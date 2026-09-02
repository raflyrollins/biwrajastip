<?php

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Models\Bag;
use App\Models\Batch;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('auto-generates a uuid and routes by uuid', function () {
    $package = Package::factory()->create();

    expect($package->uuid)->not->toBeNull();
    expect(strlen($package->uuid))->toBe(36);
    expect($package->getRouteKey())->toBe($package->uuid);
    expect((string) $package->getRouteKeyName())->toBe('uuid');
});

it('links package to bag via the bag_package pivot with position', function () {
    $bag = Bag::factory()->create();
    $packages = Package::factory()->count(3)->create();

    $bag->packages()->syncWithPivotValues(
        $packages->pluck('id'),
        ['position' => 1]
    );

    expect($bag->packages()->count())->toBe(3);

    foreach ($bag->packages()->get() as $pivotRel) {
        expect($pivotRel->pivot->position)->toBe(1);
    }

    foreach ($packages as $package) {
        expect($package->bags->contains($bag->id))->toBeTrue();
    }
});

it('links bag to batch via batch_bag pivot and supports unbatching', function () {
    $batch = Batch::factory()->create(['status' => BatchStatus::Batched]);
    $bagA = Bag::factory()->create(['status' => BagStatus::Batched]);
    $bagB = Bag::factory()->create(['status' => BagStatus::Batched]);

    $batch->bags()->sync([
        $bagA->id => ['position' => 1],
        $bagB->id => ['position' => 2],
    ]);

    expect($batch->bags()->count())->toBe(2);
    expect($bagA->batches()->count())->toBe(1);
    expect($bagA->batches()->first()->id)->toBe($batch->id);

    // Unbatching: detach bag from batch.
    $batch->bags()->detach($bagA->id);
    expect($batch->bags()->count())->toBe(1);
    expect($bagA->batches()->count())->toBe(0);
});

it('resolves batch -> bag -> package chain', function () {
    $customer = User::factory()->create();
    $batch = Batch::factory()->create(['status' => BatchStatus::Batched]);
    $bag = Bag::factory()->create(['status' => BagStatus::Batched]);
    $package = Package::factory()->create([
        'customer_id' => $customer->id,
        'status' => PackageStatus::Batched,
    ]);

    $bag->packages()->attach($package->id, ['position' => 1]);
    $batch->bags()->attach($bag->id, ['position' => 1]);

    $resolvedPackage = $batch->bags()->first()->packages()->first();
    expect($resolvedPackage->id)->toBe($package->id);
    expect($resolvedPackage->customer->id)->toBe($customer->id);
});

it('enforces unique bag_package and batch_bag pairs', function () {
    $bag = Bag::factory()->create();
    $package = Package::factory()->create();
    $bag->packages()->attach($package->id);

    expect(fn () => $bag->packages()->attach($package->id))
        ->toThrow(QueryException::class);

    $batch = Batch::factory()->create();
    $batch->bags()->attach($bag->id);

    expect(fn () => $batch->bags()->attach($bag->id))
        ->toThrow(QueryException::class);

    expect($bag->packages()->count())->toBe(1);
    expect($batch->bags()->count())->toBe(1);
});
