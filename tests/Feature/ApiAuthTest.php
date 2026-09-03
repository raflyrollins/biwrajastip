<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('does not issue a token for a customer account', function () {
    $user = User::factory()->create(['password' => 'rahasia123'])
        ->assignRole(Role::Customer->value);

    $this->postJson(route('api.auth.login'), [
        'email' => $user->email,
        'password' => 'rahasia123',
    ])->assertStatus(403);
});

it('rejects invalid credentials on login', function () {
    $user = User::factory()->create(['password' => 'benar123'])
        ->assignRole(Role::StaffSurabaya->value);

    $this->postJson(route('api.auth.login'), [
        'email' => $user->email,
        'password' => 'salah123',
    ])->assertStatus(422);
});

it('issues a sanctum token for staff surabaya', function () {
    $user = User::factory()->create(['password' => 'rahasia123'])
        ->assignRole(Role::StaffSurabaya->value);

    $response = $this->postJson(route('api.auth.login'), [
        'email' => $user->email,
        'password' => 'rahasia123',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['token', 'user', 'permissions'])
        ->assertJsonPath('user.email', $user->email);

    expect($user->tokens()->count())->toBe(1);
});

it('returns the authenticated user via token', function () {
    $user = User::factory()->create()->assignRole(Role::StaffEnde->value);
    $token = $user->createToken('mobile')->plainTextToken;

    $this->withToken($token)
        ->getJson(route('api.auth.user'))
        ->assertOk()
        ->assertJsonPath('user.email', $user->email);
});

it('revokes the token on logout', function () {
    $user = User::factory()->create()->assignRole(Role::StaffSurabaya->value);
    $token = $user->createToken('mobile')->plainTextToken;

    $this->withToken($token)
        ->postJson(route('api.auth.logout'))
        ->assertOk();

    expect($user->tokens()->count())->toBe(0);
});
