import { Head } from '@inertiajs/react';
import { PackageX } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import Pagination from '@/components/Pagination';
import type { PaginationMeta } from '@/types';

type BatchRow = {
    uuid: string;
    batch_number: string;
    status: string;
    bag_count: number;
    scheduled_departure_at: string | null;
    departed_at: string | null;
    created_at: string;
};

type BatchIndexProps = {
    batches: {
        data: BatchRow[];
        meta: PaginationMeta;
    };
    statusLabels: Record<string, string>;
};

function formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('id-ID');
}

export default function Batches(props: BatchIndexProps) {
    const { batches, statusLabels } = props;
    const rows = batches.data;

    return (
        <>
            <Head title="Batch" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">Batch</h2>
                    <p className="text-body mt-1">
                        {batches.meta.total} batch dalam lingkup Anda.
                    </p>
                </div>

                {rows.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <PackageX className="text-brand mx-auto h-10 w-10" />
                        <p className="text-heading mt-4 font-medium">
                            Belum ada batch
                        </p>
                        <p className="text-body mt-1 text-sm">
                            Batch yang dibuat akan tampil di sini.
                        </p>
                    </div>
                ) : (
                    <section className="border-border-default bg-neutral-primary border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-tertiary-soft text-body">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            No. Batch
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Bag
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Jadwal Berangkat
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Berangkat
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((batch) => (
                                        <tr
                                            key={batch.uuid}
                                            className="border-border-default border-t"
                                        >
                                            <td className="text-brand px-5 py-3 font-medium">
                                                {batch.batch_number}
                                            </td>
                                            <td className="px-5 py-3">
                                                {batch.bag_count}
                                            </td>
                                            <td className="px-5 py-3">
                                                {formatDate(
                                                    batch.scheduled_departure_at,
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                {formatDate(batch.departed_at)}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="bg-neutral-tertiary text-heading px-2 py-1 text-xs font-medium">
                                                    {statusLabels[
                                                        batch.status
                                                    ] ?? batch.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {batches.meta.last_page > 1 && (
                    <Pagination meta={batches.meta} />
                )}
            </div>
        </>
    );
}

Batches.layout = (page: ReactNode) => (
    <AppLayout title="Batch">{page}</AppLayout>
);
