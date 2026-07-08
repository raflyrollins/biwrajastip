<?php

namespace App\Http\Controllers\StaffEnde;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use Inertia\Inertia;
use Inertia\Response;

class BagController extends Controller
{
    public function show(Bag $bag): Response
    {
        $bag->load(['packages' => fn ($q) => $q->select('id', 'tracking_code', 'recipient_name', 'recipient_phone', 'status'), 'batch']);

        return Inertia::render('staff-ende/bag-detail', [
            'bag' => $bag,
        ]);
    }
}
