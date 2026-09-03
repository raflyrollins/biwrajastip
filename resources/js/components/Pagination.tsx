import { Link } from '@inertiajs/react';
import type { PaginationMeta } from '@/types';

type PaginationProps = {
    meta: Pick<PaginationMeta, 'current_page' | 'last_page' | 'links'>;
};

export default function Pagination({ meta }: PaginationProps) {
    return (
        <nav
            className="flex items-center justify-center gap-1"
            aria-label="Navigasi halaman"
        >
            {meta.links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className="text-body-subtle px-3 py-2 text-sm"
                        >
                            {link.label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-2 text-sm font-medium ${
                            link.active
                                ? 'bg-brand text-on-brand'
                                : 'text-heading hover:bg-neutral-quaternary'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
