<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Bag extends Model
{
    public const STATUS_IN_BATCH = 'in_batch';

    public const STATUS_UNBAGGED = 'unbagged';

    protected $fillable = [
        'uuid',
        'code',
        'batch_id',
        'notes',
        'status',
        'total_packages',
        'total_weight',
    ];

    protected $appends = ['status_label'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $bag) {
            if (empty($bag->uuid)) {
                $bag->uuid = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'total_packages' => 'integer',
            'total_weight' => 'integer',
        ];
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_IN_BATCH => 'Dalam Batch',
            self::STATUS_UNBAGGED => 'Unbagged',
            default => $this->status,
        };
    }

    public static function generateCode(): string
    {
        do {
            $code = 'BAG-'.strtoupper(Str::random(6));
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}
