<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Package permissions
            'packages.view' => 'Lihat Paket',
            'packages.create' => 'Buat Paket',
            'packages.update' => 'Update Paket',
            'packages.delete' => 'Hapus Paket',
            'packages.print' => 'Cetak Resi',

            // Package scope permissions
            'packages.scope.all' => 'Lihat Semua Paket',
            'packages.scope.own' => 'Lihat Paket Sendiri',
            'packages.scope.collected' => 'Lihat Paket Collected',
            'packages.scope.transit' => 'Lihat Paket Transit',

            // Bag permissions
            'bags.view' => 'Lihat Bag',
            'bags.create' => 'Buat Bag',
            'bags.update' => 'Update Bag',
            'bags.delete' => 'Hapus Bag',
            'bags.print' => 'Cetak Kode Bag',

            // Batch permissions
            'batches.view' => 'Lihat Batch',
            'batches.create' => 'Buat Batch',
            'batches.update' => 'Update Batch',
            'batches.delete' => 'Hapus Batch',
            'batches.print' => 'Cetak Batch A4',

            // Payment permissions
            'payments.view' => 'Lihat Pembayaran',
            'payments.verify' => 'Verifikasi Pembayaran',

            // Zone permissions
            'zones.view' => 'Lihat Zona',
            'zones.create' => 'Buat Zona',
            'zones.update' => 'Update Zona',
            'zones.delete' => 'Hapus Zona',

            // Ship permissions
            'ships.view' => 'Lihat Kapal',
            'ships.create' => 'Buat Kapal',
            'ships.update' => 'Update Kapal',
            'ships.delete' => 'Hapus Kapal',

            // Schedule permissions
            'schedules.view' => 'Lihat Jadwal',
            'schedules.create' => 'Buat Jadwal',
            'schedules.update' => 'Update Jadwal',
            'schedules.delete' => 'Hapus Jadwal',

            // User management permissions
            'users.view' => 'Lihat User',
            'users.create' => 'Buat User',
            'users.update' => 'Update User',
            'users.delete' => 'Hapus User',

            // Role management permissions
            'roles.view' => 'Lihat Role',
            'roles.manage' => 'Kelola Role',

            // Report permissions
            'reports.view' => 'Lihat Laporan',
        ];

        $permissionModels = [];
        foreach ($permissions as $name => $label) {
            $permissionModels[$name] = Permission::create([
                'name' => $name,
                'label' => $label,
            ]);
        }

        $roles = [
            'customer' => 'Customer',
            'staff_surabaya' => 'Staff Surabaya',
            'staff_ende' => 'Staff Ende',
            'admin' => 'Admin',
            'owner' => 'Owner',
        ];

        $roleModels = [];
        foreach ($roles as $name => $label) {
            $roleModels[$name] = Role::create([
                'name' => $name,
                'label' => $label,
            ]);
        }

        // Customer permissions
        $roleModels['customer']->permissions()->attach([
            $permissionModels['packages.view']->id,
            $permissionModels['packages.create']->id,
            $permissionModels['packages.update']->id,
            $permissionModels['packages.scope.own']->id,
            $permissionModels['payments.view']->id,
        ]);

        // Staff Surabaya permissions
        $roleModels['staff_surabaya']->permissions()->attach([
            $permissionModels['packages.view']->id,
            $permissionModels['packages.update']->id,
            $permissionModels['packages.print']->id,
            $permissionModels['packages.scope.collected']->id,
            $permissionModels['bags.view']->id,
            $permissionModels['bags.create']->id,
            $permissionModels['bags.update']->id,
            $permissionModels['bags.print']->id,
            $permissionModels['batches.view']->id,
            $permissionModels['batches.create']->id,
            $permissionModels['batches.update']->id,
            $permissionModels['batches.print']->id,
        ]);

        // Staff Ende permissions
        $roleModels['staff_ende']->permissions()->attach([
            $permissionModels['packages.view']->id,
            $permissionModels['packages.update']->id,
            $permissionModels['packages.scope.transit']->id,
            $permissionModels['bags.view']->id,
            $permissionModels['batches.view']->id,
        ]);

        // Admin permissions
        $roleModels['admin']->permissions()->attach(array_column($permissionModels, 'id'));

        // Owner permissions
        $roleModels['owner']->permissions()->attach([
            $permissionModels['packages.scope.all']->id,
            $permissionModels['reports.view']->id,
            $permissionModels['users.view']->id,
            $permissionModels['users.create']->id,
            $permissionModels['users.update']->id,
            $permissionModels['users.delete']->id,
            $permissionModels['roles.view']->id,
            $permissionModels['roles.manage']->id,
        ]);

        // Default admin account
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@biwrajastip.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Default owner account
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@biwrajastip.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
        ]);
        $owner->assignRole('owner');
    }
}
