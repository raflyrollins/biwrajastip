import { Head, Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { BatchEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useCan } from '@/lib/permissions';

interface ShipData {
    name: string;
}

interface ScheduleData {
    departure_date: string;
    arrival_date: string;
}

interface BatchData {
    uuid: string;
    code: string;
    status: string;
    notes: string | null;
    created_at: string;
    bags_count: number;
    ship: ShipData | null;
    schedule: ScheduleData | null;
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
    preparing: 'Persiapan',
    departed: 'Berangkat',
    arrived: 'Tiba',
    unbatched: 'Dibongkar',
};

function getStatusColor(status: string): string {
    switch (status) {
        case 'preparing':
            return 'var(--warning)';
        case 'departed':
            return 'var(--brand)';
        case 'arrived':
            return 'var(--success)';
        case 'unbatched':
            return 'var(--body-subtle)';
        default:
            return 'var(--body)';
    }
}

interface BatchesIndexProps {
    batches: PaginatedData<BatchData>;
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function BatchesIndex({ batches, filters }: BatchesIndexProps) {
    const canPrint = useCan('batches.print');

    return (
        <>
            <Head title="Batch" />

            <DashboardLayout title="Batch">
                <SearchFilters
                    baseRoute="/dashboard/batches"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari kode batch..."
                    showDateFilter
                />
                {batches.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada Batch"
                            description="Batch akan muncul setelah kamu melakukan batching di BiwraHub."
                            icon={<BatchEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)] text-[var(--body-subtle)]">
                                        <th className="px-4 py-3 font-medium">Kode Batch</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Kapal</th>
                                        <th className="px-4 py-3 font-medium">Keberangkatan</th>
                                        <th className="px-4 py-3 font-medium">Jml Bag</th>
                                        <th className="px-4 py-3 font-medium">Catatan</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.data.map((batch) => (
                                        <tr
                                            key={batch.uuid}
                                            className="border-b border-[var(--border-default)] last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium text-[var(--heading)]">
                                                {batch.code}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-block px-2.5 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getStatusColor(batch.status) + '20',
                                                        color: getStatusColor(batch.status),
                                                    }}
                                                >
                                                    {STATUS_LABELS[batch.status] ?? batch.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {batch.ship?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {batch.schedule
                                                    ? `${new Date(batch.schedule.departure_date).toLocaleDateString('id-ID')} - ${new Date(batch.schedule.arrival_date).toLocaleDateString('id-ID')}`
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {batch.bags_count}
                                            </td>
                                            <td className="max-w-40 truncate px-4 py-3 text-[var(--body)]">
                                                {batch.notes ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body-subtle)]">
                                                {new Date(batch.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canPrint && (
                                                    <Link
                                                        href={`/dashboard/batches/${batch.uuid}/manifest`}
                                                        target="_blank"
                                                        className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                    >
                                                        <Printer size={14} />
                                                        Cetak Manifest
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination meta={batches} />
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
