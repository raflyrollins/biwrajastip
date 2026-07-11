import { Head, Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { BagEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useCan } from '@/lib/permissions';

interface BagData {
    uuid: string;
    code: string;
    status: string;
    weight: number | null;
    packages_count: number;
    created_at: string;
    batch: { code: string } | null;
    creator: { name: string } | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const STATUS_LABELS: Record<string, string> = {
    created: 'Tersedia',
    in_batch: 'Dalam Batch',
    unbagged: 'Dibongkar',
};

function getStatusColor(status: string): string {
    switch (status) {
        case 'created':
            return 'var(--brand)';
        case 'in_batch':
            return 'var(--warning)';
        case 'unbagged':
            return 'var(--body-subtle)';
        default:
            return 'var(--body)';
    }
}

interface BagsIndexProps {
    bags: PaginatedData<BagData>;
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function BagsIndex({ bags, filters }: BagsIndexProps) {
    const canPrint = useCan('bags.print');

    return (
        <>
            <Head title="Bag" />

            <DashboardLayout title="Bag">
                <SearchFilters
                    baseRoute="/dashboard/bags"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari kode bag..."
                    showDateFilter
                />
                {bags.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada Bag"
                            description="Bag akan muncul setelah kamu melakukan bagging di BiwraHub."
                            icon={<BagEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)] text-[var(--body-subtle)]">
                                        <th className="px-4 py-3 font-medium">Kode Bag</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Jumlah Paket</th>
                                        <th className="px-4 py-3 font-medium">Berat (kg)</th>
                                        <th className="px-4 py-3 font-medium">Batch</th>
                                        <th className="px-4 py-3 font-medium">Dibuat Oleh</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bags.data.map((bag) => (
                                        <tr
                                            key={bag.uuid}
                                            className="border-b border-[var(--border-default)] last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium text-[var(--heading)]">
                                                {bag.code}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-block px-2.5 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getStatusColor(bag.status) + '20',
                                                        color: getStatusColor(bag.status),
                                                    }}
                                                >
                                                    {STATUS_LABELS[bag.status] ?? bag.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {bag.packages_count}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {bag.weight ? bag.weight / 1000 : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {bag.batch?.code ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {bag.creator?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body-subtle)]">
                                                {new Date(bag.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canPrint && (
                                                    <Link
                                                        href={`/dashboard/bags/${bag.uuid}/label`}
                                                        target="_blank"
                                                        className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                    >
                                                        <Printer size={14} />
                                                        Cetak Label
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination meta={bags} />
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
