<?php

namespace App\Http\Controllers\Api;

use App\Enums\BagStatus;
use App\Enums\PackageStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ScanRequest;
use App\Models\Bag;
use App\Models\Package;
use App\Services\EntityScopes;
use App\Support\NumberGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BagApiController extends Controller
{
    /**
     * Validate a bag (by number / QR) and return it with its packages.
     */
    public function validate(ScanRequest $request): JsonResponse
    {
        $user = $request->user();

        $code = trim($request->string('code')->toString());

        $bag = (new EntityScopes)
            ->bags($user)
            ->where('bag_number', $code)
            ->with(['packages' => fn ($q) => $q->select('packages.id', 'packages.uuid', 'packages.biwrajastip_tracking_number', 'packages.store_tracking_number')])
            ->first();

        if (! $bag) {
            throw ValidationException::withMessages([
                'code' => 'Bag tidak ditemukan untuk nomor tersebut.',
            ]);
        }

        return response()->json([
            'bag' => [
                'uuid' => $bag->uuid,
                'bag_number' => $bag->bag_number,
                'status' => $bag->status->value,
                'package_count' => $bag->package_count,
                'packages' => $bag->packages->map(fn (Package $p) => [
                    'uuid' => $p->uuid,
                    'biwrajastip_tracking_number' => $p->biwrajastip_tracking_number,
                    'store_tracking_number' => $p->store_tracking_number,
                ]),
            ],
        ]);
    }

    /**
     * Create a bag from a set of already-paid packages.
     */
    public function create(Request $request): JsonResponse
    {
        $user = $request->user();

        $codes = $request->input('codes');
        if (! is_array($codes) || $codes === []) {
            throw ValidationException::withMessages([
                'codes' => 'Minimal satu nomor paket harus diisi.',
            ]);
        }

        $packages = [];

        foreach ($codes as $code) {
            $trimmed = trim((string) $code);
            $package = (new EntityScopes)
                ->packages($user)
                ->where(function ($q) use ($trimmed) {
                    $q->where('biwrajastip_tracking_number', $trimmed)
                        ->orWhere('store_tracking_number', $trimmed)
                        ->orWhere('qr_code', $trimmed);
                })
                ->first();

            if (! $package) {
                throw ValidationException::withMessages([
                    'codes' => "Paket {$trimmed} tidak ditemukan.",
                ]);
            }

            if ($package->status !== PackageStatus::Paid) {
                throw ValidationException::withMessages([
                    'codes' => "Paket {$trimmed} belum lunas dan tidak dapat di-bagging.",
                ]);
            }

            $packages[] = $package;
        }

        $bag = DB::transaction(function () use ($packages, $user) {
            $bag = Bag::create([
                'bag_number' => (new NumberGenerator)->nextBagNumber(),
                'status' => BagStatus::Bagged,
                'package_count' => count($packages),
                'created_by' => $user->id,
            ]);

            foreach ($packages as $position => $package) {
                $bag->packages()->attach($package->id, ['position' => $position + 1]);
                $package->update(['status' => PackageStatus::Bagged]);
            }

            return $bag;
        });

        return response()->json([
            'message' => 'Bag berhasil dibuat.',
            'bag' => [
                'uuid' => $bag->uuid,
                'bag_number' => $bag->bag_number,
                'status' => $bag->status->value,
                'package_count' => $bag->package_count,
            ],
        ], 201);
    }
}
