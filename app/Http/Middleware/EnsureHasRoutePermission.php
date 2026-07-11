<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasRoutePermission
{
    private const MAP = [
        'index' => '.view',
        'create' => '.create',
        'store' => '.create',
        'edit' => '.update',
        'update' => '.update',
        'destroy' => '.delete',
        'weigh' => '.update',
        'weigh.store' => '.update',
        'receipt' => '.print',
        'label' => '.print',
        'manifest' => '.print',
        'reject' => '.verify',
        'verify' => '.verify',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $routeName = $request->route()?->getName();

        if (! $routeName) {
            return $next($request);
        }

        $permission = $this->resolve($routeName);

        if ($permission && ! $request->user()?->hasPermission($permission)) {
            abort(403);
        }

        return $next($request);
    }

    private function resolve(string $name): ?string
    {
        if ($name === 'dashboard' || ! str_starts_with($name, 'dashboard.')) {
            return null;
        }

        $parts = explode('.', $name);
        $resource = $parts[1] ?? null;

        if (! $resource) {
            return null;
        }

        $action = implode('.', array_slice($parts, 2));

        if (! $action) {
            return $resource.'.view';
        }

        if (isset(self::MAP[$action])) {
            return $resource.self::MAP[$action];
        }

        return $resource.'.'.$action;
    }
}
