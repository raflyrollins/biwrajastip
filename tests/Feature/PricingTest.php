<?php

use App\Models\DeliveryZone;
use App\Models\Setting;
use App\Models\ZoneRate;
use App\Support\Pricing;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeZoneWithRate(int $pricePerKg): DeliveryZone
{
    $zone = DeliveryZone::factory()->create();

    ZoneRate::factory()->create([
        'delivery_zone_id' => $zone->id,
        'max_weight_kg' => 100,
        'price_per_kg' => $pricePerKg,
    ]);

    return $zone;
}

it('rounds a scaled weight up past 300 grams', function (int $grams, float $expected): void {
    $billed = (new Pricing)->billedWeightKg($grams);

    expect($billed)->toBe($expected);
})->with([
    [2500, 3.0],  // 2.5 kg -> residual 500g > 300 -> 3.0
    [1300, 1.0],  // 1.3 kg -> residual 300g (not > 300) -> 1.0
    [1301, 2.0],  // 1.301 kg -> residual 301g > 300 -> 2.0
]);

it('rounds 301 grams up to a single full kg', function (): void {
    expect((new Pricing)->billedWeightKg(301))->toBe(1.0);
});

it('keeps a whole kilogram unchanged when given grams', function (): void {
    expect((new Pricing)->billedWeightKg(2000))->toBe(2.0);
});

it('uses volumetric weight when it exceeds the scaled weight', function (): void {
    // 60x40x40 cm -> 96,000 / 6000 = 16 kg volumetric.
    $billed = (new Pricing)->billedWeightKg(2000, 60, 40, 40);

    expect($billed)->toBe(16.0);
});

it('uses scaled weight when it exceeds the volumetric weight', function (): void {
    // 20x20x20 cm -> 8,000 / 6000 = 1.33 kg volumetric; scaled 5 kg wins.
    $billed = (new Pricing)->billedWeightKg(5000, 20, 20, 20);

    expect($billed)->toBe(5.0);
});

it('returns the flat zone fee as the delivery fee (not weight-scaled)', function (): void {
    $zone = makeZoneWithRate(15000);

    expect((new Pricing)->deliveryFee($zone))->toBe(15000.0);
});

it('charges no delivery fee when there is no zone', function (): void {
    expect((new Pricing)->deliveryFee(null))->toBe(0.0);
});

it('reads the flat shipping fee from settings', function (): void {
    Setting::create(['key' => Pricing::FLAT_SHIPPING_FEE_KEY, 'value' => '15000']);

    expect((new Pricing)->flatShippingFee())->toBe(15000.0);
});

it('totals (jastip x billed weight) plus flat delivery', function (): void {
    expect((new Pricing)->totalAmount(15000, 18000, 3))->toBe(63000.0);
});

it('builds an estimate from grams, flat zone fee, and jastip per kg', function (): void {
    $zone = makeZoneWithRate(18000);
    Setting::create(['key' => Pricing::FLAT_SHIPPING_FEE_KEY, 'value' => '15000']);

    // 2.5 kg -> residual 500 g > 300 -> billed 3 kg.
    $estimate = (new Pricing)->estimateFor($zone, 2500);

    expect($estimate['billed_weight_kg'])->toBe(3.0)
        ->and($estimate['shipping_fee'])->toBe(45000.0)
        ->and($estimate['delivery_fee'])->toBe(18000.0)
        ->and($estimate['total_amount'])->toBe(63000.0);
});

it('builds an estimate with no delivery fee when there is no zone', function (): void {
    Setting::create(['key' => Pricing::FLAT_SHIPPING_FEE_KEY, 'value' => '15000']);

    // 1301 g -> residual 301 g > 300 -> billed 2 kg.
    $estimate = (new Pricing)->estimateFor(null, 1301);

    expect($estimate['billed_weight_kg'])->toBe(2.0)
        ->and($estimate['shipping_fee'])->toBe(30000.0)
        ->and($estimate['delivery_fee'])->toBe(0.0)
        ->and($estimate['total_amount'])->toBe(30000.0);
});
