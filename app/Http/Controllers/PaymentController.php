<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\Permission;
use App\Events\PaymentUpdated;
use App\Models\Package;
use App\Models\Payment;
use App\Models\PromoCode;
use App\Services\MidtransService;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class PaymentController extends Controller
{
    public function __construct(private readonly MidtransService $midtrans) {}

    /**
     * Show the checkout page where the customer picks a payment method.
     */
    public function create(Request $request, Package $package): Response
    {
        $this->authorizePayable($request, $package);

        $baseAmount = $this->baseAmount($package);
        $totalAmount = (int) $package->total_amount;
        $discount = (int) $package->discount_total;

        return Inertia::render('payments/checkout', [
            'package' => [
                'uuid' => $package->uuid,
                'biwrajastip_tracking_number' => $package->biwrajastip_tracking_number,
                'receiver_name' => $package->receiver_name,
                'base_amount' => $baseAmount,
                'discount_total' => $discount,
                'discount_snapshot' => $package->discount_snapshot,
                'total_amount' => $totalAmount,
                'status' => $package->status->value,
            ],
            'methods' => collect(PaymentMethod::cases())
                ->map(fn (PaymentMethod $m) => [
                    'value' => $m->value,
                    'label' => $m->label(),
                    'group' => $m->group(),
                    'group_sort' => $m->groupSort(),
                    'admin_fee' => $m->adminFee($totalAmount),
                ])
                ->sortBy('group_sort')
                ->values(),
        ]);
    }

    /**
     * Create a Payment record and obtain a Snap token. The frontend opens
     * the Snap popup so the customer can complete the payment.
     */
    public function store(Request $request, Package $package): Response
    {
        $this->authorizePayable($request, $package);

        $validated = $request->validate([
            'method' => ['required', 'string', 'in:'.implode(',', array_column(PaymentMethod::cases(), 'value'))],
            'promo_code' => ['nullable', 'string', 'max:50'],
        ]);

        $method = PaymentMethod::from($validated['method']);

        if (! $package->wasDiscountApplied() && ! empty($validated['promo_code'])) {
            $this->applyPromoCode($package, $validated['promo_code']);
        }

        $amount = (int) $package->total_amount;
        $adminFee = $method->adminFee($amount);
        $grossAmount = $amount + $adminFee;
        $orderId = $this->newOrderId($package);

        $this->ensureNoPending($package);

        // ensureNoPending may have reconciled a previously-stuck Pending
        // payment against Midtrans. If it turned out the customer actually
        // settled a prior transaction, the package is now Paid — do not
        // create a second payment and risk double charging.
        if ($package->fresh()->status === PackageStatus::Paid) {
            throw new RuntimeException('Pembayaran paket ini sudah berhasil.');
        }

        $payment = Payment::create([
            'package_id' => $package->id,
            'order_id' => $orderId,
            'status' => PaymentStatus::Pending,
            'payment_method' => $method->value,
            'payment_type' => $method->midtransPaymentType(),
            'amount' => $amount,
            'admin_fee' => $adminFee,
        ]);

        try {
            $result = $this->midtrans->snapToken(
                $orderId,
                $grossAmount,
                (string) $request->user()->email,
                $request->user()->name,
            );

            $payment->forceFill([
                'provider_response' => $result,
            ])->save();
        } catch (Throwable $e) {
            $payment->forceFill([
                'status' => PaymentStatus::Failed,
                'provider_response' => ['error' => $e->getMessage()],
            ])->save();

            throw new RuntimeException(
                'Transaksi pembayaran gagal dibuat. Silakan coba lagi. ('.$e->getMessage().')'
            );
        }

        $package->forceFill(['status' => PackageStatus::PendingPayment])->save();

        PaymentUpdated::dispatch($package->uuid, $payment->order_id, $payment->status->value);

        $baseAmount = $this->baseAmount($package);

        return Inertia::render('payments/checkout', [
            'package' => [
                'uuid' => $package->uuid,
                'biwrajastip_tracking_number' => $package->biwrajastip_tracking_number,
                'receiver_name' => $package->receiver_name,
                'base_amount' => $baseAmount,
                'discount_total' => (int) $package->discount_total,
                'discount_snapshot' => $package->discount_snapshot,
                'total_amount' => $amount,
                'status' => $package->status->value,
            ],
            'methods' => collect(PaymentMethod::cases())
                ->map(fn (PaymentMethod $m) => [
                    'value' => $m->value,
                    'label' => $m->label(),
                    'group' => $m->group(),
                    'group_sort' => $m->groupSort(),
                    'admin_fee' => $m->adminFee($amount),
                ])
                ->sortBy('group_sort')
                ->values(),
            'snap' => [
                'token' => $result['token'],
                'client_key' => config('services.midtrans.client_key'),
                'script' => config('services.midtrans.snap_script'),
            ],
        ]);
    }

    /**
     * Validate a promo code and return discount info (JSON only).
     */
    public function promoCheck(Request $request, Package $package): JsonResponse
    {
        $this->authorizePayable($request, $package);

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        if ($package->wasDiscountApplied()) {
            return response()->json([
                'valid' => false,
                'message' => 'Paket ini sudah menggunakan promo/kode diskon.',
            ]);
        }

        $code = strtoupper(trim($validated['code']));
        $promo = PromoCode::active()->where('code', $code)->first();

        if (! $promo) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode promo tidak ditemukan atau tidak aktif.',
            ]);
        }

        $subtotal = $this->baseAmount($package);
        $discount = $promo->calculateDiscount($subtotal);

        if ($discount <= 0) {
            return response()->json([
                'valid' => false,
                'message' => 'Total belanja belum memenuhi minimum order (Rp '.number_format($promo->min_order_total, 0, ',', '.').').',
            ]);
        }

        return response()->json([
            'valid' => true,
            'code' => $promo->code,
            'name' => $promo->name,
            'type' => $promo->type->value,
            'value' => $promo->value,
            'discount' => $discount,
        ]);
    }

    /**
     * Actively check the payment status with Midtrans (does not rely on the
     * asynchronous webhook reaching this server — critical on a local URL).
     *
     * Returns the reconciled payment status as JSON so the frontend can poll
     * it while the customer is (or just finished) paying.
     */
    public function status(Request $request, Package $package): JsonResponse
    {
        $this->authorize($request, $package);

        $payment = Payment::query()
            ->where('package_id', $package->id)
            ->orderByDesc('id')
            ->first();

        if ($payment === null || $payment->order_id === null) {
            return response()->json(['status' => 'not_found', 'payment_status' => null], 404);
        }

        try {
            $payload = $this->midtrans->getStatus($payment->order_id);
        } catch (Throwable $e) {
            // Midtrans doesn't know the transaction yet (e.g. newly created).
            return response()->json([
                'status' => 'unreachable',
                'payment_status' => $payment->status->value,
                'message' => $e->getMessage(),
            ], 200);
        }

        $reconciled = $this->midtrans->reconcile($payment, $payload);

        return response()->json([
            'status' => 'ok',
            'payment_status' => $reconciled->value ?? $payment->fresh()->status->value,
        ]);
    }

    /**
     * Show the payment status page.
     */
    public function show(Request $request, Package $package): Response
    {
        $this->authorize($request, $package);

        $payment = Payment::query()
            ->where('package_id', $package->id)
            ->orderByDesc('id')
            ->firstOrFail();

        $baseAmount = $this->baseAmount($package);

        return Inertia::render('payments/show', [
            'package' => [
                'uuid' => $package->uuid,
                'biwrajastip_tracking_number' => $package->biwrajastip_tracking_number,
                'receiver_name' => $package->receiver_name,
                'base_amount' => $baseAmount,
                'discount_total' => (int) $package->discount_total,
                'discount_snapshot' => $package->discount_snapshot,
                'total_amount' => $payment->amount,
            ],
            'payment' => [
                'order_id' => $payment->order_id,
                'status' => $payment->status->value,
                'payment_method' => $payment->payment_method,
                'amount' => $payment->amount,
                'admin_fee' => $payment->admin_fee,
                'total_paid' => $payment->amount + $payment->admin_fee,
                'expired_at' => $payment->expired_at?->toIso8601String(),
                'paid_at' => $payment->paid_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Print receipt (cetak resi) with QR code.
     */
    public function receipt(Request $request, Package $package): Response
    {
        $user = $request->user();

        if ($package->customer_id !== $user->id
            && ! $user->can(Permission::MenuPackages->value)) {
            abort(403);
        }

        $payment = Payment::query()
            ->where('package_id', $package->id)
            ->where('status', PaymentStatus::Settled)
            ->latest('paid_at')
            ->first();

        if (! $payment) {
            abort(404, 'Resi hanya tersedia untuk paket yang sudah dibayar.');
        }

        $qrUrl = route('packages.index', ['highlight' => $package->uuid]);
        $qrCode = $this->generateQrSvg($qrUrl);

        $customer = $package->customer;
        $zone = $package->deliveryZone;

        return Inertia::render('payments/receipt', [
            'package' => [
                'uuid' => $package->uuid,
                'biwrajastip_tracking_number' => $package->biwrajastip_tracking_number,
                'store_tracking_number' => $package->store_tracking_number,
                'receiver_name' => $package->receiver_name,
                'delivery_address' => $package->delivery_address,
                'delivery_zone' => $zone?->name,
                'estimated_weight_kg' => $package->estimated_weight_kg,
                'actual_weight_kg' => $package->actual_weight_kg,
                'billed_weight_kg' => $package->billed_weight_kg,
                'created_at' => $package->created_at?->toIso8601String(),
            ],
            'payment' => [
                'order_id' => $payment->order_id,
                'payment_method' => $payment->payment_method,
                'amount' => $payment->amount,
                'admin_fee' => $payment->admin_fee,
                'paid_at' => $payment->paid_at?->toIso8601String(),
            ],
            'qr_code' => $qrCode,
            'customer_name' => $customer?->name,
            'customer_email' => $customer?->email,
        ]);
    }

    private function authorizePayable(Request $request, Package $package): void
    {
        $user = $request->user();

        if (! $user->can(Permission::MenuPackages->value) || $package->customer_id !== $user->id) {
            abort(403);
        }

        $payable = in_array($package->status->value, [
            PackageStatus::Processed->value,
            PackageStatus::PendingPayment->value,
        ], true);

        if (! $payable || (int) $package->total_amount <= 0) {
            abort(422, 'Paket belum diproses sehingga belum dapat dibayar.');
        }
    }

    private function authorize(Request $request, Package $package): void
    {
        if ($package->customer_id !== $request->user()->id) {
            abort(403);
        }
    }

    private function ensureNoPending(Package $package): void
    {
        $pending = Payment::query()
            ->where('package_id', $package->id)
            ->where('status', PaymentStatus::Pending)
            ->latest('id')
            ->first();

        if ($pending === null) {
            return;
        }

        // A pending payment may be stuck because the webhook never reached us
        // (e.g. local URL). Actively ask Midtrans for its real status so an
        // expired/failed transaction is released and the customer can retry.
        if ($pending->order_id !== null) {
            try {
                $this->midtrans->reconcile(
                    $pending,
                    $this->midtrans->getStatus($pending->order_id),
                );

                $pending->refresh();

                if ($pending->status !== PaymentStatus::Pending) {
                    return;
                }
            } catch (Throwable) {
                // Midtrans is unreachable; fall through to the blocking error.
            }
        }

        throw new RuntimeException('Masih ada pembayaran yang belum diselesaikan untuk paket ini. Silakan selesaikan atau tunggu hingga kedaluwarsa, lalu coba lagi.');
    }

    private function newOrderId(Package $package): string
    {
        return 'BWRJ-'.$package->uuid.'-'.strtoupper(bin2hex(random_bytes(4)));
    }

    /**
     * Return the pre-discount subtotal (shipping + delivery, before promo).
     */
    private function baseAmount(Package $package): int
    {
        $discount = (int) $package->discount_total;

        return (int) $package->total_amount + $discount;
    }

    private function applyPromoCode(Package $package, string $code): void
    {
        $promo = PromoCode::active()->where('code', strtoupper(trim($code)))->first();

        if (! $promo) {
            throw new RuntimeException('Kode promo tidak valid.');
        }

        $subtotal = $this->baseAmount($package);
        $discount = $promo->calculateDiscount($subtotal);

        if ($discount <= 0) {
            throw new RuntimeException('Kode promo tidak berlaku untuk total belanja ini.');
        }

        $newTotal = max(0, $subtotal - $discount);

        $package->forceFill([
            'discount_total' => $discount,
            'discount_snapshot' => [
                'type' => 'promo_code',
                'code' => $promo->code,
                'name' => $promo->name,
                'discount_type' => $promo->type->value,
                'discount_value' => $promo->value,
                'amount' => $discount,
            ],
            'total_amount' => $newTotal,
        ])->save();

        $promo->increment('used_count');
    }

    private function generateQrSvg(string $data): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(200, 0),
            new SvgImageBackEnd,
        );

        return (new Writer($renderer))->writeString($data);
    }
}
