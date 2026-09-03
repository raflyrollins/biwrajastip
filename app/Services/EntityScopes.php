<?php

namespace App\Services;

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Enums\Permission;
use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class EntityScopes
{
    /**
     * Scope package query per MENU_DASHBOARD.md (§1.1).
     *
     * @return Builder<Package>
     */
    public function packages(User $user): Builder
    {
        $query = Package::query();

        /** @var array<int, string> $roles */
        $roles = $user->getRoleNames()->all();

        if (! $user->can(Permission::MenuPackages->value)) {
            return $query->whereRaw('1 = 0');
        }

        if (in_array('customer', $roles, true)) {
            $query->where('customer_id', $user->id);
        } elseif (in_array('staff-surabaya', $roles, true)) {
            $query->whereIn('status', [
                PackageStatus::Registered->value,
                PackageStatus::Collected->value,
                PackageStatus::Processed->value,
                PackageStatus::PendingPayment->value,
                PackageStatus::Paid->value,
                PackageStatus::Bagged->value,
                PackageStatus::Batched->value,
                PackageStatus::PortArrived->value,
                PackageStatus::OnGoing->value,
            ]);
        } elseif (in_array('staff-ende', $roles, true)) {
            $query->whereIn('status', [
                PackageStatus::Unbatched->value,
                PackageStatus::Unbagged->value,
                PackageStatus::Ready->value,
                PackageStatus::Delivered->value,
                PackageStatus::Irregular->value,
            ]);
        }

        // admin: no filter -> all packages

        return $query;
    }

    /**
     * Scope bag query per MENU_DASHBOARD.md (§1.2).
     *
     * @return Builder<Bag>
     */
    public function bags(User $user): Builder
    {
        $query = Bag::query();

        /** @var array<int, string> $roles */
        $roles = $user->getRoleNames()->all();

        if (! $user->can(Permission::MenuBags->value)) {
            return $query->whereRaw('1 = 0');
        }

        if (in_array('staff-surabaya', $roles, true)) {
            $query->whereIn('status', [
                BagStatus::Draft->value,
                BagStatus::Bagged->value,
                BagStatus::Batched->value,
            ]);
        } elseif (in_array('staff-ende', $roles, true)) {
            $query->whereIn('status', [
                BagStatus::Unbagged->value,
                BagStatus::Complete->value,
            ]);
        }

        // admin: all

        return $query;
    }

    /**
     * Scope batch query per MENU_DASHBOARD.md (§1.3).
     *
     * @return Builder<Batch>
     */
    public function batches(User $user): Builder
    {
        $query = Batch::query();

        /** @var array<int, string> $roles */
        $roles = $user->getRoleNames()->all();

        if (! $user->can(Permission::MenuBatches->value)) {
            return $query->whereRaw('1 = 0');
        }

        if (in_array('staff-surabaya', $roles, true)) {
            $query->whereIn('status', [
                BatchStatus::Draft->value,
                BatchStatus::Batched->value,
                BatchStatus::PortArrived->value,
                BatchStatus::OnGoing->value,
            ]);
        } elseif (in_array('staff-ende', $roles, true)) {
            $query->whereIn('status', [
                BatchStatus::Unbatched->value,
                BatchStatus::Complete->value,
            ]);
        }

        // admin: all

        return $query;
    }
}
