<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            ['name' => 'Ende Kota', 'tarif_per_kg' => 12000, 'biaya_antar' => 0],
            ['name' => 'Ende Selatan', 'tarif_per_kg' => 13000, 'biaya_antar' => 0],
            ['name' => 'Ende Utara', 'tarif_per_kg' => 13000, 'biaya_antar' => 0],
            ['name' => 'Ende Timur', 'tarif_per_kg' => 14000, 'biaya_antar' => 0],
            ['name' => 'Ende', 'tarif_per_kg' => 14000, 'biaya_antar' => 10000],
            ['name' => 'Maukaro', 'tarif_per_kg' => 15000, 'biaya_antar' => 20000],
            ['name' => 'Maukari', 'tarif_per_kg' => 15000, 'biaya_antar' => 20000],
            ['name' => 'Wewaria', 'tarif_per_kg' => 16000, 'biaya_antar' => 25000],
            ['name' => 'Kelimutu', 'tarif_per_kg' => 16000, 'biaya_antar' => 25000],
            ['name' => 'Detukeli', 'tarif_per_kg' => 17000, 'biaya_antar' => 28000],
            ['name' => 'Detusoko', 'tarif_per_kg' => 17000, 'biaya_antar' => 28000],
            ['name' => 'Nanga Pendé', 'tarif_per_kg' => 18000, 'biaya_antar' => 30000],
            ['name' => 'Lio Timur', 'tarif_per_kg' => 18000, 'biaya_antar' => 30000],
            ['name' => 'Pulau Flores (Lainnya)', 'tarif_per_kg' => 20000, 'biaya_antar' => 35000],
        ];

        foreach ($zones as $zone) {
            Zone::create($zone);
        }
    }
}
