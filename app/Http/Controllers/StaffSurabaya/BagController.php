<?php

namespace App\Http\Controllers\StaffSurabaya;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BagController extends Controller
{
    public function index(Request $request): Response
    {
        $bags = Bag::with('batch')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('staff-surabaya/bags', [
            'bags' => $bags,
        ]);
    }

    public function print(Bag $bag): Response
    {
        $bag->load('batch');

        return Inertia::render('staff-surabaya/print-bag', [
            'bag' => $bag,
        ]);
    }
}
