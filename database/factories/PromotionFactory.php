<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    protected $model = Promotion::class;

    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'type' => DiscountType::Percentage,
            'value' => fake()->numberBetween(5, 30),
            'min_order_total' => 0,
            'max_discount_amount' => null,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addMonth(),
            'is_active' => true,
            'created_by' => User::factory(),
        ];
    }
}
