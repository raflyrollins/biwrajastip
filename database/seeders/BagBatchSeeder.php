<?php

namespace Database\Seeders;

use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use Illuminate\Database\Seeder;

class BagBatchSeeder extends Seeder
{
    public function run(): void
    {
        // ── Buat 2 Bag dari paket yang status paid ──
        $paidPackages = Package::where('status', 'paid')->whereNull('bag_id')->take(4)->get();

        if ($paidPackages->count() < 4) {
            $this->command->error('Perlu minimal 4 paket status paid. Jalankan PackageSeeder dulu.');

            return;
        }

        // Bag 1: 2 paket
        $bag1 = Bag::create([
            'code' => Bag::generateCode(),
            'total_packages' => 2,
            'total_weight' => $paidPackages->take(2)->sum('final_weight'),
        ]);

        $paidPackages->take(2)->each(function ($package) use ($bag1) {
            $package->update([
                'bag_id' => $bag1->id,
                'status' => 'bagging',
            ]);
        });

        // Bag 2: 2 paket
        $bag2 = Bag::create([
            'code' => Bag::generateCode(),
            'total_packages' => 2,
            'total_weight' => $paidPackages->slice(2, 2)->sum('final_weight'),
        ]);

        $paidPackages->slice(2, 2)->each(function ($package) use ($bag2) {
            $package->update([
                'bag_id' => $bag2->id,
                'status' => 'bagging',
            ]);
        });

        // ── Buat 1 Batch dari 2 bag ──
        $batch = Batch::create([
            'code' => Batch::generateCode(),
            'notes' => 'Batch pertama untuk pengiriman minggu ini',
            'total_packages' => $bag1->total_packages + $bag2->total_packages,
            'total_weight' => $bag1->total_weight + $bag2->total_weight,
        ]);

        $bag1->update(['batch_id' => $batch->id]);
        $bag2->update(['batch_id' => $batch->id]);

        // ── Buat 1 Bag tanpa Batch (untuk testing) ──
        $standaloneBag = Bag::create([
            'code' => Bag::generateCode(),
            'total_packages' => 0,
            'total_weight' => 0,
        ]);

        $this->command->info('Bag & Batch sample berhasil dibuat:');
        $this->command->info("  Bag 1: {$bag1->code} ({$bag1->total_packages} paket) → Batch {$batch->code}");
        $this->command->info("  Bag 2: {$bag2->code} ({$bag2->total_packages} paket) → Batch {$batch->code}");
        $this->command->info("  Batch: {$batch->code} ({$batch->total_packages} paket total)");
        $this->command->info("  Bag standalone: {$standaloneBag->code} (tanpa batch, untuk testing)");
    }
}
