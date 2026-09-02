<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 150);
            $table->string('district', 150);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['district', 'is_active']);
        });

        Schema::create('zone_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_zone_id')->constrained('delivery_zones')->cascadeOnDelete();
            $table->unsignedInteger('max_weight_kg');
            $table->unsignedBigInteger('price_per_kg');
            $table->timestamps();

            $table->unique(['delivery_zone_id', 'max_weight_kg']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zone_rates');
        Schema::dropIfExists('delivery_zones');
    }
};
