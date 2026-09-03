<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <script>
            // Apply the persisted theme before paint to avoid a flash of the
            // wrong mode on full page loads. Modes: `light`, `dark`, `system`
            // (default = follow the operating system preference).
            (function () {
                try {
                    var stored = localStorage.getItem('biwrajastip-theme');
                    var dark = stored === 'dark';
                    if (stored === 'system' || stored === null) {
                        dark = window.matchMedia(
                            '(prefers-color-scheme: dark)',
                        ).matches;
                    }
                    if (dark) {
                        document.documentElement.classList.add('dark');
                    }
                } catch (e) {
                    /* ignore */
                }
            })();
        </script>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @head
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
