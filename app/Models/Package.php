<?php

namespace App\Models;

use App\Enums\PackageStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $user_id
 * @property string $sender_name
 * @property string $sender_phone
 * @property string $receiver_name
 * @property string $receiver_phone
 * @property string $tracking_number
 * @property string|null $tracking_number_biwra
 * @property int $zone_id
 * @property string $status
 * @property float $weight_estimated
 * @property float $length_estimated
 * @property float $width_estimated
 * @property float $height_estimated
 * @property float|null $weight_actual
 * @property float|null $length_actual
 * @property float|null $width_actual
 * @property float|null $height_actual
 * @property float|null $price
 * @property float|null $delivery_fee
 * @property float|null $total_price
 * @property int|null $bag_id
 * @property int|null $batch_id
 * @property Carbon|null $collected_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'sender_name',
        'sender_phone',
        'receiver_name',
        'receiver_phone',
        'tracking_number',
        'tracking_number_biwra',
        'zone_id',
        'status',
        'description',
        'weight_estimated',
        'length_estimated',
        'width_estimated',
        'height_estimated',
        'weight_actual',
        'length_actual',
        'width_actual',
        'height_actual',
        'volumetric_weight',
        'final_weight',
        'price',
        'delivery_fee',
        'total_price',
        'bag_id',
        'batch_id',
        'collected_at',
        'recipient_photo',
        'recipient_name',
    ];

    protected $casts = [
        'weight_estimated' => 'decimal:2',
        'length_estimated' => 'decimal:2',
        'width_estimated' => 'decimal:2',
        'height_estimated' => 'decimal:2',
        'weight_actual' => 'decimal:2',
        'length_actual' => 'decimal:2',
        'width_actual' => 'decimal:2',
        'height_actual' => 'decimal:2',
        'volumetric_weight' => 'decimal:2',
        'final_weight' => 'decimal:2',
        'price' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'collected_at' => 'datetime',
        'status' => PackageStatus::class,
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $package) {
            if (empty($package->uuid)) {
                $package->uuid = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function bag(): BelongsTo
    {
        return $this->belongsTo(Bag::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function calculateVolumetricWeight(): float
    {
        $length = (float) $this->length_actual;
        $width = (float) $this->width_actual;
        $height = (float) $this->height_actual;

        return ceil(($length * $width * $height) / 6000) * 1000;
    }

    public function calculateFinalWeight(): float
    {
        $actual = (float) $this->weight_actual;
        $volumetric = $this->calculateVolumetricWeight();

        return max($actual, $volumetric);
    }

    public function calculatePrice(float $tariffPerKg): float
    {
        $finalWeight = $this->calculateFinalWeight();
        $weightKg = $finalWeight / 1000;
        $roundedWeight = ceil($weightKg / 0.6) * 0.6;

        return ceil($tariffPerKg * $roundedWeight);
    }
}
