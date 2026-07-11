import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { UserEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import SearchFilters from '@/components/ui/SearchFilters';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface User {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    roles: { name: string; label: string }[];
}

interface UsersIndexProps {
    users: User[];
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const canCreate = useCan('users.create');
    const canUpdate = useCan('users.update');
    const canDelete = useCan('users.delete');
    const alert = useAlert();
    const confirm = useConfirm();

    function handleDelete(uuid: string) {
        confirm('Yakin ingin menghapus pengguna ini?').then((ok) => {
            if (ok) {
                router.delete('/dashboard/users/' + uuid, {
                    onSuccess: () => {
 alert('Pengguna berhasil dihapus.'); 
},
                    onError: (errors) => {
                        const msg = Object.values(errors).flat().join(', ');
                        alert(msg || 'Gagal menghapus pengguna.');
                    },
                });
            }
        });
    }

    return (
        <>
            <Head title="Pengguna" />

            <DashboardLayout title="Pengguna">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[var(--body-subtle)]">
                        Kelola akun pengguna
                    </p>
                    {canCreate && (
                        <Link
                            href={'/dashboard/users/create'}
                            className="inline-block border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            + Tambah Pengguna
                        </Link>
                    )}
                </div>

                <SearchFilters
                    baseRoute="/dashboard/users"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari nama atau email..."
                    showDateFilter
                />

                {users.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada pengguna"
                            description="Pengguna akan muncul setelah ditambahkan oleh Admin atau Owner."
                            icon={<UserEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-default)]">
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Bergabung
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.uuid}
                                        className="border-b border-[var(--border-default)] last:border-b-0"
                                    >
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role.name}
                                                        className="border border-[var(--brand-soft)] bg-[var(--brand-softer)] px-2 py-0.5 text-xs font-medium text-[var(--brand-strong)]"
                                                    >
                                                        {role.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[var(--body-subtle)]">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {canUpdate && (
                                                    <Link
                                                        href={
                                                            '/dashboard/users/' +
                                                            user.uuid +
                                                            '/edit'
                                                        }
                                                        className="flex size-8 items-center justify-center border border-[var(--border-default)] text-[var(--body)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                                    >
                                                        <Pencil size={14} />
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.uuid,
                                                            )
                                                        }
                                                        className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] text-[var(--body)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)]"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}
