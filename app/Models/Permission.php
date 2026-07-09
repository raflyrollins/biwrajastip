<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string $label
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Permission extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'name', 'label'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $permission) {
            if (empty($permission->uuid)) {
                $permission->uuid = (string) Str::uuid();
            }
        });
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions');
    }
}
