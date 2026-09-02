<?php

namespace App\Enums;

enum Role: string
{
    case Customer = 'customer';
    case Admin = 'admin';
    case StaffSurabaya = 'staff-surabaya';
    case StaffEnde = 'staff-ende';
}
