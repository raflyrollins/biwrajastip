<?php

namespace App\Http\Controllers\Api;

use App\Enums\PackageStatus;
use App\Events\PackageStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ScanRequest;
use App\Models\Package;
use App\Models\User;
use App\Services\EntityScopes;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PackageApiController extends Controller
{
    /**
     * Validate a scanned/entered tracking reference and return the package.
     *
     * Accepts a toko online resi, a reference number, or a biwrajastip resi.
     */
    public function validate(ScanRequest $request): JsonResponse
    {
        $user = $request->user();

        $package = $this->findByScan($request->string('code')->toString(), $user);

        if (! $package) {
            throw ValidationException::withMessages([
                'code' => 'Paket tidak ditemukan untuk nomor tersebut.',
            ]);
        }

        return response()->json([
            'package' => $this->serialize($package),
        ]);
    }

    /**
     * Collect one or more packages (registered → collected).
     */
    public function collect(Request $request): JsonResponse
    {
        $user = $request->user();

        $codes = $request->input('codes');
        if (! is_array($codes) || $codes === []) {
            throw ValidationException::withMessages([
                'codes' => 'Minimal satu nomor paket harus diisi.',
            ]);
        }

        $collected = [];

        foreach ($codes as $code) {
            $package = $this->findByScan((string) $code, $user);

            if (! $package) {
                throw ValidationException::withMessages([
                    'codes' => "Paket {$code} tidak ditemukan.",
                ]);
            }

            if ($package->status !== PackageStatus::Registered) {
                throw ValidationException::withMessages([
                    'codes' => "Paket {$code} berstatus tidak dapat dikoleksi.",
                ]);
            }

            $package->update(['status' => PackageStatus::Collected]);

            PackageStatusUpdated::dispatch($package->uuid, $package->status->value);

            $collected[] = $this->serialize($package);
        }

        return response()->json([
            'message' => count($collected).' paket berhasil dikoleksi.',
            'packages' => $collected,
        ]);
    }

    /**
     * Resolve a package by any of its supported identifiers, respecting scope.
     */
    private function findByScan(string $code, User $user): ?Package
    {
        $trimmed = trim($code);

        if ($trimmed === '') {
            return null;
        }

        return (new EntityScopes)
            ->packages($user)
            ->where(function ($q) use ($trimmed) {
                $q->where('biwrajastip_tracking_number', $trimmed)
                    ->orWhere('store_tracking_number', $trimmed)
                    ->orWhere('qr_code', $trimmed);
            })
            ->first();
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Package $package): array
    {
        return [
            'uuid' => $package->uuid,
            'biwrajastip_tracking_number' => $package->biwrajastip_tracking_number,
            'store_tracking_number' => $package->store_tracking_number,
            'receiver_name' => $package->receiver_name,
            'status' => $package->status->value,
            'created_at' => $package->created_at?->toISOString(),
        ];
    }
}
