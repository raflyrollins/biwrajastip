import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2, Pencil } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { ScheduleEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface Schedule {
    uuid: string;
    ship: { uuid: string; name: string };
    departure_date: string;
    arrival_date: string | null;
    notes: string | null;
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

export default function SchedulesIndex() {
    const { schedules, filters } = usePage().props as unknown as {
        schedules: PaginatedData<Schedule>;
        filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
    };
    const canCreate = useCan('schedules.create');
    const canEdit = useCan('schedules.edit');
    const canDelete = useCan('schedules.delete');
    const alert = useAlert();
    const confirm = useConfirm();

    async function handleDelete(schedule: Schedule) {
        const ok = await confirm('Yakin ingin menghapus jadwal ini?');

        if (ok) {
            router.delete('/dashboard/schedules/' + schedule.uuid, {
                onSuccess: () => {
 alert('Jadwal berhasil dihapus.'); 
},
            });
        }
    }

    function formatDate(date: string) {
        const d = new Date(date + 'T00:00:00');
        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    return (
        <>
            <Head title="Jadwal" />

            <DashboardLayout title="Jadwal">
                <SearchFilters
                    baseRoute="/dashboard/schedules"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    year={filters?.year ?? ''}
                    searchPlaceholder="Cari kapal..."
                    showDateFilter
                    showYearFilter
                />
                {canCreate && (
                    <div className="mb-6 flex justify-end">
                        <Link
                            href={'/dashboard/schedules/create'}
                            className="border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            + Tambah Jadwal
                        </Link>
                    </div>
                )}

                {schedules.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada jadwal"
                            description="Jadwal akan muncul setelah ditambahkan oleh Admin."
                            icon={<ScheduleEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Kapal
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Berangkat
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Tiba
                                        </th>
                                        <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                            Catatan
                                        </th>
                                        {(canEdit || canDelete) && (
                                            <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                                Aksi
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.data.map((schedule) => (
                                        <tr
                                            key={schedule.uuid}
                                            className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                                        >
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {schedule.ship.name}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {formatDate(
                                                    schedule.departure_date,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {schedule.arrival_date
                                                    ? formatDate(
                                                          schedule.arrival_date,
                                                      )
                                                    : '—'}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-[var(--body-subtle)]">
                                                {schedule.notes ?? '—'}
                                            </td>
                                            {(canEdit || canDelete) && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {canEdit && (
                                                            <Link
                                                                href={
                                                                    '/dashboard/schedules/' +
                                                                    schedule.uuid +
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
                                                                        schedule,
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

                        <Pagination meta={schedules} />
                    </>
                )}
            </DashboardLayout>
        </>
    );
}
