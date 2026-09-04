import { Head, Link, router } from '@inertiajs/react';
import { FileText, PackagePlus, PackageSearch, Search } from 'lucide-react';
import { type FormEvent, useState, type ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { useRealtimeSectionRefresh } from '@/hooks/useRealtimeSectionRefresh';
import Pagination from '@/components/Pagination';
import { StatusFilter } from '@/components/StatusFilter';
import payments from '@/routes/payments';
import type { PaginationMeta } from '@/types';

type PackageRow = {
    uuid: string;
    biwrajastip_tracking_number: string | null;
    store_tracking_number: string | null;
    receiver_name: string | null;
    status: string;
    total_amount: string | null;
    created_at: string;
    can_pay: boolean;
    has_pending_payment: boolean;
    can_process: boolean;
    can_print_receipt: boolean;
};

type Filters = {
    search: string;
    status: string[];
};

type PackageIndexProps = {
    packages: {
        data: PackageRow[];
        meta: PaginationMeta;
    };
    statusLabels: Record<string, string>;
    allowCreate: boolean;
    allowProcess: boolean;
    filters: Filters;
};

export default function Packages(props: PackageIndexProps) {
    const { packages, statusLabels, allowCreate, allowProcess, filters } =
        props;
    const rows = packages.data;

    useRealtimeSectionRefresh([
        { name: 'packages', event: '.package.created' },
        { name: 'packages', event: '.package.status.updated' },
        { name: 'packages', event: '.payment.updated' },
    ]);

    const [status, setStatus] = useState<string[]>(filters.status);

    const applyFilters = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const search = (data.get('search') as string) ?? '';
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (status.length > 0) params.status = status.join(',');
        router.get('/packages', params, {
            preserveScroll: true,
            replace: true,
        });
    };

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
                        <Link href="/packages/create">
                            <Button type="button" className="w-full sm:w-auto">
                                <PackagePlus className="h-5 w-5" />
                                Daftar Paket Baru
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filter bar */}
                <form
                    onSubmit={applyFilters}
                    className="border-border-default bg-neutral-primary flex flex-col gap-3 border p-4 sm:flex-row sm:items-end sm:gap-4"
                >
                    <div className="flex-1">
                        <label
                            htmlFor="pkg-search"
                            className="text-heading mb-1.5 block text-sm font-medium"
                        >
                            Cari
                        </label>
                        <div className="relative">
                            <Search className="text-body-subtle pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <input
                                id="pkg-search"
                                name="search"
                                type="search"
                                defaultValue={filters.search}
                                placeholder="No. resi / nama penerima"
                                className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border py-2.5 pr-3 pl-9 text-sm shadow-xs transition-colors duration-200 focus:ring-1 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="w-full sm:w-64">
                        <StatusFilter
                            value={status}
                            onChange={setStatus}
                            options={statusLabels}
                        />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto">
                        Terapkan
                    </Button>
                </form>

                {rows.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <PackageSearch className="text-brand mx-auto h-10 w-10" />
                        <p className="text-heading mt-4 font-medium">
                            {filters.search || filters.status.length > 0
                                ? 'Tidak ada paket yang cocok'
                                : 'Belum ada paket'}
                        </p>
                        <p className="text-body mt-1 text-sm">
                            {filters.search || filters.status.length > 0
                                ? 'Coba ubah filter pencarian Anda.'
                                : 'Paket yang terdaftar akan tampil di sini.'}
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
                                        <th className="px-5 py-3 font-medium">
                                            Aksi
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
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {allowProcess &&
                                                    pkg.can_process ? (
                                                        <Link
                                                            href={`/packages/${pkg.uuid}/process`}
                                                        >
                                                            <span className="text-brand hover:underline">
                                                                Proses
                                                            </span>
                                                        </Link>
                                                    ) : pkg.can_pay ? (
                                                        <Link
                                                            href={payments.checkout.url(
                                                                pkg.uuid,
                                                            )}
                                                        >
                                                            <span className="text-brand hover:underline">
                                                                Bayar
                                                            </span>
                                                        </Link>
                                                    ) : pkg.has_pending_payment ? (
                                                        <Link
                                                            href={payments.show.url(
                                                                pkg.uuid,
                                                            )}
                                                        >
                                                            <span className="text-brand hover:underline">
                                                                Lihat Pembayaran
                                                            </span>
                                                        </Link>
                                                    ) : pkg.can_print_receipt ? (
                                                        <Link
                                                            href={`/packages/${pkg.uuid}/receipt`}
                                                            target="_blank"
                                                        >
                                                            <span className="text-brand inline-flex items-center gap-1 hover:underline">
                                                                <FileText className="h-3.5 w-3.5" />
                                                                Resi
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-body-subtle">
                                                            —
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                <Pagination meta={packages.meta} />
            </div>
        </>
    );
}

Packages.layout = (page: ReactNode) => (
    <AppLayout title="Paket">{page}</AppLayout>
);
