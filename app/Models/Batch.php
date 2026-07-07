<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Batch extends Model
{
    protected $fillable = [
        'uuid',
        'code',
        'notes',
        'status',
        'total_packages',
        'total_weight',
        'departure_at',
        'arrival_at',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $batch) {
            if (empty($batch->uuid)) {
                $batch->uuid = (string) Str::uuid();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'total_packages' => 'integer',
            'total_weight' => 'integer',
            'departure_at' => 'datetime',
            'arrival_at' => 'datetime',
        ];
    }

    public static function generateCode(): string
    {
        do {
            $code = 'BATCH-'.strtoupper(Str::random(6));
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'preparing' => 'Persiapan',
            'berangkat' => 'Berangkat',
            'di_kapal' => 'Di Kapal',
            'tiba' => 'Tiba',
            default => $this->status,
        };
    }
}
