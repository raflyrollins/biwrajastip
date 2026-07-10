import { Link, router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PaginationProps {
    meta: PaginationMeta;
}

const PER_PAGE_OPTIONS = [15, 25, 50, 100];

const MIN_PER_PAGE = Math.min(...PER_PAGE_OPTIONS);

export default function Pagination({ meta }: PaginationProps) {
    if (!meta) {
        return null;
    }

    const hasPages = meta.last_page > 1;
    const isFirst = (i: number) => i === 0;
    const isLast = (i: number) => i === meta.links.length - 1;
    const isNav = (i: number) => isFirst(i) || isLast(i);

    const showPerPage = meta.total > MIN_PER_PAGE;

    function handlePerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = Number(e.target.value);
        router.get(
            window.location.pathname,
            { per_page: value },
            { preserveState: true, replace: true },
        );
    }

    return (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--body-subtle)]">
                <span>
                    Menampilkan {meta.from}–{meta.to} dari {meta.total}
                </span>
                {showPerPage && (
                    <select
                        value={meta.per_page}
                        onChange={handlePerPageChange}
                        className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2 py-1 text-xs text-[var(--body)] outline-none"
                    >
                        {PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n}/hlm
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {hasPages && (
                <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
                    {meta.links.map((link: PaginationLink, i: number) => {
                        const classes = isNav(i)
                            ? 'flex items-center justify-center border px-3 py-1.5 text-xs no-underline transition-colors whitespace-nowrap'
                            : 'flex size-8 items-center justify-center border text-xs no-underline transition-colors';

                        if (link.url === null) {
                            return (
                                <span
                                    key={i}
                                    className={`${classes} cursor-not-allowed text-[var(--body-subtle)]`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        }

                        return (
                            <Link
                                key={i}
                                href={link.url}
                                className={`${classes} ${
                                    link.active
                                        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]'
                                        : 'border-[var(--border-default)] text-[var(--body)] hover:bg-[var(--neutral-tertiary)]'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                                preserveScroll
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
