<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Services\EntityScopes;
use App\Support\Pagination;
use App\Support\StatusLabels;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $scopes = new EntityScopes;

        $packages = $scopes->packages($user)
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('packages/index', [
            'packages' => Pagination::toNested($packages),
            'statusLabels' => StatusLabels::packages(),
            'allowCreate' => $user->can(Permission::ActionPackagesCreate->value),
        ]);
    }
}
