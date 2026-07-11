import { Head, Link } from '@inertiajs/react';
import { Settings } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { SettingsEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import SearchFilters from '@/components/ui/SearchFilters';
import { useCan } from '@/lib/permissions';

interface Role {
    uuid: string;
    name: string;
    label: string;
    permissions_count: number;
}

interface RolesIndexProps {
    roles: Role[];
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function RolesIndex({ roles, filters }: RolesIndexProps) {
    const canManage = useCan('roles.manage');

    return (
        <>
            <Head title="Roles" />

            <DashboardLayout title="Roles">
                {canManage && (
                    <p className="mb-6 text-sm text-[var(--body-subtle)]">
                        Kelola role dan permission.
                    </p>
                )}

                <SearchFilters
                    baseRoute="/dashboard/roles"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari role..."
                    showDateFilter
                />

                {roles.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada role"
                            description="Role akan muncul setelah dikonfigurasi."
                            icon={<SettingsEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-default)]">
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Identifier
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Total Permission
                                    </th>
                                    <th className="px-4 py-3 font-medium text-[var(--heading)]">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr
                                        key={role.uuid}
                                        className="border-b border-[var(--border-default)] last:border-b-0"
                                    >
                                        <td className="px-4 py-3 font-medium text-[var(--heading)]">
                                            {role.label}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-[var(--body-subtle)]">
                                            {role.name}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {role.permissions_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            {canManage && (
                                                <Link
                                                    href={
                                                        '/dashboard/roles/' +
                                                        role.uuid +
                                                        '/edit'
                                                    }
                                                    className="flex w-fit items-center gap-2 border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--body)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                                >
                                                    <Settings size={14} />
                                                    Atur Permission
                                                </Link>
                                            )}
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
