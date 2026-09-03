<?php

use App\Enums\BagStatus;
use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\Bag;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('validates a bag by its number', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $bag = Bag::factory()->create([
        'status' => BagStatus::Bagged->value,
        'bag_number' => 'BAG-0001',
    ]);

    $this->withToken($token)
        ->postJson(route('api.bags.validate'), [
            'code' => 'BAG-0001',
        ])
        ->assertOk()
        ->assertJsonPath('bag.bag_number', 'BAG-0001');
});

it('returns an error when a bag is not found', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $this->withToken($token)
        ->postJson(route('api.bags.validate'), [
            'code' => 'BAG-9999',
        ])
        ->assertStatus(422)
        ->assertJsonPath('errors.code.0', 'Bag tidak ditemukan untuk nomor tersebut.');
});

it('creates a bag from paid packages', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $first = Package::factory()->paid()->create([
        'biwrajastip_tracking_number' => 'BWRJ-0000001',
    ]);
    $second = Package::factory()->paid()->create([
        'biwrajastip_tracking_number' => 'BWRJ-0000002',
    ]);

    $this->withToken($token)
        ->postJson(route('api.bags.create'), [
            'codes' => ['BWRJ-0000001', 'BWRJ-0000002'],
        ])
        ->assertStatus(201)
        ->assertJsonPath('bag.package_count', 2);

    $bag = Bag::first();
    expect($bag)->not->toBeNull();
    expect($bag->packages()->count())->toBe(2);
    expect($first->fresh()->status)->toBe(PackageStatus::Bagged);
    expect($second->fresh()->status)->toBe(PackageStatus::Bagged);
});

it('rejects bagging a package that is not paid', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $package = Package::factory()->create([
        'status' => PackageStatus::Registered->value,
        'biwrajastip_tracking_number' => 'BWRJ-0000001',
    ]);

    $this->withToken($token)
        ->postJson(route('api.bags.create'), [
            'codes' => ['BWRJ-0000001'],
        ])
        ->assertStatus(422)
        ->assertJsonPath('errors.codes.0', 'Paket BWRJ-0000001 belum lunas dan tidak dapat di-bagging.');

    expect(Bag::count())->toBe(0);
    expect($package->fresh()->status)->toBe(PackageStatus::Registered);
});

it('requires authentication for bag endpoints', function () {
    $this->postJson(route('api.bags.validate'), ['code' => 'BAG-0001'])->assertStatus(401);
    $this->postJson(route('api.bags.create'), ['codes' => ['X']])->assertStatus(401);
});
