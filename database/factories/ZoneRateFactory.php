<?php

namespace Database\Factories;

use App\Models\DeliveryZone;
use App\Models\ZoneRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ZoneRate>
 */
class ZoneRateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'delivery_zone_id' => DeliveryZone::factory(),
            'max_weight_kg' => 10,
            'price_per_kg' => fake()->numberBetween(10000, 25000),
        ];
    }
}
