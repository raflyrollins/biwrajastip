<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use App\Models\Batch;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function showBag(Bag $bag): Response
    {
        $bag->load(['packages' => fn ($q) => $q->select('id', 'tracking_code', 'recipient_name', 'recipient_phone', 'status'), 'batch']);

        return Inertia::render('shared/bag-detail', [
            'bag' => $bag,
        ]);
    }

    public function showBatch(Batch $batch): Response
    {
        $batch->load(['bags' => fn ($q) => $q->withCount('packages')]);

        return Inertia::render('shared/batch-detail', [
            'batch' => $batch,
        ]);
    }
}
