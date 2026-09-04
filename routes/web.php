<?php

use App\Enums\Permission;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BagController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PromoCodeController;
use App\Http\Controllers\PromotionController;
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

    Route::get('/auth/google', [GoogleController::class, 'redirect'])
        ->name('auth.google.redirect');

    Route::get('/auth/google/callback', [GoogleController::class, 'callback'])
        ->name('auth.google.callback');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/packages', [PackageController::class, 'index'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('packages.index');

    Route::get('/packages/create', [PackageController::class, 'create'])
        ->middleware('permission:'.Permission::ActionPackagesCreate->value)
        ->name('packages.create');

    Route::post('/packages', [PackageController::class, 'store'])
        ->middleware('permission:'.Permission::ActionPackagesCreate->value)
        ->name('packages.store');

    Route::get('/packages/{package:uuid}/process', [PackageController::class, 'process'])
        ->middleware('permission:'.Permission::ActionPackagesProcess->value)
        ->name('packages.process');

    Route::match(['put', 'patch'], '/packages/{package:uuid}/process', [PackageController::class, 'updateProcessed'])
        ->middleware('permission:'.Permission::ActionPackagesProcess->value)
        ->name('packages.process.update');

    Route::get('/packages/{package:uuid}/pay', [PaymentController::class, 'create'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('payments.checkout');

    Route::post('/packages/{package:uuid}/pay', [PaymentController::class, 'store'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('payments.charge');

    Route::post('/packages/{package:uuid}/promo-check', [PaymentController::class, 'promoCheck'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('payments.promo-check');

    Route::get('/packages/{package:uuid}/payment', [PaymentController::class, 'show'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('payments.show');

    Route::get('/packages/{package:uuid}/receipt', [PaymentController::class, 'receipt'])
        ->middleware('permission:'.Permission::MenuPackages->value)
        ->name('payments.receipt');

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

    Route::middleware('permission:'.Permission::PromotionsManage->value)->group(function (): void {
        Route::get('/promotions', [PromotionController::class, 'index'])
            ->name('promotions.index');

        Route::post('/promotions', [PromotionController::class, 'store'])
            ->name('promotions.store');

        Route::put('/promotions/{promotion}', [PromotionController::class, 'update'])
            ->name('promotions.update');

        Route::post('/promotions/{promotion}/toggle', [PromotionController::class, 'toggle'])
            ->name('promotions.toggle');

        Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy'])
            ->name('promotions.destroy');
    });

    Route::middleware('permission:'.Permission::PromoCodesManage->value)->group(function (): void {
        Route::get('/promo-codes', [PromoCodeController::class, 'index'])
            ->name('promo-codes.index');

        Route::post('/promo-codes', [PromoCodeController::class, 'store'])
            ->name('promo-codes.store');

        Route::put('/promo-codes/{promoCode}', [PromoCodeController::class, 'update'])
            ->name('promo-codes.update');

        Route::post('/promo-codes/{promoCode}/toggle', [PromoCodeController::class, 'toggle'])
            ->name('promo-codes.toggle');

        Route::delete('/promo-codes/{promoCode}', [PromoCodeController::class, 'destroy'])
            ->name('promo-codes.destroy');
    });

    Route::inertia('/profile', 'profile/index')
        ->middleware('permission:'.Permission::MenuProfile->value)
        ->name('profile.index');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
