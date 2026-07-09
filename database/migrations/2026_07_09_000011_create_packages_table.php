<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bag_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('zone_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('waiting_for_collection');
            $table->string('sender_name');
            $table->string('sender_phone');
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->string('tracking_number');
            $table->string('tracking_number_biwra')->nullable();
            $table->string('description')->nullable();
            $table->decimal('weight_estimated', 10, 2)->nullable();
            $table->decimal('length_estimated', 10, 2)->nullable();
            $table->decimal('width_estimated', 10, 2)->nullable();
            $table->decimal('height_estimated', 10, 2)->nullable();
            $table->decimal('weight_actual', 10, 2)->nullable();
            $table->decimal('length_actual', 10, 2)->nullable();
            $table->decimal('width_actual', 10, 2)->nullable();
            $table->decimal('height_actual', 10, 2)->nullable();
            $table->decimal('volumetric_weight', 10, 2)->nullable();
            $table->decimal('final_weight', 10, 2)->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('delivery_fee', 12, 2)->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->timestamp('collected_at')->nullable();
            $table->timestamps();

            $table->fullText(['tracking_number', 'receiver_name', 'sender_name', 'description'], 'packages_search_fulltext');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
