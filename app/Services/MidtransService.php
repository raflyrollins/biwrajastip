<?php

namespace App\Services;

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Events\PaymentUpdated;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MidtransService
{
    /**
     * Map a Midtrans transaction_status to our PaymentStatus, or null when
     * the transaction is still in an unmapped/unknown state.
     */
    public function mapTransactionStatus(?string $transactionStatus): ?PaymentStatus
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

    /**
     * Request a Snap payment token for the given order details.
     *
     * Snap handles the payment instrument (VA number, QR code, etc.)
     * and the customer pays via the Snap popup/redirect.
     *
     * @return array{token: string, redirect_url: string}
     *
     * @throws RuntimeException when the token request fails
     */
    public function snapToken(string $orderId, int $grossAmount, string $customerEmail, string $customerName): array
    {
        $response = $this->client()->post(config('services.midtrans.snap_url'), [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => array_filter([
                'first_name' => $customerName,
                'email' => $customerEmail,
            ]),
            'callbacks' => [
                'finish' => config('services.midtrans.finish_redirect_url'),
            ],
            'notification_url' => config('services.midtrans.notification_url'),
        ]);

        $token = $response->json('token');

        if ($response->failed() || ! is_string($token)) {
            $message = $response->json('status_message') ?? $response->body();

            throw new RuntimeException("Gagal membuat pembayaran: {$message}");
        }

        return [
            'token' => $token,
            'redirect_url' => $response->json('redirect_url', ''),
        ];
    }

    /**
     * Query a transaction status from Midtrans.
     *
     * @return array<string, mixed>
     *
     * @throws RuntimeException when the order is unknown to Midtrans
     */
    public function getStatus(string $orderId): array
    {
        $response = $this->client()
            ->get(sprintf('%s/v2/%s/status', config('services.midtrans.api_url'), $orderId));

        if ($response->failed()) {
            $message = $response->json('status_message') ?? $response->body();

            throw new RuntimeException("[Midtrans] {$message}");
        }

        return $response->json();
    }

    /**
     * Apply a Midtrans status payload (from the notification webhook or an
     * active GET /status query) to a Payment, keeping the related Package in
     * sync. Idempotent: re-running with the same status is a no-op.
     *
     * @param  array<string, mixed>  $payload
     */
    public function reconcile(Payment $payment, array $payload): ?PaymentStatus
    {
        $status = $this->mapTransactionStatus(
            isset($payload['transaction_status']) ? (string) $payload['transaction_status'] : null,
        );

        if ($status === null || $status === $payment->status) {
            return $status;
        }

        $payment->forceFill([
            'status' => $status,
            'payment_type' => isset($payload['payment_type'])
                ? (string) $payload['payment_type']
                : $payment->payment_type,
            'transaction_id' => isset($payload['transaction_id'])
                ? (string) $payload['transaction_id']
                : $payment->transaction_id,
            'provider_response' => array_merge(
                is_array($payment->provider_response) ? $payment->provider_response : [],
                $payload,
            ),
            'paid_at' => $status === PaymentStatus::Settled
                ? (isset($payload['settlement_time'])
                    ? Carbon::parse((string) $payload['settlement_time'])
                    : now())
                : $payment->paid_at,
        ])->save();

        PaymentUpdated::dispatch(
            $payment->package->uuid,
            $payment->order_id,
            $status->value,
        );

        if ($status === PaymentStatus::Settled) {
            Package::query()
                ->whereKey($payment->package_id)
                ->whereIn('status', [
                    PackageStatus::Registered->value,
                    PackageStatus::Processed->value,
                    PackageStatus::PendingPayment->value,
                ])
                ->update([
                    'status' => PackageStatus::Paid,
                    'paid_at' => now(),
                ]);
        }

        return $status;
    }

    private function client(): PendingRequest
    {
        $serverKey = config('services.midtrans.server_key');

        if (empty($serverKey)) {
            throw new RuntimeException('MIDTRANS_SERVER_KEY belum diatur di .env.');
        }

        return Http::acceptJson()
            ->asJson()
            ->withBasicAuth($serverKey, '')
            ->timeout(15);
    }
}
