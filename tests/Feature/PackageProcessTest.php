<?php

use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Events\PackageStatusUpdated;
use App\Models\DeliveryZone;
use App\Models\Package;
use App\Models\Setting;
use App\Models\User;
use App\Models\ZoneRate;
use App\Support\Pricing;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function staffSurabaya(): User
{
    return User::factory()->create()->assignRole(Role::StaffSurabaya->value);
}

it('lets staff-surabaya process a registered package into a payable processed state', function () {
    $staff = staffSurabaya();

    $zone = DeliveryZone::factory()->create();
    ZoneRate::factory()->create([
        'delivery_zone_id' => $zone->id,
        'max_weight_kg' => 100,
        'price_per_kg' => 18000,
    ]);
    Setting::create(['key' => Pricing::FLAT_SHIPPING_FEE_KEY, 'value' => '15000']);

    $package = Package::factory()->create([
        'status' => PackageStatus::Registered->value,
        'delivery_zone_id' => $zone->id,
    ]);

    Event::fake([PackageStatusUpdated::class]);

    $this->actingAs($staff)
        ->from(route('packages.index'))
        ->put(route('packages.process.update', $package), [
            'actual_weight_g' => 2516,
            'actual_length_cm' => 30,
            'actual_width_cm' => 20,
            'actual_height_cm' => 20,
        ])
        ->assertRedirect(route('packages.index'));

    $processed = $package->fresh();

    expect($processed->status)->toBe(PackageStatus::Processed)
        ->and($processed->actual_weight_kg)->toBe('2.516')
        ->and($processed->actual_length_cm)->toBe('30.00')
        ->and($processed->billed_weight_kg)->toBe('3.000')
        ->and($processed->shipping_fee)->toBe('45000.00')
        ->and($processed->delivery_fee)->toBe('18000.00')
        ->and($processed->total_amount)->toBe('63000.00');

    Event::assertDispatched(PackageStatusUpdated::class, function ($event) use ($package) {
        return $event->uuid === $package->uuid
            && $event->status === PackageStatus::Processed->value;
    });
});

it('allows processing a collected package', function () {
    $staff = staffSurabaya();
    Setting::create(['key' => Pricing::FLAT_SHIPPING_FEE_KEY, 'value' => '15000']);

    $package = Package::factory()->create([
        'status' => PackageStatus::Collected->value,
    ]);

    $this->actingAs($staff)
        ->from(route('packages.index'))
        ->put(route('packages.process.update', $package), [
            'actual_weight_g' => 1000,
        ])
        ->assertRedirect(route('packages.index'));

    expect($package->fresh()->status)->toBe(PackageStatus::Processed);
});

it('forbids processing a package that is already processed', function () {
    $staff = staffSurabaya();

    $package = Package::factory()->create([
        'status' => PackageStatus::Processed->value,
        'total_amount' => 33000,
    ]);

    $this->actingAs($staff)
        ->put(route('packages.process.update', $package), [
            'actual_weight_g' => 1000,
        ])
        ->assertStatus(422);

    expect($package->fresh()->status)->toBe(PackageStatus::Processed);
});

it('forbids non-staff-surabaya from processing a package', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);
    $package = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Registered->value,
    ]);

    $this->actingAs($customer)
        ->put(route('packages.process.update', $package), [
            'actual_weight_g' => 1000,
        ])
        ->assertStatus(403);

    expect($package->fresh()->status)->toBe(PackageStatus::Registered);
});

it('renders the process page for an authorized staff user', function () {
    $staff = staffSurabaya();
    $package = Package::factory()->create([
        'status' => PackageStatus::Registered->value,
    ]);

    $this->actingAs($staff)
        ->get(route('packages.process', $package))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('packages/process'));
});
