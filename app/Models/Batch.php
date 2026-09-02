<?php

namespace App\Models;

use App\Enums\BatchStatus;
use App\Models\Concerns\HasUuidKey;
use Database\Factories\BatchFactory;
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
 * @property string $batch_number
 * @property BatchStatus $status
 * @property Carbon|null $scheduled_departure_at
 * @property Carbon|null $departed_at
 * @property int $bag_count
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'batch_number',
    'status',
    'scheduled_departure_at',
    'departed_at',
    'bag_count',
    'created_by',
])]
class Batch extends Model
{
    /** @use HasFactory<BatchFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => BatchStatus::class,
            'scheduled_departure_at' => 'datetime',
            'departed_at' => 'datetime',
            'bag_count' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsToMany<Bag, $this>
     */
    public function bags(): BelongsToMany
    {
        return $this->belongsToMany(Bag::class, 'batch_bag')
            ->withPivot('position')
            ->withTimestamps()
            ->orderBy('batch_bag.position');
    }

    /**
     * @return HasMany<Irregularity, $this>
     */
    public function irregularities(): HasMany
    {
        return $this->hasMany(Irregularity::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
