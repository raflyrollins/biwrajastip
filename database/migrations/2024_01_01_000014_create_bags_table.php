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
            $table->uuid()->unique();
            $table->string('code')->unique();
            $table->string('qr_code')->nullable();
            $table->enum('status', ['created', 'in_batch', 'unbagged'])->default('created');
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bags');
    }
};
