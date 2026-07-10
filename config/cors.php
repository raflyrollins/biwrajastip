<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        env('FRONTEND_URL', env('APP_URL', 'http://localhost')),
        ...explode(',', env('CORS_ALLOWED_ORIGINS', '')),
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86_400,

    'supports_credentials' => false,

];
