<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $fillable = ['name', 'tarif_per_kg', 'biaya_antar'];

    protected function casts(): array
    {
        return [
            'tarif_per_kg' => 'integer',
            'biaya_antar' => 'integer',
        ];
    }
}
