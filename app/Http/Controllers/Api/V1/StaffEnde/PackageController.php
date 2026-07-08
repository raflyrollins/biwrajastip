<?php

namespace App\Http\Controllers\Api\V1\StaffEnde;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'tracking_code' => 'required|string|max:255',
        ]);

        $package = Package::where('tracking_code', $request->tracking_code)->first();

        if (! $package) {
            return response()->json([
                'message' => 'Paket tidak ditemukan.',
            ], 404);
        }

        if ($package->status !== 'tiba_di_ende') {
            return response()->json([
                'message' => 'Paket belum siap disortir. Status: '.$package->status_label,
            ], 422);
        }

        return response()->json([
            'package' => [
                'id' => $package->id,
                'tracking_code' => $package->tracking_code,
                'sender_name' => $package->sender_name,
                'sender_store' => $package->sender_store,
                'sender_tracking_number' => $package->sender_tracking_number,
                'recipient_name' => $package->recipient_name,
                'recipient_phone' => $package->recipient_phone,
                'status' => $package->status,
                'status_label' => $package->status_label,
            ],
        ]);
    }

    public function sort(Request $request): JsonResponse
    {
        $request->validate([
            'package_ids' => 'required|array|min:1',
            'package_ids.*' => 'required|integer|exists:packages,id',
        ]);

        $updated = Package::whereIn('id', $request->package_ids)
            ->where('status', 'tiba_di_ende')
            ->update(['status' => 'disortir']);

        return response()->json([
            'message' => $updated.' paket berhasil disortir.',
            'updated' => $updated,
        ]);
    }
}
