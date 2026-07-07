interface EmptyStateProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export default function EmptyState({
    title,
    description,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-5 text-[var(--body-subtle)] opacity-60">
                {icon}
            </div>
            <p className="mb-1 text-sm font-medium text-[var(--heading)]">
                {title}
            </p>
            <p className="max-w-xs text-sm text-[var(--body-subtle)]">
                {description}
            </p>
        </div>
    );
}
