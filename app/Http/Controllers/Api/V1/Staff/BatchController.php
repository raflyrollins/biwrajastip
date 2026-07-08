<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use App\Models\Batch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BatchController extends Controller
{
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $bag = Bag::where('code', $request->code)->first();

        if (! $bag) {
            return response()->json([
                'message' => 'Bag tidak ditemukan.',
            ], 404);
        }

        if ($bag->batch_id) {
            return response()->json([
                'message' => 'Bag sudah masuk dalam batch.',
            ], 422);
        }

        return response()->json([
            'bag' => [
                'id' => $bag->id,
                'code' => $bag->code,
                'total_packages' => $bag->total_packages,
                'total_weight' => $bag->total_weight,
                'created_at' => $bag->created_at->toIso8601String(),
            ],
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'bag_ids' => 'required|array|min:1',
            'bag_ids.*' => 'required|integer|exists:bags,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $bags = Bag::whereIn('id', $request->bag_ids)
            ->whereNull('batch_id')
            ->get();

        if ($bags->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada bag valid untuk dibuatkan batch.',
            ], 422);
        }

        return DB::transaction(function () use ($bags, $request) {
            $batch = Batch::create([
                'code' => Batch::generateCode(),
                'notes' => $request->notes,
                'total_packages' => $bags->sum('total_packages'),
                'total_weight' => $bags->sum('total_weight'),
            ]);

            $bags->each(function ($bag) use ($batch) {
                $bag->update(['batch_id' => $batch->id]);
            });

            return response()->json([
                'message' => 'Batch berhasil dibuat.',
                'batch' => [
                    'id' => $batch->id,
                    'code' => $batch->code,
                    'total_packages' => $batch->total_packages,
                    'total_weight' => $batch->total_weight,
                ],
            ]);
        });
    }
}
