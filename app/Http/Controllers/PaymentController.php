<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $perPage = min((int) request('per_page', 20), 100);

        $payments = Payment::with(['package', 'user'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->latest()
            ->paginate($perPage)
            ->onEachSide(1);

        return Inertia::render('dashboard/payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create()
    {
        $packages = auth()->user()->packages()
            ->where('status', PackageStatus::WaitingForPayment)
            ->with('zone')
            ->get(['uuid', 'tracking_number', 'tracking_number_biwra', 'total_price', 'status'])
            ->map(fn ($p) => [
                'uuid' => $p->uuid,
                'tracking_number' => $p->tracking_number,
                'tracking_number_biwra' => $p->tracking_number_biwra,
                'total_price' => (float) $p->total_price,
            ]);

        return Inertia::render('dashboard/payments/Form', [
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,uuid'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'proof_image' => ['nullable', 'string', 'max:2048'],
        ]);

        $package = \App\Models\Package::where('uuid', $validated['package_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($package->status->value !== PackageStatus::WaitingForPayment->value) {
            return back()->with('error', 'Paket tidak dalam status menunggu pembayaran.');
        }

        Payment::create([
            'package_id' => $package->id,
            'user_id' => auth()->id(),
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'proof_image' => $validated['proof_image'] ?? null,
            'status' => PaymentStatus::Pending,
        ]);

        return redirect()->route('dashboard.packages')->with('success', 'Bukti pembayaran berhasil dikirim.');
    }

    public function verify($uuid)
    {
        $payment = Payment::where('uuid', $uuid)->firstOrFail();

        if ($payment->status !== PaymentStatus::Pending) {
            return back()->with('error', 'Pembayaran sudah diverifikasi.');
        }

        $payment->update([
            'status' => PaymentStatus::Verified,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        $payment->package->update([
            'status' => PackageStatus::Paid,
        ]);

        return redirect()->route('dashboard.payments')->with('success', 'Pembayaran berhasil diverifikasi.');
    }
}
