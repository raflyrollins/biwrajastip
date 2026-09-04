import { router } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';

import { useEffect, useRef } from 'react';

/**
 * Subscribe to a set of realtime channels (private-*) and refetch the current
 * Inertia page whenever a matching event is broadcast, so a scoped list stays
 * fresh without a manual refresh.
 *
 * Event names must use the leading-dot convention (e.g. `.package.created`)
 * so Echo's EventFormatter passes them through unchanged to match `broadcastAs()`.
 */
export function useRealtimeSectionRefresh(
    channels: Array<{
        name: string;
        event: string;
    }>,
): void {
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const grouped: Record<string, string[]> = {};

        for (const { name, event } of channels) {
            grouped[name] ??= [];
            grouped[name].push(event);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptions: Array<{
            channel: any;
            event: string;
            handler: () => void;
        }> = [];

        for (const [channelName, events] of Object.entries(grouped)) {
            const channel = echo().private(channelName);

            for (const event of events) {
                const handler = () => {
                    if (timerRef.current !== null) {
                        window.clearTimeout(timerRef.current);
                    }

                    timerRef.current = window.setTimeout(() => {
                        router.reload();
                    }, 300);
                };

                channel.listen(event, handler);
                subscriptions.push({ channel, event, handler });
            }
        }

        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }

            for (const { channel, event, handler } of subscriptions) {
                channel.stopListening(event, handler);
            }
        };
    }, [JSON.stringify(channels)]);
}
