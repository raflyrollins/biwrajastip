<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use App\Models\PromoCode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PromoCode>
 */
class PromoCodeFactory extends Factory
{
    protected $model = PromoCode::class;

    public function definition(): array
    {
        $code = strtoupper(fake()->bothify('####'));

        return [
            'uuid' => fake()->uuid(),
            'code' => $code,
            'name' => $code,
            'description' => fake()->sentence(),
            'type' => DiscountType::Fixed,
            'value' => fake()->numberBetween(5000, 25000),
            'min_order_total' => 0,
            'max_discount_amount' => null,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
            'max_uses' => 100,
            'used_count' => 0,
            'is_active' => true,
            'created_by' => User::factory(),
        ];
    }
}
