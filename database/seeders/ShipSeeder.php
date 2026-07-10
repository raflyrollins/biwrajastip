<?php

namespace Database\Seeders;

use App\Models\Ship;
use Illuminate\Database\Seeder;

class ShipSeeder extends Seeder
{
    public function run(): void
    {
        $ships = [
            [
                'name' => 'KM Tilongkabila',
                'description' => 'Kapal cepat rute Surabaya - Denpasar - Bima - Ende. Kapasitas 500 penumpang, 150 ton kargo.',
                'is_active' => true,
            ],
            [
                'name' => 'KM Dharma Kartika',
                'description' => 'Kapal penumpang dan barang rute Surabaya - Labuan Bajo - Ende - Kupang. Kapasitas 600 penumpang, 200 ton kargo.',
                'is_active' => true,
            ],
            [
                'name' => 'KM Marina Nusantara',
                'description' => 'Kapal barang rute Surabaya - Ende - Maumere - Larantuka. Kapasitas 300 ton kargo.',
                'is_active' => true,
            ],
            [
                'name' => 'KM Sabuk Nusantara',
                'description' => 'Kapal rute Surabaya - Denpasar - Waingapu - Ende. Kapasitas 250 penumpang, 100 ton kargo.',
                'is_active' => true,
            ],
            [
                'name' => 'KM Bukit Siguntang',
                'description' => 'Kapal penumpang rute Surabaya - Bajawa - Ruteng - Labuan Bajo. Kapasitas 400 penumpang, 120 ton kargo.',
                'is_active' => true,
            ],
            [
                'name' => 'KM Leuser Indah',
                'description' => 'Kapal cepat rute Surabaya - Ende - Kupang. Kapasitas 350 penumpang, 80 ton kargo.',
                'is_active' => true,
            ],
        ];

        foreach ($ships as $ship) {
            Ship::firstOrCreate(
                ['name' => $ship['name']],
                $ship,
            );
        }
    }
}
