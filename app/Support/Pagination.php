<?php

namespace App\Support;

use Illuminate\Pagination\LengthAwarePaginator;

class Pagination
{
    /**
     * Reshape a LengthAwarePaginator into a { data, meta } structure that the
     * frontend PaginationMeta type + Pagination component expect. Inertia
     * otherwise serializes a paginator to a flat array (current_page, links,
     * total, ...) which the client types do not match.
     *
     * @param  LengthAwarePaginator<int, mixed>  $paginator
     * @return array{ data: array<int, mixed>, meta: array<string, mixed> }
     */
    public static function toNested(LengthAwarePaginator $paginator): array
    {
        $flat = $paginator->toArray();

        return [
            'data' => $flat['data'],
            'meta' => [
                'total' => $flat['total'],
                'current_page' => $flat['current_page'],
                'last_page' => $flat['last_page'],
                'per_page' => $flat['per_page'],
                'links' => $flat['links'],
                'from' => $flat['from'] ?? null,
                'to' => $flat['to'] ?? null,
                'first_page_url' => $flat['first_page_url'] ?? null,
                'last_page_url' => $flat['last_page_url'] ?? null,
                'next_page_url' => $flat['next_page_url'] ?? null,
                'prev_page_url' => $flat['prev_page_url'] ?? null,
                'path' => $flat['path'] ?? null,
            ],
        ];
    }
}
