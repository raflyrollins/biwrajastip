import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import ComingSoon from '@/components/ComingSoon';

type SettingsProps = {
    reportedAt: string;
};

export default function Settings({ reportedAt }: SettingsProps) {
    return (
        <>
            <Head title="Pengaturan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">
                        Pengaturan
                    </h2>
                </div>
                <ComingSoon
                    title="Manajemen pengaturan"
                    description="Manajemen role & permission, tarif antar, irregularity, dan pembayaran akan tersedia di sini. Menyusul."
                />
                <p className="text-body-subtle text-xs">
                    Dibuat pada {new Date(reportedAt).toLocaleString('id-ID')}
                </p>
            </div>
        </>
    );
}

Settings.layout = (page: ReactNode) => (
    <AppLayout title="Pengaturan">{page}</AppLayout>
);
