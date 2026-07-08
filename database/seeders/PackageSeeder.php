<?php

namespace Database\Seeders;

use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@biwrajastip.com')->first();
        $zone = Zone::first();

        if (! $customer || ! $zone) {
            $this->command->error('Jalankan RolePermissionSeeder dan ZoneSeeder terlebih dahulu.');

            return;
        }

        // ── 1. Paket waiting_for_collection (belum diambil staff) ──
        $wfcPackages = [
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Toko Elektronik Jaya',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-001',
                'recipient_name' => 'Budi Santoso',
                'recipient_phone' => '081234567890',
                'zone_id' => $zone->id,
                'weight_estimated' => 2000,
                'length_estimated' => 30,
                'width_estimated' => 20,
                'height_estimated' => 15,
                'volumetric_estimated' => 15000,
                'status' => 'waiting_for_collection',
                'total_cost' => 25000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Fashion Store Bandung',
                'sender_store' => 'Tokopedia',
                'sender_tracking_number' => 'TKP-2026-002',
                'recipient_name' => 'Siti Rahayu',
                'recipient_phone' => '081234567891',
                'zone_id' => $zone->id,
                'weight_estimated' => 1500,
                'length_estimated' => 25,
                'width_estimated' => 18,
                'height_estimated' => 10,
                'volumetric_estimated' => 7500,
                'status' => 'waiting_for_collection',
                'total_cost' => 18000,
            ],
        ];

        // ── 2. Paket paid (sudah bayar, belum dibuatkan bag) ──
        $paidPackages = [
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Kosmetik Murah',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-003',
                'recipient_name' => 'Andi Wijaya',
                'recipient_phone' => '081234567892',
                'zone_id' => $zone->id,
                'weight_estimated' => 800,
                'length_estimated' => 20,
                'width_estimated' => 15,
                'height_estimated' => 10,
                'volumetric_estimated' => 5000,
                'status' => 'paid',
                'weight_actual' => 900,
                'final_weight' => 5000,
                'total_cost' => 15000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Book Store Jakarta',
                'sender_store' => 'Bukalapak',
                'sender_tracking_number' => 'BLK-2026-004',
                'recipient_name' => 'Dewi Lestari',
                'recipient_phone' => '081234567893',
                'zone_id' => $zone->id,
                'weight_estimated' => 3000,
                'length_estimated' => 35,
                'width_estimated' => 25,
                'height_estimated' => 20,
                'volumetric_estimated' => 29167,
                'status' => 'paid',
                'weight_actual' => 3200,
                'final_weight' => 29167,
                'total_cost' => 45000,
            ],
        ];

        // ── 3. Paket bagging (sudah masuk bag, siap dikirim) ──
        //    12 paket → 4 bag × 3 paket → 1 batch
        $baggingPackages = [
            // Bag 1: Elektronik
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Spare Part Motor',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-005',
                'recipient_name' => 'Rudi Hermawan',
                'recipient_phone' => '081234567894',
                'zone_id' => $zone->id,
                'weight_estimated' => 5000,
                'length_estimated' => 40,
                'width_estimated' => 30,
                'height_estimated' => 25,
                'volumetric_estimated' => 50000,
                'status' => 'bagging',
                'weight_actual' => 5200,
                'final_weight' => 50000,
                'total_cost' => 65000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Aksesoris HP',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-006',
                'recipient_name' => 'Maya Putri',
                'recipient_phone' => '081234567895',
                'zone_id' => $zone->id,
                'weight_estimated' => 500,
                'length_estimated' => 15,
                'width_estimated' => 10,
                'height_estimated' => 8,
                'volumetric_estimated' => 2000,
                'status' => 'bagging',
                'weight_actual' => 600,
                'final_weight' => 2000,
                'total_cost' => 12000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Mainan Anak',
                'sender_store' => 'Bukalapak',
                'sender_tracking_number' => 'BLK-2026-007',
                'recipient_name' => 'Eko Prasetyo',
                'recipient_phone' => '081234567896',
                'zone_id' => $zone->id,
                'weight_estimated' => 2500,
                'length_estimated' => 30,
                'width_estimated' => 20,
                'height_estimated' => 15,
                'volumetric_estimated' => 15000,
                'status' => 'bagging',
                'weight_actual' => 2600,
                'final_weight' => 15000,
                'total_cost' => 30000,
            ],

            // Bag 2: Fashion
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Pakaian Import',
                'sender_store' => 'Tokopedia',
                'sender_tracking_number' => 'TKP-2026-008',
                'recipient_name' => 'Linda Sari',
                'recipient_phone' => '081234567897',
                'zone_id' => $zone->id,
                'weight_estimated' => 1200,
                'length_estimated' => 22,
                'width_estimated' => 16,
                'height_estimated' => 12,
                'volumetric_estimated' => 7040,
                'status' => 'bagging',
                'weight_actual' => 1300,
                'final_weight' => 7040,
                'total_cost' => 20000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Batik Trusmi',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-009',
                'recipient_name' => 'Rina Wati',
                'recipient_phone' => '081234567898',
                'zone_id' => $zone->id,
                'weight_estimated' => 800,
                'length_estimated' => 18,
                'width_estimated' => 14,
                'height_estimated' => 8,
                'volumetric_estimated' => 3360,
                'status' => 'bagging',
                'weight_actual' => 900,
                'final_weight' => 3360,
                'total_cost' => 15000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Sepatu Casual',
                'sender_store' => 'Tokopedia',
                'sender_tracking_number' => 'TKP-2026-010',
                'recipient_name' => 'Ahmad Fauzi',
                'recipient_phone' => '081234567899',
                'zone_id' => $zone->id,
                'weight_estimated' => 1500,
                'length_estimated' => 30,
                'width_estimated' => 20,
                'height_estimated' => 12,
                'volumetric_estimated' => 12000,
                'status' => 'bagging',
                'weight_actual' => 1600,
                'final_weight' => 12000,
                'total_cost' => 22000,
            ],

            // Bag 3: Kesehatan
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Vitamin Store',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-011',
                'recipient_name' => 'Dokter Sari',
                'recipient_phone' => '081234567800',
                'zone_id' => $zone->id,
                'weight_estimated' => 600,
                'length_estimated' => 15,
                'width_estimated' => 12,
                'height_estimated' => 10,
                'volumetric_estimated' => 3000,
                'status' => 'bagging',
                'weight_actual' => 700,
                'final_weight' => 3000,
                'total_cost' => 18000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Herbal Sehat',
                'sender_store' => 'Bukalapak',
                'sender_tracking_number' => 'BLK-2026-012',
                'recipient_name' => 'Pak Tono',
                'recipient_phone' => '081234567801',
                'zone_id' => $zone->id,
                'weight_estimated' => 400,
                'length_estimated' => 12,
                'width_estimated' => 10,
                'height_estimated' => 8,
                'volumetric_estimated' => 1600,
                'status' => 'bagging',
                'weight_actual' => 500,
                'final_weight' => 1600,
                'total_cost' => 10000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Suplemen Fitness',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-013',
                'recipient_name' => 'Budi Gym',
                'recipient_phone' => '081234567802',
                'zone_id' => $zone->id,
                'weight_estimated' => 2000,
                'length_estimated' => 25,
                'width_estimated' => 18,
                'height_estimated' => 15,
                'volumetric_estimated' => 11250,
                'status' => 'bagging',
                'weight_actual' => 2100,
                'final_weight' => 11250,
                'total_cost' => 28000,
            ],

            // Bag 4: Rumah Tangga
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Peralatan Dapur',
                'sender_store' => 'Tokopedia',
                'sender_tracking_number' => 'TKP-2026-014',
                'recipient_name' => 'Ibu Ani',
                'recipient_phone' => '081234567803',
                'zone_id' => $zone->id,
                'weight_estimated' => 3000,
                'length_estimated' => 35,
                'width_estimated' => 25,
                'height_estimated' => 20,
                'volumetric_estimated' => 29167,
                'status' => 'bagging',
                'weight_actual' => 3100,
                'final_weight' => 29167,
                'total_cost' => 42000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Organizer Store',
                'sender_store' => 'Shopee',
                'sender_tracking_number' => 'SHP-2026-015',
                'recipient_name' => 'Pak Joko',
                'recipient_phone' => '081234567804',
                'zone_id' => $zone->id,
                'weight_estimated' => 1000,
                'length_estimated' => 20,
                'width_estimated' => 15,
                'height_estimated' => 10,
                'volumetric_estimated' => 5000,
                'status' => 'bagging',
                'weight_actual' => 1100,
                'final_weight' => 5000,
                'total_cost' => 16000,
            ],
            [
                'tracking_code' => Package::generateTrackingCode(),
                'sender_name' => 'Rumah Cantik',
                'sender_store' => 'Bukalapak',
                'sender_tracking_number' => 'BLK-2026-016',
                'recipient_name' => 'Ibu Dewi',
                'recipient_phone' => '081234567805',
                'zone_id' => $zone->id,
                'weight_estimated' => 700,
                'length_estimated' => 18,
                'width_estimated' => 12,
                'height_estimated' => 8,
                'volumetric_estimated' => 2880,
                'status' => 'bagging',
                'weight_actual' => 800,
                'final_weight' => 2880,
                'total_cost' => 14000,
            ],
        ];

        $allPackages = array_merge($wfcPackages, $paidPackages, $baggingPackages);

        foreach ($allPackages as $data) {
            Package::firstOrCreate(
                ['sender_tracking_number' => $data['sender_tracking_number']],
                [
                    ...$data,
                    'user_id' => $customer->id,
                ],
            );
        }

        // ── Buat 4 Bag dari paket bagging ──
        $bagging = Package::where('status', 'bagging')->whereNull('bag_id')->get();
        $bagData = [
            ['label' => 'Bag 1 - Elektronik', 'count' => 3],
            ['label' => 'Bag 2 - Fashion', 'count' => 3],
            ['label' => 'Bag 3 - Kesehatan', 'count' => 3],
            ['label' => 'Bag 4 - Rumah Tangga', 'count' => 3],
        ];

        $bags = [];
        $offset = 0;

        foreach ($bagData as $bd) {
            $pkgSlice = $bagging->slice($offset, $bd['count']);
            $offset += $bd['count'];

            $bag = Bag::create([
                'code' => Bag::generateCode(),
                'status' => Bag::STATUS_IN_BATCH,
                'total_packages' => $pkgSlice->count(),
                'total_weight' => $pkgSlice->sum('final_weight'),
            ]);

            $pkgSlice->each(fn ($p) => $p->update(['bag_id' => $bag->id]));

            $bags[] = $bag;
        }

        // ── Buat 1 Batch dari 4 bag, status tiba ──
        $batch = Batch::create([
            'code' => Batch::generateCode(),
            'status' => 'tiba',
            'notes' => 'Batch pengiriman Surabaya - Ende minggu ini',
            'total_packages' => $bags[0]->total_packages + $bags[1]->total_packages + $bags[2]->total_packages + $bags[3]->total_packages,
            'total_weight' => $bags[0]->total_weight + $bags[1]->total_weight + $bags[2]->total_weight + $bags[3]->total_weight,
        ]);

        foreach ($bags as $bag) {
            $bag->update(['batch_id' => $batch->id]);
        }

        $this->command->info('Seeder berhasil!');
        $this->command->info('');
        $this->command->info('Paket:');
        $this->command->info('  2 waiting_for_collection (SHP-2026-001, TKP-2026-002)');
        $this->command->info('  2 paid tanpa bag (SHP-2026-003, BLK-2026-004)');
        $this->command->info('  12 bagging → masuk 4 bag');
        $this->command->info('');
        $this->command->info('Batch: '.$batch->code.' (status: tiba, 12 paket)');
        foreach ($bags as $i => $bag) {
            $this->command->info('  '.($i + 1).'. '.$bag->code.' (3 paket, '.$bag->total_weight.'g)');
        }
        $this->command->info('');
        $this->command->info('Siap untuk staff_ende proses unbatch & unbag.');
    }
}
