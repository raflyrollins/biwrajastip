<?php

namespace App\Http\Controllers;

use App\Services\EntityScopes;
use App\Support\Pagination;
use App\Support\StatusLabels;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BagController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $scopes = new EntityScopes;

        $allowed = $scopes->allowedBagStatuses($user);
        $requested = array_filter(explode(',', $request->string('status')->toString()));
        $statuses = array_values(array_intersect($requested, $allowed));

        $bags = $scopes->bags($user)
            ->when($statuses, fn ($query, $s) => $query->whereIn('status', $s))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        $allLabels = StatusLabels::bags();
        $statusLabels = array_intersect_key($allLabels, array_flip($allowed));

        return Inertia::render('bags/index', [
            'bags' => Pagination::toNested($bags),
            'statusLabels' => $statusLabels,
            'filters' => ['status' => $statuses],
        ]);
    }
}
