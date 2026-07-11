import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Edit, Plus, Printer, ReceiptText, Trash2, Weight } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface Zone {
    uuid: string;
    name: string;
}

interface Package {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    receiver_name: string;
    status: string;
    weight_estimated: string | null;
    weight_actual: string | null;
    price: string | null;
    total_price: string | null;
    created_at: string;
    user_id: number;
    zone: Zone | null;
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
    waiting_for_collection: 'Menunggu Penjemputan',
    collected: 'Terkumpul',
    waiting_for_payment: 'Menunggu Pembayaran',
    paid: 'Lunas',
    bagging: 'Packing',
    batched: 'Dalam Batch',
    heading_to_port: 'Berangkat ke Pelabuhan',
    at_port: 'Di Pelabuhan',
    in_transit: 'Dalam Perjalanan',
    arrived: 'Tiba',
    arrived_at_warehouse: 'Barang Tiba di Gudang',
    ready_for_sorting: 'Siap Disortir',
    ready_for_pickup: 'Siap Diambil',
    in_delivery: 'Dalam Pengantaran',
    completed: 'Selesai',
};

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        waiting_for_collection: 'var(--warning)',
        waiting_for_payment: 'var(--warning)',
        paid: 'var(--success)',
        completed: 'var(--success)',
        ready_for_pickup: 'var(--success)',
    };

    return colors[status] ?? 'var(--fg-brand-strong)';
}

interface PackagesIndexProps {
    packages: PaginatedData<Package>;
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function PackagesIndex({ packages, filters }: PackagesIndexProps) {
    const canCreate = useCan('packages.create');
    const canDelete = useCan('packages.delete');
    const canUpdate = useCan('packages.update');
    const canCollectedScope = useCan('packages.scope.collected');
    const canPay = useCan('payments.create');
    const canPrint = useCan('packages.print');
    const alert = useAlert();
    const confirm = useConfirm();

    async function handleDelete(pkg: Package) {
        const confirmed = await confirm(
            `Yakin ingin menghapus paket ${pkg.tracking_number}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/dashboard/packages/${pkg.uuid}`, {
            onSuccess: () => {
                alert('Paket berhasil dihapus.');
            },
        });
    }

    return (
        <>
            <Head title="Paket" />

            <DashboardLayout title="Paket">
                <SearchFilters
                    baseRoute="/dashboard/packages"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari tracking, penerima, pengirim..."
                    showDateFilter
                />
                {canCreate && (
                    <div className="mb-6 flex justify-end">
                        <Link
                            href="/dashboard/packages/create"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            <Plus size={16} />
                            Buat Paket
                        </Link>
                    </div>
                )}

                {packages.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada paket"
                            description="Paket yang kamu buat akan muncul di sini."
                            icon={<PackageEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)] text-[var(--body-subtle)]">
                                        <th className="px-4 py-3 font-medium">
                                            No. Tracking
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Penerima
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Zona
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Berat
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Harga
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.data.map((pkg) => (
                                        <tr
                                            key={pkg.uuid}
                                            className="border-b border-[var(--border-default)] last:border-0"
                                        >
                                            <td className="px-4 py-3 text-[var(--heading)]">
                                                {pkg.tracking_number}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {pkg.receiver_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-block px-2.5 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            getStatusColor(
                                                                pkg.status,
                                                            ) + '20',
                                                        color: getStatusColor(
                                                            pkg.status,
                                                        ),
                                                    }}
                                                >
                                                    {STATUS_LABELS[
                                                        pkg.status
                                                    ] ?? pkg.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {pkg.zone?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {pkg.weight_actual
                                                    ? `${pkg.weight_actual} kg`
                                                    : pkg.weight_estimated
                                                      ? `${pkg.weight_estimated} kg (est)`
                                                      : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {pkg.total_price
                                                    ? `Rp ${Number(pkg.total_price).toLocaleString('id-ID')}`
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body-subtle)]">
                                                {new Date(
                                                    pkg.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {canUpdate &&
                                                        canCollectedScope &&
                                                        pkg.status ===
                                                            'collected' && (
                                                            <Link
                                                                href={`/dashboard/packages/${pkg.uuid}/weigh`}
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                            >
                                                                <Weight
                                                                    size={14}
                                                                />
                                                                Timbang
                                                            </Link>
                                                        )}
                                                    {canUpdate &&
                                                        pkg.status ===
                                                            'waiting_for_collection' && (
                                                            <Link
                                                                href={`/dashboard/packages/${pkg.uuid}/edit`}
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                            >
                                                                <Edit size={14} />
                                                                Edit
                                                            </Link>
                                                        )}
                                                    {canPay &&
                                                        pkg.status ===
                                                            'waiting_for_payment' && (
                                                            <Link
                                                                href={`/dashboard/payments/create?package=${pkg.uuid}`}
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--brand)] px-2.5 py-1.5 text-xs font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                                                            >
                                                                <ReceiptText
                                                                    size={14}
                                                                />
                                                                Bayar
                                                            </Link>
                                                        )}
                                                    {canPrint &&
                                                        pkg.status ===
                                                            'paid' && (
                                                            <Link
                                                                href={`/dashboard/packages/${pkg.uuid}/receipt`}
                                                                target="_blank"
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                            >
                                                                <Printer
                                                                    size={14}
                                                                />
                                                                Cetak Resi
                                                            </Link>
                                                        )}
                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    pkg,
                                                                )
                                                            }
                                                            className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                        >
                                                            <Trash2 size={14} />
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination meta={packages} />
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
