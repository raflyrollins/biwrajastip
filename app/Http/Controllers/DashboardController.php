<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $view = match ($user->role) {
            'customer' => 'dashboard/customer',
            'staff_surabaya' => 'dashboard/staff-surabaya',
            'staff_ende' => 'dashboard/staff-ende',
            'admin' => 'dashboard/admin',
            'owner' => 'dashboard/owner',
            default => 'dashboard/customer',
        };

        return Inertia::render($view);
    }
}
