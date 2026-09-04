<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\Permission;
use App\Events\PackageCreated;
use App\Events\PackageStatusUpdated;
use App\Http\Requests\Package\ProcessPackageRequest;
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

        $payableStatuses = [
            PackageStatus::Processed->value,
        ];

        $pendingPaymentStatuses = [
            PackageStatus::PendingPayment->value,
        ];

        $processableStatuses = [
            PackageStatus::Registered->value,
            PackageStatus::Collected->value,
        ];

        $isCustomer = $user->hasRole('customer');

        $data = collect(Pagination::toNested($packages)['data'])->map(function ($row) use ($payableStatuses, $pendingPaymentStatuses, $processableStatuses, $isCustomer) {
            $row['can_pay'] = $isCustomer
                && in_array($row['status'], $payableStatuses, true)
                && (int) ($row['total_amount'] ?? 0) > 0;

            $row['has_pending_payment'] = $isCustomer
                && in_array($row['status'], $pendingPaymentStatuses, true);

            $row['can_process'] = in_array($row['status'], $processableStatuses, true);

            $row['can_print_receipt'] = in_array($row['status'], [
                PackageStatus::Paid->value,
                PackageStatus::Bagged->value,
                PackageStatus::Batched->value,
                PackageStatus::PortArrived->value,
                PackageStatus::OnGoing->value,
                PackageStatus::Unbatched->value,
                PackageStatus::Unbagged->value,
                PackageStatus::Ready->value,
                PackageStatus::Delivered->value,
            ], true);

            return $row;
        })->values();

        return Inertia::render('packages/index', [
            'packages' => array_merge(
                Pagination::toNested($packages),
                ['data' => $data->all()],
            ),
            'statusLabels' => $statusLabels,
            'allowCreate' => $user->can(Permission::ActionPackagesCreate->value),
            'allowProcess' => $user->can(Permission::ActionPackagesProcess->value),
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

        PackageCreated::dispatch($package->uuid, $package->status->value);

        return redirect()
            ->route('packages.index')
            ->with('success', 'Paket berhasil didaftarkan.');
    }

    public function process(Request $request, Package $package): Response
    {
        $this->authorizeProcessable($request, $package);

        $plugin = $package->load('deliveryZone');

        return Inertia::render('packages/process', [
            'package' => [
                'uuid' => $plugin->uuid,
                'biwrajastip_tracking_number' => $plugin->biwrajastip_tracking_number,
                'store_tracking_number' => $plugin->store_tracking_number,
                'receiver_name' => $plugin->receiver_name,
                'delivery_address' => $plugin->delivery_address,
                'status' => $plugin->status->value,
                'estimated_weight_kg' => $plugin->estimated_weight_kg,
                'estimated_length_cm' => $plugin->estimated_length_cm,
                'estimated_width_cm' => $plugin->estimated_width_cm,
                'estimated_height_cm' => $plugin->estimated_height_cm,
                'actual_weight_kg' => $plugin->actual_weight_kg,
                'actual_length_cm' => $plugin->actual_length_cm,
                'actual_width_cm' => $plugin->actual_width_cm,
                'actual_height_cm' => $plugin->actual_height_cm,
                'volumetric_weight_kg' => $plugin->volumetric_weight_kg,
                'billed_weight_kg' => $plugin->billed_weight_kg,
                'shipping_fee' => $plugin->shipping_fee,
                'delivery_fee' => $plugin->delivery_fee,
                'total_amount' => $plugin->total_amount,
                'delivery_zone' => $plugin->deliveryZone?->name,
            ],
            'flatShippingFee' => (new Pricing)->flatShippingFee(),
        ]);
    }

    public function updateProcessed(ProcessPackageRequest $request, Package $package): RedirectResponse
    {
        $this->authorizeProcessable($request, $package);

        $pricing = new Pricing;

        $estimate = $pricing->estimateFor(
            $package->deliveryZone,
            (int) $request->input('actual_weight_g'),
            $request->filled('actual_length_cm') ? (float) $request->input('actual_length_cm') : null,
            $request->filled('actual_width_cm') ? (float) $request->input('actual_width_cm') : null,
            $request->filled('actual_height_cm') ? (float) $request->input('actual_height_cm') : null,
        );

        $package->forceFill([
            'status' => PackageStatus::Processed,
            'actual_weight_kg' => $request->integer('actual_weight_g') / 1000,
            'actual_length_cm' => $request->filled('actual_length_cm') ? (float) $request->input('actual_length_cm') : null,
            'actual_width_cm' => $request->filled('actual_width_cm') ? (float) $request->input('actual_width_cm') : null,
            'actual_height_cm' => $request->filled('actual_height_cm') ? (float) $request->input('actual_height_cm') : null,
            'volumetric_weight_kg' => $estimate['volumetric_weight_kg'],
            'billed_weight_kg' => $estimate['billed_weight_kg'],
            'shipping_fee' => $estimate['shipping_fee'],
            'delivery_fee' => $estimate['delivery_fee'],
            'total_amount' => $estimate['total_amount'],
        ])->save();

        PackageStatusUpdated::dispatch($package->uuid, $package->status->value);

        return redirect()
            ->route('packages.index')
            ->with('success', 'Paket berhasil diproses. Customer dapat melakukan pembayaran.');
    }

    private function authorizeProcessable(Request $request, Package $package): void
    {
        $user = $request->user();

        if (! $user->can(Permission::ActionPackagesProcess->value)
            || ! $user->getRoleNames()->contains('staff-surabaya')) {
            abort(403);
        }

        $packageInScope = (new EntityScopes)->packages($user)->whereKey($package->id)->exists();

        if (! $packageInScope) {
            abort(403);
        }

        if (! in_array($package->status->value, [
            PackageStatus::Registered->value,
            PackageStatus::Collected->value,
        ], true)) {
            abort(422, 'Paket sudah diproses dan tidak dapat diubah lagi.');
        }
    }
}
