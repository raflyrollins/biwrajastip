<?php

namespace App\Http\Controllers\Api\V1\Staff;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageScanController extends Controller
{
    public function scan(Request $request): JsonResponse
    {
        $request->validate([
            'sender_tracking_numbers' => 'required|array|min:1',
            'sender_tracking_numbers.*' => 'required|string|max:255',
        ]);

        $inputs = $request->sender_tracking_numbers;

        $packages = Package::whereIn('sender_tracking_number', $inputs)
            ->get()
            ->keyBy('sender_tracking_number');

        $valid = [];
        $invalid = [];

        foreach ($inputs as $input) {
            $package = $packages->get($input);

            if (! $package) {
                $invalid[] = [
                    'sender_tracking_number' => $input,
                    'reason' => 'Paket tidak ditemukan.',
                ];

                continue;
            }

            if ($package->status !== 'waiting_for_collection') {
                $invalid[] = [
                    'sender_tracking_number' => $input,
                    'reason' => 'Status paket sudah "'.$package->status_label.'".',
                ];

                continue;
            }

            $valid[] = [
                'id' => $package->id,
                'tracking_code' => $package->tracking_code,
                'sender_tracking_number' => $package->sender_tracking_number,
                'recipient_name' => $package->recipient_name,
                'status' => $package->status,
            ];
        }

        return response()->json([
            'valid' => $valid,
            'invalid' => $invalid,
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'sender_tracking_numbers' => 'required|array|min:1',
            'sender_tracking_numbers.*' => 'required|string|max:255',
        ]);

        $updated = Package::whereIn('sender_tracking_number', $request->sender_tracking_numbers)
            ->where('status', 'waiting_for_collection')
            ->update(['status' => 'collected']);

        return response()->json([
            'message' => $updated.' paket berhasil dikumpulkan.',
            'updated' => $updated,
        ]);
    }
}
