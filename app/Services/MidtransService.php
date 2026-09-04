<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MidtransService
{
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
        $response = $this->client()->get("/v2/{$orderId}/status");

        if ($response->failed()) {
            $message = $response->json('status_message') ?? $response->body();

            throw new RuntimeException("[Midtrans] {$message}");
        }

        return $response->json();
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
