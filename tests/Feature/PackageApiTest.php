<?php

use App\Enums\PackageStatus;
use App\Enums\Role;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('validates a package by biwrajastip resi', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $package = Package::factory()->create([
        'status' => PackageStatus::Registered->value,
        'biwrajastip_tracking_number' => 'BWRJ-0000001',
    ]);

    $this->withToken($token)
        ->postJson(route('api.packages.validate'), [
            'code' => $package->biwrajastip_tracking_number,
        ])
        ->assertOk()
        ->assertJsonPath('package.biwrajastip_tracking_number', $package->biwrajastip_tracking_number);
});

it('validates a package by store tracking number', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $package = Package::factory()->create([
        'store_tracking_number' => 'JNE-REF-123',
    ]);

    $this->withToken($token)
        ->postJson(route('api.packages.validate'), [
            'code' => 'JNE-REF-123',
        ])
        ->assertOk()
        ->assertJsonPath('package.uuid', $package->uuid);
});

it('returns an error when a package is not found', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $this->withToken($token)
        ->postJson(route('api.packages.validate'), [
            'code' => 'TIDAK-ADA',
        ])
        ->assertStatus(422)
        ->assertJsonPath('errors.code.0', 'Paket tidak ditemukan untuk nomor tersebut.');
});

it('requires the code field when validating', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $this->withToken($token)
        ->postJson(route('api.packages.validate'), [])
        ->assertStatus(422)
        ->assertJsonValidationErrors('code');
});

it('collects a registered package', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $package = Package::factory()->create([
        'status' => PackageStatus::Registered->value,
        'biwrajastip_tracking_number' => 'BWRJ-0000001',
    ]);

    $this->withToken($token)
        ->postJson(route('api.packages.collect'), [
            'codes' => ['BWRJ-0000001'],
        ])
        ->assertOk();

    $this->assertDatabaseHas('packages', [
        'id' => $package->id,
        'status' => PackageStatus::Collected->value,
    ]);
});

it('rejects collecting a package in a non-registered status', function () {
    $staff = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $staff->createToken('mobile')->plainTextToken;

    $package = Package::factory()->create([
        'status' => PackageStatus::Collected->value,
        'biwrajastip_tracking_number' => 'BWRJ-0000001',
    ]);

    $this->withToken($token)
        ->postJson(route('api.packages.collect'), [
            'codes' => ['BWRJ-0000001'],
        ])
        ->assertStatus(422)
        ->assertJsonPath('errors.codes.0', 'Paket BWRJ-0000001 berstatus tidak dapat dikoleksi.');

    $this->assertDatabaseHas('packages', [
        'id' => $package->id,
        'status' => PackageStatus::Collected->value,
    ]);
});

it('requires authentication for package endpoints', function () {
    $this->postJson(route('api.packages.validate'), ['code' => 'X'])
        ->assertStatus(401);
    $this->postJson(route('api.packages.collect'), ['codes' => ['X']])
        ->assertStatus(401);
});
