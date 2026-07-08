<?php

namespace App\Http\Controllers\StaffSurabaya;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    public function index(Request $request): Response
    {
        $batches = Batch::with('bags')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('staff-surabaya/batches', [
            'batches' => $batches,
        ]);
    }

    public function print(Batch $batch): Response
    {
        $batch->load('bags');

        return Inertia::render('staff-surabaya/print-batch', [
            'batch' => $batch,
        ]);
    }
}
