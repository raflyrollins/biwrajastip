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
        $payments = Payment::with(['package', 'user'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->latest()
            ->paginate(20);

        return Inertia::render('dashboard/payments/Index', [
            'payments' => $payments,
        ]);
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
