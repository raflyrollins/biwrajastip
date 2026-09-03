<?php

namespace App\Support;

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;

class StatusLabels
{
    /**
     * Map of package status value => Indonesian label.
     *
     * @return array<string, string>
     */
    public static function packages(): array
    {
        $map = [];
        foreach (PackageStatus::cases() as $case) {
            $map[$case->value] = $case->label();
        }

        return $map;
    }

    /**
     * Map of bag status value => Indonesian label.
     *
     * @return array<string, string>
     */
    public static function bags(): array
    {
        $map = [];
        foreach (BagStatus::cases() as $case) {
            $map[$case->value] = $case->label();
        }

        return $map;
    }

    /**
     * Map of batch status value => Indonesian label.
     *
     * @return array<string, string>
     */
    public static function batches(): array
    {
        $map = [];
        foreach (BatchStatus::cases() as $case) {
            $map[$case->value] = $case->label();
        }

        return $map;
    }

    /**
     * Map of payment status value => Indonesian label.
     *
     * @return array<string, string>
     */
    public static function payments(): array
    {
        $map = [];
        foreach (PaymentStatus::cases() as $case) {
            $map[$case->value] = $case->label();
        }

        return $map;
    }
}
