<?php

use App\Http\Controllers\Api\BiwraHubController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

Route::post('/v1/login', function (Request $request) {
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Email atau password salah.'],
        ]);
    }

    $abilities = $user->roles()->with('permissions')->get()
        ->pluck('permissions.*.name')
        ->flatten()
        ->unique()
        ->values()
        ->toArray();

    $token = $user->createToken('api-token', $abilities)
        ->plainTextToken;

    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => [
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ]);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->prefix('biwrahub')->name('api.biwrahub.')->group(function () {
    Route::post('/collecting', [BiwraHubController::class, 'collecting']);
    Route::post('/bagging', [BiwraHubController::class, 'bagging']);
    Route::post('/batching', [BiwraHubController::class, 'batching']);
    Route::post('/send-to-port', [BiwraHubController::class, 'sendToPort']);
    Route::post('/arrive-at-port', [BiwraHubController::class, 'arriveAtPort']);
    Route::post('/ship-depart', [BiwraHubController::class, 'shipDepart']);
    Route::post('/ship-arrive', [BiwraHubController::class, 'shipArrive']);
    Route::post('/unbatching', [BiwraHubController::class, 'unbatching']);
    Route::post('/unbagging', [BiwraHubController::class, 'unbagging']);
    Route::post('/sorting', [BiwraHubController::class, 'sorting']);
    Route::post('/ending', [BiwraHubController::class, 'ending']);
    Route::get('/scan/{code}', [BiwraHubController::class, 'scan'])->middleware('throttle:30,1');
    Route::get('/options', [BiwraHubController::class, 'options']);
});
