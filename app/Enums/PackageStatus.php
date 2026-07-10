<?php

namespace App\Enums;

enum PackageStatus: string
{
    case WaitingForCollection = 'waiting_for_collection';
    case Collected = 'collected';
    case WaitingForPayment = 'waiting_for_payment';
    case Paid = 'paid';
    case Bagging = 'bagging';
    case Batched = 'batched';
    case HeadingToPort = 'heading_to_port';
    case AtPort = 'at_port';
    case InTransit = 'in_transit';
    case Arrived = 'arrived';
    case ArrivedAtWarehouse = 'arrived_at_warehouse';
    case ReadyForSorting = 'ready_for_sorting';
    case ReadyForPickup = 'ready_for_pickup';
    case InDelivery = 'in_delivery';
    case Completed = 'completed';
}
