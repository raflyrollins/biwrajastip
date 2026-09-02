<?php

namespace Database\Factories;

use App\Enums\BagStatus;
use App\Models\Bag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Bag>
 */
class BagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bag_number' => 'BAG-'.strtoupper(Str::random(8)),
            'status' => BagStatus::Bagged,
            'package_count' => 0,
            'created_by' => User::factory(),
        ];
    }
}
