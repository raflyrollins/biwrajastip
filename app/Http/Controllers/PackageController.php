<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Models\Package;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    private const DEFAULT_TARIFF_PER_KG = 15000;

    public function index()
    {
        $user = auth()->user();
        $query = Package::with('zone');

        $scopes = $user->roles()->with('permissions')->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->unique();

        if ($scopes->contains('packages.scope.all')) {
            // no filter
        } elseif ($scopes->contains('packages.scope.own')
            || $scopes->contains('packages.scope.collected')
            || $scopes->contains('packages.scope.transit')
        ) {
            $query->where(function ($q) use ($scopes, $user) {
                if ($scopes->contains('packages.scope.own')) {
                    $q->orWhere('user_id', $user->id);
                }

                if ($scopes->contains('packages.scope.collected')) {
                    $q->orWhereIn('status', [
                        PackageStatus::Collected->value,
                        PackageStatus::WaitingForPayment->value,
                        PackageStatus::Paid->value,
                        PackageStatus::Bagging->value,
                    ]);
                }

                if ($scopes->contains('packages.scope.transit')) {
                    $q->orWhereIn('status', [
                        PackageStatus::BerangkatKePelabuhan->value,
                        PackageStatus::InTransit->value,
                        PackageStatus::Arrived->value,
                        PackageStatus::ReadyForSorting->value,
                        PackageStatus::SiapDiambil->value,
                        PackageStatus::DalamPengantaran->value,
                        PackageStatus::Selesai->value,
                    ]);
                }
            });
        } else {
            $query->where('user_id', $user->id);
        }

        $packages = $query->latest()->paginate(20);

        return Inertia::render('dashboard/packages/Index', [
            'packages' => $packages,
        ]);
    }

    public function create()
    {
        $zones = Zone::all(['uuid', 'name']);

        return Inertia::render('dashboard/packages/Form', [
            'zones' => $zones,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_name' => ['required', 'string', 'max:255'],
            'sender_phone' => ['required', 'string', 'max:20'],
            'receiver_name' => ['required', 'string', 'max:255'],
            'receiver_phone' => ['required', 'string', 'max:20'],
            'tracking_number' => ['required', 'string', 'max:255', 'unique:packages,tracking_number'],
            'zone_id' => ['required', 'exists:zones,uuid'],
            'description' => ['nullable', 'string', 'max:255'],
            'weight_estimated' => ['nullable', 'numeric', 'min:0'],
            'length_estimated' => ['nullable', 'numeric', 'min:0'],
            'width_estimated' => ['nullable', 'numeric', 'min:0'],
            'height_estimated' => ['nullable', 'numeric', 'min:0'],
        ]);

        $zone = Zone::where('uuid', $validated['zone_id'])->firstOrFail();

        auth()->user()->packages()->create([
            'sender_name' => $validated['sender_name'],
            'sender_phone' => $validated['sender_phone'],
            'receiver_name' => $validated['receiver_name'],
            'receiver_phone' => $validated['receiver_phone'],
            'tracking_number' => $validated['tracking_number'],
            'zone_id' => $zone->id,
            'description' => $validated['description'] ?? null,
            'weight_estimated' => $validated['weight_estimated'] ?? null,
            'length_estimated' => $validated['length_estimated'] ?? null,
            'width_estimated' => $validated['width_estimated'] ?? null,
            'height_estimated' => $validated['height_estimated'] ?? null,
            'status' => PackageStatus::WaitingForCollection,
        ]);

        return redirect()->route('dashboard.packages')->with('success', 'Paket berhasil dibuat.');
    }

    public function edit($uuid)
    {
        $package = Package::where('uuid', $uuid)->with('zone')->firstOrFail();

        $user = auth()->user();

        if ($user->hasRole('customer') && $package->user_id !== $user->id) {
            abort(403);
        }

        if ($user->hasRole('customer') && $package->status->value !== PackageStatus::WaitingForCollection->value) {
            abort(403);
        }

        $zones = Zone::all(['uuid', 'name']);

        return Inertia::render('dashboard/packages/Form', [
            'package' => $package,
            'zones' => $zones,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $package = Package::where('uuid', $uuid)->firstOrFail();

        $user = auth()->user();

        if ($user->hasRole('customer') && $package->user_id !== $user->id) {
            abort(403);
        }

        if ($user->hasRole('customer') && $package->status->value !== PackageStatus::WaitingForCollection->value) {
            abort(403);
        }

        $rules = [
            'sender_name' => ['required', 'string', 'max:255'],
            'sender_phone' => ['required', 'string', 'max:20'],
            'receiver_name' => ['required', 'string', 'max:255'],
            'receiver_phone' => ['required', 'string', 'max:20'],
            'tracking_number' => ['required', 'string', 'max:255', 'unique:packages,tracking_number,'.$package->id],
            'zone_id' => ['required', 'exists:zones,uuid'],
            'description' => ['nullable', 'string', 'max:255'],
            'weight_estimated' => ['nullable', 'numeric', 'min:0'],
            'length_estimated' => ['nullable', 'numeric', 'min:0'],
            'width_estimated' => ['nullable', 'numeric', 'min:0'],
            'height_estimated' => ['nullable', 'numeric', 'min:0'],
        ];

        if ($user->hasPermission('packages.update') && $user->hasPermission('packages.scope.collected')) {
            $rules['weight_actual'] = ['nullable', 'numeric', 'min:0'];
            $rules['length_actual'] = ['nullable', 'numeric', 'min:0'];
            $rules['width_actual'] = ['nullable', 'numeric', 'min:0'];
            $rules['height_actual'] = ['nullable', 'numeric', 'min:0'];
        }

        $validated = $request->validate($rules);

        $zone = Zone::where('uuid', $validated['zone_id'])->firstOrFail();
        $validated['zone_id'] = $zone->id;

        $package->update($validated);

        return redirect()->route('dashboard.packages')->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroy($uuid)
    {
        $package = Package::where('uuid', $uuid)->firstOrFail();

        $package->delete();

        return redirect()->route('dashboard.packages')->with('success', 'Paket berhasil dihapus.');
    }

    public function showTimbang($uuid)
    {
        $package = Package::where('uuid', $uuid)
            ->with('zone')
            ->firstOrFail();

        if ($package->status->value !== PackageStatus::Collected->value) {
            abort(403, 'Paket harus dalam status collected untuk ditimbang.');
        }

        return Inertia::render('dashboard/packages/Timbang', [
            'package' => $package,
            'tariffPerKg' => self::DEFAULT_TARIFF_PER_KG,
        ]);
    }

    public function updateDimensions(Request $request, $uuid)
    {
        $package = Package::where('uuid', $uuid)->with('zone')->firstOrFail();

        if ($package->status->value !== PackageStatus::Collected->value) {
            abort(403, 'Paket harus dalam status collected.');
        }

        $validated = $request->validate([
            'weight_actual' => ['required', 'numeric', 'min:0'],
            'length_actual' => ['required', 'numeric', 'min:0'],
            'width_actual' => ['required', 'numeric', 'min:0'],
            'height_actual' => ['required', 'numeric', 'min:0'],
        ]);

        $package->update($validated);

        $volumetric = $package->calculateVolumetricWeight();
        $finalWeight = $package->calculateFinalWeight();
        $price = $package->calculatePrice(self::DEFAULT_TARIFF_PER_KG);
        $deliveryFee = $package->zone?->delivery_fee ?? 0;

        $package->update([
            'volumetric_weight' => $volumetric,
            'final_weight' => $finalWeight,
            'price' => $price,
            'delivery_fee' => $deliveryFee,
            'total_price' => $price + $deliveryFee,
            'status' => PackageStatus::WaitingForPayment,
        ]);

        return redirect()->route('dashboard.packages')->with('success', 'Data timbangan berhasil disimpan.');
    }
}
