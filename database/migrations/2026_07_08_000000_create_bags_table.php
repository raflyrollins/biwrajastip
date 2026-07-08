<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bags', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('code', 20)->unique();
            $table->unsignedBigInteger('batch_id')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedInteger('total_packages')->default(0);
            $table->unsignedInteger('total_weight')->default(0);
            $table->timestamps();

            $table->index(['batch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bags');
    }
};
