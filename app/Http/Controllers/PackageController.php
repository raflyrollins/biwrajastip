<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\Permission;
use App\Http\Requests\Package\StorePackageRequest;
use App\Models\DeliveryZone;
use App\Models\Package;
use App\Services\EntityScopes;
use App\Support\Pagination;
use App\Support\Pricing;
use App\Support\StatusLabels;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $scopes = new EntityScopes;

        $search = $request->string('search')->toString();

        $allowed = $scopes->allowedPackageStatuses($user);
        $requested = array_filter(explode(',', $request->string('status')->toString()));
        $statuses = array_values(array_intersect($requested, $allowed));

        $packages = $scopes->packages($user)
            ->when($search, function ($query, $term) {
                $term = '%'.$term.'%';
                $query->where(function ($q) use ($term) {
                    $q->where('biwrajastip_tracking_number', 'like', $term)
                        ->orWhere('store_tracking_number', 'like', $term)
                        ->orWhere('receiver_name', 'like', $term);
                });
            })
            ->when($statuses, fn ($query, $s) => $query->whereIn('status', $s))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        $allLabels = StatusLabels::packages();
        $statusLabels = array_intersect_key($allLabels, array_flip($allowed));

        return Inertia::render('packages/index', [
            'packages' => Pagination::toNested($packages),
            'statusLabels' => $statusLabels,
            'allowCreate' => $user->can(Permission::ActionPackagesCreate->value),
            'filters' => ['search' => $search, 'status' => $statuses],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('packages/create', [
            'deliveryZones' => DeliveryZone::query()
                ->where('is_active', true)
                ->with('rates')
                ->orderBy('name')
                ->get(),
            'flatShippingFee' => (new Pricing)->flatShippingFee(),
        ]);
    }

    public function store(StorePackageRequest $request): RedirectResponse
    {
        $pricing = new Pricing;

        $zone = $request->filled('delivery_zone_id')
            ? DeliveryZone::find((int) $request->input('delivery_zone_id'))
            : null;

        $estimate = $pricing->estimateFor(
            $zone,
            (int) $request->input('estimated_weight_g'),
            $request->filled('estimated_length_cm') ? (float) $request->input('estimated_length_cm') : null,
            $request->filled('estimated_width_cm') ? (float) $request->input('estimated_width_cm') : null,
            $request->filled('estimated_height_cm') ? (float) $request->input('estimated_height_cm') : null,
        );

        $package = Package::create([
            'customer_id' => $request->user()->id,
            'status' => PackageStatus::Registered,
            'delivery_zone_id' => $zone?->id,
            'store_tracking_number' => $request->input('store_tracking_number'),
            'receiver_name' => $request->input('receiver_name'),
            'delivery_address' => $request->input('delivery_address'),
            'estimated_weight_kg' => (int) $request->input('estimated_weight_g') / 1000,
            'estimated_length_cm' => $request->filled('estimated_length_cm') ? (float) $request->input('estimated_length_cm') : null,
            'estimated_width_cm' => $request->filled('estimated_width_cm') ? (float) $request->input('estimated_width_cm') : null,
            'estimated_height_cm' => $request->filled('estimated_height_cm') ? (float) $request->input('estimated_height_cm') : null,
            'volumetric_weight_kg' => $estimate['volumetric_weight_kg'],
            'billed_weight_kg' => $estimate['billed_weight_kg'],
            'shipping_fee' => $estimate['shipping_fee'],
            'delivery_fee' => $estimate['delivery_fee'],
            'total_amount' => $estimate['total_amount'],
        ]);

        return redirect()
            ->route('packages.index')
            ->with('success', 'Paket berhasil didaftarkan.');
    }
}
