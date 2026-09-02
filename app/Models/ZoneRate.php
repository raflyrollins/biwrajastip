<?php

namespace App\Models;

use Database\Factories\ZoneRateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $delivery_zone_id
 * @property int $max_weight_kg
 * @property int $price_per_kg
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'delivery_zone_id',
    'max_weight_kg',
    'price_per_kg',
])]
class ZoneRate extends Model
{
    /** @use HasFactory<ZoneRateFactory> */
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'max_weight_kg' => 'integer',
            'price_per_kg' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<DeliveryZone, $this>
     */
    public function deliveryZone(): BelongsTo
    {
        return $this->belongsTo(DeliveryZone::class);
    }
}
