<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->text('notes')->nullable();
            $table->string('status', 30)->default('preparing');
            $table->unsignedInteger('total_packages')->default(0);
            $table->unsignedInteger('total_weight')->default(0);
            $table->timestamp('departure_at')->nullable();
            $table->timestamp('arrival_at')->nullable();
            $table->timestamps();

            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
