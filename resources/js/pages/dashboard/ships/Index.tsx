import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Trash2, Pencil } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { ShipEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface Ship {
    uuid: string;
    name: string;
    description: string | null;
    is_active: boolean;
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
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function ShipsIndex() {
    const { ships } = usePage().props as unknown as {
        ships: PaginatedData<Ship>;
    };
    const canCreate = useCan('ships.create');
    const canEdit = useCan('ships.edit');
    const canDelete = useCan('ships.delete');
    const alert = useAlert();
    const confirm = useConfirm();

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const search = form.get('search') as string;

        router.get(
            '/dashboard/ships',
            { search },
            { preserveState: true, replace: true },
        );
    }

    async function handleDelete(ship: Ship) {
        const ok = await confirm(`Yakin ingin menghapus kapal "${ship.name}"?`);

        if (ok) {
            router.delete('/dashboard/ships/' + ship.uuid, {
                onSuccess: () => alert('Kapal berhasil dihapus.'),
            });
        }
    }

    return (
        <>
            <Head title="Kapal" />

            <DashboardLayout title="Kapal">
                <div className="mb-6 flex items-center justify-between">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-2"
                    >
                        <div className="relative">
                            <Search
                                size={16}
                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--body-subtle)]"
                            />
                            <input
                                type="text"
                                name="search"
                                placeholder="Cari kapal..."
                                className="w-64 border border-[var(--border-default)] bg-[var(--neutral-primary)] py-2.5 pr-3 pl-10 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            />
                        </div>
                    </form>
                    {canCreate && (
                        <Link
                            href={'/dashboard/ships/create'}
                            className="border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            + Tambah Kapal
                        </Link>
                    )}
                </div>

                {ships.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada kapal"
                            description="Kapal akan muncul setelah ditambahkan oleh Admin."
                            icon={<ShipEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Nama
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Deskripsi
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Status
                                        </th>
                                        {(canEdit || canDelete) && (
                                            <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ships.data.map((ship) => (
                                        <tr
                                            key={ship.uuid}
                                            className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                                        >
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {ship.name}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-[var(--body-subtle)]">
                                                {ship.description ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {ship.is_active ? (
                                                    <span className="bg-[var(--brand-softer)] px-2 py-1 text-xs font-medium text-[var(--brand-strong)]">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="bg-[var(--neutral-tertiary)] px-2 py-1 text-xs text-[var(--body-subtle)]">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            {(canEdit || canDelete) && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {canEdit && (
                                                            <Link
                                                                href={
                                                                    '/dashboard/ships/' +
                                                                    ship.uuid +
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
                                                                        ship,
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

                        {ships.meta.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between text-sm text-[var(--body-subtle)]">
                                <span>
                                    Menampilkan {ships.meta.from}–
                                    {ships.meta.to} dari {ships.meta.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    {ships.meta.links.map((link, i) => {
                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={i}
                                                    className="flex size-8 cursor-not-allowed items-center justify-center border border-[var(--border-default)] text-[var(--body-subtle)]"
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
                                                className={`flex size-8 items-center justify-center border text-sm no-underline transition-colors ${
                                                    link.active
                                                        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]'
                                                        : 'border-[var(--border-default)] text-[var(--body)] hover:bg-[var(--neutral-tertiary)]'
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                preserveState
                                                preserveScroll
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
