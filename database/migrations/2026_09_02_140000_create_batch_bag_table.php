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
        Schema::table('bags', function (Blueprint $table) {
            $table->dropIndex(['status', 'batch_id']);
            $table->dropConstrainedForeignId('batch_id');
        });

        Schema::create('batch_bag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained('batches')->cascadeOnDelete();
            $table->foreignId('bag_id')->constrained('bags')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['batch_id', 'bag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_bag');

        Schema::table('bags', function (Blueprint $table) {
            $table->foreignId('batch_id')->nullable()->after('uuid')->constrained('batches')->nullOnDelete();
            $table->index(['status', 'batch_id']);
        });
    }
};
