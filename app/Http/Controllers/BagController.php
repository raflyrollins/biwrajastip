<?php

namespace App\Http\Controllers;

use App\Enums\BagStatus;
use App\Http\Controllers\Traits\HasFilters;
use App\Models\Bag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BagController extends Controller
{
    use HasFilters;

    public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 20), 100);

        $query = Bag::withCount('packages')
            ->with(['creator', 'batch'])
            ->latest();

        $user = $request->user();

        $scopes = $user->roles()->with('permissions')->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->unique();

        if ($scopes->contains('bags.scope.all')) {
            // no filter
        } elseif ($scopes->contains('bags.scope.own')
            || $scopes->contains('bags.scope.unbagged')
        ) {
            $query->where(function ($q) use ($scopes, $user) {
                if ($scopes->contains('bags.scope.own')) {
                    $q->orWhere('created_by', $user->id)
                      ->orWhereIn('batch_id', function ($sub) use ($user) {
                          $sub->select('id')->from('batches')->where('created_by', $user->id);
                      });
                }

                if ($scopes->contains('bags.scope.unbagged')) {
                    $q->orWhere('status', BagStatus::Unbagged);
                }
            });
        } else {
            $query->where('created_by', $user->id);
        }

        $this->applyFilters($query, $request, ['code']);
        $bags = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('dashboard/bags/Index', [
            'bags' => $bags,
        ]);
    }

    public function showLabel(string $uuid)
    {
        $bag = Bag::where('uuid', $uuid)
            ->with(['packages.zone', 'batch'])
            ->firstOrFail();

        return Inertia::render('dashboard/bags/Label', [
            'bag' => $bag,
        ]);
    }
}
