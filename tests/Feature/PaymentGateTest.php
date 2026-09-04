<?php

use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('lets a customer open the checkout when the package is processed or pending payment', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $collected = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Collected->value,
        'total_amount' => 50000,
    ]);

    $processed = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Processed->value,
        'total_amount' => 50000,
    ]);

    $pendingPayment = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::PendingPayment->value,
        'total_amount' => 50000,
    ]);

    // Not yet processed -> payment is blocked.
    $this->actingAs($customer)
        ->get(route('payments.checkout', $collected))
        ->assertStatus(422);

    // Processed -> checkout is reachable.
    $this->actingAs($customer)
        ->get(route('payments.checkout', $processed))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('payments/checkout'));

    // PendingPayment -> checkout is reachable (retry flow).
    $this->actingAs($customer)
        ->get(route('payments.checkout', $pendingPayment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('payments/checkout'));
});

it('blocks checkout for a registered package', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $registered = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Registered->value,
        'total_amount' => 30000,
    ]);

    $this->actingAs($customer)
        ->get(route('payments.checkout', $registered))
        ->assertStatus(422);
});

it('does not let another customer open another customers checkout', function () {
    $owner = User::factory()->create()->assignRole(Role::Customer->value);
    $other = User::factory()->create()->assignRole(Role::Customer->value);

    $package = Package::factory()->create([
        'customer_id' => $owner->id,
        'status' => PackageStatus::Processed->value,
        'total_amount' => 50000,
    ]);

    $this->actingAs($other)
        ->get(route('payments.checkout', $package))
        ->assertStatus(403);
});

it('exposes can_pay and has_pending_payment correctly on the index', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Registered->value,
        'total_amount' => 30000,
    ]);
    $processed = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Processed->value,
        'total_amount' => 50000,
    ]);
    $pendingPayment = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::PendingPayment->value,
        'total_amount' => 50000,
    ]);

    $this->actingAs($customer)
        ->get(route('packages.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('packages.data', 3)
            ->where('packages.data', fn ($rows) => $rows
                ->every(fn ($row) => match ($row['uuid']) {
                    $processed->uuid => $row['can_pay'] === true && $row['has_pending_payment'] === false,
                    $pendingPayment->uuid => $row['can_pay'] === false && $row['has_pending_payment'] === true,
                    default => $row['can_pay'] === false && $row['has_pending_payment'] === false,
                })));
});

it('hides can_pay for staff users even on processed packages', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);

    Package::factory()->create([
        'status' => PackageStatus::Processed->value,
        'total_amount' => 50000,
    ]);

    $this->actingAs($staff)
        ->get(route('packages.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('packages.data', 1)
            ->where('packages.data.0.can_pay', false)
            ->where('packages.data.0.has_pending_payment', false));
});
