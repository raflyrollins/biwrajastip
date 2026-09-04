<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;
use Throwable;

class GoogleController extends Controller
{
    /**
     * Redirect the guest to Google for authorization. `prompt=login`
     * forces Google to show the account/password screen on every sign-in,
     * even when the user already has an active Google session.
     */
    public function redirect(): SymfonyRedirectResponse
    {
        /** @var GoogleProvider $provider */
        $provider = Socialite::driver('google');

        return $provider->with(['prompt' => 'login'])->redirect();
    }

    /**
     * Handle the Google callback, creating (or logging into) a customer.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $google = Socialite::driver('google')->user();
        } catch (Throwable) {
            return redirect()->route('login')->withErrors([
                'email' => 'Gagal masuk dengan Google. Silakan coba lagi.',
            ]);
        }

        $user = $this->findOrCreateUser($google);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    private function findOrCreateUser(SocialiteUser $google): User
    {
        $user = User::query()->where('google_id', $google->getId())->first();

        if ($user !== null) {
            return $user;
        }

        $user = User::query()->where('email', $google->getEmail())->first();

        if ($user === null) {
            $user = User::create([
                'name' => $google->getName() ?? 'Customer biwrajastip',
                'email' => $google->getEmail(),
                'google_id' => $google->getId(),
                'password' => str()->random(40),
            ]);

            $user->assignRole(Role::Customer->value);
        } else {
            $user->forceFill(['google_id' => $google->getId()])->save();
        }

        return $user;
    }
}
