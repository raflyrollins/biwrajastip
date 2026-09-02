<?php

namespace Database\Factories;

use App\Enums\IrregularityType;
use App\Models\Irregularity;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Irregularity>
 */
class IrregularityFactory extends Factory
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
            'type' => IrregularityType::LabelMismatch,
            'notes' => fake()->sentence(),
            'resolved' => false,
            'created_by' => User::factory(),
        ];
    }
}
