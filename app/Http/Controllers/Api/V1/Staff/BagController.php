<?php

namespace App\Http\Controllers\Api\V1\Staff;

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

        $package = Package::where('tracking_code', $request->code)->first();

        if (! $package) {
            return response()->json([
                'message' => 'Paket tidak ditemukan.',
            ], 404);
        }

        if ($package->status !== 'paid') {
            return response()->json([
                'message' => 'Paket belum lunas. Status: '.$package->status_label,
            ], 422);
        }

        if ($package->bag_id) {
            return response()->json([
                'message' => 'Paket sudah masuk dalam bag.',
            ], 422);
        }

        return response()->json([
            'package' => [
                'id' => $package->id,
                'tracking_code' => $package->tracking_code,
                'recipient_name' => $package->recipient_name,
                'recipient_phone' => $package->recipient_phone,
                'zone' => $package->zone?->name,
                'weight_actual' => $package->weight_actual,
                'final_weight' => $package->final_weight,
                'total_cost' => $package->total_cost,
                'status' => $package->status,
            ],
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'package_ids' => 'required|array|min:1',
            'package_ids.*' => 'required|integer|exists:packages,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $packages = Package::whereIn('id', $request->package_ids)
            ->where('status', 'paid')
            ->whereNull('bag_id')
            ->get();

        if ($packages->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada paket valid untuk dibuatkan bag.',
            ], 422);
        }

        return DB::transaction(function () use ($packages, $request) {
            $bag = Bag::create([
                'code' => Bag::generateCode(),
                'notes' => $request->notes,
                'total_packages' => $packages->count(),
                'total_weight' => $packages->sum('final_weight'),
            ]);

            $packages->each(function ($package) use ($bag) {
                $package->update([
                    'bag_id' => $bag->id,
                    'status' => 'bagging',
                ]);
            });

            return response()->json([
                'message' => 'Bag berhasil dibuat.',
                'bag' => [
                    'id' => $bag->id,
                    'code' => $bag->code,
                    'total_packages' => $bag->total_packages,
                    'total_weight' => $bag->total_weight,
                ],
            ]);
        });
    }
}
