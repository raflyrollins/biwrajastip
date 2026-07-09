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
            $table->uuid()->unique();
            $table->string('code')->unique();
            $table->string('qr_code')->nullable();
            $table->foreignId('ship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->date('departure_date');
            $table->enum('status', ['preparing', 'departed', 'arrived', 'unbatched'])->default('preparing');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
