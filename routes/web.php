<?php

use App\Enums\Permission;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BagController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store');

    Route::get('/register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->name('register.store');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/packages', [PackageController::class, 'index'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('packages.index');

    Route::get('/bags', [BagController::class, 'index'])
        ->middleware('permission:'.Permission::MenuBags->value)
        ->name('bags.index');

    Route::get('/batches', [BatchController::class, 'index'])
        ->middleware('permission:'.Permission::MenuBatches->value)
        ->name('batches.index');

    Route::inertia('/reports', 'reports/index', [
        'reportedAt' => now()->toDateTimeString(),
    ])
        ->middleware('permission:'.Permission::ReportsView->value)
        ->name('reports.index');

    Route::inertia('/settings', 'settings/index', [
        'reportedAt' => now()->toDateTimeString(),
    ])
        ->middleware('permission:'.Permission::SettingsManage->value)
        ->name('settings.index');

    Route::inertia('/profile', 'profile/index')
        ->middleware('permission:'.Permission::MenuProfile->value)
        ->name('profile.index');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
