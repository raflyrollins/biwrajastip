<?php

namespace App\Http\Controllers;

use App\Enums\BatchStatus;
use App\Http\Controllers\Traits\HasFilters;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    use HasFilters;

    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 20), 100);

        $query = Batch::withCount('bags')
            ->with(['ship', 'schedule'])
            ->latest();

        $user = $request->user();

        $scopes = $user->roles()->with('permissions')->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->unique();

        if ($scopes->contains('batches.scope.all')) {
            // no filter
        } elseif ($scopes->contains('batches.scope.own')
            || $scopes->contains('batches.scope.unbatched')
        ) {
            $query->where(function ($q) use ($scopes, $user) {
                if ($scopes->contains('batches.scope.own')) {
                    $q->orWhere('created_by', $user->id);
                }

                if ($scopes->contains('batches.scope.unbatched')) {
                    $q->orWhere('status', BatchStatus::Unbatched);
                }
            });
        } else {
            $query->where('created_by', $user->id);
        }

        $this->applyFilters($query, $request, ['code', 'notes']);
        $batches = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('dashboard/batches/Index', [
            'batches' => $batches,
        ]);
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
