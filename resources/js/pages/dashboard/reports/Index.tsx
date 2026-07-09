import { Head } from '@inertiajs/react';

import DashboardLayout from '@/components/DashboardLayout';
import { ReportEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import { useCan } from '@/lib/permissions';

export default function ReportsIndex() {
    const canExport = useCan('reports.export');

    return (
        <>
            <Head title="Laporan" />

            <DashboardLayout title="Laporan">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[var(--body-subtle)]">
                        Laporan performa &amp; keuangan
                    </p>
                    {canExport && (
                        <button
                            type="button"
                            className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                        >
                            Export
                        </button>
                    )}
                </div>

                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                    <EmptyState
                        title="Belum ada laporan"
                        description="Laporan akan muncul setelah ada data transaksi."
                        icon={<ReportEmpty className="size-40" />}
                    />
                </div>
            </DashboardLayout>
        </>
    );
}
