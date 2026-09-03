<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin biwrajastip',
            'email' => 'admin@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::Admin->value);

        User::factory()->create([
            'name' => 'Customer Demo',
            'email' => 'customer@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::Customer->value);

        User::factory()->create([
            'name' => 'Staff Surabaya',
            'email' => 'staff-surabaya@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::StaffSurabaya->value);

        User::factory()->create([
            'name' => 'Staff Ende',
            'email' => 'staff-ende@biwrajastip.test',
            'password' => 'password',
        ])->assignRole(Role::StaffEnde->value);

        $this->call([
            DeliveryZoneSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
