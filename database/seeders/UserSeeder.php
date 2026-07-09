<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin Biwra',
                'email' => 'admin@biwrajastip.com',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'Owner Biwra',
                'email' => 'owner@biwrajastip.com',
                'password' => 'password',
                'role' => 'owner',
            ],
            [
                'name' => 'Staff Surabaya',
                'email' => 'staff.surabaya@biwrajastip.com',
                'password' => 'password',
                'role' => 'staff_surabaya',
            ],
            [
                'name' => 'Staff Ende',
                'email' => 'staff.ende@biwrajastip.com',
                'password' => 'password',
                'role' => 'staff_ende',
            ],
            [
                'name' => 'Customer Biwra',
                'email' => 'customer@biwrajastip.com',
                'password' => 'password',
                'role' => 'customer',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [...$userData, 'password' => Hash::make($userData['password'])],
            );

            $role = Role::where('name', $roleName)->firstOrFail();
            $user->assignRole($role->name);
        }
    }
}
