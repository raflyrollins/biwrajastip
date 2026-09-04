<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast a payment state change (e.g. settled via webhook) so the package
 * owner and staff can refresh their scoped lists.
 */
class PaymentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $packageUuid,
        public string $orderId,
        public string $status,
    ) {}

    /**
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('packages'),
            new PrivateChannel('payments.'.$this->orderId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'payment.updated';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'entity' => 'payment',
            'package_uuid' => $this->packageUuid,
            'order_id' => $this->orderId,
            'status' => $this->status,
            'event' => 'status.updated',
        ];
    }
}
