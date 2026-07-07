<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Package::with(['user', 'zone']);

        if ($search = $request->input('search')) {
            $query->whereFullText(
                ['tracking_code', 'recipient_name', 'sender_name', 'sender_tracking_number'],
                $search
            );
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $packages = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/packages', [
            'packages' => $packages,
            'zones' => Zone::orderBy('name')->get(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['nullable', 'string', 'max:20'],
            'zone_id' => ['nullable', 'exists:zones,id'],
            'sender_name' => ['nullable', 'string', 'max:255'],
            'sender_store' => ['nullable', 'string', 'max:255'],
            'sender_tracking_number' => ['nullable', 'string', 'max:100'],
            'weight_estimated' => ['nullable', 'integer', 'min:0'],
            'length' => ['nullable', 'integer', 'min:0'],
            'width' => ['nullable', 'integer', 'min:0'],
            'height' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['tracking_code'] = Package::generateTrackingCode();
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'waiting_for_collection';

        Package::create($validated);

        return redirect()->route('admin.packages')->with('success', 'Paket berhasil ditambahkan.');
    }

    public function show(Package $package)
    {
        $package->load(['user', 'zone']);

        return response()->json($package);
    }

    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'recipient_name' => ['sometimes', 'string', 'max:255'],
            'recipient_phone' => ['nullable', 'string', 'max:20'],
            'zone_id' => ['nullable', 'exists:zones,id'],
            'status' => ['sometimes', 'string', 'max:30'],
            'weight_actual' => ['nullable', 'integer', 'min:0'],
            'final_weight' => ['nullable', 'integer', 'min:0'],
            'shipping_cost' => ['nullable', 'integer', 'min:0'],
            'delivery_fee' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $package->update($validated);

        return redirect()->route('admin.packages')->with('success', 'Paket berhasil diperbarui.');
    }

    public function confirmPayment(Package $package)
    {
        abort_unless($package->status === 'waiting_for_payment', 422);

        $package->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Pembayaran dikonfirmasi. Status: Lunas.');
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return redirect()->route('admin.packages')->with('success', 'Paket berhasil dihapus.');
    }
}
