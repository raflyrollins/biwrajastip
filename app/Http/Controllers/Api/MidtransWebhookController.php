<?php

namespace App\Http\Controllers\Api;

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Events\PackageStatusUpdated;
use App\Events\PaymentUpdated;
use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MidtransWebhookController extends Controller
{
    /**
     * Handle Midtrans HTTP(S) notification, verifying the signature before
     * mutating payment/package state. Idempotent per order_id.
     */
    public function notification(Request $request): JsonResponse
    {
        $payload = $request->all();

        if (! $this->validSignature($payload)) {
            return response()->json(['status' => 'invalid_signature'], 403);
        }

        $payment = Payment::query()->where('order_id', $payload['order_id'] ?? null)->first();

        if ($payment === null) {
            return response()->json(['status' => 'order_not_found'], 404);
        }

        $status = $this->mapTransactionStatus($payload['transaction_status'] ?? null);

        if ($status === null) {
            return response()->json(['status' => 'unmapped'], 422);
        }

        $package = Package::query()->find($payment->package_id);

        $payment->forceFill([
            'status' => $status,
            'payment_type' => $payload['payment_type'] ?? $payment->payment_type,
            'provider_response' => array_merge(is_array($payment->provider_response) ? $payment->provider_response : [], $payload),
            'paid_at' => $status === PaymentStatus::Settled
                ? ($payload['settlement_time'] ?? null ? Carbon::parse($payload['settlement_time']) : now())
                : $payment->paid_at,
        ])->save();

        if ($package !== null) {
            PaymentUpdated::dispatch($package->uuid, $payment->order_id, $status->value);

            if ($status === PaymentStatus::Settled) {
                Package::query()
                    ->whereKey($package->id)
                    ->whereIn('status', [
                        PackageStatus::Registered->value,
                        PackageStatus::Processed->value,
                        PackageStatus::PendingPayment->value,
                    ])
                    ->update(['status' => PackageStatus::Paid, 'paid_at' => now()]);

                $package->refresh();

                PackageStatusUpdated::dispatch($package->uuid, $package->status->value);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Verify Midtrans signature: SHA512(order_id + status_code + gross_amount + server_key).
     *
     * @param  array<int|string, mixed>  $payload
     */
    private function validSignature(array $payload): bool
    {
        $serverKey = config('services.midtrans.server_key');

        if (empty($serverKey)) {
            return false;
        }

        $expected = hash(
            'sha512',
            ($payload['order_id'] ?? '').
            ($payload['status_code'] ?? '').
            ($payload['gross_amount'] ?? '').
            $serverKey,
        );

        return hash_equals($expected, (string) ($payload['signature_key'] ?? ''));
    }

    private function mapTransactionStatus(?string $transactionStatus): ?PaymentStatus
    {
        return match ($transactionStatus) {
            'capture', 'settlement' => PaymentStatus::Settled,
            'pending' => PaymentStatus::Pending,
            'deny', 'cancel' => PaymentStatus::Failed,
            'expire' => PaymentStatus::Expired,
            'refund', 'partial_refund' => PaymentStatus::Refunded,
            default => null,
        };
    }
}
