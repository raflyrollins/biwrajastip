<?php

namespace App\Models;

use App\Enums\PackageStatus;
use App\Models\Concerns\HasUuidKey;
use Database\Factories\PackageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int $customer_id
 * @property int|null $delivery_zone_id
 * @property PackageStatus $status
 * @property string|null $store_tracking_number
 * @property string|null $biwrajastip_tracking_number
 * @property string|null $receiver_name
 * @property string|null $delivery_address
 * @property string|null $estimated_weight_kg
 * @property string|null $estimated_length_cm
 * @property string|null $estimated_width_cm
 * @property string|null $estimated_height_cm
 * @property string|null $actual_weight_kg
 * @property string|null $actual_length_cm
 * @property string|null $actual_width_cm
 * @property string|null $actual_height_cm
 * @property string|null $volumetric_weight_kg
 * @property string|null $billed_weight_kg
 * @property string|null $shipping_fee
 * @property string|null $delivery_fee
 * @property string|null $total_amount
 * @property string|null $qr_code
 * @property Carbon|null $paid_at
 * @property string|null $delivery_receipt_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'customer_id',
    'delivery_zone_id',
    'status',
    'store_tracking_number',
    'biwrajastip_tracking_number',
    'receiver_name',
    'delivery_address',
    'estimated_weight_kg',
    'estimated_length_cm',
    'estimated_width_cm',
    'estimated_height_cm',
    'actual_weight_kg',
    'actual_length_cm',
    'actual_width_cm',
    'actual_height_cm',
    'volumetric_weight_kg',
    'billed_weight_kg',
    'shipping_fee',
    'delivery_fee',
    'total_amount',
    'qr_code',
    'paid_at',
    'delivery_receipt_path',
])]
class Package extends Model
{
    /** @use HasFactory<PackageFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PackageStatus::class,
            'estimated_weight_kg' => 'decimal:3',
            'estimated_length_cm' => 'decimal:2',
            'estimated_width_cm' => 'decimal:2',
            'estimated_height_cm' => 'decimal:2',
            'actual_weight_kg' => 'decimal:3',
            'actual_length_cm' => 'decimal:2',
            'actual_width_cm' => 'decimal:2',
            'actual_height_cm' => 'decimal:2',
            'volumetric_weight_kg' => 'decimal:3',
            'billed_weight_kg' => 'decimal:3',
            'shipping_fee' => 'decimal:2',
            'delivery_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * @return BelongsTo<DeliveryZone, $this>
     */
    public function deliveryZone(): BelongsTo
    {
        return $this->belongsTo(DeliveryZone::class);
    }

    /**
     * @return BelongsToMany<Bag, $this>
     */
    public function bags(): BelongsToMany
    {
        return $this->belongsToMany(Bag::class, 'bag_package')
            ->withPivot('position')
            ->withTimestamps();
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * @return HasMany<Irregularity, $this>
     */
    public function irregularities(): HasMany
    {
        return $this->hasMany(Irregularity::class);
    }

    public function isPaid(): bool
    {
        return $this->status === PackageStatus::Paid;
    }
}
