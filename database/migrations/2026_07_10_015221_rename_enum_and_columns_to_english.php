<?php

use App\Enums\PackageStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('packages')
            ->where('status', 'berangkat_ke_pelabuhan')
            ->update(['status' => PackageStatus::HeadingToPort->value]);

        DB::table('packages')
            ->where('status', 'siap_diambil')
            ->update(['status' => PackageStatus::ReadyForPickup->value]);

        DB::table('packages')
            ->where('status', 'dalam_pengantaran')
            ->update(['status' => PackageStatus::InDelivery->value]);

        DB::table('packages')
            ->where('status', 'selesai')
            ->update(['status' => PackageStatus::Completed->value]);

        Schema::table('zones', function (Blueprint $table) {
            $table->renameColumn('is_pusat', 'is_central');
        });
    }

    public function down(): void
    {
        DB::table('packages')
            ->where('status', PackageStatus::HeadingToPort->value)
            ->update(['status' => 'berangkat_ke_pelabuhan']);

        DB::table('packages')
            ->where('status', PackageStatus::ReadyForPickup->value)
            ->update(['status' => 'siap_diambil']);

        DB::table('packages')
            ->where('status', PackageStatus::InDelivery->value)
            ->update(['status' => 'dalam_pengantaran']);

        DB::table('packages')
            ->where('status', PackageStatus::Completed->value)
            ->update(['status' => 'selesai']);

        Schema::table('zones', function (Blueprint $table) {
            $table->renameColumn('is_central', 'is_pusat');
        });
    }
};
