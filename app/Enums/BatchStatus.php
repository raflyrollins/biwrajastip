<?php

namespace App\Enums;

enum BatchStatus: string
{
    case Preparing = 'preparing';
    case Departed = 'departed';
    case Arrived = 'arrived';
    case Unbatched = 'unbatched';
}
