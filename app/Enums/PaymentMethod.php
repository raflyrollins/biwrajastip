<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case VaBca = 'va_bca';
    case VaBni = 'va_bni';
    case VaMandiri = 'va_mandiri';
    case VaBri = 'va_bri';
    case Qris = 'qris';

    public function label(): string
    {
        return trans("enums.payment_method.{$this->value}");
    }

    /**
     * Admin fee charged to the customer (Rp).
     *
     * Bank Transfer VA: flat Rp 4,000.
     * QRIS: 0.7 % of gross amount (rounded up to the nearest Rp 100).
     */
    public function adminFee(int $grossAmount): int
    {
        return match ($this) {
            self::VaBca, self::VaBni, self::VaMandiri, self::VaBri => 4_000,
            self::Qris => (int) (ceil($grossAmount * 0.007 / 100) * 100),
        };
    }

    /**
     * Midtrans payment_type returned in the charge response for this method.
     */
    public function midtransPaymentType(): string
    {
        return match ($this) {
            self::VaBca, self::VaBni, self::VaMandiri, self::VaBri => 'bank_transfer',
            self::Qris => 'qris',
        };
    }

    /**
     * Dedicated Midtrans bank code for bank_transfer methods.
     */
    public function midtransBank(): ?string
    {
        return match ($this) {
            self::VaBca => 'bca',
            self::VaBni => 'bni',
            self::VaMandiri => 'mandiri',
            self::VaBri => 'bri',
            self::Qris => null,
        };
    }

    /**
     * Midtrans acquirer for QRIS method.
     */
    public function midtransQrisAcquirer(): ?string
    {
        return match ($this) {
            self::Qris => 'gopay',
            default => null,
        };
    }

    /**
     * Grouped display order on the checkout page.
     */
    public function group(): string
    {
        return match ($this) {
            self::VaBca, self::VaBni, self::VaMandiri, self::VaBri => 'Virtual Account',
            self::Qris => 'QRIS & E-Wallet',
        };
    }

    public function groupSort(): int
    {
        return match ($this) {
            self::VaBca, self::VaBni, self::VaMandiri, self::VaBri => 1,
            self::Qris => 2,
        };
    }
}
