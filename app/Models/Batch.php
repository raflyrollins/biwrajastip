<?php

namespace App\Models;

use App\Enums\BatchStatus;
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
 * @property int $ship_id
 * @property int $schedule_id
 * @property string $departure_date
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Batch extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'code', 'ship_id', 'schedule_id', 'departure_date', 'status', 'created_by', 'notes'];

    protected $casts = [
        'departure_date' => 'date',
        'status' => BatchStatus::class,
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
            if (empty($batch->code)) {
                $batch->code = self::generateCode();
            }
        });
    }

    public static function generateCode(): string
    {
        $today = now()->format('Ymd');
        $lastBatch = self::where('code', 'like', "BATCH-{$today}-%")
            ->orderByDesc('code')
            ->first();

        if ($lastBatch) {
            $sequence = (int) substr($lastBatch->code, -3) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf('BATCH-%s-%03d', $today, $sequence);
    }

    public function ship(): BelongsTo
    {
        return $this->belongsTo(Ship::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function bags(): HasMany
    {
        return $this->hasMany(Bag::class);
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
