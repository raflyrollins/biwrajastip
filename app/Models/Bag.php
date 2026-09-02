<?php

namespace App\Models;

use App\Enums\BagStatus;
use App\Models\Concerns\HasUuidKey;
use Database\Factories\BagFactory;
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
 * @property string $bag_number
 * @property BagStatus $status
 * @property string|null $sealed_weight_kg
 * @property int $package_count
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'bag_number',
    'status',
    'sealed_weight_kg',
    'package_count',
    'created_by',
])]
class Bag extends Model
{
    /** @use HasFactory<BagFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => BagStatus::class,
            'sealed_weight_kg' => 'decimal:3',
            'package_count' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsToMany<Batch, $this>
     */
    public function batches(): BelongsToMany
    {
        return $this->belongsToMany(Batch::class, 'batch_bag')
            ->withPivot('position')
            ->withTimestamps()
            ->orderBy('batch_bag.position');
    }

    /**
     * @return BelongsToMany<Package, $this>
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'bag_package')
            ->withPivot('position')
            ->withTimestamps()
            ->orderBy('bag_package.position');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<Irregularity, $this>
     */
    public function irregularities(): HasMany
    {
        return $this->hasMany(Irregularity::class);
    }
}
