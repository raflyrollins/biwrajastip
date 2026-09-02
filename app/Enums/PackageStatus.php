<?php

namespace App\Enums;

enum PackageStatus: string
{
    case Registered = 'registered';
    case Collected = 'collected';
    case Processed = 'processed';
    case PendingPayment = 'pending_payment';
    case Paid = 'paid';
    case Bagged = 'bagged';
    case Batched = 'batched';
    case PortArrived = 'port_arrived';
    case OnGoing = 'on_going';
    case Unbatched = 'unbatched';
    case Unbagged = 'unbagged';
    case Ready = 'ready';
    case Delivered = 'delivered';
    case Irregular = 'irregular';

    public function label(): string
    {
        return trans("enums.package_status.{$this->value}");
    }
}
