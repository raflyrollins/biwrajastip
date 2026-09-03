import { Head } from '@inertiajs/react';
import { PackagePlus, PackageSearch } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import Pagination from '@/components/Pagination';
import type { PaginationMeta } from '@/types';

type PackageRow = {
    uuid: string;
    biwrajastip_tracking_number: string | null;
    store_tracking_number: string | null;
    receiver_name: string | null;
    status: string;
    total_amount: string | null;
    created_at: string;
};

type PackageIndexProps = {
    packages: {
        data: PackageRow[];
        meta: PaginationMeta;
    };
    statusLabels: Record<string, string>;
    allowCreate: boolean;
};

export default function Packages(props: PackageIndexProps) {
    const { packages, statusLabels, allowCreate } = props;
    const rows = packages.data;

    return (
        <>
            <Head title="Paket" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-heading text-2xl font-bold">
                            Paket
                        </h2>
                        <p className="text-body mt-1">
                            {packages.meta.total} paket dalam lingkup Anda.
                        </p>
                    </div>
                    {allowCreate && (
                        <Button type="button">
                            <PackagePlus className="h-5 w-5" />
                            Daftar Paket Baru
                        </Button>
                    )}
                </div>

                {rows.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <PackageSearch className="text-brand mx-auto h-10 w-10" />
                        <p className="text-heading mt-4 font-medium">
                            Belum ada paket
                        </p>
                        <p className="text-body mt-1 text-sm">
                            Paket yang terdaftar akan tampil di sini.
                        </p>
                    </div>
                ) : (
                    <section className="border-border-default bg-neutral-primary border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-tertiary-soft text-body">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            No. Resi
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Penerima
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Didaftarkan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((pkg) => (
                                        <tr
                                            key={pkg.uuid}
                                            className="border-border-default border-t"
                                        >
                                            <td className="text-brand px-5 py-3 font-medium">
                                                {pkg.biwrajastip_tracking_number ??
                                                    pkg.store_tracking_number ??
                                                    '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                {pkg.receiver_name ?? '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="bg-neutral-tertiary text-heading px-2 py-1 text-xs font-medium">
                                                    {statusLabels[pkg.status] ??
                                                        pkg.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {pkg.total_amount
                                                    ? `Rp ${Number(pkg.total_amount).toLocaleString('id-ID')}`
                                                    : '—'}
                                            </td>
                                            <td className="text-body px-5 py-3">
                                                {new Date(
                                                    pkg.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {packages.meta.last_page > 1 && (
                    <Pagination meta={packages.meta} />
                )}
            </div>
        </>
    );
}

Packages.layout = (page: ReactNode) => (
    <AppLayout title="Paket">{page}</AppLayout>
);
