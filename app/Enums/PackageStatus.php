<?php

namespace App\Enums;

enum PackageStatus: string
{
    case WaitingForCollection = 'waiting_for_collection';
    case Collected = 'collected';
    case WaitingForPayment = 'waiting_for_payment';
    case Paid = 'paid';
    case Bagging = 'bagging';
    case BerangkatKePelabuhan = 'berangkat_ke_pelabuhan';
    case InTransit = 'in_transit';
    case Arrived = 'arrived';
    case ReadyForSorting = 'ready_for_sorting';
    case SiapDiambil = 'siap_diambil';
    case DalamPengantaran = 'dalam_pengantaran';
    case Selesai = 'selesai';
}
