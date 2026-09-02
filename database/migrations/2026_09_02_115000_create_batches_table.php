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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('batch_number', 100)->unique();
            $table->string('status', 30)->default('draft');
            $table->timestamp('scheduled_departure_at')->nullable();
            $table->timestamp('departed_at')->nullable();
            $table->unsignedInteger('bag_count')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'scheduled_departure_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
