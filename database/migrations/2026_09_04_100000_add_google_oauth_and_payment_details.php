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
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id', 100)->nullable()->after('email_verified_at');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->string('order_id', 100)->nullable()->unique()->after('package_id');
            $table->string('payment_type', 50)->nullable()->after('payment_method');
            $table->timestamp('expired_at')->nullable()->after('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('order_id', 'payment_type', 'expired_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('google_id');
        });
    }
};
