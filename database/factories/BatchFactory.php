<?php

namespace Database\Factories;

use App\Enums\BatchStatus;
use App\Models\Batch;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Batch>
 */
class BatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'batch_number' => 'BCH-'.strtoupper(Str::random(8)),
            'status' => BatchStatus::Batched,
            'bag_count' => 0,
            'created_by' => User::factory(),
        ];
    }
}
