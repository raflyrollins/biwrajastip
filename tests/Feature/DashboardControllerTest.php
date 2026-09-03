<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);
});

it('redirects guests away from the dashboard', function (): void {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

it('lets an admin see the dashboard with package/bag/batch stats', function (): void {
    $admin = User::factory()->create()->assignRole(Role::Admin->value);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('greeting')
            ->has('stats', fn (Assert $stats) => $stats
                ->where('packages', 0)
                ->where('bags', 0)
                ->where('batches', 0)
                ->where('nearing_delivery', 0)));
});

it('lets a customer see only their own package scope', function (): void {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats', fn (Assert $stats) => $stats
                ->where('packages', 0)
                ->where('nearing_delivery', 0)
                // customer has no bag/batch menus -> null
                ->where('bags', null)
                ->where('batches', null)));
});
