import { Head } from '@inertiajs/react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/permissions';

export default function DashboardIndex() {
    const { user, permissions } = useAuth();

    return (
        <>
            <Head title="Dashboard" />

            <DashboardLayout title="Dashboard">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Total Paket"
                        value="0"
                        color="var(--brand)"
                    />
                    <StatCard
                        label="Paket Dalam Proses"
                        value="0"
                        color="var(--warning)"
                    />
                    <StatCard
                        label="Paket Selesai"
                        value="0"
                        color="var(--success)"
                    />
                </div>

                <section className="mt-8 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <h2 className="mb-4 text-lg font-bold text-[var(--heading)]">
                        Selamat Datang, {user?.name}
                    </h2>
                    <div className="space-y-2 text-sm text-[var(--body)]">
                        <p>
                            Role: {user?.roles?.map((r) => r.label).join(', ')}
                        </p>
                        <p>Total permissions: {permissions.length}</p>
                    </div>
                </section>

                <section className="mt-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <h2 className="mb-4 text-lg font-bold text-[var(--heading)]">
                        Scope Data
                    </h2>
                    <div className="space-y-2 text-sm text-[var(--body)]">
                        <p>
                            {getScopeDescription(user?.roles?.[0]?.name ?? '')}
                        </p>
                        {(user?.roles?.length ?? 0) > 1 && (
                            <p className="text-xs text-[var(--body-subtle)]">
                                Multi-role: scope dari role utama ditampilkan.
                            </p>
                        )}
                    </div>
                </section>
            </DashboardLayout>
        </>
    );
}

function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
            <p className="mb-2 text-sm text-[var(--body-subtle)]">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>
                {value}
            </p>
        </div>
    );
}

function getScopeDescription(roleName: string): string {
    const scopes: Record<string, string> = {
        customer: 'Anda hanya melihat paket milik sendiri.',
        staff_surabaya:
            'Anda melihat paket yang sudah collected hingga bagging. Bag & Batch yang Anda buat sendiri.',
        staff_ende:
            'Anda melihat paket dalam transit (heading_to_port hingga completed). Bag & Batch yang sudah di-unbatch/unbag.',
        admin: 'Anda memiliki akses ke semua data tanpa filter.',
        owner: 'Anda memiliki akses ke semua data dan laporan.',
    };

    return scopes[roleName] ?? 'Tidak ada akses khusus.';
}
