<?php

namespace App\Http\Controllers;

use App\Services\EntityScopes;
use App\Support\Pagination;
use App\Support\StatusLabels;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $scopes = new EntityScopes;

        $allowed = $scopes->allowedBatchStatuses($user);
        $requested = array_filter(explode(',', $request->string('status')->toString()));
        $statuses = array_values(array_intersect($requested, $allowed));

        $batches = $scopes->batches($user)
            ->when($statuses, fn ($query, $s) => $query->whereIn('status', $s))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        $allLabels = StatusLabels::batches();
        $statusLabels = array_intersect_key($allLabels, array_flip($allowed));

        return Inertia::render('batches/index', [
            'batches' => Pagination::toNested($batches),
            'statusLabels' => $statusLabels,
            'filters' => ['status' => $statuses],
        ]);
    }
}
