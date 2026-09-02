<?php

use App\Enums\BagStatus;
use App\Enums\BatchStatus;
use App\Enums\PackageStatus;
use App\Enums\PaymentStatus;
use App\Enums\Permission;
use App\Enums\Role;

it('backed enums expose stable string values', function () {
    expect(PackageStatus::Registered->value)->toBe('registered');
    expect(PackageStatus::Delivered->value)->toBe('delivered');
    expect(BagStatus::Unbagged->value)->toBe('unbagged');
    expect(BatchStatus::Batched->value)->toBe('batched');
    expect(PaymentStatus::Settled->value)->toBe('settled');
    expect(Role::Admin->value)->toBe('admin');
    expect(Role::StaffSurabaya->value)->toBe('staff-surabaya');
    expect(Role::StaffEnde->value)->toBe('staff-ende');
});

it('permission enum covers the web & mobile menu contract', function () {
    $values = collect(Permission::cases())->map(fn (Permission $p) => $p->value);

    expect($values)->toContain(
        'menu.packages',
        'menu.bags',
        'menu.batches',
        'menu.reports',
        'menu.profile',
    )->toContain(
        'action.packages.create',
        'action.packages.process',
        'action.bags.print',
        'action.bags.adjust',
        'action.batches.print',
        'action.batches.schedule',
    );
});
