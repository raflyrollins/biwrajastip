<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

it('renders the login page', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login'));
});

it('renders the register page', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register'));
});

it('registers a new user and assigns the customer role', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Nina Bahari',
        'email' => 'nina@biwrajastip.test',
        'phone' => '081234567890',
        'password' => 'rahasia123',
        'password_confirmation' => 'rahasia123',
    ]);

    $response->assertRedirect(route('home'));

    $this->assertAuthenticated();

    $user = User::whereEmail('nina@biwrajastip.test')->first();
    expect($user->uuid)->not->toBeNull();
    expect($user->hasRole(Role::Customer->value))->toBeTrue();
});

it('rejects duplicate email on registration', function () {
    User::factory()->create(['email' => 'taken@biwrajastip.test']);

    $response = $this->post(route('register.store'), [
        'name' => 'Duplikat',
        'email' => 'taken@biwrajastip.test',
        'password' => 'rahasia123',
        'password_confirmation' => 'rahasia123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('logs an existing user in', function () {
    $user = User::factory()->create(['password' => 'rahasia123']);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'rahasia123',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

it('fails login with wrong credentials', function () {
    User::factory()->create(['email' => 'ada@biwrajastip.test', 'password' => 'benar123']);

    $this->post(route('login.store'), [
        'email' => 'ada@biwrajastip.test',
        'password' => 'salah123',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('logs the user out', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect('/');

    $this->assertGuest();
});
