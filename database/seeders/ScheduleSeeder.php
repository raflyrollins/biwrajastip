<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\Ship;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $ships = Ship::all();

        if ($ships->isEmpty()) {
            $this->command->warn('Tidak ada kapal, jalankan ShipSeeder terlebih dahulu.');

            return;
        }

        $startDate = Carbon::parse('2026-07-15');

        $schedules = [];

        foreach ($ships as $index => $ship) {
            $offset = $index * 3;

            for ($i = 0; $i < 8; $i++) {
                $departure = (clone $startDate)->addDays($offset + $i * 4);
                $arrival = (clone $departure)->addDays(2);

                $schedules[] = [
                    'ship_id' => $ship->id,
                    'departure_date' => $departure->format('Y-m-d'),
                    'arrival_date' => $arrival->format('Y-m-d'),
                    'notes' => 'Estimasi tiba di Ende pukul 18.00 - 20.00 WITA',
                ];
            }
        }

        foreach ($schedules as $schedule) {
            Schedule::firstOrCreate(
                [
                    'ship_id' => $schedule['ship_id'],
                    'departure_date' => $schedule['departure_date'],
                ],
                $schedule,
            );
        }
    }
}
