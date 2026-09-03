import { Monitor, Moon, Sun, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Terang', icon: Sun },
    { mode: 'dark', label: 'Gelap', icon: Moon },
    { mode: 'system', label: 'Sistem', icon: Monitor },
];

export function ThemeToggle() {
    const { mode, setMode } = useTheme();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only reveal the client-resolved icon after hydration. Reading
        // localStorage/matchMedia during first render would make the client
        // HTML differ from the SSR HTML (hydration mismatch), so keep the
        // server-stable "system" icon until the component has mounted.
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    const CurrentIcon = mounted
        ? (OPTIONS.find((o) => o.mode === mode)?.icon ?? Monitor)
        : Monitor;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Ubah mode tampilan"
                aria-haspopup="menu"
                aria-expanded={open}
                className="hover:bg-neutral-quaternary text-heading inline-flex h-10 w-10 items-center justify-center"
            >
                <CurrentIcon className="h-5 w-5" />
            </button>

            {open ? (
                <div
                    role="menu"
                    className="border-border-default bg-neutral-primary absolute right-0 z-50 mt-2 w-44 border py-1 shadow-md"
                >
                    <p className="text-body-subtle border-border-default px-3 py-1.5 text-xs font-medium">
                        Mode tampilan
                    </p>
                    {OPTIONS.map((option) => {
                        const active = option.mode === mode;

                        return (
                            <button
                                key={option.mode}
                                type="button"
                                role="menuitemradio"
                                aria-checked={active}
                                onClick={() => {
                                    setMode(option.mode);
                                    setOpen(false);
                                }}
                                className="hover:bg-neutral-tertiary text-heading flex w-full items-center gap-3 px-3 py-2 text-sm"
                            >
                                <option.icon
                                    className={cn(
                                        'h-4 w-4',
                                        active ? 'text-brand' : 'text-body',
                                    )}
                                />
                                <span className="flex-1 text-left">
                                    {option.label}
                                </span>
                                {active && (
                                    <Check className="text-brand h-4 w-4" />
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
