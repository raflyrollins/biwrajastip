<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BagController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ShipController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoneController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('route.permission')->prefix('/dashboard')->name('dashboard.')->group(function () {
        Route::get('/packages', [PackageController::class, 'index'])->name('packages');
        Route::get('/packages/create', [PackageController::class, 'create'])->name('packages.create');
        Route::post('/packages', [PackageController::class, 'store'])->name('packages.store');
        Route::get('/packages/{package}/edit', [PackageController::class, 'edit'])->name('packages.edit');
        Route::put('/packages/{package}', [PackageController::class, 'update'])->name('packages.update');
        Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('packages.destroy');
        Route::get('/packages/{package}/weigh', [PackageController::class, 'showWeigh'])->name('packages.weigh');
        Route::post('/packages/{package}/weigh', [PackageController::class, 'updateDimensions'])->name('packages.weigh.store');
        Route::get('/packages/{package}/receipt', [PackageController::class, 'showReceipt'])->name('packages.receipt');

        Route::get('/bags', [BagController::class, 'index'])->name('bags');
        Route::get('/bags/{bag}/label', [BagController::class, 'showLabel'])->name('bags.label');
        Route::get('/batches', [BatchController::class, 'index'])->name('batches');
        Route::get('/batches/{batch}/manifest', [BatchController::class, 'showManifest'])->name('batches.manifest');
        Route::get('/payments', [PaymentController::class, 'index'])->name('payments');
        Route::get('/payments/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
        Route::put('/payments/{payment}/verify', [PaymentController::class, 'verify'])->name('payments.verify');
        Route::get('/zones', [ZoneController::class, 'index'])->name('zones');
        Route::get('/zones/create', [ZoneController::class, 'create'])->name('zones.create');
        Route::post('/zones', [ZoneController::class, 'store'])->name('zones.store');
        Route::get('/zones/{zone}/edit', [ZoneController::class, 'edit'])->name('zones.edit');
        Route::put('/zones/{zone}', [ZoneController::class, 'update'])->name('zones.update');
        Route::delete('/zones/{zone}', [ZoneController::class, 'destroy'])->name('zones.destroy');

        Route::get('/ships', [ShipController::class, 'index'])->name('ships');
        Route::get('/ships/create', [ShipController::class, 'create'])->name('ships.create');
        Route::post('/ships', [ShipController::class, 'store'])->name('ships.store');
        Route::get('/ships/{ship}/edit', [ShipController::class, 'edit'])->name('ships.edit');
        Route::put('/ships/{ship}', [ShipController::class, 'update'])->name('ships.update');
        Route::delete('/ships/{ship}', [ShipController::class, 'destroy'])->name('ships.destroy');

        Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules');
        Route::get('/schedules/create', [ScheduleController::class, 'create'])->name('schedules.create');
        Route::post('/schedules', [ScheduleController::class, 'store'])->name('schedules.store');
        Route::get('/schedules/{schedule}/edit', [ScheduleController::class, 'edit'])->name('schedules.edit');
        Route::put('/schedules/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');
        Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->name('schedules.destroy');
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    });
});
