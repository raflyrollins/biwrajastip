interface PaymentIconProps {
    method: string;
    className?: string;
}

const iconMap: Record<string, string> = {
    va_bca: '/images/payment-methods/bca_va.png',
    va_bni: '/images/payment-methods/bni_va.png',
    va_mandiri: '/images/payment-methods/mandiri_va.png',
    va_bri: '/images/payment-methods/bri_va.png',
    qris: '/images/payment-methods/qris.png',
};

export function PaymentIcon({ method, className = '' }: PaymentIconProps) {
    const src = iconMap[method];

    if (!src) {
        return null;
    }

    return (
        <img
            src={src}
            alt={method}
            className={`h-7 w-10 shrink-0 object-contain ${className}`}
            loading="lazy"
        />
    );
}
