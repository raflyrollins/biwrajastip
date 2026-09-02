<?php

namespace App\Enums;

enum IrregularityType: string
{
    case LabelMismatch = 'label_mismatch';
    case WrongDelivery = 'wrong_delivery';
    case Refused = 'refused';
    case AddressNotFound = 'address_not_found';
    case BagCountMismatch = 'bag_count_mismatch';
    case PackageCountMismatch = 'package_count_mismatch';
    case Other = 'other';

    public function label(): string
    {
        return trans("enums.irregularity_type.{$this->value}");
    }
}
