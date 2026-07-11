<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\HasFilters;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    use HasFilters;

    public function index(Request $request)
    {
        $query = Role::withCount('permissions')->orderBy('name');

        $this->applyFilters($query, $request, ['name', 'label']);

        $roles = $query->get();

        return Inertia::render('dashboard/roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function edit(string $uuid)
    {
        $role = Role::where('uuid', $uuid)->with('permissions')->firstOrFail();
        $permissions = Permission::orderBy('group')->orderBy('name')->get();
        $groups = $permissions->groupBy('group');

        return Inertia::render('dashboard/roles/Form', [
            'role' => $role,
            'groups' => $groups,
        ]);
    }

    public function update(Request $request, string $uuid)
    {
        $role = Role::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,uuid'],
        ]);

        $permissionIds = Permission::whereIn('uuid', $validated['permissions'] ?? [])
            ->pluck('id')
            ->toArray();

        $role->permissions()->sync($permissionIds);

        return redirect()->route('dashboard.roles')
            ->with('success', 'Permission role berhasil diperbarui.');
    }
}
