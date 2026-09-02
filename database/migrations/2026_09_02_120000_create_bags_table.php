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
        Schema::create('bags', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('batch_id')->nullable()->constrained('batches')->nullOnDelete();
            $table->string('bag_number', 100)->unique();
            $table->string('status', 30)->default('draft');
            $table->decimal('sealed_weight_kg', 8, 3)->nullable();
            $table->unsignedInteger('package_count')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'batch_id']);
        });

        Schema::create('bag_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bag_id')->constrained('bags')->cascadeOnDelete();
            $table->foreignId('package_id')->constrained('packages')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['bag_id', 'package_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bag_package');
        Schema::dropIfExists('bags');
    }
};
