<?php

namespace App\Enums;

enum BagStatus: string
{
    case Draft = 'draft';
    case Bagged = 'bagged';
    case Batched = 'batched';
    case OnShip = 'on_ship';
    case Unbagged = 'unbagged';
    case Complete = 'complete';

    public function label(): string
    {
        return trans("enums.bag_status.{$this->value}");
    }
}
