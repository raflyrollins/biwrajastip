<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $ship_id
 * @property string $departure_date
 * @property string|null $arrival_date
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Schedule extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'ship_id', 'departure_date', 'arrival_date', 'status'];

    protected $casts = [
        'departure_date' => 'date',
        'arrival_date' => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $schedule) {
            if (empty($schedule->uuid)) {
                $schedule->uuid = (string) Str::uuid();
            }
        });
    }

    public function ship(): BelongsTo
    {
        return $this->belongsTo(Ship::class);
    }

    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }
}
