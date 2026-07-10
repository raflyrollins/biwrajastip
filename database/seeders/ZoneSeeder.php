<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            // Kecamatan dalam Kota Ende — delivery free
            ['name' => 'Ende Timur', 'delivery_fee' => 0, 'shipping_price' => 8000, 'is_central' => true, 'description' => 'Kecamatan dalam Kota Ende'],
            ['name' => 'Ende Tengah', 'delivery_fee' => 0, 'shipping_price' => 8000, 'is_central' => true, 'description' => 'Kecamatan dalam Kota Ende'],
            ['name' => 'Ende Selatan', 'delivery_fee' => 0, 'shipping_price' => 8000, 'is_central' => true, 'description' => 'Kecamatan dalam Kota Ende'],
            ['name' => 'Ende Utara', 'delivery_fee' => 0, 'shipping_price' => 8000, 'is_central' => true, 'description' => 'Kecamatan dalam Kota Ende'],
            ['name' => 'Ende Barat', 'delivery_fee' => 0, 'shipping_price' => 8000, 'is_central' => true, 'description' => 'Kecamatan dalam Kota Ende'],

            // Kecamatan luar Kota Ende — delivery fee
            ['name' => 'Ndona', 'delivery_fee' => 25000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Ndona Timur', 'delivery_fee' => 25000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Wolowaru', 'delivery_fee' => 25000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Kelimutu', 'delivery_fee' => 25000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende (Moni)'],
            ['name' => 'Nangapanda', 'delivery_fee' => 30000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Detusoko', 'delivery_fee' => 30000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Maurole', 'delivery_fee' => 35000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Kotabaru', 'delivery_fee' => 35000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Wewaria', 'delivery_fee' => 35000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Maukaro', 'delivery_fee' => 35000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Lio Timur', 'delivery_fee' => 35000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],
            ['name' => 'Pulau Ende', 'delivery_fee' => 40000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kecamatan Kabupaten Ende'],

            // Beda kabupaten
            ['name' => 'Ngada', 'delivery_fee' => 50000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kabupaten Ngada (Bajawa)'],
            ['name' => 'Nagekeo', 'delivery_fee' => 50000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kabupaten Nagekeo (Mbay)'],
            ['name' => 'Sikka', 'delivery_fee' => 60000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kabupaten Sikka (Maumere)'],
            ['name' => 'Flores Timur', 'delivery_fee' => 65000, 'shipping_price' => 8000, 'is_central' => false, 'description' => 'Kabupaten Flores Timur (Larantuka)'],
        ];

        foreach ($zones as $zone) {
            Zone::updateOrCreate(
                ['name' => $zone['name']],
                $zone,
            );
        }

        // Hapus zona lama yang tidak relevan
        Zone::whereIn('name', ['Surabaya', 'Kota Ende', 'Tetandara', 'Mautapaga', 'Onekore', 'Rukunlima'])->delete();
    }
}
