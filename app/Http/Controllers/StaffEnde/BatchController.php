<?php

namespace App\Http\Controllers\StaffEnde;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    public function index(Request $request): Response
    {
        $batches = Batch::with(['bags' => fn ($q) => $q->withCount('packages')])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('staff-ende/batches', [
            'batches' => $batches,
        ]);
    }

    public function show(Batch $batch): Response
    {
        $batch->load(['bags' => fn ($q) => $q->withCount('packages')]);

        return Inertia::render('staff-ende/batch-detail', [
            'batch' => $batch,
        ]);
    }
}
