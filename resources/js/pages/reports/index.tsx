import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import ComingSoon from '@/components/ComingSoon';

type ReportsProps = {
    reportedAt: string;
};

export default function Reports({ reportedAt }: ReportsProps) {
    return (
        <>
            <Head title="Laporan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">Laporan</h2>
                </div>
                <ComingSoon
                    title="Laporan omzet & paket"
                    description="Metrik laporan omzet dan jumlah paket per periode akan tersedia di sini. Menyusul."
                />
                <p className="text-body-subtle text-xs">
                    Dibuat pada {new Date(reportedAt).toLocaleString('id-ID')}
                </p>
            </div>
        </>
    );
}

Reports.layout = (page: ReactNode) => (
    <AppLayout title="Laporan">{page}</AppLayout>
);
