<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Ship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 15), 100);

        $query = Schedule::query()->with('ship');

        if ($search = $request->get('search')) {
            $query->whereHas('ship', fn ($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($dateFrom = $request->get('date_from')) {
            $query->whereDate('departure_date', '>=', $dateFrom);
        }

        if ($dateTo = $request->get('date_to')) {
            $query->whereDate('departure_date', '<=', $dateTo);
        }

        if ($year = $request->get('year')) {
            $query->whereYear('departure_date', $year);
        }

        return Inertia::render('dashboard/schedules/Index', [
            'schedules' => $query
                ->orderBy('departure_date', 'desc')
                ->paginate($perPage)
                ->onEachSide(1)
                ->withQueryString()
                ->through(fn (Schedule $schedule) => [
                    'uuid' => $schedule->uuid,
                    'ship' => ['uuid' => $schedule->ship->uuid, 'name' => $schedule->ship->name],
                    'departure_date' => $schedule->departure_date?->format('Y-m-d'),
                    'arrival_date' => $schedule->arrival_date?->format('Y-m-d'),
                    'notes' => $schedule->notes,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/schedules/Form', [
            'ships' => Ship::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Ship $ship) => ['value' => $ship->uuid, 'label' => $ship->name]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ship_id' => 'required|exists:ships,uuid',
            'departure_date' => 'required|date',
            'arrival_date' => 'nullable|date|after_or_equal:departure_date',
            'notes' => 'nullable|string',
        ]);

        $ship = Ship::where('uuid', $validated['ship_id'])->firstOrFail();
        $validated['ship_id'] = $ship->id;

        Schedule::create($validated);

        return redirect()->route('dashboard.schedules')->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Schedule $schedule)
    {
        $schedule->load('ship');

        return Inertia::render('dashboard/schedules/Form', [
            'schedule' => [
                'uuid' => $schedule->uuid,
                'ship_id' => $schedule->ship->uuid,
                'departure_date' => $schedule->departure_date,
                'arrival_date' => $schedule->arrival_date,
                'notes' => $schedule->notes,
            ],
            'ships' => Ship::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Ship $ship) => ['value' => $ship->uuid, 'label' => $ship->name]),
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'ship_id' => 'required|exists:ships,uuid',
            'departure_date' => 'required|date',
            'arrival_date' => 'nullable|date|after_or_equal:departure_date',
            'notes' => 'nullable|string',
        ]);

        $ship = Ship::where('uuid', $validated['ship_id'])->firstOrFail();
        $validated['ship_id'] = $ship->id;

        $schedule->update($validated);

        return redirect()->route('dashboard.schedules')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('dashboard.schedules')->with('success', 'Jadwal berhasil dihapus.');
    }
}
