<?php

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);
});

it('redirects guests away from entity list pages', function (): void {
    $this->get(route('packages.index'))->assertRedirect(route('login'));
    $this->get(route('bags.index'))->assertRedirect(route('login'));
    $this->get(route('batches.index'))->assertRedirect(route('login'));
});

it('lets an admin see package, bag, and batch lists', function (): void {
    $admin = User::factory()->create()->assignRole(Role::Admin->value);

    Package::factory()->create([
        'status' => PackageStatus::Paid->value,
        'biwrajastip_tracking_number' => 'BWRJ-0001',
    ]);
    Bag::factory()->create(['status' => BagStatus::Bagged->value]);
    Batch::factory()->create(['status' => BatchStatus::Batched->value]);

    $this->actingAs($admin)
        ->get(route('packages.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('packages/index')
            ->has('packages.data', 1)
            ->where('packages.meta.total', 1)
            ->where('allowCreate', true));

    $this->actingAs($admin)
        ->get(route('bags.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('bags/index')
            ->has('bags.data', 1)
            ->where('bags.meta.total', 1));

    $this->actingAs($admin)
        ->get(route('batches.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('batches/index')
            ->has('batches.data', 1)
            ->where('batches.meta.total', 1));
});

it('denies a customer bag and batch lists via permission gate', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)->get(route('packages.index'))->assertOk();
    $this->actingAs($customer)->get(route('bags.index'))->assertForbidden();
    $this->actingAs($customer)->get(route('batches.index'))->assertForbidden();
});

it('scopes packages to the owning customer only', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);
    $other = User::factory()->create();

    Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Registered->value,
    ]);
    Package::factory()->create([
        'customer_id' => $other->id,
        'status' => PackageStatus::Registered->value,
    ]);

    $this->actingAs($customer)
        ->get(route('packages.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('packages/index')
            ->has('packages.data', 1));
});

it('scopes packages to staff-ende statuses only', function (): void {
    $staff = User::factory()->create()->assignRole(Role::StaffEnde->value);

    Package::factory()->create(['status' => PackageStatus::Delivered->value]);
    Package::factory()->create(['status' => PackageStatus::Registered->value]);

    $this->actingAs($staff)
        ->get(route('packages.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('packages/index')
            ->has('packages.data', 1)
            ->where('allowCreate', false));
});

it('scopes bags to staff-surabaya statuses only', function (): void {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);

    Bag::factory()->create(['status' => BagStatus::Draft->value]);
    Bag::factory()->create(['status' => BagStatus::Complete->value]);

    $this->actingAs($staff)
        ->get(route('bags.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('bags/index')
            ->has('bags.data', 1));
});

it('lets any account open profile and sees their roles', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->get(route('profile.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/index'));
});

it('restricts reports and settings to admins', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);
    $admin = User::factory()->create()->assignRole(Role::Admin->value);

    $this->actingAs($customer)->get(route('reports.index'))->assertForbidden();
    $this->actingAs($customer)->get(route('settings.index'))->assertForbidden();

    $this->actingAs($admin)->get(route('reports.index'))->assertOk();
    $this->actingAs($admin)->get(route('settings.index'))->assertOk();
});

it('shares the accounts menu permissions to the frontend', function (): void {
    $admin = User::factory()->create()->assignRole(Role::Admin->value);

    // An empty auth.permissions would hide every menu item (regression guard
    // for the sidebar). Admin must see all menus and actions.
    $expected = [
        'menu.packages',
        'menu.bags',
        'menu.batches',
        'menu.reports',
        'menu.settings.roles',
        'menu.settings.rates',
        'menu.settings.irregularity',
        'menu.settings.payments',
        'menu.profile',
        'action.packages.create',
        'action.packages.process',
        'action.bags.print',
        'action.bags.adjust',
        'action.batches.print',
        'action.batches.schedule',
        'settings.manage',
        'reports.view',
        'promotions.manage',
        'promo-codes.manage',
    ];

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('auth.permissions')
            ->where('auth.permissions', $expected));
});

it('shares a customers limited menu permissions', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('auth.permissions')
            ->where('auth.permissions', [
                'menu.packages',
                'menu.profile',
                'action.packages.create',
            ]));
});
