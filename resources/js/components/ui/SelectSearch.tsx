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
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelect(option: Option) {
        onChange(option.value);
        setOpen(false);
        setQuery('');
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onChange('');
        setQuery('');
    }

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <button
                type="button"
                onClick={() => {
                    if (!disabled) {
                        setOpen(!open);
                        if (!open) {
                            setTimeout(() => inputRef.current?.focus(), 50);
                        }
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

            {open && (
                <div className="absoluteinset-x-0 z-50 mt-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-lg">
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
                            placeholder="Cari..."
                            className="w-full border-none bg-transparent py-2.5 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--body-subtle)]"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-4 text-center text-sm text-[var(--body-subtle)]">
                                Tidak ada data
                            </li>
                        ) : (
                            filtered.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={cn(
                                            'flex w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--neutral-tertiary)]',
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
            )}
        </div>
    );
}
