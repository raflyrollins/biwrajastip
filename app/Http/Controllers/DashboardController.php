<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
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
}
