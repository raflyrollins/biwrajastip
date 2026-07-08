<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bags', function (Blueprint $table) {
            $table->string('status', 30)->default('in_batch')->after('total_weight');
        });
    }

    public function down(): void
    {
        Schema::table('bags', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
