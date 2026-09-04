<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransWebhookController extends Controller
{
    public function __construct(private readonly MidtransService $midtrans) {}

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

        $payment = Payment::query()
            ->where('order_id', $payload['order_id'] ?? null)
            ->first();

        if ($payment === null) {
            return response()->json(['status' => 'order_not_found'], 404);
        }

        if ($this->midtrans->reconcile($payment, $payload) === null) {
            return response()->json(['status' => 'unmapped'], 422);
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
}
