<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use Inertia\Inertia;

class BagController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/bags/Index');
    }

    public function showLabel(string $uuid)
    {
        $bag = Bag::where('uuid', $uuid)
            ->with(['packages.zone', 'batch'])
            ->firstOrFail();

        return Inertia::render('dashboard/bags/Label', [
            'bag' => $bag,
        ]);
    }
}
