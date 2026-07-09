<?php

namespace App\Models;

use App\Enums\BagStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property string $code
 * @property string $status
 * @property int|null $batch_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Bag extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'code', 'status', 'batch_id', 'created_by', 'weight'];

    protected $casts = [
        'status' => BagStatus::class,
        'weight' => 'decimal:2',
    ];

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
            if (empty($bag->code)) {
                $bag->code = self::generateCode();
            }
        });
    }

    public static function generateCode(): string
    {
        $today = now()->format('Ymd');
        $lastBag = self::where('code', 'like', "BAG-{$today}-%")
            ->orderByDesc('code')
            ->first();

        if ($lastBag) {
            $sequence = (int) substr($lastBag->code, -3) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf('BAG-%s-%03d', $today, $sequence);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
