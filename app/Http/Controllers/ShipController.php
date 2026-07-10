<?php

namespace App\Http\Controllers;

use App\Models\Ship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipController extends Controller
{
    public function index()
    {
        $perPage = min((int) request('per_page', 15), 100);

        return Inertia::render('dashboard/ships/Index', [
            'ships' => Ship::query()
                ->when(request('search'), fn ($q, $s) => $q->whereFullText('name', $s . '*', ['mode' => 'boolean']))
                ->orderBy('name')
                ->paginate($perPage)
                ->onEachSide(1)
                ->withQueryString()
                ->through(fn (Ship $ship) => [
                    'uuid' => $ship->uuid,
                    'name' => $ship->name,
                    'description' => $ship->description,
                    'is_active' => $ship->is_active,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/ships/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Ship::create($validated);

        return redirect()->route('dashboard.ships')->with('success', 'Kapal berhasil ditambahkan.');
    }

    public function edit(Ship $ship)
    {
        return Inertia::render('dashboard/ships/Form', [
            'ship' => [
                'uuid' => $ship->uuid,
                'name' => $ship->name,
                'description' => $ship->description,
                'is_active' => $ship->is_active,
            ],
        ]);
    }

    public function update(Request $request, Ship $ship)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $ship->update($validated);

        return redirect()->route('dashboard.ships')->with('success', 'Kapal berhasil diperbarui.');
    }

    public function destroy(Ship $ship)
    {
        $ship->delete();

        return redirect()->route('dashboard.ships')->with('success', 'Kapal berhasil dihapus.');
    }
}
