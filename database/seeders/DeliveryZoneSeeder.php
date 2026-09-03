<?php

namespace Database\Seeders;

use App\Models\DeliveryZone;
use App\Models\Setting;
use App\Models\ZoneRate;
use Illuminate\Database\Seeder;

class DeliveryZoneSeeder extends Seeder
{
    /**
     * Seeds the delivery zones + FLAT delivery fees used for biaya antar within
     * Ende, plus the flat jastip (ongkir Surabaya → Ende) fee. A null
     * delivery_zone means the parcel is picked up at the Ende office (no
     * delivery fee). Delivery fees are flat per zone, not weight-scaled.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'shipping_fee_flat'],
            ['value' => '15000'],
        );

        $zones = [
            ['name' => 'Kec. Ende', 'district' => 'Ende Tengah', 'delivery_fee' => 5000],
            ['name' => 'Kec. Detusoko', 'district' => 'Detusoko', 'delivery_fee' => 15000],
            ['name' => 'Kec. Nangapanda', 'district' => 'Nangapanda', 'delivery_fee' => 18000],
        ];

        foreach ($zones as $zone) {
            $deliveryZone = DeliveryZone::firstOrCreate([
                'name' => $zone['name'],
                'district' => $zone['district'],
            ], ['is_active' => true]);

            // Delivery fees are flat per zone; drop any legacy per-kg tiers.
            $deliveryZone->rates()
                ->where('max_weight_kg', '!=', 100)
                ->delete();

            ZoneRate::updateOrCreate(
                ['delivery_zone_id' => $deliveryZone->id, 'max_weight_kg' => 100],
                ['price_per_kg' => $zone['delivery_fee']],
            );
        }
    }
}
