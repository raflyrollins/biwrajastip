import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    meta: {
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
};

function buildPageNumbers(current: number, last: number): (number | '...')[] {
    if (last <= 5) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];

    if (current <= 3) {
        pages.push(1, 2, 3, '...', last);
    } else if (current >= last - 2) {
        pages.push(1, '...', last - 2, last - 1, last);
    } else {
        pages.push(1, '...', current, '...', last);
    }

    return pages;
}

function findUrl(
    links: PaginationProps['meta']['links'],
    page: number,
): string | null {
    // Laravel pagination links: "Previous" (idx 0), page 1 (idx 1), ..., "Next" (last idx)
    const idx = page; // page 1 → idx 1, page 2 → idx 2, etc.
    return links[idx]?.url ?? null;
}

export default function Pagination({ meta }: PaginationProps) {
    const { current_page, last_page, links } = meta;

    if (last_page <= 1) return null;

    const prevUrl = links[0]?.url ?? null;
    const nextUrl = links[links.length - 1]?.url ?? null;
    const pages = buildPageNumbers(current_page, last_page);

    return (
        <nav
            className="flex items-center justify-center gap-1"
            aria-label="Navigasi halaman"
        >
            {/* Previous */}
            <Link
                href={prevUrl ?? '#'}
                preserveScroll
                aria-label="Halaman sebelumnya"
                className={`flex h-9 w-9 items-center justify-center rounded-sm text-sm font-medium ${
                    prevUrl
                        ? 'text-heading hover:bg-neutral-quaternary'
                        : 'text-body-subtle pointer-events-none cursor-not-allowed'
                }`}
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>

            {/* Page numbers */}
            {pages.map((page, i) => {
                if (page === '...') {
                    return (
                        <span
                            key={`ellipsis-${i}`}
                            className="text-body-subtle px-1 text-sm"
                        >
                            …
                        </span>
                    );
                }

                const url = findUrl(links, page);
                const isActive = page === current_page;

                return (
                    <Link
                        key={page}
                        href={url ?? '#'}
                        preserveScroll
                        className={`flex h-9 w-9 items-center justify-center rounded-sm text-sm font-medium ${
                            isActive
                                ? 'bg-brand text-on-brand'
                                : 'text-heading hover:bg-neutral-quaternary'
                        }`}
                    >
                        {page}
                    </Link>
                );
            })}

            {/* Next */}
            <Link
                href={nextUrl ?? '#'}
                preserveScroll
                aria-label="Halaman berikutnya"
                className={`flex h-9 w-9 items-center justify-center rounded-sm text-sm font-medium ${
                    nextUrl
                        ? 'text-heading hover:bg-neutral-quaternary'
                        : 'text-body-subtle pointer-events-none cursor-not-allowed'
                }`}
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
        </nav>
    );
}
