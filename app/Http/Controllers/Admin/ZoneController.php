<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Zone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ZoneController extends Controller
{
    public function index(Request $request): Response
    {
        $zones = Zone::orderBy('name')->get();

        return Inertia::render('admin/zones', [
            'zones' => $zones,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:zones,name'],
            'tarif_per_kg' => ['required', 'integer', 'min:0'],
            'biaya_antar' => ['required', 'integer', 'min:0'],
        ]);

        Zone::create($validated);

        return redirect()->route('admin.zones')->with('success', 'Zona berhasil ditambahkan.');
    }

    public function update(Request $request, Zone $zone)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:zones,name,'.$zone->id],
            'tarif_per_kg' => ['sometimes', 'integer', 'min:0'],
            'biaya_antar' => ['sometimes', 'integer', 'min:0'],
        ]);

        $zone->update($validated);

        return redirect()->route('admin.zones')->with('success', 'Zona berhasil diperbarui.');
    }

    public function destroy(Zone $zone)
    {
        $zone->delete();

        return redirect()->route('admin.zones')->with('success', 'Zona berhasil dihapus.');
    }
}
