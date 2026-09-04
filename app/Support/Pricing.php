<?php

namespace App\Support;

use App\Models\DeliveryZone;
use App\Models\Setting;

/**
 * Encapsulates the pricing / weight business rules for biwrajastip.
 *
 * Fee model: biaya jastip is a FLAT per-kg fee (ongkir Surabaya → Ende) that
 * is MULTIPLIED by the billed weight; biaya antar is FLAT per delivery zone
 * and is NOT weight-scaled. The total tagihan = (biaya jastip × billed weight)
 * + biaya antar. Parcels picked up at the Ende office (no zone) pay no antar.
 *
 * Weight is entered in GRAMS. The chargeable (billed) weight is the higher of
 * the scaled weight and the volumetric weight (volume cm³ / 6000), then
 * rounded up to the next full kg once the residual passes 300 grams.
 */
class Pricing
{
    public const FLAT_SHIPPING_FEE_KEY = 'shipping_fee_flat';

    /**
     * Volumetric divisor expressed in cm³/kg (industry standard volume / 6000).
     */
    private const VOLUMETRIC_DIVISOR = 6000;

    /**
     * Round-up buffer in grams after which a parcel is billed to the next kg.
     */
    private const ROUND_UP_BUFFER_GRAMS = 300;

    public function flatShippingFee(): float
    {
        return (float) (Setting::get(self::FLAT_SHIPPING_FEE_KEY) ?? '0');
    }

    /**
     * Chargeable weight in kg = the higher of the scaled (timbang) weight and
     * the volumetric weight (volume cm³ / 6000), then rounded up to the next
     * full kg once the residual passes 300 grams (1301 g → 2 kg).
     *
     * @param  int|string|null  $weightGrams  scaled weight in grams
     * @param  float|string|null  $lengthCm  cm
     * @param  float|string|null  $widthCm  cm
     * @param  float|string|null  $heightCm  cm
     */
    public function billedWeightKg(
        int|string|null $weightGrams,
        float|string|null $lengthCm = null,
        float|string|null $widthCm = null,
        float|string|null $heightCm = null,
    ): float {
        $candidateGrams = max(
            (int) max(0, (int) $weightGrams),
            $this->volumetricGrams($lengthCm, $widthCm, $heightCm),
        );

        if ($candidateGrams <= 0) {
            return 0.0;
        }

        $residual = $candidateGrams % 1000;

        if ($residual > self::ROUND_UP_BUFFER_GRAMS) {
            $candidateGrams = $candidateGrams - $residual + 1000;
        } else {
            $candidateGrams -= $residual;
        }

        // A positive parcel is never billed as zero.
        $candidateGrams = max(1000, $candidateGrams);

        return $candidateGrams / 1000;
    }

    /**
     * Flat delivery fee for a zone. Zonasi pricing is flat (not weight-scaled)
     * to keep ongkir cheap. Returns 0 for office pick-up (no zone).
     */
    public function deliveryFee(?DeliveryZone $zone): float
    {
        if (! $zone) {
            return 0.0;
        }

        $rate = $zone->rates()
            ->orderBy('max_weight_kg')
            ->first();

        return $rate ? (float) $rate->price_per_kg : 0.0;
    }

    public function totalAmount(float $shippingFeeKg, float $deliveryFee, float $billedWeightKg): float
    {
        return ($shippingFeeKg * $billedWeightKg) + $deliveryFee;
    }

    /**
     * @return array{billed_weight_kg: float, volumetric_weight_kg: float, shipping_fee: float, delivery_fee: float, total_amount: float}
     */
    public function estimateFor(
        ?DeliveryZone $zone,
        int|string|null $weightGrams,
        float|string|null $lengthCm = null,
        float|string|null $widthCm = null,
        float|string|null $heightCm = null,
    ): array {
        $volumetricKg = $this->volumetricGrams($lengthCm, $widthCm, $heightCm) / 1000;
        $billedKg = $this->billedWeightKg($weightGrams, $lengthCm, $widthCm, $heightCm);
        $deliveryFee = $this->deliveryFee($zone);
        $shippingFeeKg = $this->flatShippingFee();
        $shippingFee = $shippingFeeKg * $billedKg;

        return [
            'billed_weight_kg' => $billedKg,
            'volumetric_weight_kg' => $volumetricKg,
            'shipping_fee' => $shippingFee,
            'delivery_fee' => $deliveryFee,
            'total_amount' => $this->totalAmount($shippingFeeKg, $deliveryFee, $billedKg),
        ];
    }

    private function volumetricGrams(
        float|string|null $lengthCm,
        float|string|null $widthCm,
        float|string|null $heightCm,
    ): int {
        $volume = max(0.0, (float) $lengthCm) * max(0.0, (float) $widthCm) * max(0.0, (float) $heightCm);

        if ($volume <= 0) {
            return 0;
        }

        return (int) round($volume / self::VOLUMETRIC_DIVISOR * 1000);
    }
}
