<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $package_id
 * @property float $amount
 * @property string $payment_method
 * @property string $proof_image
 * @property PaymentStatus $status
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
        'user_id',
        'amount',
        'payment_method',
        'proof_image',
        'status',
        'verified_by',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
        'verified_at' => 'datetime',
        'status' => PaymentStatus::class,
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function proofImage(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                if (! $value || str_contains($value, '://')) {
                    return $value;
                }

                return Storage::url($value);
            },
        );
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
