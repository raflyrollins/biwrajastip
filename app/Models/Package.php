<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Package extends Model
{
    protected $fillable = [
        'user_id',
        'tracking_code',
        'sender_name',
        'sender_store',
        'sender_tracking_number',
        'recipient_name',
        'recipient_phone',
        'zone_id',
        'weight_estimated',
        'length_estimated',
        'width_estimated',
        'height_estimated',
        'volumetric_estimated',
        'length',
        'width',
        'height',
        'weight_actual',
        'volumetric_actual',
        'final_weight',
        'shipping_cost',
        'delivery_fee',
        'total_cost',
        'status',
        'bag_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'weight_estimated' => 'integer',
            'length_estimated' => 'integer',
            'width_estimated' => 'integer',
            'height_estimated' => 'integer',
            'volumetric_estimated' => 'integer',
            'length' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'weight_actual' => 'integer',
            'volumetric_actual' => 'integer',
            'final_weight' => 'integer',
            'shipping_cost' => 'integer',
            'delivery_fee' => 'integer',
            'total_cost' => 'integer',
        ];
    }

    public static function generateTrackingCode(): string
    {
        do {
            $code = 'BWJ-'.strtoupper(Str::random(8));
        } while (static::where('tracking_code', $code)->exists());

        return $code;
    }

    public static function calculateVolumetric(int $length, int $width, int $height): int
    {
        return (int) ceil(($length * $width * $height) / 6000);
    }

    public static function calculateFinalWeight(int $weight, int $volumetric): int
    {
        return max($weight, $volumetric);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'waiting_for_collection' => 'Menunggu Pengambilan',
            'collected' => 'Dikumpulkan',
            'waiting_for_payment' => 'Menunggu Pembayaran',
            'paid' => 'Lunas',
            'bagging' => 'Bagging',
            'berangkat_ke_pelabuhan' => 'Berangkat',
            'di_kapal' => 'Di Kapal',
            'tiba_di_ende' => 'Tiba di Ende',
            'disortir' => 'Disortir',
            'siap_diambil' => 'Siap Diambil',
            'dalam_pengantaran' => 'Dalam Pengantaran',
            'selesai' => 'Selesai',
            default => $this->status,
        };
    }
}
