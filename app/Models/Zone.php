<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property float $delivery_fee
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Zone extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'name', 'delivery_fee', 'shipping_price', 'is_central', 'description'];

    protected $casts = [
        'delivery_fee' => 'float',
        'shipping_price' => 'float',
        'is_central' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $zone) {
            if (empty($zone->uuid)) {
                $zone->uuid = (string) Str::uuid();
            }
        });
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}
