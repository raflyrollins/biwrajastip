<?php

namespace App\Support;

use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;

class NumberGenerator
{
    /**
     * Generate the next unique biwrajastip tracking number (package resi).
     *
     * Format: BWRJ-0000001 (zero-padded 7 digits).
     */
    public function nextBiwrajastipTrackingNumber(): string
    {
        $prefix = 'BWRJ-';
        $last = Package::query()
            ->where('biwrajastip_tracking_number', 'like', $prefix.'%')
            ->orderByRaw('biwrajastip_tracking_number desc')
            ->value('biwrajastip_tracking_number');

        $next = $last === null ? 1 : ((int) substr($last, strlen($prefix))) + 1;

        return $prefix.str_pad((string) $next, 7, '0', STR_PAD_LEFT);
    }

    /**
     * Generate the next unique bag number.
     *
     * Format: BAG-0001 (zero-padded 4 digits).
     */
    public function nextBagNumber(): string
    {
        $prefix = 'BAG-';
        $last = Bag::query()
            ->where('bag_number', 'like', $prefix.'%')
            ->orderByRaw('bag_number desc')
            ->value('bag_number');

        $next = $last === null ? 1 : ((int) substr($last, strlen($prefix))) + 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Generate the next unique batch number.
     *
     * Format: BCH-0001 (zero-padded 4 digits).
     */
    public function nextBatchNumber(): string
    {
        $prefix = 'BCH-';
        $last = Batch::query()
            ->where('batch_number', 'like', $prefix.'%')
            ->orderByRaw('batch_number desc')
            ->value('batch_number');

        $next = $last === null ? 1 : ((int) substr($last, strlen($prefix))) + 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }
}
