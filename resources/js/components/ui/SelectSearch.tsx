import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface Option {
    value: string;
    label: string;
}

interface SelectSearchProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

const DROPDOWN_HEIGHT = 260;

export default function SelectSearch({
    options,
    value,
    onChange,
    placeholder = 'Pilih...',
    className,
    disabled,
}: SelectSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [openUp, setOpenUp] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selected = options.find((o) => o.value === value);

    const filtered = query
        ? options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()),
        )
        : options;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open) {
            setQuery('');
            setHighlightedIndex(-1);
        }
    }, [open]);

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filtered.length]);

    useEffect(() => {
        if (highlightedIndex < 0 || !open || !listRef.current) return;

        const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
        item?.scrollIntoView({ block: 'nearest' });
    }, [highlightedIndex, open]);

    function handleSelect(option: Option) {
        onChange(option.value);
        setOpen(false);
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onChange('');
        setQuery('');
    }

    function handleOpen() {
        if (disabled) return;

        const btn = containerRef.current?.querySelector('button');
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setOpenUp(spaceBelow < DROPDOWN_HEIGHT && spaceAbove >= DROPDOWN_HEIGHT);
        }

        setHighlightedIndex(-1);
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < filtered.length - 1 ? prev + 1 : 0,
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : filtered.length - 1,
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (
                    highlightedIndex >= 0 &&
                    highlightedIndex < filtered.length
                ) {
                    handleSelect(filtered[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                break;
        }
    }

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => {
                    if (open) {
                        setOpen(false);
                    } else {
                        handleOpen();
                    }
                }}
                disabled={disabled}
                className={cn(
                    'flex w-full cursor-pointer items-center border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-left text-sm transition-colors hover:border-[var(--brand)]',
                    disabled && 'cursor-not-allowed opacity-50',
                    open && 'border-[var(--brand)]',
                )}
            >
                <span
                    className={cn(
                        'flex-1 truncate',
                        !selected && 'text-[var(--body-subtle)]',
                    )}
                >
                    {selected ? selected.label : placeholder}
                </span>
                {value ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="mr-1 flex size-4 cursor-pointer items-center justify-center text-[var(--body-subtle)] hover:text-[var(--heading)]"
                    >
                        <X size={14} />
                    </button>
                ) : null}
                <ChevronDown
                    size={16}
                    className={cn(
                        'text-[var(--body-subtle)] transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>

            <div
                className={cn(
                    'absolute inset-x-0 z-50 border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-lg transition-all duration-150',
                    open
                        ? 'visible opacity-100 translate-y-0'
                        : 'invisible opacity-0 translate-y-1',
                    openUp ? 'mb-1' : 'mt-1',
                )}
                style={{ [openUp ? 'bottom' : 'top']: '100%' }}
            >
                <div className="flex items-center border-b border-[var(--border-default)] px-3">
                    <Search
                        size={15}
                        className="mr-2 shrink-0 text-[var(--body-subtle)]"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Cari..."
                        className="w-full border-none bg-transparent py-2.5 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--body-subtle)]"
                    />
                </div>
                <ul ref={listRef} className="max-h-48 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <li className="px-3 py-4 text-center text-sm text-[var(--body-subtle)]">
                            Tidak ada data
                        </li>
                    ) : (
                        filtered.map((option, index) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() =>
                                        setHighlightedIndex(index)
                                    }
                                    className={cn(
                                        'flex w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--neutral-tertiary)]',
                                        index === highlightedIndex &&
                                            'bg-[var(--neutral-tertiary)]',
                                        option.value === value &&
                                            'bg-[var(--brand-softer)] font-medium text-[var(--brand-strong)]',
                                    )}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
