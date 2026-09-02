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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('delivery_zone_id')->nullable()->constrained('delivery_zones')->nullOnDelete();
            $table->string('status', 30)->default('registered');
            $table->string('store_tracking_number', 100)->nullable();
            $table->string('biwrajastip_tracking_number', 100)->nullable();
            $table->string('receiver_name', 150)->nullable();
            $table->string('collecting_address', 255)->nullable();

            $table->decimal('estimated_weight_kg', 8, 3)->nullable();
            $table->decimal('estimated_length_cm', 8, 2)->nullable();
            $table->decimal('estimated_width_cm', 8, 2)->nullable();
            $table->decimal('estimated_height_cm', 8, 2)->nullable();

            $table->decimal('actual_weight_kg', 8, 3)->nullable();
            $table->decimal('actual_length_cm', 8, 2)->nullable();
            $table->decimal('actual_width_cm', 8, 2)->nullable();
            $table->decimal('actual_height_cm', 8, 2)->nullable();

            $table->decimal('volumetric_weight_kg', 8, 3)->nullable();
            $table->decimal('billed_weight_kg', 8, 3)->nullable();
            $table->decimal('shipping_fee', 12, 2)->nullable();
            $table->decimal('delivery_fee', 12, 2)->nullable();
            $table->decimal('total_amount', 12, 2)->nullable();

            $table->string('qr_code', 255)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('delivery_receipt_path', 255)->nullable();
            $table->timestamps();

            $table->index(['customer_id', 'status']);
            $table->index('created_at');
            $table->index('store_tracking_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
