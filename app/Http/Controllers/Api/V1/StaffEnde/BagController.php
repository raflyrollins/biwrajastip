<?php

namespace App\Http\Controllers\Api\V1\StaffEnde;

use App\Http\Controllers\Controller;
use App\Models\Bag;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BagController extends Controller
{
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $bag = Bag::with(['packages' => fn ($q) => $q->select('id', 'tracking_code', 'recipient_name', 'status')])->where('code', $request->code)->first();

        if (! $bag) {
            return response()->json([
                'message' => 'Bag tidak ditemukan.',
            ], 404);
        }

        if ($bag->status === Bag::STATUS_UNBAGGED) {
            return response()->json([
                'message' => 'Bag sudah di-unbag.',
            ], 422);
        }

        return response()->json([
            'bag' => [
                'id' => $bag->id,
                'code' => $bag->code,
                'status' => $bag->status,
                'batch_code' => $bag->batch?->code,
                'total_packages' => $bag->total_packages,
                'total_weight' => $bag->total_weight,
                'packages' => $bag->packages->map(fn (Package $pkg) => [
                    'id' => $pkg->id,
                    'tracking_code' => $pkg->tracking_code,
                    'recipient_name' => $pkg->recipient_name,
                    'status' => $pkg->status,
                    'status_label' => $pkg->status_label,
                ]),
            ],
        ]);
    }

    public function unbag(Request $request): JsonResponse
    {
        $request->validate([
            'bag_id' => 'required|integer|exists:bags,id',
            'confirmed_package_ids' => 'required|array|min:1',
            'confirmed_package_ids.*' => 'required|integer|exists:packages,id',
        ]);

        $bag = Bag::findOrFail($request->bag_id);

        if ($bag->status === Bag::STATUS_UNBAGGED) {
            return response()->json([
                'message' => 'Bag sudah di-unbag.',
            ], 422);
        }

        $packageCount = $bag->packages()->count();

        if (count($request->confirmed_package_ids) !== $packageCount) {
            return response()->json([
                'message' => 'Jumlah paket yang dikonfirmasi ('.count($request->confirmed_package_ids).') tidak cocok dengan jumlah paket dalam bag ('.$packageCount.').',
            ], 422);
        }

        return DB::transaction(function () use ($bag, $request) {
            $bag->update(['status' => Bag::STATUS_UNBAGGED]);

            Package::whereIn('id', $request->confirmed_package_ids)
                ->where('bag_id', $bag->id)
                ->update(['status' => 'tiba_di_ende']);

            return response()->json([
                'message' => 'Bag berhasil di-unbag.',
                'bag' => [
                    'id' => $bag->id,
                    'code' => $bag->code,
                    'status' => $bag->status,
                    'status_label' => $bag->status_label,
                ],
            ]);
        });
    }
}
