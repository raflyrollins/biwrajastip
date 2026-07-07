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
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tracking_code', 20)->unique();
            $table->string('sender_name')->nullable();
            $table->string('sender_store')->nullable();
            $table->string('sender_tracking_number')->nullable();
            $table->string('recipient_name');
            $table->string('recipient_phone')->nullable();
            $table->foreignId('zone_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('weight_estimated')->nullable();
            $table->unsignedInteger('length')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('weight_actual')->nullable();
            $table->unsignedInteger('final_weight')->nullable();
            $table->unsignedInteger('shipping_cost')->default(0);
            $table->unsignedInteger('delivery_fee')->default(0);
            $table->unsignedInteger('total_cost')->default(0);
            $table->string('status', 30)->default('waiting_for_collection');
            $table->unsignedBigInteger('bag_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
