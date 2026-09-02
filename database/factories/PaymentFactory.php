<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'package_id' => Package::factory(),
            'status' => PaymentStatus::Pending,
            'amount' => fake()->numberBetween(10000, 500000),
        ];
    }
}
