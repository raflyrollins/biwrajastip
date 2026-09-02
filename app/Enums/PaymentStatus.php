<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Settled = 'settled';
    case Failed = 'failed';
    case Expired = 'expired';
    case Refunded = 'refunded';

    public function label(): string
    {
        return trans("enums.payment_status.{$this->value}");
    }
}
