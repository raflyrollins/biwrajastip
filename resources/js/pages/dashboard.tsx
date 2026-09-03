import { Head } from '@inertiajs/react';
import {
    Boxes,
    FolderArchive,
    Package,
    PackagePlus,
    Truck,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';

type Stats = {
    packages: number | null;
    bags: number | null;
    batches: number | null;
    nearing_delivery: number | null;
};

type RecentPackage = {
    uuid: string;
    status: string;
    biwrajastip_tracking_number: string | null;
    store_tracking_number: string | null;
    receiver_name: string | null;
    total_amount: string | null;
    created_at: string;
};

type DashboardProps = {
    greeting: string;
    allowCreatePackage: boolean;
    stats: Stats;
    recent_packages: RecentPackage[];
};

type StatCard = {
    key: keyof Stats;
    label: string;
    icon: ComponentType<{ className?: string }>;
    value: number | null;
};

const STATUS_LABELS: Record<string, string> = {
    registered: 'Terdaftar',
    collected: 'Diterima di Pusat Collecting',
    processed: 'Sudah Diproses',
    pending_payment: 'Menunggu Pembayaran',
    paid: 'Lunas',
    bagged: 'Dalam Bag',
    batched: 'Dalam Batch',
    port_arrived: 'Tiba di Pelabuhan',
    on_going: 'Dalam Perjalanan',
    unbatched: 'Tiba di Ende',
    unbagged: 'Dikeluarkan dari Bag',
    ready: 'Siap Diambil/Diantar',
    delivered: 'Sudah Diserahkan',
    irregular: 'Irregular',
};

export default function Dashboard(props: DashboardProps) {
    const { greeting, allowCreatePackage, stats } = props;

    const cards: StatCard[] = [];
    if (stats.packages !== null) {
        cards.push({
            key: 'packages',
            label: 'Paket',
            icon: Package,
            value: stats.packages,
        });
    }
    if (stats.bags !== null) {
        cards.push({
            key: 'bags',
            label: 'Bag',
            icon: FolderArchive,
            value: stats.bags,
        });
    }
    if (stats.batches !== null) {
        cards.push({
            key: 'batches',
            label: 'Batch',
            icon: Boxes,
            value: stats.batches,
        });
    }
    if (stats.nearing_delivery !== null) {
        cards.push({
            key: 'nearing_delivery',
            label: 'Menuju Ende',
            icon: Truck,
            value: stats.nearing_delivery,
        });
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-heading text-2xl font-bold">
                            {greeting}
                        </h2>
                        <p className="text-body mt-1">
                            Ringkasan pengirimanmu dari Surabaya ke Ende.
                        </p>
                    </div>
                    {allowCreatePackage && (
                        <Button type="button">
                            <PackagePlus className="h-5 w-5" />
                            Daftar Paket Baru
                        </Button>
                    )}
                </div>

                {cards.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => (
                            <div
                                key={card.key}
                                className="border-border-default bg-neutral-primary border p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-body text-sm font-medium">
                                        {card.label}
                                    </span>
                                    <card.icon className="text-brand h-5 w-5" />
                                </div>
                                <p className="text-heading mt-4 text-4xl font-bold">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {props.recent_packages.length > 0 && (
                    <section className="border-border-default bg-neutral-primary border">
                        <header className="border-border-default border-b px-5 py-4">
                            <h3 className="text-heading font-semibold">
                                Paket Terbaru
                            </h3>
                        </header>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-tertiary-soft text-body">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            No. Resi
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Penerima
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Didaftarkan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.recent_packages.map((pkg) => (
                                        <tr
                                            key={pkg.uuid}
                                            className="border-border-default border-t"
                                        >
                                            <td className="text-brand px-5 py-3 font-medium">
                                                {pkg.biwrajastip_tracking_number ??
                                                    pkg.store_tracking_number ??
                                                    '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                {pkg.receiver_name ?? '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="bg-neutral-tertiary text-heading px-2 py-1 text-xs font-medium">
                                                    {STATUS_LABELS[
                                                        pkg.status
                                                    ] ?? pkg.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {pkg.total_amount
                                                    ? `Rp ${Number(pkg.total_amount).toLocaleString('id-ID')}`
                                                    : '—'}
                                            </td>
                                            <td className="text-body px-5 py-3">
                                                {new Date(
                                                    pkg.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => (
    <AppLayout title="Dashboard">{page}</AppLayout>
);
