<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Enums\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed roles and permissions, then assign permissions per role.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = array_map(
            fn (Permission $p): string => $p->value,
            Permission::cases()
        );

        foreach ($permissions as $permission) {
            SpatiePermission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $permissionsByRole = [
            Role::Customer->value => [
                Permission::MenuPackages->value,
                Permission::MenuProfile->value,
                Permission::ActionPackagesCreate->value,
            ],
            Role::StaffSurabaya->value => [
                Permission::MenuPackages->value,
                Permission::MenuBags->value,
                Permission::MenuBatches->value,
                Permission::MenuProfile->value,
                Permission::ActionPackagesProcess->value,
                Permission::ActionBagsPrint->value,
                Permission::ActionBagsAdjust->value,
                Permission::ActionBatchesPrint->value,
            ],
            Role::StaffEnde->value => [
                Permission::MenuPackages->value,
                Permission::MenuBags->value,
                Permission::MenuBatches->value,
                Permission::MenuProfile->value,
            ],
            Role::Admin->value => $permissions,
        ];

        foreach ($permissionsByRole as $roleName => $rolePermissions) {
            /** @var SpatieRole $role */
            $role = SpatieRole::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
