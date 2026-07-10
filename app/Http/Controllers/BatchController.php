<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/batches/Index');
    }

    public function showManifest(string $uuid)
    {
        $batch = Batch::where('uuid', $uuid)
            ->with(['bags.packages', 'ship', 'schedule'])
            ->firstOrFail();

        return Inertia::render('dashboard/batches/Manifest', [
            'batch' => $batch,
        ]);
    }
}
