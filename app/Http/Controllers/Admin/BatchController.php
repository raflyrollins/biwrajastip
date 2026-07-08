<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        return Inertia::render('admin/batches', [
            'batches' => $batches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['code'] = Batch::generateCode();
        $validated['status'] = 'preparing';

        Batch::create($validated);

        return redirect()->route('admin.batches')->with('success', 'Batch berhasil dibuat.');
    }

    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', 'max:30'],
            'departure_at' => ['nullable', 'date'],
            'arrival_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $newStatus = $validated['status'] ?? null;

        DB::transaction(function () use ($batch, $validated, $newStatus) {
            $batch->update($validated);

            if ($newStatus) {
                $packageStatus = match ($newStatus) {
                    'berangkat' => 'berangkat_ke_pelabuhan',
                    'di_kapal' => 'di_kapal',
                    'tiba' => 'tiba_di_ende',
                    default => null,
                };

                if ($packageStatus) {
                    Package::whereHas('bag', fn ($q) => $q->where('batch_id', $batch->id))
                        ->whereIn('status', ['bagging', 'berangkat_ke_pelabuhan', 'di_kapal', 'tiba_di_ende'])
                        ->update(['status' => $packageStatus]);
                }
            }
        });

        return redirect()->route('admin.batches')->with('success', 'Batch berhasil diperbarui.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('admin.batches')->with('success', 'Batch berhasil dihapus.');
    }

    public function print(Batch $batch): Response
    {
        $batch->load('bags');

        return Inertia::render('staff-surabaya/print-batch', [
            'batch' => $batch,
        ]);
    }
}
