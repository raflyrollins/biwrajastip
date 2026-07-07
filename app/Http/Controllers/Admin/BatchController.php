<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    public function index(Request $request): Response
    {
        $batches = Batch::latest()->paginate(15)->withQueryString();

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

        $batch->update($validated);

        return redirect()->route('admin.batches')->with('success', 'Batch berhasil diperbarui.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('admin.batches')->with('success', 'Batch berhasil dihapus.');
    }
}
