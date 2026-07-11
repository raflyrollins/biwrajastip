import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2, Pencil } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { ZoneEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface Zone {
    uuid: string;
    name: string;
    delivery_fee: string;
    shipping_price: string;
    is_central: boolean;
    description: string | null;
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

export default function ZonesIndex() {
    const { zones, filters } = usePage().props as unknown as {
        zones: PaginatedData<Zone>;
        filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
    };
    const canCreate = useCan('zones.create');
    const canEdit = useCan('zones.update');
    const canDelete = useCan('zones.delete');
    const alert = useAlert();
    const confirm = useConfirm();

    async function handleDelete(zone: Zone) {
        const ok = await confirm(`Yakin ingin menghapus zona "${zone.name}"?`);

        if (ok) {
            router.delete('/dashboard/zones/' + zone.uuid, {
                onSuccess: () => {
 alert('Zona berhasil dihapus.'); 
},
            });
        }
    }

    return (
        <>
            <Head title="Zona" />

            <DashboardLayout title="Zona">
                <SearchFilters
                    baseRoute="/dashboard/zones"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari zona..."
                    showDateFilter
                />
                {canCreate && (
                    <div className="mb-6 flex justify-end">
                        <Link
                            href={'/dashboard/zones/create'}
                            className="border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            + Tambah Zona
                        </Link>
                    </div>
                )}

                {zones.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada zona"
                            description="Zona akan muncul setelah ditambahkan oleh Admin."
                            icon={<ZoneEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Harga Kirim (kg)
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Biaya Antar
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Pusat
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Deskripsi
                                        </th>
                                        {(canEdit || canDelete) && (
                                            <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {zones.data.map((zone) => (
                                        <tr
                                            key={zone.uuid}
                                            className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                                        >
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {zone.name}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                Rp{' '}
                                                {Number(
                                                    zone.shipping_price,
                                                ).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                Rp{' '}
                                                {Number(
                                                    zone.delivery_fee,
                                                ).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {zone.is_central ? (
                                                    <span className="bg-[var(--brand-softer)] px-2 py-1 text-xs font-medium text-[var(--brand-strong)]">
                                                        Pusat
                                                    </span>
                                                ) : (
                                                    <span className="bg-[var(--neutral-tertiary)] px-2 py-1 text-xs text-[var(--body-subtle)]">
                                                        Cabang
                                                    </span>
                                                )}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-[var(--body-subtle)]">
                                                {zone.description ?? '—'}
                                            </td>
                                            {(canEdit || canDelete) && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {canEdit && (
                                                            <Link
                                                                href={
                                                                    '/dashboard/zones/' +
                                                                    zone.uuid +
                                                                    '/edit'
                                                                }
                                                                className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)] hover:text-[var(--heading)]"
                                                            >
                                                                <Pencil
                                                                    size={14}
                                                                />
                                                            </Link>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        zone,
                                                                    )
                                                                }
                                                                className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] transition-colors hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination meta={zones} />
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
