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
class Role extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'name', 'label'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (self $role) {
            if (empty($role->uuid)) {
                $role->uuid = (string) Str::uuid();
            }
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
}
