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
use Illuminate\Support\Facades\DB;

class BiwraHubController
{
    public function collecting(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_numbers' => ['required', 'array', 'min:1'],
            'tracking_numbers.*' => ['required', 'string'],
        ]);

        $codes = $validated['tracking_numbers'];

        return DB::transaction(function () use ($codes) {
            $packages = Package::where(function ($q) use ($codes) {
                $q->whereIn('tracking_number', $codes)
                    ->orWhereIn('tracking_number_biwra', $codes);
            })->lockForUpdate()->get();

            $found = $packages->pluck('tracking_number')->merge(
                $packages->pluck('tracking_number_biwra')
            )->filter()->values()->toArray();

            $notFound = array_diff($codes, $found);

            if (! empty($notFound)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket tidak ditemukan: ' . implode(', ', $notFound),
                    'not_found' => array_values($notFound),
                ], 404);
            }

            $invalid = $packages->first(fn($p) => $p->status !== PackageStatus::WaitingForCollection);

            if ($invalid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket ' . $invalid->tracking_number . ' berstatus ' . $invalid->status->value . ', tidak dapat dikoleksi.',
                    'invalid_package' => $invalid->tracking_number,
                ], 422);
            }

            $now = now();

            Package::whereIn('id', $packages->pluck('id'))->update([
                'status' => PackageStatus::Collected,
                'collected_at' => $now,
            ]);

            return response()->json([
                'success' => true,
                'packages' => $packages->fresh(),
            ]);
        });
    }

    public function bagging(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_numbers' => ['required', 'array', 'min:1'],
            'tracking_numbers.*' => ['required', 'string'],
        ]);

        $codes = $validated['tracking_numbers'];

        return DB::transaction(function () use ($codes, $request) {
            $packages = Package::where(function ($q) use ($codes) {
                $q->whereIn('tracking_number', $codes)
                    ->orWhereIn('tracking_number_biwra', $codes);
            })->lockForUpdate()->get();

            $found = $packages->pluck('tracking_number')->merge(
                $packages->pluck('tracking_number_biwra')
            )->filter()->values()->toArray();

            $notFound = array_diff($codes, $found);

            if (! empty($notFound)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket tidak ditemukan: ' . implode(', ', $notFound),
                    'not_found' => array_values($notFound),
                ], 404);
            }

            $invalid = $packages->first(fn($p) => $p->status !== PackageStatus::Paid);

            if ($invalid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket ' . $invalid->tracking_number . ' berstatus ' . $invalid->status->value . ', tidak dapat di-bagging.',
                    'invalid_package' => $invalid->tracking_number,
                ], 422);
            }

            $bag = Bag::create([
                'status' => BagStatus::Created,
                'created_by' => $request->user()->id,
            ]);

            Package::whereIn('id', $packages->pluck('id'))->update([
                'bag_id' => $bag->id,
                'status' => PackageStatus::Bagging,
            ]);

            $bag->refresh();

            return response()->json([
                'success' => true,
                'bag' => $bag,
                'packages' => $packages->fresh(),
            ]);
        });
    }

    public function batching(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bag_codes' => ['required', 'array', 'min:1'],
            'bag_codes.*' => ['required', 'string', 'exists:bags,code'],
            'ship_id' => ['required', 'string', 'exists:ships,uuid'],
            'schedule_id' => ['required', 'string', 'exists:schedules,uuid'],
            'departure_date' => ['required', 'date'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $bags = Bag::whereIn('code', $validated['bag_codes'])
                ->lockForUpdate()
                ->get();

            $allowedStatuses = [BagStatus::Created->value, BagStatus::Unbagged->value];
            $invalid = $bags->first(fn($b) => ! in_array($b->status->value, $allowedStatuses, true));

            if ($invalid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bag ' . $invalid->code . ' berstatus tidak valid, tidak dapat di-batching.',
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

            Bag::whereIn('code', $validated['bag_codes'])->update([
                'batch_id' => $batch->id,
                'status' => BagStatus::InBatch,
            ]);

            foreach ($bags as $bag) {
                Package::where('bag_id', $bag->id)->update([
                    'batch_id' => $batch->id,
                    'status' => PackageStatus::Batched,
                ]);
            }

            return response()->json([
                'success' => true,
                'batch' => $batch->fresh()->load(['ship', 'schedule']),
                'bags' => $bags->fresh(),
            ]);
        });
    }

    public function sendToPort(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_code' => ['required', 'string', 'exists:batches,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $batch = Batch::where('code', $validated['batch_code'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($batch->status !== BatchStatus::Preparing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Batch tidak dalam status preparing, tidak dapat dikirim ke pelabuhan.',
                ], 422);
            }

            Package::where('batch_id', $batch->id)
                ->where('status', PackageStatus::Batched)
                ->update(['status' => PackageStatus::HeadingToPort]);

            return response()->json(['success' => true]);
        });
    }

    public function arriveAtPort(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_code' => ['required', 'string', 'exists:batches,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $batch = Batch::where('code', $validated['batch_code'])
                ->lockForUpdate()
                ->firstOrFail();

            Package::where('batch_id', $batch->id)
                ->where('status', PackageStatus::HeadingToPort)
                ->update(['status' => PackageStatus::AtPort]);

            $batch->update(['status' => BatchStatus::Preparing]);

            return response()->json(['success' => true]);
        });
    }

    public function shipDepart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_code' => ['required', 'string', 'exists:batches,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $batch = Batch::where('code', $validated['batch_code'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($batch->status !== BatchStatus::Preparing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Batch tidak dalam status preparing, tidak dapat diberangkatkan.',
                ], 422);
            }

            $batch->update(['status' => BatchStatus::Departed]);

            Package::where('batch_id', $batch->id)
                ->whereIn('status', [
                    PackageStatus::Batched->value,
                    PackageStatus::HeadingToPort->value,
                    PackageStatus::AtPort->value,
                ])
                ->update(['status' => PackageStatus::InTransit]);

            return response()->json(['success' => true]);
        });
    }

    public function shipArrive(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_code' => ['required', 'string', 'exists:batches,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $batch = Batch::where('code', $validated['batch_code'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($batch->status !== BatchStatus::Departed) {
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
        });
    }

    public function unbatching(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'batch_code' => ['required', 'string', 'exists:batches,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $batch = Batch::where('code', $validated['batch_code'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($batch->status !== BatchStatus::Arrived) {
                return response()->json([
                    'success' => false,
                    'message' => 'Batch harus dalam status arrived untuk di-unbatch.',
                ], 422);
            }

            $batch->update(['status' => BatchStatus::Unbatched]);

            Package::where('batch_id', $batch->id)
                ->where('status', PackageStatus::Arrived)
                ->update(['status' => PackageStatus::ArrivedAtWarehouse]);

            $bags = Bag::where('batch_id', $batch->id)->get();

            return response()->json([
                'success' => true,
                'bags' => $bags,
            ]);
        });
    }

    public function unbagging(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bag_code' => ['required', 'string', 'exists:bags,code'],
        ]);

        return DB::transaction(function () use ($validated) {
            $bag = Bag::where('code', $validated['bag_code'])
                ->lockForUpdate()
                ->firstOrFail();

            $packages = Package::where('bag_id', $bag->id)->get();

            $bag->update(['status' => BagStatus::Unbagged]);

            Package::where('bag_id', $bag->id)->update([
                'bag_id' => null,
                'batch_id' => null,
                'status' => PackageStatus::ReadyForSorting,
            ]);

            return response()->json([
                'success' => true,
                'packages' => $packages,
            ]);
        });
    }

    public function sorting(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_number' => ['required', 'string'],
            'result' => ['required', 'string', 'in:ready_for_pickup,in_delivery'],
        ]);

        $package = Package::where('tracking_number', $validated['tracking_number'])
            ->orWhere('tracking_number_biwra', $validated['tracking_number'])
            ->first();

        if (! $package) {
            return response()->json([
                'success' => false,
                'message' => 'Paket tidak ditemukan.',
            ], 404);
        }

        if ($package->status !== PackageStatus::ReadyForSorting) {
            return response()->json([
                'success' => false,
                'message' => 'Paket belum siap untuk sorting (status: ' . $package->status->value . ').',
            ], 422);
        }

        $newStatus = match ($validated['result']) {
            'ready_for_pickup' => PackageStatus::ReadyForPickup,
            'in_delivery' => PackageStatus::InDelivery,
        };

        $package->update(['status' => $newStatus]);

        return response()->json(['success' => true]);
    }

    public function ending(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracking_number' => ['required', 'string'],
            'recipient_photo' => ['required', 'string', 'max:2048'],
            'recipient_name' => ['required', 'string', 'max:255'],
        ]);

        $package = Package::where('tracking_number', $validated['tracking_number'])
            ->orWhere('tracking_number_biwra', $validated['tracking_number'])
            ->first();

        if (! $package) {
            return response()->json([
                'success' => false,
                'message' => 'Paket tidak ditemukan.',
            ], 404);
        }

        $package->update([
            'status' => PackageStatus::Completed,
            'recipient_photo' => $validated['recipient_photo'],
            'recipient_name' => $validated['recipient_name'],
        ]);

        return response()->json(['success' => true]);
    }

    private function validatePackageForModule(Package $item, ?string $module): array
    {
        if (! $module) {
            return ['valid' => true, 'message' => 'Paket ditemukan'];
        }

        $canProcess = match ($module) {
            'collecting' => $item->status === PackageStatus::WaitingForCollection,
            'bagging' => $item->status === PackageStatus::Paid,
            'sorting' => $item->status === PackageStatus::ReadyForSorting,
            'ending' => in_array($item->status, [PackageStatus::ReadyForPickup, PackageStatus::InDelivery], true),
            default => true,
        };

        $message = match ($module) {
            'collecting' => $canProcess ? 'Siap dikoleksi' : 'Status: ' . $item->status->value,
            'bagging' => $canProcess ? 'Siap di-bagging' : 'Status: ' . $item->status->value,
            'sorting' => $canProcess ? 'Siap sorting' : 'Status: ' . $item->status->value,
            'ending' => $canProcess ? 'Siap di-ending' : 'Status: ' . $item->status->value,
            default => 'Paket ditemukan',
        };

        return ['valid' => $canProcess, 'message' => $message];
    }

    private function validateBagForModule(Bag $item, ?string $module): array
    {
        if (! $module) {
            return ['valid' => true, 'message' => 'Bag ditemukan'];
        }

        $canProcess = match ($module) {
            'batching' => in_array($item->status, [BagStatus::Created, BagStatus::Unbagged], true),
            'unbagging' => $item->status === BagStatus::InBatch,
            default => true,
        };

        $message = match ($module) {
            'batching' => $canProcess ? 'Siap di-batch' : 'Status: ' . $item->status->value,
            'unbagging' => $canProcess ? 'Siap di-unbagging' : 'Status: ' . $item->status->value,
            default => 'Bag ditemukan',
        };

        return ['valid' => $canProcess, 'message' => $message];
    }

    private function validateBatchForModule(Batch $item, ?string $module): array
    {
        if (! $module) {
            return ['valid' => true, 'message' => 'Batch ditemukan'];
        }

        $canProcess = match ($module) {
            'send-to-port', 'ship-depart' => $item->status === BatchStatus::Preparing,
            'ship-arrive' => $item->status === BatchStatus::Departed,
            'unbatching' => $item->status === BatchStatus::Arrived,
            default => true,
        };

        $message = match ($module) {
            'send-to-port', 'ship-depart' => $canProcess ? 'Siap diproses' : 'Status: ' . $item->status->value,
            'ship-arrive' => $canProcess ? 'Siap tiba' : 'Status: ' . $item->status->value,
            'unbatching' => $canProcess ? 'Siap di-unbatch' : 'Status: ' . $item->status->value,
            default => 'Batch ditemukan',
        };

        return ['valid' => $canProcess, 'message' => $message];
    }

    public function scan(string $code, Request $request): JsonResponse
    {
        $module = $request->query('module');

        $package = Package::where('tracking_number', $code)
            ->orWhere('tracking_number_biwra', $code)
            ->with(['zone', 'bag', 'batch.ship', 'batch.schedule'])
            ->first();

        if ($package) {
            return response()->json([
                'type' => 'package',
                ...$this->validatePackageForModule($package, $module),
                'data' => $package,
            ]);
        }

        $bag = Bag::where('code', $code)
            ->with(['packages', 'batch'])
            ->first();

        if ($bag) {
            return response()->json([
                'type' => 'bag',
                ...$this->validateBagForModule($bag, $module),
                'data' => $bag,
            ]);
        }

        $batch = Batch::where('code', $code)
            ->with(['bags.packages', 'ship', 'schedule'])
            ->first();

        if ($batch) {
            return response()->json([
                'type' => 'batch',
                ...$this->validateBatchForModule($batch, $module),
                'data' => $batch,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Kode tidak ditemukan.',
        ], 404);
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
