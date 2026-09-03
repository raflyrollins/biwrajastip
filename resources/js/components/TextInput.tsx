import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    reserveErrorSpace?: boolean;
};

/**
 * Text input whose box size (height/width) NEVER changes when an error appears.
 * The error message renders in a fixed-height slot so neighbours don't shift.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    function TextInput(
        {
            id,
            label,
            error,
            hint,
            reserveErrorSpace = true,
            className,
            ...props
        },
        ref,
    ) {
        const message = error ?? hint ?? '';

        return (
            <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor={id}
                        className="text-heading text-sm font-medium"
                    >
                        {label}
                    </label>
                    {reserveErrorSpace && error ? (
                        <span className="text-fg-danger-strong inline-flex items-center gap-1 text-xs font-medium">
                            <AlertCircle
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            />
                            Wajib diperbaiki
                        </span>
                    ) : null}
                </div>

                <div
                    className={
                        // Fixed-height message slot keeps the surrounding layout stable.
                        reserveErrorSpace ? 'relative grid' : 'relative'
                    }
                >
                    <input
                        ref={ref}
                        id={id}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={
                            error
                                ? `${id}-error`
                                : hint
                                  ? `${id}-hint`
                                  : undefined
                        }
                        className={cn(
                            'bg-neutral-secondary-medium text-heading placeholder:text-body block w-full rounded-none border px-3 py-2.5 text-sm shadow-xs transition-colors duration-200 focus:ring-1 focus:outline-none',
                            error
                                ? 'border-danger focus:border-danger focus:ring-danger'
                                : 'border-border-default-medium focus:border-brand focus:ring-brand',
                            className,
                        )}
                        {...props}
                    />
                </div>

                {reserveErrorSpace ? (
                    <p className="text-fg-danger-strong h-4 text-xs">
                        {message || '\u00A0'}
                    </p>
                ) : message ? (
                    <p
                        id={error ? `${id}-error` : `${id}-hint`}
                        className={cn(
                            'text-xs',
                            error
                                ? 'text-fg-danger-strong'
                                : 'text-body-subtle',
                        )}
                    >
                        {message}
                    </p>
                ) : null}
            </div>
        );
    },
);
