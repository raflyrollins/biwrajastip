<?php

use App\Enums\Permission;
use App\Models\Payment;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('packages', function ($user) {
    return $user->can(Permission::MenuPackages->value);
});

Broadcast::channel('bags', function ($user) {
    return $user->can(Permission::MenuBags->value);
});

Broadcast::channel('batches', function ($user) {
    return $user->can(Permission::MenuBatches->value);
});

Broadcast::channel('payments.{orderId}', function ($user, $orderId) {
    if (! $user->can(Permission::MenuPackages->value)) {
        return false;
    }

    $payment = Payment::query()
        ->where('order_id', $orderId)
        ->with('package:id,customer_id,uuid')
        ->first();

    if ($payment === null) {
        return false;
    }

    // Customers only follow payments they own; staff/admin may follow any.
    if ($user->getRoleNames()->contains('customer')) {
        return $payment->package?->customer_id === $user->id;
    }

    return true;
});
