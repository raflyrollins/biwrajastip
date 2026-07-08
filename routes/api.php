<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Staff\BagController;
use App\Http\Controllers\Api\V1\Staff\BatchController;
use App\Http\Controllers\Api\V1\Staff\PackageScanController;
use App\Http\Controllers\Api\V1\StaffEnde\BagController as StaffEndeBagController;
use App\Http\Controllers\Api\V1\StaffEnde\BatchController as StaffEndeBatchController;
use App\Http\Controllers\Api\V1\StaffEnde\PackageController as StaffEndePackageController;
use Illuminate\Support\Facades\Route;

Route::post('/v1/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/v1/logout', [AuthController::class, 'logout']);

    Route::middleware('check.role:staff_surabaya,staff_ende')
        ->prefix('v1/staff')
        ->group(function () {
            Route::prefix('packages')->group(function () {
                Route::post('/scan', [PackageScanController::class, 'scan']);
                Route::post('/confirm', [PackageScanController::class, 'confirm']);
            });

            Route::prefix('bags')->group(function () {
                Route::post('/scan', [BagController::class, 'scan']);
                Route::post('/confirm', [BagController::class, 'confirm']);
            });

            Route::prefix('batches')->group(function () {
                Route::post('/scan', [BatchController::class, 'scan']);
                Route::post('/confirm', [BatchController::class, 'confirm']);
            });
        });

    Route::middleware('check.role:staff_ende')
        ->prefix('v1/staff-ende')
        ->group(function () {
            Route::prefix('batches')->group(function () {
                Route::post('/scan', [StaffEndeBatchController::class, 'scan']);
                Route::post('/unbatch', [StaffEndeBatchController::class, 'unbatch']);
            });

            Route::prefix('bags')->group(function () {
                Route::post('/scan', [StaffEndeBagController::class, 'scan']);
                Route::post('/unbag', [StaffEndeBagController::class, 'unbag']);
            });

            Route::prefix('packages')->group(function () {
                Route::post('/scan', [StaffEndePackageController::class, 'scan']);
                Route::post('/sort', [StaffEndePackageController::class, 'sort']);
            });
        });
});
