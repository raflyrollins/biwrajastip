import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'brand' | 'white' | 'danger';
    size?: 'base' | 'large';
    fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        {
            variant = 'brand',
            size = 'base',
            fullWidth = false,
            className,
            type = 'button',
            ...props
        },
        ref,
    ) {
        return (
            <button
                ref={ref}
                type={type}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-none px-6 py-4 font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    size === 'large' && 'px-10 py-5 text-lg',
                    variant === 'brand' &&
                        'bg-brand text-on-brand hover:bg-brand-strong focus-visible:ring-brand',
                    variant === 'white' &&
                        'text-fg-brand hover:bg-neutral-tertiary focus-visible:ring-brand bg-white',
                    variant === 'danger' &&
                        'bg-fg-danger-strong text-white hover:bg-red-700 focus-visible:ring-red-500',
                    fullWidth && 'w-full',
                    className,
                )}
                {...props}
            />
        );
    },
);
