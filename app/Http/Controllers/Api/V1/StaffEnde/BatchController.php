<?php

namespace App\Http\Controllers\Api\V1\StaffEnde;

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

        $batch = Batch::with(['bags' => fn ($q) => $q->withCount('packages')])->where('code', $request->code)->first();

        if (! $batch) {
            return response()->json([
                'message' => 'Batch tidak ditemukan.',
            ], 404);
        }

        if ($batch->status !== 'tiba') {
            return response()->json([
                'message' => 'Batch belum sampai. Status: '.$batch->status_label,
            ], 422);
        }

        return response()->json([
            'batch' => [
                'id' => $batch->id,
                'code' => $batch->code,
                'status' => $batch->status,
                'total_packages' => $batch->total_packages,
                'total_weight' => $batch->total_weight,
                'bags' => $batch->bags->map(fn (Bag $bag) => [
                    'id' => $bag->id,
                    'code' => $bag->code,
                    'status' => $bag->status,
                    'total_packages' => $bag->total_packages,
                    'total_weight' => $bag->total_weight,
                    'packages_count' => $bag->packages_count,
                ]),
            ],
        ]);
    }

    public function unbatch(Request $request): JsonResponse
    {
        $request->validate([
            'batch_id' => 'required|integer|exists:batches,id',
            'confirmed_bag_ids' => 'required|array|min:1',
            'confirmed_bag_ids.*' => 'required|integer|exists:bags,id',
        ]);

        $batch = Batch::findOrFail($request->batch_id);

        if ($batch->status !== 'tiba') {
            return response()->json([
                'message' => 'Batch belum sampai. Status: '.$batch->status_label,
            ], 422);
        }

        $bagCount = $batch->bags()->count();

        if (count($request->confirmed_bag_ids) !== $bagCount) {
            return response()->json([
                'message' => 'Jumlah bag yang dikonfirmasi ('.count($request->confirmed_bag_ids).') tidak cocok dengan jumlah bag dalam batch ('.$bagCount.').',
            ], 422);
        }

        return DB::transaction(function () use ($batch, $request) {
            $batch->update(['status' => 'unbatched']);

            Bag::whereIn('id', $request->confirmed_bag_ids)
                ->where('batch_id', $batch->id)
                ->update(['status' => Bag::STATUS_IN_BATCH]);

            return response()->json([
                'message' => 'Batch berhasil di-unbatch.',
                'batch' => [
                    'id' => $batch->id,
                    'code' => $batch->code,
                    'status' => $batch->status,
                    'status_label' => $batch->status_label,
                ],
            ]);
        });
    }
}
