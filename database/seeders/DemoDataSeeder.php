<?php

namespace Database\Seeders;

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Seeds a large, realistic dataset so permission scoping can be eyeballed
     * per role (see MENU_DASHBOARD.md). Every status value is represented.
     *
     * @param  int  $customers  demo customer accounts
     * @param  int  $packagesPerCustomer  packages generated per customer
     * @param  int  $bags  bags spread across the six bag statuses
     * @param  int  $batches  batches spread across the six batch statuses
     */
    public function run(
        int $customers = 6,
        int $packagesPerCustomer = 20,
        int $bags = 30,
        int $batches = 18,
    ): void {
        $staffSurabaya = User::factory()->create([
            'name' => 'Staff Surabaya Operasional',
            'email' => 'ops-surabaya@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::StaffSurabaya->value);

        $staffEnde = User::factory()->create([
            'name' => 'Staff Ende Operasional',
            'email' => 'ops-ende@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::StaffEnde->value);

        $customers = collect(range(1, $customers))
            ->map(function (int $i): User {
                return User::factory()->create([
                    'name' => "Customer Demo {$i}",
                    'email' => "customer{$i}@biwrajastip.test",
                    'password' => 'password',
                ])->assignRole(Role::Customer->value);
            });

        // ---- Packages -----------------------------------------------------
        // Distribute all package statuses evenly so each scope filter is
        // exercised and the counts per role are visibly different.
        $packageStatuses = PackageStatus::cases();
        $maxPackage = max(1, $packagesPerCustomer);

        $items = $customers->flatMap(function (User $customer) use ($packageStatuses, $maxPackage): array {
            $ids = [];

            foreach ($packageStatuses as $i => $status) {
                $count = (int) floor($maxPackage / count($packageStatuses));

                if ($i < ($maxPackage % count($packageStatuses))) {
                    $count++;
                }

                for ($n = 0; $n < $count; $n++) {
                    $ids[] = $customer->id;
                    Package::factory()->create([
                        'customer_id' => $customer->id,
                        'status' => $status,
                        'biwrajastip_tracking_number' => 'BWRJ-'.str_pad((string) rand(1, 9_999_999), 7, '0', STR_PAD_LEFT),
                        'paid_at' => $status === PackageStatus::Paid ? now()->subDays($n) : null,
                        'total_amount' => match ($status) {
                            PackageStatus::Paid, PackageStatus::PendingPayment => (string) (250_000 + $n * 17_500),
                            default => null,
                        },
                    ]);
                }
            }

            return $ids;
        });

        $packageIds = $items->flatten()->count();

        // ---- Bags ---------------------------------------------------------
        $bagStatuses = BagStatus::cases();

        $staffSurabayaId = $staffSurabaya->id;
        $staffEndeId = $staffEnde->id;

        foreach ($bagStatuses as $i => $status) {
            $count = (int) floor($bags / count($bagStatuses));

            if ($i < ($bags % count($bagStatuses))) {
                $count++;
            }

            $creatorId = match ($status) {
                BagStatus::Unbagged, BagStatus::Complete => $staffEndeId,
                default => $staffSurabayaId,
            };

            for ($n = 0; $n < $count; $n++) {
                Bag::factory()->create([
                    'bag_number' => 'BAG-'.str_pad((string) ($i * 100 + $n + 1), 4, '0', STR_PAD_LEFT),
                    'status' => $status,
                    'package_count' => rand(1, 15),
                    'sealed_weight_kg' => (string) (5 + $n * 1.5),
                    'created_by' => $creatorId,
                ]);
            }
        }

        // ---- Batches ------------------------------------------------------
        $batchStatuses = BatchStatus::cases();

        foreach ($batchStatuses as $i => $status) {
            $count = (int) floor($batches / count($batchStatuses));

            if ($i < ($batches % count($batchStatuses))) {
                $count++;
            }

            $creatorId = match ($status) {
                BatchStatus::Unbatched, BatchStatus::Complete => $staffEndeId,
                default => $staffSurabayaId,
            };

            for ($n = 0; $n < $count; $n++) {
                Batch::factory()->create([
                    'batch_number' => 'BCH-'.str_pad((string) ($i * 100 + $n + 1), 4, '0', STR_PAD_LEFT),
                    'status' => $status,
                    'bag_count' => rand(2, 12),
                    'scheduled_departure_at' => now()->addDays(rand(1, 30)),
                    'departed_at' => in_array($status, [
                        BatchStatus::PortArrived,
                        BatchStatus::OnGoing,
                        BatchStatus::Complete,
                    ], true) ? now()->subDays(rand(1, 14)) : null,
                    'created_by' => $creatorId,
                ]);
            }
        }

        $this->command->info(
            "Demo data seeded: {$customers->count()} customers, {$packageIds} packages, {$bags} bags, {$batches} batches."
        );
    }
}
