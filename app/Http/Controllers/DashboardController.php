<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Admin\BagController as AdminBagController;
use App\Http\Controllers\Admin\BatchController as AdminBatchController;
use App\Http\Controllers\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Customer\PackageController as CustomerPackageController;
use App\Http\Controllers\StaffEnde\BatchController as StaffEndeBatchController;
use App\Http\Controllers\StaffSurabaya\BagController as StaffSurabayaBagController;
use App\Http\Controllers\StaffSurabaya\BatchController as StaffSurabayaBatchController;
use App\Http\Controllers\StaffSurabaya\PackageController as StaffSurabayaPackageController;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->getRoleNames()->first() ?? 'customer';

        $stats = match ($role) {
            'customer' => [
                'total' => Package::where('user_id', $user->id)->count(),
                'waiting' => Package::where('user_id', $user->id)->where('status', 'waiting_for_collection')->count(),
                'in_transit' => Package::where('user_id', $user->id)->whereIn('status', ['bagging', 'berangkat_ke_pelabuhan', 'di_kapal', 'tiba_di_ende'])->count(),
                'delivered' => Package::where('user_id', $user->id)->where('status', 'selesai')->count(),
            ],
            'staff_surabaya' => [
                'waiting' => Package::where('status', 'waiting_for_collection')->count(),
                'collected' => Package::where('status', 'collected')->count(),
                'waiting_payment' => Package::where('status', 'waiting_for_payment')->count(),
            ],
            'admin' => [
                'total' => Package::count(),
                'active_customers' => User::role('customer')->count(),
                'active_batches' => Batch::whereIn('status', ['preparing', 'berangkat'])->count(),
                'revenue_this_month' => Package::whereIn('status', ['paid', 'selesai'])
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('total_cost'),
            ],
            default => [],
        };

        $view = match ($role) {
            'customer' => 'dashboard/customer',
            'staff_surabaya' => 'dashboard/staff-surabaya',
            'admin' => 'dashboard/admin',
            default => 'dashboard/admin',
        };

        return Inertia::render($view, [
            'stats' => $stats,
        ]);
    }

    public function packages(Request $request): Response|RedirectResponse
    {
        $role = $request->user()->getRoleNames()->first() ?? 'customer';

        $controller = match ($role) {
            'customer' => new CustomerPackageController,
            'staff_surabaya' => new StaffSurabayaPackageController,
            'admin' => new AdminPackageController,
            default => null,
        };

        if ($controller === null) {
            return redirect()->route('dashboard');
        }

        return $controller->index($request);
    }

    public function bags(Request $request): Response|RedirectResponse
    {
        $role = $request->user()->getRoleNames()->first() ?? 'customer';

        $controller = match ($role) {
            'staff_surabaya' => new StaffSurabayaBagController,
            'admin' => new AdminBagController,
            default => null,
        };

        if ($controller === null) {
            return redirect()->route('dashboard');
        }

        return $controller->index($request);
    }

    public function batches(Request $request): Response|RedirectResponse
    {
        $role = $request->user()->getRoleNames()->first() ?? 'customer';

        $controller = match ($role) {
            'staff_surabaya' => new StaffSurabayaBatchController,
            'staff_ende' => new StaffEndeBatchController,
            'admin' => new AdminBatchController,
            default => null,
        };

        if ($controller === null) {
            return redirect()->route('dashboard');
        }

        return $controller->index($request);
    }
}
