import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import DatePicker from '@/components/ui/DatePicker';

interface SearchFiltersProps {
    baseRoute: string;
    searchPlaceholder?: string;
    showDateFilter?: boolean;
    showYearFilter?: boolean;
}

function getParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        search: params.get('search') ?? '',
        dateFrom: params.get('date_from') ?? '',
        dateTo: params.get('date_to') ?? '',
        year: params.get('year') ?? '',
    };
}

export default function SearchFilters({
    baseRoute,
    searchPlaceholder = 'Cari...',
    showDateFilter = true,
    showYearFilter = false,
}: SearchFiltersProps) {
    const initial = getParams();
    const [search, setSearch] = useState(initial.search);
    const [dateFrom, setDateFrom] = useState(initial.dateFrom);
    const [dateTo, setDateTo] = useState(initial.dateTo);
    const [yearFilter, setYearFilter] = useState(initial.year);

    useEffect(() => {
        function handlePopState() {
            const p = getParams();
            setSearch(p.search);
            setDateFrom(p.dateFrom);
            setDateTo(p.dateTo);
            setYearFilter(p.year);
        }
        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    function applyFilters() {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (yearFilter) params.year = yearFilter;

        router.get(baseRoute, params, { preserveState: true, replace: true });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    }

    function clearFilters() {
        router.get(baseRoute, {}, { preserveState: true, replace: true });
    }

    const hasFilters = search || dateFrom || dateTo || yearFilter;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

    return (
        <div className="mb-6 flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1 max-w-md">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--body-subtle)]"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={searchPlaceholder}
                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] py-2.5 pl-10 pr-3 text-sm text-[var(--body)] outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                    />
                </div>
            </div>

            {showDateFilter && (
                <>
                    <DatePicker
                        value={dateFrom}
                        onChange={setDateFrom}
                        placeholder="Dari tanggal"
                    />
                    <span className="text-sm text-[var(--body-subtle)]">–</span>
                    <DatePicker
                        value={dateTo}
                        onChange={setDateTo}
                        placeholder="Sampai tanggal"
                    />
                </>
            )}

            {showYearFilter && (
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                >
                    <option value="">Semua Tahun</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            )}

            <button
                type="button"
                onClick={applyFilters}
                className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-2.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
            >
                Cari
            </button>

            {hasFilters && (
                <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-transparent px-4 py-2.5 text-sm text-[var(--body-subtle)] transition-colors hover:text-[var(--body)]"
                >
                    <X size={14} />
                    Reset
                </button>
            )}
        </div>
    );
}
