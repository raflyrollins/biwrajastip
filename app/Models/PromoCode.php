<?php

namespace App\Models;

use App\Enums\DiscountType;
use Database\Factories\PromoCodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property DiscountType $type
 * @property int $value
 * @property int $min_order_total
 * @property int|null $max_discount_amount
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property int|null $max_uses
 * @property int $used_count
 * @property bool $is_active
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'code',
    'name',
    'description',
    'type',
    'value',
    'min_order_total',
    'max_discount_amount',
    'starts_at',
    'ends_at',
    'max_uses',
    'used_count',
    'is_active',
    'created_by',
])]
class PromoCode extends Model
{
    /** @use HasFactory<PromoCodeFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => DiscountType::class,
            'value' => 'integer',
            'min_order_total' => 'integer',
            'max_discount_amount' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope: only promo codes that are currently active, within their date
     * range, and have not exceeded max_uses.
     *
     * @param  Builder<PromoCode>  $query
     * @return Builder<PromoCode>
     */
    public function scopeActive(Builder $query): Builder
    {
        $now = now();

        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')->orWhereColumn('used_count', '<', 'max_uses');
            });
    }

    /**
     * Calculate the discount amount for a given subtotal.
     */
    public function calculateDiscount(int $subtotal): int
    {
        if ($subtotal < $this->min_order_total) {
            return 0;
        }

        $discount = match ($this->type) {
            DiscountType::Percentage => (int) ceil($subtotal * $this->value / 100),
            DiscountType::Fixed => $this->value,
        };

        if ($this->max_discount_amount !== null) {
            $discount = min($discount, $this->max_discount_amount);
        }

        return min($discount, $subtotal);
    }
}
