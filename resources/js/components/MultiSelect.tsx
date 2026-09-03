import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type SelectOption = {
    value: string;
    label: string;
};

type MultiSelectProps = {
    label?: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: SelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
};

export function MultiSelect({
    label,
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    searchPlaceholder = 'Cari...',
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const selected = options.filter((o) => value.includes(o.value));
    const first = selected[0] ?? null;
    const extraCount = Math.max(selected.length - 1, 0);
    const extraLabels = selected
        .slice(1)
        .map((o) => o.label)
        .join(', ');
    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        function onOutside(e: MouseEvent) {
            if (
                open &&
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [open]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    function toggleOpen() {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 280);
        }
        setSearch('');
        setOpen((prev) => !prev);
    }

    function toggle(val: string) {
        onChange(
            value.includes(val)
                ? value.filter((v) => v !== val)
                : [...value, val],
        );
    }

    return (
        <div className="grid gap-1.5">
            {label && (
                <label className="text-heading text-sm font-medium">
                    {label}
                </label>
            )}

            <div ref={wrapperRef} className="relative">
                <div
                    ref={triggerRef}
                    role="button"
                    tabIndex={0}
                    onClick={toggleOpen}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleOpen();
                        }
                    }}
                    className={cn(
                        'bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand flex min-h-[42px] cursor-pointer items-center gap-2 rounded-none border px-3 py-2 text-sm shadow-xs transition-colors duration-200 focus:ring-1 focus:outline-none',
                    )}
                >
                    {!first ? (
                        <span className="text-body-subtle flex-1 truncate">
                            {placeholder}
                        </span>
                    ) : (
                        <ul className="flex min-w-0 flex-1 items-center gap-2">
                            <li className="min-w-0">
                                <span className="bg-brand/10 text-brand inline-flex max-w-full items-center gap-1 px-2 py-0.5 text-xs font-semibold">
                                    <span className="truncate">
                                        {first.label}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggle(first.value);
                                        }}
                                        className="text-brand hover:text-brand-strong shrink-0 transition-colors"
                                        aria-label={`Hapus ${first.label}`}
                                    >
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                </span>
                            </li>
                            {extraCount > 0 && (
                                <li>
                                    <span
                                        className="bg-neutral-tertiary text-body-subtle inline-flex items-center px-2 py-0.5 text-xs font-semibold"
                                        title={extraLabels}
                                    >
                                        +{extraCount}
                                    </span>
                                </li>
                            )}
                        </ul>
                    )}
                    <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={cn(
                            'text-body-subtle shrink-0 transition-transform',
                            open && 'rotate-180',
                        )}
                    />
                </div>

                {open && (
                    <div
                        className={cn(
                            'border-border-default bg-neutral-primary absolute right-0 left-0 z-50 max-h-64 overflow-auto border shadow-lg',
                            dropUp ? 'bottom-full mb-1' : 'top-full mt-1',
                        )}
                    >
                        <div className="border-border-default bg-neutral-primary sticky top-0 border-b p-2">
                            <div className="bg-neutral-secondary-medium border-border-default-medium flex items-center gap-2 border px-3 py-2">
                                <Search
                                    size={14}
                                    aria-hidden="true"
                                    className="text-body-subtle shrink-0"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    autoFocus
                                    className="text-heading placeholder:text-body-subtle w-full bg-transparent text-sm outline-none"
                                />
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <p className="text-body-subtle px-4 py-8 text-center text-sm">
                                Tidak ada hasil
                            </p>
                        ) : (
                            <ul className="py-1">
                                {filtered.map((option) => {
                                    const isSelected = value.includes(
                                        option.value,
                                    );
                                    return (
                                        <li key={option.value}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggle(option.value)
                                                }
                                                className={cn(
                                                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                                                    isSelected
                                                        ? 'bg-brand/5 text-brand font-semibold'
                                                        : 'text-body hover:bg-neutral-tertiary-soft hover:text-heading',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex h-4 w-4 shrink-0 items-center justify-center border',
                                                        isSelected
                                                            ? 'border-brand bg-brand'
                                                            : 'border-border-default-medium bg-neutral-primary',
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check
                                                            size={12}
                                                            aria-hidden="true"
                                                            className="text-on-brand"
                                                        />
                                                    )}
                                                </span>
                                                <span className="flex-1">
                                                    {option.label}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
