<?php

namespace App\Models;

use App\Enums\IrregularityType;
use App\Models\Concerns\HasUuidKey;
use Database\Factories\IrregularityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $package_id
 * @property int|null $bag_id
 * @property int|null $batch_id
 * @property IrregularityType $type
 * @property string|null $notes
 * @property bool $resolved
 * @property Carbon|null $resolved_at
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'package_id',
    'bag_id',
    'batch_id',
    'type',
    'notes',
    'resolved',
    'resolved_at',
    'created_by',
])]
class Irregularity extends Model
{
    /** @use HasFactory<IrregularityFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => IrregularityType::class,
            'resolved' => 'boolean',
            'resolved_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Package, $this>
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * @return BelongsTo<Bag, $this>
     */
    public function bag(): BelongsTo
    {
        return $this->belongsTo(Bag::class);
    }

    /**
     * @return BelongsTo<Batch, $this>
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
