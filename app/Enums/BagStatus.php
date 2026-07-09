<?php

namespace App\Enums;

enum BagStatus: string
{
    case Created = 'created';
    case InBatch = 'in_batch';
    case Unbagged = 'unbagged';
}
