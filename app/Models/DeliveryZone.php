<?php

namespace App\Models;

use App\Models\Concerns\HasUuidKey;
use Database\Factories\DeliveryZoneFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string $district
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'district',
    'is_active',
])]
class DeliveryZone extends Model
{
    /** @use HasFactory<DeliveryZoneFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<ZoneRate, $this>
     */
    public function rates(): HasMany
    {
        return $this->hasMany(ZoneRate::class);
    }
}
