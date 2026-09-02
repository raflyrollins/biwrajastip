<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

/**
 * Assign a UUID (in the "uuid" column, right after "id") on creation and
 * use it as the route key so URLs never expose the sequential id.
 *
 * @mixin Model
 */
trait HasUuidKey
{
    protected static function bootHasUuidKey(): void
    {
        static::creating(function (Model $model): void {
            if (empty($model->getAttribute('uuid'))) {
                $model->setAttribute('uuid', Uuid::uuid4()->toString());
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
