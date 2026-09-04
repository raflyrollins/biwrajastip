<?php

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Enums\Role;
use App\Models\Package;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    config(['services.midtrans.server_key' => 'SB-Mid-server-status-test']);
});

it('reconciles a pending payment to settled when Midtrans reports settlement', function () {
    Http::fake([
        '*/v2/BWRJ-STATUS-1/status' => Http::response([
            'order_id' => 'BWRJ-STATUS-1',
            'transaction_status' => 'settlement',
            'transaction_id' => 'txn-123',
            'payment_type' => 'bank_transfer',
            'settlement_time' => '2024-01-01 10:00:00',
            'gross_amount' => '50000',
            'status_code' => '200',
            'signature_key' => hash('sha512', 'BWRJ-STATUS-1'.'200'.'50000'.config('services.midtrans.server_key')),
        ]),
    ]);

    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $package = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::PendingPayment->value,
        'total_amount' => 50000,
    ]);

    $payment = Payment::factory()->create([
        'package_id' => $package->id,
        'order_id' => 'BWRJ-STATUS-1',
        'status' => PaymentStatus::Pending,
        'amount' => 50000,
    ]);

    $this->actingAs($customer)
        ->get(route('payments.status', $package))
        ->assertOk()
        ->assertJson(['payment_status' => PaymentStatus::Settled->value]);

    expect($payment->fresh()->status)->toBe(PaymentStatus::Settled);
    expect($package->fresh()->status)->toBe(PackageStatus::Paid);
});

it('releases a stuck pending payment when Midtrans reports it expired', function () {
    Http::fake([
        '*/v2/BWRJ-STATUS-2/status' => Http::response([
            'order_id' => 'BWRJ-STATUS-2',
            'transaction_status' => 'expire',
            'gross_amount' => '50000',
            'status_code' => '201',
            'signature_key' => hash('sha512', 'BWRJ-STATUS-2'.'201'.'50000'.config('services.midtrans.server_key')),
        ]),
    ]);

    $customer = User::factory()->create()->assignRole(Role::Customer->value);

    $package = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Processed->value,
        'total_amount' => 50000,
    ]);

    $payment = Payment::factory()->create([
        'package_id' => $package->id,
        'order_id' => 'BWRJ-STATUS-2',
        'status' => PaymentStatus::Pending,
        'amount' => 50000,
    ]);

    $this->actingAs($customer)
        ->get(route('payments.status', $package))
        ->assertOk()
        ->assertJson(['payment_status' => PaymentStatus::Expired->value]);

    expect($payment->fresh()->status)->toBe(PaymentStatus::Expired);
    expect($package->fresh()->status)->toBe(PackageStatus::Processed);
    expect(Payment::query()->where('package_id', $package->id)->where('status', PaymentStatus::Pending)->doesntExist())->toBeTrue();
});
