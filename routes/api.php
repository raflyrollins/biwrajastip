<?php

use App\Enums\Permission;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BagApiController;
use App\Http\Controllers\Api\PackageApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.auth.login');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
        Route::get('/auth/user', [AuthController::class, 'user'])->name('api.auth.user');

        Route::prefix('packages')->group(function (): void {
            Route::post('/validate', [PackageApiController::class, 'validate'])
                ->middleware('permission:'.Permission::MenuPackages->value)
                ->name('api.packages.validate');

            Route::post('/collect', [PackageApiController::class, 'collect'])
                ->middleware('permission:'.Permission::ActionPackagesProcess->value)
                ->name('api.packages.collect');
        });

        Route::prefix('bags')->group(function (): void {
            Route::post('/validate', [BagApiController::class, 'validate'])
                ->middleware('permission:'.Permission::MenuBags->value)
                ->name('api.bags.validate');

            Route::post('/create', [BagApiController::class, 'create'])
                ->middleware('permission:'.Permission::MenuBags->value)
                ->name('api.bags.create');
        });
    });
});
