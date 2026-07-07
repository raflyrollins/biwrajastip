<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Zone extends Model
{
    protected $fillable = ['uuid', 'name', 'tarif_per_kg', 'biaya_antar'];

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

    protected function casts(): array
    {
        return [
            'tarif_per_kg' => 'integer',
            'biaya_antar' => 'integer',
        ];
    }
}
