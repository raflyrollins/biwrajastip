<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->orderByDesc('created_at')->get();

        return Inertia::render('dashboard/users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::orderBy('name')->get(['uuid', 'name', 'label']);

        return Inertia::render('dashboard/users/Form', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,uuid'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $role = Role::where('uuid', $validated['role'])->firstOrFail();
        $user->assignRole($role->name);

        return redirect()->route('dashboard.users')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(string $uuid)
    {
        $user = User::where('uuid', $uuid)->with('roles')->firstOrFail();
        $roles = Role::orderBy('name')->get(['uuid', 'name', 'label']);

        return Inertia::render('dashboard/users/Form', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,uuid'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if ($validated['password']) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $role = Role::where('uuid', $validated['role'])->firstOrFail();
        $user->roles()->sync([$role->id]);

        return redirect()->route('dashboard.users')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus akun sendiri.']);
        }

        $user->delete();

        return redirect()->route('dashboard.users')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}
