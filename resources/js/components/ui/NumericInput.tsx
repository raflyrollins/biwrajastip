import { cn } from '@/lib/utils';

interface NumericInputProps {
    value?: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    allowDecimal?: boolean;
    suffix?: string;
}

export default function NumericInput({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    allowDecimal = true,
    suffix,
}: NumericInputProps) {
    function handleInput(e: React.FormEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        let val = input.value;

        const regex = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
        val = val.replace(regex, '');

        if (allowDecimal) {
            const parts = val.split('.');
            if (parts.length > 2) {
                val = parts[0] + '.' + parts.slice(1).join('');
            }
        }

        if (val !== input.value) {
            input.value = val;
        }

        onChange(val);
    }

    return (
        <div className={cn('relative', className)}>
            <input
                type="text"
                inputMode={allowDecimal ? 'decimal' : 'numeric'}
                value={value ?? ''}
                onInput={handleInput}
                onChange={() => {}}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    'w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] outline-none transition-colors placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]',
                    disabled && 'cursor-not-allowed opacity-50',
                    suffix && 'pr-10',
                )}
            />
            {suffix && (
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[var(--body-subtle)]">
                    {suffix}
                </span>
            )}
        </div>
    );
}
