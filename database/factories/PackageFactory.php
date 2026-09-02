<?php

namespace Database\Factories;

use App\Enums\PackageStatus;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Package>
 */
class PackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'status' => PackageStatus::Registered,
            'receiver_name' => 'biwrajastip ('.strtolower(fake()->name()).')',
            'collecting_address' => 'Jl. Combo Driyorejo, Surabaya',
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PackageStatus::Paid,
            'paid_at' => now(),
        ]);
    }
}
