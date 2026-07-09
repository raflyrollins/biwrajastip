<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('qr_code');
        });

        Schema::table('bags', function (Blueprint $table) {
            $table->dropColumn('qr_code');
        });

        Schema::table('batches', function (Blueprint $table) {
            $table->dropColumn('qr_code');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('qr_code')->nullable();
        });

        Schema::table('bags', function (Blueprint $table) {
            $table->string('qr_code')->nullable();
        });

        Schema::table('batches', function (Blueprint $table) {
            $table->string('qr_code')->nullable();
        });
    }
};
