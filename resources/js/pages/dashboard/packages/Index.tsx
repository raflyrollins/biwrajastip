import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Edit, Plus, Trash2, Weight } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';
import { cn } from '@/lib/utils';

interface Zone {
    uuid: string;
    name: string;
}

interface Package {
    uuid: string;
    tracking_number: string;
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
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

const STATUS_LABELS: Record<string, string> = {
    waiting_for_collection: 'Menunggu Penjemputan',
    collected: 'Terkumpul',
    waiting_for_payment: 'Menunggu Pembayaran',
    paid: 'Lunas',
    bagging: 'Packing',
    berangkat_ke_pelabuhan: 'Berangkat ke Pelabuhan',
    in_transit: 'Dalam Perjalanan',
    arrived: 'Tiba',
    ready_for_sorting: 'Siap Disortir',
    siap_diambil: 'Siap Diambil',
    dalam_pengantaran: 'Dalam Pengantaran',
    selesai: 'Selesai',
};

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        waiting_for_collection: 'var(--warning)',
        waiting_for_payment: 'var(--warning)',
        paid: 'var(--success)',
        selesai: 'var(--success)',
        siap_diambil: 'var(--success)',
    };

    return colors[status] ?? 'var(--fg-brand-strong)';
}

interface PackagesIndexProps {
    packages: PaginatedData<Package>;
}

export default function PackagesIndex({ packages }: PackagesIndexProps) {
    const canCreate = useCan('packages.create');
    const canDelete = useCan('packages.delete');
    const canUpdate = useCan('packages.update');
    const canCollectedScope = useCan('packages.scope.collected');
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
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[var(--body-subtle)]">
                        Daftar semua paket
                    </p>
                    {canCreate && (
                        <Link
                            href="/dashboard/packages/create"
                            className="inline-flex cursor-pointer items-center gap-2 border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            <Plus size={16} />
                            Buat Paket
                        </Link>
                    )}
                </div>

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
                            <table className="w-full text-left text-sm">
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
                                                                href={`/dashboard/packages/${pkg.uuid}/timbang`}
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                            >
                                                                <Weight
                                                                    size={14}
                                                                />
                                                                Timbang
                                                            </Link>
                                                        )}
                                                    {canUpdate && (
                                                        <Link
                                                            href={`/dashboard/packages/${pkg.uuid}/edit`}
                                                            className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-2.5 py-1.5 text-xs text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                                                        >
                                                            <Edit size={14} />
                                                            Edit
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

                        {packages.meta.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-[var(--body-subtle)]">
                                <span>
                                    Menampilkan {packages.meta.from}-
                                    {packages.meta.to} dari{' '}
                                    {packages.meta.total}
                                </span>
                                <div className="flex gap-1">
                                    {packages.links.map((link, i) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={i}
                                                    className={cn(
                                                        'px-3 py-1.5',
                                                        link.active &&
                                                            'bg-[var(--brand)] text-[var(--on-brand)]',
                                                    )}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={cn(
                                                    'px-3 py-1.5 no-underline transition-colors hover:bg-[var(--neutral-tertiary)]',
                                                    link.active &&
                                                        'bg-[var(--brand)] text-[var(--on-brand)] hover:bg-[var(--brand-strong)]',
                                                    !link.active &&
                                                        'text-[var(--body)]',
                                                )}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
