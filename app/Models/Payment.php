<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use App\Models\Concerns\HasUuidKey;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property int $package_id
 * @property PaymentStatus $status
 * @property string|null $payment_method
 * @property int $amount
 * @property string|null $transaction_id
 * @property array<int, mixed>|null $provider_response
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'package_id',
    'status',
    'payment_method',
    'amount',
    'transaction_id',
    'provider_response',
    'paid_at',
])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory, HasUuidKey;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'amount' => 'integer',
            'provider_response' => 'array',
            'paid_at' => 'datetime',
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
}
