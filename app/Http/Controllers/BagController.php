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

        $bags = $scopes->bags($user)
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('bags/index', [
            'bags' => Pagination::toNested($bags),
            'statusLabels' => StatusLabels::bags(),
        ]);
    }
}
