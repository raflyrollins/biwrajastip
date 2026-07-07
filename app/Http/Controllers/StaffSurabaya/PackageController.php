<?php

namespace App\Http\Controllers\StaffSurabaya;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'waiting');

        $allowedTabs = [
            'waiting',
            'collected',
            'waiting_for_payment',
            'paid',
            'bagging',
        ];

        if (! in_array($tab, $allowedTabs)) {
            $tab = 'waiting';
        }

        $query = Package::with('zone');

        if ($tab === 'waiting') {
            $query->where('status', 'waiting_for_collection');
        } elseif ($tab === 'collected') {
            $query->where('status', 'collected');
        } elseif ($tab === 'waiting_for_payment') {
            $query->where('status', 'waiting_for_payment');
        } elseif ($tab === 'paid') {
            $query->where('status', 'paid');
        } elseif ($tab === 'bagging') {
            $query->whereIn('status', ['bagging', 'berangkat_ke_pelabuhan', 'di_kapal', 'tiba_di_ende', 'disortir', 'siap_diambil', 'dalam_pengantaran', 'selesai']);
        }

        $packages = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'waiting' => Package::where('status', 'waiting_for_collection')->count(),
            'collected' => Package::where('status', 'collected')->count(),
            'waiting_for_payment' => Package::where('status', 'waiting_for_payment')->count(),
            'paid' => Package::where('status', 'paid')->count(),
            'bagging' => Package::whereIn('status', ['bagging', 'berangkat_ke_pelabuhan', 'di_kapal', 'tiba_di_ende', 'disortir', 'siap_diambil', 'dalam_pengantaran', 'selesai'])->count(),
        ];

        return Inertia::render('staff-surabaya/packages', [
            'packages' => $packages,
            'stats' => $stats,
            'tab' => $tab,
        ]);
    }

    public function collect(Request $request, Package $package)
    {
        abort_unless($package->status === 'waiting_for_collection', 422);

        $package->update(['status' => 'collected']);

        return back()->with('success', 'Paket berhasil diterima. Status: Dikumpulkan.');
    }

    public function showWeigh(Package $package): Response
    {
        abort_unless(in_array($package->status, ['collected', 'waiting_for_payment']), 403);

        $package->load('zone');

        return Inertia::render('staff-surabaya/weigh', [
            'package' => $package,
        ]);
    }

    public function weigh(Request $request, Package $package)
    {
        abort_unless($package->status === 'collected', 422);

        $validated = $request->validate([
            'weight_actual' => ['required', 'integer', 'min:1'],
            'length' => ['required', 'integer', 'min:1'],
            'width' => ['required', 'integer', 'min:1'],
            'height' => ['required', 'integer', 'min:1'],
        ]);

        $zone = $package->zone;
        $actualWeight = $validated['weight_actual'];
        $volumetricActual = Package::calculateVolumetric(
            $validated['length'],
            $validated['width'],
            $validated['height']
        );
        $finalWeight = Package::calculateFinalWeight($actualWeight, $volumetricActual);
        $shippingCost = (int) ceil(($zone->tarif_per_kg * $finalWeight / 1000) + $zone->biaya_antar);

        $package->update([
            'weight_actual' => $actualWeight,
            'length' => $validated['length'],
            'width' => $validated['width'],
            'height' => $validated['height'],
            'volumetric_actual' => $volumetricActual,
            'final_weight' => $finalWeight,
            'shipping_cost' => $shippingCost,
            'total_cost' => $shippingCost,
            'delivery_fee' => $zone->biaya_antar,
            'status' => 'waiting_for_payment',
        ]);

        return redirect()->route('staff-sby.packages', ['tab' => 'waiting_for_payment'])
            ->with('success', 'Paket selesai ditimbang. Harga: Rp'.number_format((float) $shippingCost, 0, ',', '.'));
    }

    public function printReceipt(Package $package): Response
    {
        abort_unless($package->status === 'paid', 403);

        $package->load('zone', 'user');

        return Inertia::render('staff-surabaya/print-receipt', [
            'package' => $package,
        ]);
    }
}
