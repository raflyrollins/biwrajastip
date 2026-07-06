import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';

type ButtonSize = 'default' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--brand)] text-[var(--on-brand)] hover:bg-[var(--brand-strong)]',
    secondary: 'bg-[var(--dark)] text-white hover:bg-[var(--dark-strong)]',
    outline:
        'bg-transparent text-[var(--heading)] border border-[var(--border-default)] hover:bg-[var(--neutral-tertiary)]',
    ghost: 'bg-transparent text-[var(--body)] hover:bg-[var(--neutral-tertiary)] hover:text-[var(--heading)]',
    white: 'bg-white text-[var(--fg-brand)] hover:bg-[var(--neutral-tertiary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
    default: 'px-6 py-4 text-base',
    large: 'px-10 py-5 text-xl',
};

export default function Button({
    variant,
    size = 'default',
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 border-none leading-none font-medium no-underline transition-[background-color] duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed text-[var(--fg-disabled)] opacity-50' : 'cursor-pointer'} ${className}`}
            disabled={disabled}
            {...props}
        />
    );
}
