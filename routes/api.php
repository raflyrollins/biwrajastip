<?php

use App\Http\Controllers\Api\BiwraHubController;
use Illuminate\Support\Facades\Route;

Route::post('/v1/login', function () {
    return response()->json(['message' => 'API login placeholder']);
});

Route::middleware('auth:sanctum')->prefix('biwrahub')->name('api.biwrahub.')->group(function () {
    Route::post('/collecting', [BiwraHubController::class, 'collecting']);
    Route::post('/bagging', [BiwraHubController::class, 'bagging']);
    Route::post('/batching', [BiwraHubController::class, 'batching']);
    Route::post('/kapal-berangkat', [BiwraHubController::class, 'kapalBerangkat']);
    Route::post('/kapal-sampai', [BiwraHubController::class, 'kapalSampai']);
    Route::post('/unbatching', [BiwraHubController::class, 'unbatching']);
    Route::post('/unbagging', [BiwraHubController::class, 'unbagging']);
    Route::post('/sorting', [BiwraHubController::class, 'sorting']);
    Route::post('/ending', [BiwraHubController::class, 'ending']);
    Route::get('/scan/{code}', [BiwraHubController::class, 'scan']);
    Route::get('/staff/packages', [BiwraHubController::class, 'staffPackages']);
    Route::get('/options', [BiwraHubController::class, 'options']);
});
