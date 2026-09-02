import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

void createInertiaApp({
    serverHead: true,
    progress: {
        color: '#4B5563',
    },
});
