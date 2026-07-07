<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Permissions ──
        $permissions = [
            // Dashboard
            'view dashboard',

            // Package (customer)
            'view own packages',
            'create package',
            'view own tracking',

            // Package (shared)
            'view all packages',

            // Staff Surabaya
            'receive package',
            'process bagging',

            // Staff Ende
            'sort packages',
            'manage pickup',

            // Admin
            'manage packages',
            'manage batches',
            'manage zones',

            // Admin & Owner
            'manage users',
            'view reports',
            'manage settings',

            // Owner
            'manage all',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // ── Roles & Permissions ──
        $roles = [
            'customer' => [
                'view dashboard',
                'view own packages',
                'create package',
                'view own tracking',
            ],
            'staff_surabaya' => [
                'view dashboard',
                'view all packages',
                'receive package',
                'process bagging',
            ],
            'staff_ende' => [
                'view dashboard',
                'view all packages',
                'sort packages',
                'manage pickup',
            ],
            'admin' => [
                'view dashboard',
                'manage packages',
                'manage batches',
                'manage zones',
                'manage users',
                'view reports',
                'manage settings',
            ],
            'owner' => [
                'view dashboard',
                'view reports',
                'manage users',
                'manage settings',
                'manage all',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($rolePermissions);
        }

        // ── Users ──
        $users = [
            [
                'name' => 'Customer',
                'email' => 'customer@biwrajastip.com',
                'phone' => '081234567890',
                'password' => 'password',
                'role' => 'customer',
            ],
            [
                'name' => 'Staff Surabaya',
                'email' => 'staff.sby@biwrajastip.com',
                'phone' => '081234567891',
                'password' => 'password',
                'role' => 'staff_surabaya',
            ],
            [
                'name' => 'Staff Ende',
                'email' => 'staff.ende@biwrajastip.com',
                'phone' => '081234567892',
                'password' => 'password',
                'role' => 'staff_ende',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@biwrajastip.com',
                'phone' => '081234567893',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'Owner',
                'email' => 'owner@biwrajastip.com',
                'phone' => '081234567894',
                'password' => 'password',
                'role' => 'owner',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    ...$userData,
                    'password' => Hash::make($userData['password']),
                ],
            );

            $user->syncRoles($role);
        }
    }
}
