<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->unsignedInteger('length_estimated')->nullable()->after('height');
            $table->unsignedInteger('width_estimated')->nullable()->after('length_estimated');
            $table->unsignedInteger('height_estimated')->nullable()->after('width_estimated');
            $table->unsignedInteger('volumetric_estimated')->nullable()->after('height_estimated');
            $table->unsignedInteger('volumetric_actual')->nullable()->after('weight_actual');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'length_estimated',
                'width_estimated',
                'height_estimated',
                'volumetric_estimated',
                'volumetric_actual',
            ]);
        });
    }
};
