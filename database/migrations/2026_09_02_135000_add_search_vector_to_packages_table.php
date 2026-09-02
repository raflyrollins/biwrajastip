<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * PostgreSQL fulltext support for scannable package identifiers.
     * Guarded: phpunit runs on SQLite, which does not support tsvector.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement("
            ALTER TABLE packages
            ADD COLUMN search_vector tsvector
            GENERATED ALWAYS AS (
                to_tsvector('simple',
                    coalesce(store_tracking_number, '') || ' ' ||
                    coalesce(biwrajastip_tracking_number, '') || ' ' ||
                    coalesce(receiver_name, '')
                )
            ) STORED
        ");

        DB::statement('CREATE INDEX packages_search_vector_idx ON packages USING GIN (search_vector)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS packages_search_vector_idx');
        DB::statement('ALTER TABLE packages DROP COLUMN IF EXISTS search_vector');
    }
};
