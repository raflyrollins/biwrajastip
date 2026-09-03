<?php

namespace App\Http\Controllers;

use App\Enums\PackageStatus;
use App\Enums\Permission;
use App\Services\EntityScopes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $scopes = new EntityScopes;

        // Data scope is enforced server-side, not by just hiding menu items.
        $packageQuery = $scopes->packages($user);
        $bagQuery = $scopes->bags($user);
        $batchQuery = $scopes->batches($user);

        $hasMenuPackages = $user->can(Permission::MenuPackages->value);
        $hasMenuBags = $user->can(Permission::MenuBags->value);
        $hasMenuBatches = $user->can(Permission::MenuBatches->value);

        return Inertia::render('dashboard', [
            'greeting' => $this->greeting(),
            'allowCreatePackage' => $user->can(Permission::ActionPackagesCreate->value),
            'stats' => [
                // KPI only exposed for menus the user can actually see.
                'packages' => $hasMenuPackages ? $packageQuery->count() : null,
                'bags' => $hasMenuBags ? $bagQuery->count() : null,
                'batches' => $hasMenuBatches ? $batchQuery->count() : null,
                'nearing_delivery' => $hasMenuPackages
                    ? (clone $packageQuery)->whereIn('status', [
                        PackageStatus::Unbatched->value,
                        PackageStatus::Ready->value,
                    ])->count()
                    : null,
            ],
            'recent_packages' => $hasMenuPackages
                ? $packageQuery
                    ->latest('created_at')
                    ->limit(5)
                    ->get(['uuid', 'status', 'biwrajastip_tracking_number', 'store_tracking_number', 'receiver_name', 'total_amount', 'created_at'])
                : [],
        ]);
    }

    private function greeting(): string
    {
        $hour = (int) now()->format('G');

        return match (true) {
            $hour >= 5 && $hour < 11 => 'Selamat pagi',
            $hour >= 11 && $hour < 15 => 'Selamat siang',
            $hour >= 15 && $hour < 18 => 'Selamat sore',
            default => 'Selamat malam',
        };
    }
}
