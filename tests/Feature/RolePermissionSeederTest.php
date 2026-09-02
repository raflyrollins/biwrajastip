<?php

use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\Models\Role as SpatieRole;

uses(RefreshDatabase::class);

it('seeds all permissions referenced by the enum', function () {
    (new RolePermissionSeeder)->run();

    $count = SpatiePermission::count();
    expect($count)->toBe(count(Permission::cases()));
});

it('seeds the four core roles', function () {
    (new RolePermissionSeeder)->run();

    expect(SpatieRole::count())->toBe(4);
    foreach ([Role::Customer, Role::Admin, Role::StaffSurabaya, Role::StaffEnde] as $role) {
        expect(SpatieRole::whereName($role->value)->exists())->toBeTrue();
    }
});

it('gives admin every permission and customer only own-scope permissions', function () {
    (new RolePermissionSeeder)->run();

    $admin = SpatieRole::whereName(Role::Admin->value)->first();
    $expectedAll = array_map(fn (Permission $p) => $p->value, Permission::cases());
    sort($expectedAll);

    expect($admin->permissions->pluck('name')->sort()->values()->all())
        ->toEqual($expectedAll);

    $customer = SpatieRole::whereName(Role::Customer->value)->first();
    expect($customer->permissions->pluck('name')->sort()->values()->all())
        ->toEqualCanonicalizing([
            Permission::MenuPackages->value,
            Permission::MenuProfile->value,
            Permission::ActionPackagesCreate->value,
        ]);
});

it('is idempotent when seeded twice', function () {
    (new RolePermissionSeeder)->run();
    (new RolePermissionSeeder)->run();

    expect(SpatieRole::count())->toBe(4);
    expect(SpatiePermission::count())->toBe(count(Permission::cases()));
});

it('assigns the demo roles via the seeder', function () {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole(Role::Admin->value);

    expect($admin->hasRole(Role::Admin->value))->toBeTrue();
    expect($admin->can(Permission::MenuReports->value))->toBeTrue();
    expect($admin->can(Permission::ActionBatchesSchedule->value))->toBeTrue();
});
