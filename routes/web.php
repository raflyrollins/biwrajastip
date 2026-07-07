<?php

use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ZoneController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Customer\PackageController as CustomerPackageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StaffSurabaya\PackageController as StaffSurabayaPackageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/check-shipping', 'check-shipping')->name('check-shipping');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Customer Routes ──
    Route::middleware('role:customer')->prefix('customer')->group(function () {
        Route::get('/packages', [CustomerPackageController::class, 'index'])->name('customer.packages');
        Route::get('/packages/create', [CustomerPackageController::class, 'create'])->name('customer.packages.create');
        Route::post('/packages', [CustomerPackageController::class, 'store'])->name('customer.packages.store');
        Route::get('/packages/{package}', [CustomerPackageController::class, 'show'])->name('customer.packages.show');
    });

    // ── Staff Surabaya Routes ──
    Route::middleware('role:staff_surabaya')->prefix('staff/surabaya')->group(function () {
        Route::get('/packages', [StaffSurabayaPackageController::class, 'index'])->name('staff-sby.packages');
        Route::put('/packages/{package}/collect', [StaffSurabayaPackageController::class, 'collect'])->name('staff-sby.packages.collect');
        Route::get('/packages/{package}/weigh', [StaffSurabayaPackageController::class, 'showWeigh'])->name('staff-sby.packages.weigh');
        Route::post('/packages/{package}/weigh', [StaffSurabayaPackageController::class, 'weigh'])->name('staff-sby.packages.weigh.store');
    });

    // ── Admin Routes ──
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/packages', [PackageController::class, 'index'])->name('admin.packages');
        Route::post('/packages', [PackageController::class, 'store'])->name('admin.packages.store');
        Route::get('/packages/{package}', [PackageController::class, 'show'])->name('admin.packages.show');
        Route::put('/packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update');
        Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');

        Route::get('/batches', [BatchController::class, 'index'])->name('admin.batches');
        Route::post('/batches', [BatchController::class, 'store'])->name('admin.batches.store');
        Route::put('/batches/{batch}', [BatchController::class, 'update'])->name('admin.batches.update');
        Route::delete('/batches/{batch}', [BatchController::class, 'destroy'])->name('admin.batches.destroy');

        Route::get('/zones', [ZoneController::class, 'index'])->name('admin.zones');
        Route::post('/zones', [ZoneController::class, 'store'])->name('admin.zones.store');
        Route::put('/zones/{zone}', [ZoneController::class, 'update'])->name('admin.zones.update');
        Route::delete('/zones/{zone}', [ZoneController::class, 'destroy'])->name('admin.zones.destroy');

        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

        Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');

        Route::get('/settings', [SettingController::class, 'index'])->name('admin.settings');
        Route::put('/settings/profile', [SettingController::class, 'updateProfile'])->name('admin.settings.profile');
        Route::put('/settings/password', [SettingController::class, 'updatePassword'])->name('admin.settings.password');
    });
});
