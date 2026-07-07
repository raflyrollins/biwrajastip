<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $now = now();

        $totalPackages = Package::count();
        $packagesThisMonth = Package::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();
        $totalRevenue = Package::where('status', 'paid')
            ->orWhere('status', 'selesai')
            ->sum('total_cost');
        $revenueThisMonth = Package::where('status', 'paid')
            ->orWhere('status', 'selesai')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('total_cost');
        $activeCustomers = User::role('customer')->count();
        $totalBatches = Batch::count();
        $activeBatches = Batch::whereIn('status', ['preparing', 'berangkat'])->count();

        $packagesByZone = Package::join('zones', 'packages.zone_id', '=', 'zones.id')
            ->select('zones.name', DB::raw('count(*) as total'))
            ->groupBy('zones.name')
            ->get();

        $monthlyRevenue = Package::where('status', 'paid')
            ->orWhere('status', 'selesai')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('sum(total_cost) as total'),
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('admin/reports', [
            'stats' => [
                'total_packages' => $totalPackages,
                'packages_this_month' => $packagesThisMonth,
                'total_revenue' => $totalRevenue,
                'revenue_this_month' => $revenueThisMonth,
                'active_customers' => $activeCustomers,
                'total_batches' => $totalBatches,
                'active_batches' => $activeBatches,
            ],
            'packages_by_zone' => $packagesByZone,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }
}
