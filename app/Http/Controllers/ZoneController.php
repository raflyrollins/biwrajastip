<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\HasFilters;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ZoneController extends Controller
{
    use HasFilters;

    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 15), 100);

        $query = Zone::query()->orderBy('name');

        $this->applyFilters($query, $request, ['name']);

        return Inertia::render('dashboard/zones/Index', [
            'zones' => $query
                ->paginate($perPage)
                ->onEachSide(1)
                ->withQueryString()
                ->through(fn (Zone $zone) => [
                    'uuid' => $zone->uuid,
                    'name' => $zone->name,
                    'delivery_fee' => $zone->delivery_fee,
                    'shipping_price' => $zone->shipping_price,
                    'is_central' => $zone->is_central,
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
            'shipping_price' => 'required|numeric|min:0',
            'is_central' => 'boolean',
            'description' => 'nullable|string',
        ]);

        if ($validated['is_central'] ?? false) {
            $validated['delivery_fee'] = 0;
        }

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
                'shipping_price' => $zone->shipping_price,
                'is_central' => $zone->is_central,
                'description' => $zone->description,
            ],
        ]);
    }

    public function update(Request $request, Zone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'delivery_fee' => 'required|numeric|min:0',
            'shipping_price' => 'required|numeric|min:0',
            'is_central' => 'boolean',
            'description' => 'nullable|string',
        ]);

        if ($validated['is_central'] ?? false) {
            $validated['delivery_fee'] = 0;
        }

        $zone->update($validated);

        return redirect()->route('dashboard.zones')->with('success', 'Zona berhasil diperbarui.');
    }

    public function destroy(Zone $zone)
    {
        $zone->delete();

        return redirect()->route('dashboard.zones')->with('success', 'Zona berhasil dihapus.');
    }
}
