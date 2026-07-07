<?php

namespace App\Http\Controllers\Customer;

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
        $packages = Package::where('user_id', $request->user()->id)
            ->with('zone')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('customer/packages', [
            'packages' => $packages,
        ]);
    }

    public function create(Request $request): Response
    {
        $zones = Zone::orderBy('name')->get();

        return Inertia::render('customer/create-package', [
            'zones' => $zones,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['nullable', 'string', 'max:20'],
            'zone_id' => ['required', 'exists:zones,id'],
            'sender_tracking_number' => ['nullable', 'string', 'max:100'],
            'weight_estimated' => ['required', 'integer', 'min:1'],
            'length' => ['nullable', 'integer', 'min:1'],
            'width' => ['nullable', 'integer', 'min:1'],
            'height' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $lengthEst = $validated['length'] ?? null;
        $widthEst = $validated['width'] ?? null;
        $heightEst = $validated['height'] ?? null;

        $volumetricEstimated = null;
        if ($lengthEst && $widthEst && $heightEst) {
            $volumetricEstimated = Package::calculateVolumetric($lengthEst, $widthEst, $heightEst);
        }

        $package = Package::create([
            'user_id' => $request->user()->id,
            'tracking_code' => Package::generateTrackingCode(),
            'recipient_name' => $validated['recipient_name'],
            'recipient_phone' => $validated['recipient_phone'] ?? null,
            'zone_id' => $validated['zone_id'],
            'sender_tracking_number' => $validated['sender_tracking_number'] ?? null,
            'weight_estimated' => $validated['weight_estimated'],
            'length_estimated' => $lengthEst,
            'width_estimated' => $widthEst,
            'height_estimated' => $heightEst,
            'volumetric_estimated' => $volumetricEstimated,
            'notes' => $validated['notes'] ?? null,
            'status' => 'waiting_for_collection',
        ]);

        return redirect()->route('customer.packages.show', $package)
            ->with('success', 'Paket berhasil didaftarkan. Kode tracking: '.$package->tracking_code);
    }

    public function show(Package $package): Response
    {
        abort_unless($package->user_id === auth()->id(), 403);

        $package->load('zone');

        return Inertia::render('customer/show-package', [
            'package' => $package,
        ]);
    }
}
