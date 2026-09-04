import { X, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useViewportPosition } from '@/hooks/useViewportPosition';

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
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const { triggerRef, dropdownRef, open, setOpen, position } =
        useViewportPosition(4);

    const selected = useMemo(
        () => options.find((o) => String(o.value) === String(value)),
        [options, value],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, query]);

    const handleSelect = (option: SearchableOption<T>) => {
        onChange(String(option.value));
        onSelect?.(option);
        setQuery('');
        setOpen(false);
    };

    const handleClear = () => {
        onChange('');
        onSelect?.(undefined);
        setQuery('');
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
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
        }
    };

    const inputValue = open ? query : (selected?.label ?? '');

    return (
        <div
            className="grid gap-1.5"
            ref={triggerRef as React.Ref<HTMLDivElement>}
        >
            <label htmlFor={id} className="text-heading text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-autocomplete="list"
                    aria-controls={`${id}-list`}
                    value={inputValue}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!open) setOpen(true);
                    }}
                    onFocus={() => {
                        if (!open) setOpen(true);
                    }}
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

            {open && position && (
                <ul
                    id={`${id}-list`}
                    ref={dropdownRef as React.Ref<HTMLUListElement>}
                    role="listbox"
                    style={position}
                    className="border-border-default bg-neutral-primary max-h-60 overflow-auto border shadow-lg"
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
            )}

            {hint ? <p className="text-body-subtle text-xs">{hint}</p> : null}
        </div>
    );
}
