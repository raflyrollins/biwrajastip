<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HasFilters
{
    protected function applyFilters(Builder $query, Request $request, array $searchColumns = []): Builder
    {
        if ($search = $request->get('search')) {
            $query->where(function (Builder $q) use ($search, $searchColumns) {
                foreach ($searchColumns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        if ($dateFrom = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        if ($year = $request->get('year')) {
            $query->whereYear('created_at', $year);
        }

        return $query;
    }
}
