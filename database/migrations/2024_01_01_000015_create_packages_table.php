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
            $table->string('sender_name');
            $table->string('sender_phone');
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->string('tracking_number');
            $table->string('tracking_number_biwra')->nullable()->unique();
            $table->string('qr_code')->nullable();
            $table->foreignId('zone_id')->constrained()->cascadeOnDelete();
            $table->enum('status', [
                'waiting_for_collection',
                'collected',
                'waiting_for_payment',
                'paid',
                'bagging',
                'berangkat_ke_pelabuhan',
                'in_transit',
                'arrived',
                'ready_for_sorting',
                'siap_diambil',
                'dalam_pengantaran',
                'selesai',
                'cancelled',
            ])->default('waiting_for_collection');
            $table->decimal('weight_estimated', 8, 2)->default(0);
            $table->decimal('length_estimated', 8, 2)->default(0);
            $table->decimal('width_estimated', 8, 2)->default(0);
            $table->decimal('height_estimated', 8, 2)->default(0);
            $table->decimal('weight_actual', 8, 2)->nullable();
            $table->decimal('length_actual', 8, 2)->nullable();
            $table->decimal('width_actual', 8, 2)->nullable();
            $table->decimal('height_actual', 8, 2)->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('delivery_fee', 12, 2)->nullable();
            $table->decimal('total_price', 12, 2)->nullable();
            $table->foreignId('bag_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('collected_at')->nullable();
            $table->timestamps();

            $table->fulltext(['tracking_number', 'tracking_number_biwra', 'sender_name', 'receiver_name'], 'pkg_fulltext');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
