<?php

use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\DeliveryZone;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\DeliveryZoneSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('lets a customer open the registration form', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->get(route('packages.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('packages/create')
            ->has('deliveryZones')
            ->has('flatShippingFee'));
});

it('denies staff the registration form', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);

    $this->actingAs($staff)
        ->get(route('packages.create'))
        ->assertForbidden();
});

it('stores a package and computes pricing for a delivery zone', function () {
    $this->seed(DeliveryZoneSeeder::class);
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $zone = DeliveryZone::where('name', 'Kec. Ende')->first();

    $this->actingAs($customer)
        ->post(route('packages.store'), [
            'store_tracking_number' => 'JNE-REF-123',
            'receiver_name' => 'biwrajastip (test)',
            'delivery_zone_id' => $zone->id,
            'delivery_address' => 'Jl. Kelimutu No. 1, Ende',
            'estimated_weight_g' => 2500,
        ])
        ->assertRedirect(route('packages.index'));

    $this->assertDatabaseHas('packages', [
        'customer_id' => $customer->id,
        'store_tracking_number' => 'JNE-REF-123',
        'receiver_name' => 'biwrajastip (test)',
        'delivery_zone_id' => $zone->id,
        'delivery_address' => 'Jl. Kelimutu No. 1, Ende',
        'status' => PackageStatus::Registered->value,
        // 2500 g -> residual 500g > 300 -> rounded up to 3.0 kg.
        'estimated_weight_kg' => '2.500',
        'billed_weight_kg' => '3.000',
        'shipping_fee' => '45000.00',
        'delivery_fee' => '5000.00',
        'total_amount' => '50000.00',
    ]);
});

it('stores a pick-up package without a delivery fee', function () {
    $this->seed(DeliveryZoneSeeder::class);
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->post(route('packages.store'), [
            'store_tracking_number' => 'JNE-REF-124',
            'receiver_name' => 'biwrajastip (test)',
            'delivery_address' => 'Jl. Kelimutu No. 1, Ende',
            'estimated_weight_g' => 1100,
        ])
        ->assertRedirect(route('packages.index'));

    $this->assertDatabaseHas('packages', [
        'store_tracking_number' => 'JNE-REF-124',
        'delivery_zone_id' => null,
        'billed_weight_kg' => '1.000',
        'shipping_fee' => '15000.00',
        'delivery_fee' => '0.00',
        'total_amount' => '15000.00',
    ]);
});

it('uses the volumetric weight when it exceeds the scaled weight', function () {
    $this->seed(DeliveryZoneSeeder::class);
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $zone = DeliveryZone::where('name', 'Kec. Ende')->first();

    // 60x40x40 cm -> 96,000 cm³ / 6000 = 16 kg volumetric, but scaled is 2 kg.
    $this->actingAs($customer)
        ->post(route('packages.store'), [
            'store_tracking_number' => 'JNE-REF-125',
            'receiver_name' => 'biwrajastip (test)',
            'delivery_zone_id' => $zone->id,
            'delivery_address' => 'Jl. Kelimutu No. 1, Ende',
            'estimated_weight_g' => 2000,
            'estimated_length_cm' => 60,
            'estimated_width_cm' => 40,
            'estimated_height_cm' => 40,
        ])
        ->assertRedirect(route('packages.index'));

    $this->assertDatabaseHas('packages', [
        'store_tracking_number' => 'JNE-REF-125',
        'volumetric_weight_kg' => '16.000',
        'billed_weight_kg' => '16.000',
        'shipping_fee' => '240000.00',
        'delivery_fee' => '5000.00',
        'total_amount' => '245000.00',
    ]);
});

it('validates required fields when registering', function () {
    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $this->actingAs($customer)
        ->from(route('packages.create'))
        ->post(route('packages.store'), [])
        ->assertRedirect(route('packages.create'))
        ->assertSessionHasErrors([
            'store_tracking_number',
            'receiver_name',
            'delivery_address',
            'estimated_weight_g',
        ]);

    expect(Package::count())->toBe(0);
});

it('denies staff the registration submission', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);

    $this->actingAs($staff)
        ->post(route('packages.store'), [
            'store_tracking_number' => 'JNE-REF-123',
            'receiver_name' => 'biwrajastip (test)',
            'delivery_address' => 'Jl. Kelimutu No. 1, Ende',
            'estimated_weight_g' => 2500,
        ])
        ->assertForbidden();

    expect(Package::count())->toBe(0);
});
