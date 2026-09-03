import { X, Check } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type SearchableOption<T> = {
    value: string | number;
    label: string;
    hint?: string;
    data?: T;
};

type SearchableSelectProps<T> = {
    id: string;
    label: string;
    options: SearchableOption<T>[];
    value: string;
    onChange: (value: string) => void;
    onSelect?: (option: SearchableOption<T> | undefined) => void;
    placeholder?: string;
    emptyText?: string;
    hint?: string;
    clearable?: boolean;
};

export function SearchableSelect<T>({
    id,
    label,
    options,
    value,
    onChange,
    onSelect,
    placeholder = 'Ketik untuk mencari...',
    emptyText = 'Tidak ditemukan',
    hint,
    clearable = true,
}: SearchableSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(
        () => options.find((o) => String(o.value) === String(value)),
        [options, value],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [query]);

    const handleSelect = (option: SearchableOption<T>) => {
        onChange(String(option.value));
        onSelect?.(option);
        setQuery('');
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange('');
        onSelect?.(undefined);
        setQuery('');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) =>
                    Math.min(prev + 1, filtered.length - 1),
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && filtered[selectedIndex]) {
                    handleSelect(filtered[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const inputValue = isOpen ? query : (selected?.label ?? '');

    return (
        <div className="relative grid gap-1.5" ref={wrapperRef}>
            <label htmlFor={id} className="text-heading text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    aria-controls={`${id}-list`}
                    value={inputValue}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    placeholder={placeholder}
                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand block w-full rounded-none border px-3 py-2.5 pr-10 text-sm shadow-xs transition-colors duration-200 focus:ring-1 focus:outline-none"
                />
                {value && clearable ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Hapus"
                        className="text-body-subtle hover:text-heading absolute top-1/2 right-3 -translate-y-1/2"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                ) : null}
            </div>

            {isOpen ? (
                <ul
                    id={`${id}-list`}
                    role="listbox"
                    className="border-border-default bg-neutral-primary absolute z-50 mt-[54px] max-h-60 w-full overflow-auto border shadow-lg"
                >
                    {filtered.length === 0 ? (
                        <li className="text-body-subtle px-4 py-3 text-center text-sm">
                            {emptyText}
                        </li>
                    ) : (
                        filtered.map((option, index) => {
                            const isActive =
                                String(option.value) === String(value);
                            return (
                                <li
                                    key={String(option.value)}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    className={cn(
                                        'cursor-pointer px-4 py-2 transition-colors',
                                        index === selectedIndex || isActive
                                            ? 'bg-brand-soft text-brand'
                                            : 'hover:bg-brand-soft',
                                    )}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(option);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <div className="text-heading text-sm font-medium">
                                                {option.label}
                                            </div>
                                            {option.hint ? (
                                                <div className="text-body-subtle text-xs">
                                                    {option.hint}
                                                </div>
                                            ) : null}
                                        </div>
                                        {isActive ? (
                                            <Check
                                                className="h-4 w-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>
            ) : null}

            {hint ? <p className="text-body-subtle text-xs">{hint}</p> : null}
        </div>
    );
}
