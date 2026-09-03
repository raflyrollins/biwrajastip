import { useCallback, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'biwrajastip-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

type Theme = 'light' | 'dark';

const QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

function getStoredMode(): ThemeMode {
    if (typeof window === 'undefined') return 'system';
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'system';
}

function applyTheme(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme(): {
    mode: ThemeMode;
    theme: Theme;
    setMode: (mode: ThemeMode) => void;
} {
    const [mode, setModeState] = useState<ThemeMode>(() => getStoredMode());
    const [systemTheme, setSystemTheme] = useState<Theme>(() =>
        getSystemTheme(),
    );

    // Track OS preference changes so "system" stays live.
    useEffect(() => {
        const media = window.matchMedia(QUERY);

        const onChange = () => setSystemTheme(getSystemTheme());
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const theme: Theme = useMemo(
        () => (mode === 'system' ? systemTheme : mode),
        [mode, systemTheme],
    );

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setMode = useCallback((next: ThemeMode) => {
        setModeState(next);
        window.localStorage.setItem(THEME_KEY, next);
    }, []);

    return { mode, theme, setMode };
}
