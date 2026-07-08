<?php

use App\Http\Controllers\Admin\BagController;
use App\Http\Controllers\Admin\BatchController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ZoneController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Customer\PackageController as CustomerPackageController;
use App\Http\Controllers\Customer\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\StaffSurabaya\BagController as StaffSurabayaBagController;
use App\Http\Controllers\StaffSurabaya\BatchController as StaffSurabayaBatchController;
use App\Http\Controllers\StaffSurabaya\PackageController as StaffSurabayaPackageController;
use Illuminate\Http\Request;
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

    // ── Shared Detail Routes (any authenticated user) ──
    Route::get('/bags/{bag}', [ItemController::class, 'showBag'])->name('bags.show');
    Route::get('/batches/{batch}', [ItemController::class, 'showBatch'])->name('batches.show');

    // ── Packages (role-based dispatch for list, role middleware for actions) ──
    Route::get('/packages', [DashboardController::class, 'packages'])->name('packages');
    Route::get('/packages/create', [CustomerPackageController::class, 'create'])->middleware('role:customer')->name('packages.create');
    Route::post('/packages', function (Request $request) {
        $role = $request->user()->getRoleNames()->first() ?? 'customer';

        return match ($role) {
            'customer' => app(CustomerPackageController::class)->store($request),
            'admin' => app(PackageController::class)->store($request),
            default => redirect()->route('dashboard'),
        };
    })->name('packages.store');
    Route::get('/packages/{package}', function (Request $request, $package) {
        $role = $request->user()->getRoleNames()->first() ?? 'customer';

        return match ($role) {
            'admin' => app(PackageController::class)->show($package),
            'customer' => app(CustomerPackageController::class)->show($package),
            default => redirect()->route('dashboard'),
        };
    })->name('packages.show');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->middleware('role:admin')->name('packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->middleware('role:admin')->name('packages.destroy');
    Route::put('/packages/{package}/confirm-payment', [PackageController::class, 'confirmPayment'])->middleware('role:admin')->name('packages.confirm-payment');
    Route::put('/packages/{package}/collect', [StaffSurabayaPackageController::class, 'collect'])->middleware('role:staff_surabaya')->name('packages.collect');
    Route::get('/packages/{package}/weigh', [StaffSurabayaPackageController::class, 'showWeigh'])->middleware('role:staff_surabaya')->name('packages.weigh');
    Route::post('/packages/{package}/weigh', [StaffSurabayaPackageController::class, 'weigh'])->middleware('role:staff_surabaya')->name('packages.weigh.store');
    Route::get('/packages/{package}/print', [StaffSurabayaPackageController::class, 'printReceipt'])->middleware('role:staff_surabaya')->name('packages.print');
    Route::get('/packages/{package}/pay', [PaymentController::class, 'showPayment'])->middleware('role:customer')->name('packages.pay');
    Route::post('/packages/{package}/pay', [PaymentController::class, 'uploadProof'])->middleware('role:customer')->name('packages.pay.upload');

    // ── Bags (role-based dispatch for list, shared detail) ──
    Route::get('/bags', [DashboardController::class, 'bags'])->name('bags');
    Route::delete('/bags/{bag}', [BagController::class, 'destroy'])->middleware('role:admin')->name('bags.destroy');
    Route::get('/bags/{bag}/print', [StaffSurabayaBagController::class, 'print'])->middleware('role:staff_surabaya,admin')->name('bags.print');

    // ── Batches (role-based dispatch for list, shared detail) ──
    Route::get('/batches', [DashboardController::class, 'batches'])->name('batches');
    Route::post('/batches', [BatchController::class, 'store'])->middleware('role:admin')->name('batches.store');
    Route::put('/batches/{batch}', [BatchController::class, 'update'])->middleware('role:admin')->name('batches.update');
    Route::delete('/batches/{batch}', [BatchController::class, 'destroy'])->middleware('role:admin')->name('batches.destroy');
    Route::get('/batches/{batch}/print', [StaffSurabayaBatchController::class, 'print'])->middleware('role:staff_surabaya,admin')->name('batches.print');

    // ── Zones (admin) ──
    Route::middleware('role:admin')->group(function () {
        Route::get('/zones', [ZoneController::class, 'index'])->name('zones');
        Route::post('/zones', [ZoneController::class, 'store'])->name('zones.store');
        Route::put('/zones/{zone}', [ZoneController::class, 'update'])->name('zones.update');
        Route::delete('/zones/{zone}', [ZoneController::class, 'destroy'])->name('zones.destroy');
    });

    // ── Users (admin) ──
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // ── Reports & Settings (admin) ──
    Route::middleware('role:admin')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings');
        Route::put('/settings/profile', [SettingController::class, 'updateProfile'])->name('settings.profile');
        Route::put('/settings/password', [SettingController::class, 'updatePassword'])->name('settings.password');
    });
});
