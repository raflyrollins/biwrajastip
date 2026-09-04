<?php

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

const TEST_SERVER_KEY = 'SB-Mid-server-test-key';

beforeEach(function () {
    config(['services.midtrans.server_key' => TEST_SERVER_KEY]);
});

function signedPayload(string $orderId, string $statusCode, string $grossAmount, string $status): array
{
    $payload = [
        'order_id' => $orderId,
        'status_code' => $statusCode,
        'gross_amount' => $grossAmount,
        'transaction_status' => $status,
        'payment_type' => 'bank_transfer',
    ];

    $payload['signature_key'] = hash(
        'sha512',
        $orderId.$statusCode.$grossAmount.TEST_SERVER_KEY,
    );

    return $payload;
}

it('rejects a request with an invalid signature', function () {
    $payment = Payment::factory()->create([
        'status' => PaymentStatus::Pending,
        'order_id' => 'BWRJ-TEST-INVALID',
    ]);

    $payload = signedPayload($payment->order_id, '200', '50000', 'capture');
    $payload['signature_key'] = 'invalid';

    $this->postJson(route('api.midtrans.notification'), $payload)->assertStatus(403);
});

it('marks a payment settled and package paid on settlement', function () {
    $package = Package::factory()->create(['status' => PackageStatus::PendingPayment]);
    $payment = Payment::factory()->create([
        'package_id' => $package->id,
        'order_id' => 'BWRJ-TEST-0001',
        'status' => PaymentStatus::Pending,
        'amount' => 50000,
    ]);

    $this->postJson(route('api.midtrans.notification'), signedPayload(
        'BWRJ-TEST-0001',
        '200',
        '50000',
        'settlement',
    ))->assertOk()->assertJson(['status' => 'ok']);

    expect(Payment::find($payment->id)->status)->toBe(PaymentStatus::Settled);
    expect($package->fresh()->status)->toBe(PackageStatus::Paid);
});

it('marks payment expired on expire', function () {
    $payment = Payment::factory()->create([
        'order_id' => 'BWRJ-TEST-0002',
        'status' => PaymentStatus::Pending,
    ]);

    $this->postJson(route('api.midtrans.notification'), signedPayload(
        'BWRJ-TEST-0002',
        '201',
        '50000',
        'expire',
    ))->assertOk();

    expect(Payment::find($payment->id)->status)->toBe(PaymentStatus::Expired);
});

it('returns 404 for an unknown order id', function () {
    $this->postJson(route('api.midtrans.notification'), signedPayload(
        'BWRJ-NOPE',
        '200',
        '50000',
        'settlement',
    ))->assertStatus(404);
});
