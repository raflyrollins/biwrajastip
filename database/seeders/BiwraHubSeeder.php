<?php

namespace Database\Seeders;

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Models\Package;
use App\Models\Payment;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class BiwraHubSeeder extends Seeder
{
    public function run(): void
    {
        // ensure payments.create permission exists for customer role
        $perm = Permission::firstOrCreate(
            ['name' => 'payments.create'],
            ['label' => 'Create Payments', 'group' => 'payments']
        );
        $role = Role::where('name', 'customer')->first();
        if ($role && ! $role->permissions()->where('permission_id', $perm->id)->exists()) {
            $role->permissions()->attach($perm->id);
        }

        // clean up old test data
        Payment::whereIn('package_id', Package::where('tracking_number', 'like', 'SPX%')
            ->orWhere('tracking_number', 'like', 'JNT%')
            ->pluck('id')
        )->delete();
        Package::where('tracking_number', 'like', 'SPX%')->delete();
        Package::where('tracking_number', 'like', 'JNT%')->delete();

        $customer = User::where('email', 'customer@biwrajastip.com')->firstOrFail();
        $staffSurabaya = User::where('email', 'staff.surabaya@biwrajastip.com')->firstOrFail();

        $centralZone = Zone::where('is_central', true)->firstOrFail();

        // ========== Waiting for collection (5) ==========
        for ($i = 1; $i <= 5; $i++) {
            Package::create([
                'user_id' => $customer->id,
                'zone_id' => $centralZone->id,
                'status' => PackageStatus::WaitingForCollection,
                'sender_name' => 'Toko Online ' . $i,
                'sender_phone' => '0812345678' . $i,
                'receiver_name' => 'Penerima Ende ' . $i,
                'receiver_phone' => '0812345679' . $i,
                'tracking_number' => 'SPX' . str_pad((string) $i, 10, '0', STR_PAD_LEFT),
                'description' => 'Barang elektronik',
                'weight_estimated' => 1.5,
                'length_estimated' => 30,
                'width_estimated' => 20,
                'height_estimated' => 15,
            ]);
        }

        // ========== Paid packages (3) with payments ==========
        for ($i = 1; $i <= 3; $i++) {
            $package = Package::create([
                'user_id' => $customer->id,
                'zone_id' => $centralZone->id,
                'status' => PackageStatus::Paid,
                'sender_name' => 'Toko Pakaian ' . $i,
                'sender_phone' => '0823456789' . $i,
                'receiver_name' => 'Penerima Ende ' . (10 + $i),
                'receiver_phone' => '0823456790' . $i,
                'tracking_number' => 'JNT' . str_pad((string) (100 + $i), 10, '0', STR_PAD_LEFT),
                'tracking_number_biwra' => 'BWR' . str_pad((string) (100 + $i), 8, '0', STR_PAD_LEFT),
                'description' => 'Pakaian jadi',
                'weight_estimated' => 2.0,
                'length_estimated' => 40,
                'width_estimated' => 30,
                'height_estimated' => 10,
                'weight_actual' => 1.8,
                'length_actual' => 38,
                'width_actual' => 28,
                'height_actual' => 10,
                'volumetric_weight' => ceil(38 * 28 * 10 / 6000) * 1000,
                'final_weight' => max(1800, ceil(38 * 28 * 10 / 6000) * 1000),
                'price' => 50000,
                'delivery_fee' => $centralZone->delivery_fee,
                'total_price' => 50000 + $centralZone->delivery_fee + 8000,
                'collected_at' => now()->subDays(2),
            ]);

            Payment::create([
                'package_id' => $package->id,
                'user_id' => $customer->id,
                'amount' => $package->total_price,
                'payment_method' => 'transfer_bank',
                'proof_image' => 'payments/proof-dummy-' . $i . '.jpg',
                'status' => PaymentStatus::Verified,
                'verified_by' => $staffSurabaya->id,
                'verified_at' => now()->subDays(1),
            ]);
        }

        $this->command->info('=== BiwraHub Test Data ===');
        $this->command->info('Packages waiting for collection (5): SPX0000000001–00005');
        $this->command->info('Paid packages (3): JNT0000000101–0103 (with verified payments)');
        $this->command->info('Seeding selesai!');
    }
}
