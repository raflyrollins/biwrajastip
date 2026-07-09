<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $package_id
 * @property float $amount
 * @property string $payment_method
 * @property string $proof_image
 * @property string $status
 * @property int|null $verified_by
 * @property Carbon|null $verified_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'package_id',
        'amount',
        'payment_method',
        'proof_image',
        'status',
        'verified_by',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $payment) {
            if (empty($payment->uuid)) {
                $payment->uuid = (string) Str::uuid();
            }
        });
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
