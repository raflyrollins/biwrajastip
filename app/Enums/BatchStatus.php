<?php

namespace App\Enums;

enum BatchStatus: string
{
    case Draft = 'draft';
    case Batched = 'batched';
    case PortArrived = 'port_arrived';
    case OnGoing = 'on_going';
    case Unbatched = 'unbatched';
    case Complete = 'complete';

    public function label(): string
    {
        return trans("enums.batch_status.{$this->value}");
    }
}
