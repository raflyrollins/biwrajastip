<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function showPayment(Package $package): Response
    {
        abort_unless($package->user_id === auth()->id(), 403);
        abort_unless($package->status === 'waiting_for_payment', 403);

        $package->load('zone');

        return Inertia::render('customer/payment', [
            'package' => $package,
        ]);
    }

    public function uploadProof(Request $request, Package $package)
    {
        abort_unless($package->user_id === auth()->id(), 403);
        abort_unless($package->status === 'waiting_for_payment', 422);

        $validated = $request->validate([
            'payment_proof' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        $package->update([
            'payment_proof' => $path,
        ]);

        return redirect()->route('customer.packages.show', $package)
            ->with('success', 'Bukti pembayaran berhasil diupload. Menunggu konfirmasi admin.');
    }
}
