<?php

namespace App\Http\Controllers\Api;

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\Schedule;
use App\Models\Ship;
use App\Models\Zone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BiwraHubController
{
    public function collecting(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_number' => ['required', 'string'],
        ]);

        $package = Package::where('tracking_number', $validated['tracking_number'])
            ->where('status', PackageStatus::WaitingForCollection)
            ->first();

        if (! $package) {
            return response()->json([
                'success' => false,
                'message' => 'Paket tidak ditemukan atau status tidak sesuai.',
            ], 404);
        }

        $package->update([
            'status' => PackageStatus::Collected,
            'collected_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'package' => $package->fresh(),
        ]);
    }

    public function bagging(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_ids' => ['required', 'array', 'min:1'],
            'package_ids.*' => ['string', 'exists:packages,uuid'],
        ]);

        $packages = Package::whereIn('uuid', $validated['package_ids'])->get();

        $allowedStatuses = [PackageStatus::Collected->value, PackageStatus::Paid->value];
        $invalidStatus = $packages->first(fn ($p) => ! in_array((string) $p->status, $allowedStatuses, true));

        if ($invalidStatus) {
            return response()->json([
                'success' => false,
                'message' => 'Paket '.$invalidStatus->tracking_number.' berstatus tidak valid, tidak dapat di-bagging.',
            ], 422);
        }

        $bag = Bag::create([
            'status' => BagStatus::Created,
            'created_by' => $request->user()->id,
        ]);

        Package::whereIn('uuid', $validated['package_ids'])->update([
            'bag_id' => $bag->id,
            'status' => PackageStatus::Bagging,
        ]);

        $bag->refresh();

        return response()->json([
            'success' => true,
            'bag' => $bag,
            'packages' => $packages->fresh(),
        ]);
    }

    public function batching(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bag_ids' => ['required', 'array', 'min:1'],
            'bag_ids.*' => ['string', 'exists:bags,uuid'],
            'ship_id' => ['required', 'string', 'exists:ships,uuid'],
            'schedule_id' => ['required', 'string', 'exists:schedules,uuid'],
            'departure_date' => ['required', 'date'],
        ]);

        $bags = Bag::whereIn('uuid', $validated['bag_ids'])->get();

        $allowedStatuses = [BagStatus::Created->value, BagStatus::Unbagged->value];
        $invalidBags = $bags->first(fn ($b) => ! in_array((string) $b->status, $allowedStatuses, true));

        if ($invalidBags) {
            return response()->json([
                'success' => false,
                'message' => 'Bag '.$invalidBags->code.' berstatus tidak valid, tidak dapat di-batching.',
            ], 422);
        }

        $ship = Ship::where('uuid', $validated['ship_id'])->firstOrFail();
        $schedule = Schedule::where('uuid', $validated['schedule_id'])->firstOrFail();

        $batch = Batch::create([
            'ship_id' => $ship->id,
            'schedule_id' => $schedule->id,
            'departure_date' => $validated['departure_date'],
            'status' => BatchStatus::Preparing,
            'created_by' => $request->user()->id,
        ]);

        Bag::whereIn('uuid', $validated['bag_ids'])->update([
            'batch_id' => $batch->id,
            'status' => BagStatus::InBatch,
        ]);

        foreach ($bags as $bag) {
            Package::where('bag_id', $bag->id)->update([
                'batch_id' => $batch->id,
                'status' => PackageStatus::BerangkatKePelabuhan,
            ]);
        }

        return response()->json([
            'success' => true,
            'batch' => $batch->fresh()->load(['ship', 'schedule']),
            'bags' => $bags->fresh(),
        ]);
    }

    public function kapalBerangkat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_id' => ['required', 'string', 'exists:batches,uuid'],
        ]);

        $batch = Batch::where('uuid', $validated['batch_id'])->firstOrFail();

        if ((string) $batch->status !== BatchStatus::Preparing->value) {
            return response()->json([
                'success' => false,
                'message' => 'Batch tidak dalam status preparing, tidak dapat diberangkatkan.',
            ], 422);
        }

        $batch->update(['status' => BatchStatus::Departed]);

        Package::where('batch_id', $batch->id)
            ->where('status', PackageStatus::BerangkatKePelabuhan)
            ->update(['status' => PackageStatus::InTransit]);

        return response()->json(['success' => true]);
    }

    public function kapalSampai(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_id' => ['required', 'string', 'exists:batches,uuid'],
        ]);

        $batch = Batch::where('uuid', $validated['batch_id'])->firstOrFail();

        if ((string) $batch->status !== BatchStatus::Departed->value) {
            return response()->json([
                'success' => false,
                'message' => 'Batch belum berangkat, tidak dapat ditandai sampai.',
            ], 422);
        }

        $batch->update(['status' => BatchStatus::Arrived]);

        Package::where('batch_id', $batch->id)
            ->where('status', PackageStatus::InTransit)
            ->update(['status' => PackageStatus::Arrived]);

        return response()->json(['success' => true]);
    }

    public function unbatching(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_id' => ['required', 'string', 'exists:batches,uuid'],
        ]);

        $batch = Batch::where('uuid', $validated['batch_id'])->firstOrFail();

        $batch->update(['status' => BatchStatus::Unbatched]);

        $bags = Bag::where('batch_id', $batch->id)->get();

        return response()->json([
            'success' => true,
            'bags' => $bags,
        ]);
    }

    public function unbagging(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bag_id' => ['required', 'string', 'exists:bags,uuid'],
        ]);

        $bag = Bag::where('uuid', $validated['bag_id'])->firstOrFail();

        $bag->update(['status' => BagStatus::Unbagged]);

        Package::where('bag_id', $bag->id)->update([
            'bag_id' => null,
            'batch_id' => null,
            'status' => PackageStatus::ReadyForSorting,
        ]);

        $packages = Package::where('bag_id', $bag->id)->get();

        return response()->json([
            'success' => true,
            'packages' => $packages,
        ]);
    }

    public function sorting(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'string', 'exists:packages,uuid'],
            'result' => ['required', 'string', 'in:siap_diambil,dalam_pengantaran'],
        ]);

        $package = Package::where('uuid', $validated['package_id'])->firstOrFail();

        $newStatus = $validated['result'] === 'siap_diambil'
            ? PackageStatus::SiapDiambil
            : PackageStatus::DalamPengantaran;

        $package->update(['status' => $newStatus]);

        return response()->json(['success' => true]);
    }

    public function ending(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'string', 'exists:packages,uuid'],
            'recipient_photo' => ['required', 'string'],
            'recipient_name' => ['required', 'string', 'max:255'],
        ]);

        $package = Package::where('uuid', $validated['package_id'])->firstOrFail();

        $package->update([
            'status' => PackageStatus::Selesai,
            'recipient_photo' => $validated['recipient_photo'],
            'recipient_name' => $validated['recipient_name'],
        ]);

        return response()->json(['success' => true]);
    }

    public function scan(string $code): JsonResponse
    {
        $package = Package::where('tracking_number', $code)
            ->orWhere('tracking_number_biwra', $code)
            ->first();

        if ($package) {
            return response()->json([
                'type' => 'package',
                'data' => $package->load(['zone', 'bag', 'batch.ship', 'batch.schedule']),
            ]);
        }

        $bag = Bag::where('code', $code)->first();

        if ($bag) {
            return response()->json([
                'type' => 'bag',
                'data' => $bag->load(['packages', 'batch']),
            ]);
        }

        $batch = Batch::where('code', $code)->first();

        if ($batch) {
            return response()->json([
                'type' => 'batch',
                'data' => $batch->load(['bags.packages', 'ship', 'schedule']),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Kode tidak ditemukan.',
        ], 404);
    }

    public function staffPackages(Request $request): JsonResponse
    {
        $user = $request->user();

        $packages = Package::query();

        if ($user->hasRole('staff_surabaya')) {
            $packages->whereIn('status', [
                PackageStatus::Collected,
                PackageStatus::WaitingForPayment,
                PackageStatus::Paid,
                PackageStatus::Bagging,
            ]);
        } elseif ($user->hasRole('staff_ende')) {
            $packages->whereIn('status', [
                PackageStatus::InTransit,
                PackageStatus::Arrived,
                PackageStatus::ReadyForSorting,
                PackageStatus::SiapDiambil,
                PackageStatus::DalamPengantaran,
                PackageStatus::Selesai,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Akses tidak diizinkan.',
            ], 403);
        }

        return response()->json([
            'packages' => $packages->with(['zone', 'bag', 'batch'])->orderByDesc('created_at')->get(),
        ]);
    }

    public function options(): JsonResponse
    {
        return response()->json([
            'ships' => Ship::where('is_active', true)->orderBy('name')->get(['uuid', 'name']),
            'schedules' => Schedule::with('ship')->orderBy('departure_date')->get(['uuid', 'ship_id', 'departure_date', 'arrival_date']),
            'zones' => Zone::orderBy('name')->get(['uuid', 'name', 'delivery_fee']),
        ]);
    }
}
