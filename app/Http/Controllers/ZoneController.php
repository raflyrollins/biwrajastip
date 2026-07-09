<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZoneController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/zones/Index', [
            'zones' => Zone::query()
                ->when(request('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
                ->orderBy('name')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Zone $zone) => [
                    'uuid' => $zone->uuid,
                    'name' => $zone->name,
                    'delivery_fee' => $zone->delivery_fee,
                    'is_pusat' => $zone->is_pusat,
                    'description' => $zone->description,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/zones/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'delivery_fee' => 'required|numeric|min:0',
            'is_pusat' => 'boolean',
            'description' => 'nullable|string',
        ]);

        Zone::create($validated);

        return redirect()->route('dashboard.zones')->with('success', 'Zona berhasil ditambahkan.');
    }

    public function edit(Zone $zone)
    {
        return Inertia::render('dashboard/zones/Form', [
            'zone' => [
                'uuid' => $zone->uuid,
                'name' => $zone->name,
                'delivery_fee' => $zone->delivery_fee,
                'is_pusat' => $zone->is_pusat,
                'description' => $zone->description,
            ],
        ]);
    }

    public function update(Request $request, Zone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'delivery_fee' => 'required|numeric|min:0',
            'is_pusat' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $zone->update($validated);

        return redirect()->route('dashboard.zones')->with('success', 'Zona berhasil diperbarui.');
    }

    public function destroy(Zone $zone)
    {
        $zone->delete();

        return redirect()->route('dashboard.zones')->with('success', 'Zona berhasil dihapus.');
    }
}
