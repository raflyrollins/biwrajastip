<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function fakeGoogle(?string $email = 'baru@biwrajastip.test', ?string $googleId = 'google-abc-123'): SocialiteUser
{
    return SocialiteUser::fake([
        'id' => $googleId,
        'name' => 'Nina Google',
        'email' => $email,
    ]);
}

it('redirects to Google for authorization with force-login prompt', function () {
    $this->get(route('auth.google.redirect'))
        ->assertRedirect();
});

it('creates a new customer from a Google login', function () {
    Socialite::fake('google', fakeGoogle());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();

    $user = User::whereEmail('baru@biwrajastip.test')->first();
    expect($user)->not->toBeNull();
    expect($user->google_id)->toBe('google-abc-123');
    expect($user->hasRole(Role::Customer->value))->toBeTrue();
});

it('logs in an existing user by google id without duplicating', function () {
    $existing = User::factory()->create([
        'email' => 'ada@biwrajastip.test',
        'name' => 'Lama',
    ]);

    Socialite::fake('google', fakeGoogle('ada@biwrajastip.test', 'google-xyz'));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($existing);
    expect($existing->fresh()->google_id)->toBe('google-xyz');
    expect(User::whereEmail('ada@biwrajastip.test')->count())->toBe(1);
});
