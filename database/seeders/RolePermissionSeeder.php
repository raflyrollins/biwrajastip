<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'customer', 'label' => 'Customer'],
            ['name' => 'staff_surabaya', 'label' => 'Staff Surabaya'],
            ['name' => 'staff_ende', 'label' => 'Staff Ende'],
            ['name' => 'admin', 'label' => 'Admin'],
            ['name' => 'owner', 'label' => 'Owner'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }

        $permissions = [
            // Packages
            ['name' => 'packages.view', 'label' => 'View Packages', 'group' => 'packages'],
            ['name' => 'packages.create', 'label' => 'Create Packages', 'group' => 'packages'],
            ['name' => 'packages.update', 'label' => 'Update Packages', 'group' => 'packages'],
            ['name' => 'packages.delete', 'label' => 'Delete Packages', 'group' => 'packages'],
            ['name' => 'packages.print', 'label' => 'Print Package Receipt', 'group' => 'packages'],
            ['name' => 'packages.scope.own', 'label' => 'Scope: Own Packages', 'group' => 'packages'],
            ['name' => 'packages.scope.collected', 'label' => 'Scope: Collected Packages', 'group' => 'packages'],
            ['name' => 'packages.scope.transit', 'label' => 'Scope: Transit Packages', 'group' => 'packages'],
            ['name' => 'packages.scope.all', 'label' => 'Scope: All Packages', 'group' => 'packages'],
            // Bags
            ['name' => 'bags.view', 'label' => 'View Bags', 'group' => 'bags'],
            ['name' => 'bags.create', 'label' => 'Create Bags', 'group' => 'bags'],
            ['name' => 'bags.update', 'label' => 'Update Bags', 'group' => 'bags'],
            ['name' => 'bags.delete', 'label' => 'Delete Bags', 'group' => 'bags'],
            ['name' => 'bags.print', 'label' => 'Print Bag Label', 'group' => 'bags'],
            ['name' => 'bags.scope.own', 'label' => 'Scope: Own Bags', 'group' => 'bags'],
            ['name' => 'bags.scope.unbagged', 'label' => 'Scope: Unbagged Bags', 'group' => 'bags'],
            ['name' => 'bags.scope.all', 'label' => 'Scope: All Bags', 'group' => 'bags'],
            // Batches
            ['name' => 'batches.view', 'label' => 'View Batches', 'group' => 'batches'],
            ['name' => 'batches.create', 'label' => 'Create Batches', 'group' => 'batches'],
            ['name' => 'batches.update', 'label' => 'Update Batches', 'group' => 'batches'],
            ['name' => 'batches.delete', 'label' => 'Delete Batches', 'group' => 'batches'],
            ['name' => 'batches.print', 'label' => 'Print Batch Manifest', 'group' => 'batches'],
            ['name' => 'batches.scope.own', 'label' => 'Scope: Own Batches', 'group' => 'batches'],
            ['name' => 'batches.scope.unbatched', 'label' => 'Scope: Unbatched Batches', 'group' => 'batches'],
            ['name' => 'batches.scope.all', 'label' => 'Scope: All Batches', 'group' => 'batches'],
            // Payments
            ['name' => 'payments.view', 'label' => 'View Payments', 'group' => 'payments'],
            ['name' => 'payments.verify', 'label' => 'Verify Payments', 'group' => 'payments'],
            // Ships
            ['name' => 'ships.view', 'label' => 'View Ships', 'group' => 'ships'],
            ['name' => 'ships.create', 'label' => 'Create Ships', 'group' => 'ships'],
            ['name' => 'ships.update', 'label' => 'Update Ships', 'group' => 'ships'],
            ['name' => 'ships.delete', 'label' => 'Delete Ships', 'group' => 'ships'],
            // Schedules
            ['name' => 'schedules.view', 'label' => 'View Schedules', 'group' => 'schedules'],
            ['name' => 'schedules.create', 'label' => 'Create Schedules', 'group' => 'schedules'],
            ['name' => 'schedules.update', 'label' => 'Update Schedules', 'group' => 'schedules'],
            ['name' => 'schedules.delete', 'label' => 'Delete Schedules', 'group' => 'schedules'],
            // Zones
            ['name' => 'zones.view', 'label' => 'View Zones', 'group' => 'zones'],
            ['name' => 'zones.create', 'label' => 'Create Zones', 'group' => 'zones'],
            ['name' => 'zones.update', 'label' => 'Update Zones', 'group' => 'zones'],
            ['name' => 'zones.delete', 'label' => 'Delete Zones', 'group' => 'zones'],
            // Users
            ['name' => 'users.view', 'label' => 'View Users', 'group' => 'users'],
            ['name' => 'users.create', 'label' => 'Create Users', 'group' => 'users'],
            ['name' => 'users.update', 'label' => 'Update Users', 'group' => 'users'],
            ['name' => 'users.delete', 'label' => 'Delete Users', 'group' => 'users'],
            // Roles
            ['name' => 'roles.view', 'label' => 'View Roles', 'group' => 'roles'],
            ['name' => 'roles.create', 'label' => 'Create Roles', 'group' => 'roles'],
            ['name' => 'roles.update', 'label' => 'Update Roles', 'group' => 'roles'],
            ['name' => 'roles.delete', 'label' => 'Delete Roles', 'group' => 'roles'],
            ['name' => 'roles.manage', 'label' => 'Manage Roles', 'group' => 'roles'],
            // Reports
            ['name' => 'reports.view', 'label' => 'View Reports', 'group' => 'reports'],
            ['name' => 'reports.export', 'label' => 'Export Reports', 'group' => 'reports'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }

        $rolePermissions = [
            'customer' => [
                'packages.view',
                'packages.create',
                'packages.update',
                'packages.scope.own',
                'payments.view',
                'zones.view',
            ],
            'staff_surabaya' => [
                'packages.view',
                'packages.update',
                'packages.print',
                'packages.scope.collected',
                'bags.view',
                'bags.create',
                'bags.update',
                'bags.print',
                'bags.scope.own',
                'batches.view',
                'batches.create',
                'batches.update',
                'batches.print',
                'batches.scope.own',
            ],
            'staff_ende' => [
                'packages.view',
                'packages.update',
                'packages.scope.transit',
                'bags.view',
                'bags.update',
                'bags.scope.unbagged',
                'batches.view',
                'batches.update',
                'batches.scope.unbatched',
            ],
            'admin' => [
                'packages.view',
                'packages.create',
                'packages.update',
                'packages.delete',
                'packages.print',
                'packages.scope.all',
                'bags.view',
                'bags.create',
                'bags.update',
                'bags.delete',
                'bags.print',
                'bags.scope.all',
                'batches.view',
                'batches.create',
                'batches.update',
                'batches.delete',
                'batches.print',
                'batches.scope.all',
                'payments.view',
                'payments.verify',
                'ships.view',
                'ships.create',
                'ships.update',
                'ships.delete',
                'schedules.view',
                'schedules.create',
                'schedules.update',
                'schedules.delete',
                'zones.view',
                'zones.create',
                'zones.update',
                'zones.delete',
                'users.view',
                'users.create',
                'users.update',
                'users.delete',
                'roles.view',
                'roles.create',
                'roles.update',
                'roles.delete',
                'roles.manage',
                'reports.view',
            ],
            'owner' => [
                'packages.scope.all',
                'users.view',
                'users.create',
                'users.update',
                'users.delete',
                'roles.view',
                'roles.create',
                'roles.update',
                'roles.delete',
                'roles.manage',
                'reports.view',
                'reports.export',
                'bags.scope.all',
                'batches.scope.all',
            ],
        ];

        foreach ($rolePermissions as $roleName => $permNames) {
            $role = Role::where('name', $roleName)->firstOrFail();
            $permissionIds = Permission::whereIn('name', $permNames)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }
    }
}
