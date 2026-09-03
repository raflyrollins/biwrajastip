import { Head } from '@inertiajs/react';
import { PackageX } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import Pagination from '@/components/Pagination';
import type { PaginationMeta } from '@/types';

type BagRow = {
    uuid: string;
    bag_number: string;
    status: string;
    sealed_weight_kg: string | null;
    package_count: number;
    created_at: string;
};

type BagIndexProps = {
    bags: {
        data: BagRow[];
        meta: PaginationMeta;
    };
    statusLabels: Record<string, string>;
};

export default function Bags(props: BagIndexProps) {
    const { bags, statusLabels } = props;
    const rows = bags.data;

    return (
        <>
            <Head title="Bag" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">Bag</h2>
                    <p className="text-body mt-1">
                        {bags.meta.total} bag dalam lingkup Anda.
                    </p>
                </div>

                {rows.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <PackageX className="text-brand mx-auto h-10 w-10" />
                        <p className="text-heading mt-4 font-medium">
                            Belum ada bag
                        </p>
                        <p className="text-body mt-1 text-sm">
                            Bag yang dibuat akan tampil di sini.
                        </p>
                    </div>
                ) : (
                    <section className="border-border-default bg-neutral-primary border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-tertiary-soft text-body">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            No. Bag
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Paket
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Berat Segel
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Dibuat
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((bag) => (
                                        <tr
                                            key={bag.uuid}
                                            className="border-border-default border-t"
                                        >
                                            <td className="text-brand px-5 py-3 font-medium">
                                                {bag.bag_number}
                                            </td>
                                            <td className="px-5 py-3">
                                                {bag.package_count}
                                            </td>
                                            <td className="px-5 py-3">
                                                {bag.sealed_weight_kg
                                                    ? `${Number(bag.sealed_weight_kg).toLocaleString('id-ID')} kg`
                                                    : '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="bg-neutral-tertiary text-heading px-2 py-1 text-xs font-medium">
                                                    {statusLabels[bag.status] ??
                                                        bag.status}
                                                </span>
                                            </td>
                                            <td className="text-body px-5 py-3">
                                                {new Date(
                                                    bag.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {bags.meta.last_page > 1 && <Pagination meta={bags.meta} />}
            </div>
        </>
    );
}

Bags.layout = (page: ReactNode) => <AppLayout title="Bag">{page}</AppLayout>;
