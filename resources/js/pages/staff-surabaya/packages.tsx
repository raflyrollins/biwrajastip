import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, PackageCheck } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

interface PackageItem {
    id: number;
    tracking_code: string;
    recipient_name: string;
    sender_tracking_number: string | null;
    zone: { name: string } | null;
    weight_estimated: number | null;
    status: string;
    status_label: string;
    created_at: string;
}

interface PaginatedData {
    data: PackageItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface StaffSurabayaPackagesProps {
    packages: PaginatedData;
    stats: { waiting: number; collected: number };
}

export default function StaffSurabayaPackages({
    packages,
    stats,
}: StaffSurabayaPackagesProps) {
    const handleCollect = (pkgId: number) => {
        router.put(
            `/staff/surabaya/packages/${pkgId}/collect`,
            {},
            { preserveState: true },
        );
    };

    const statCards = [
        {
            icon: Clock,
            label: 'Menunggu Diterima',
            value: String(stats.waiting),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
        },
        {
            icon: PackageCheck,
            label: 'Sudah Dikumpulkan',
            value: String(stats.collected),
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
    ];

    return (
        <>
            <Head title="Terima Paket - Staff Surabaya" />

            <DashboardLayout title="Terima Paket">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Terima Paket
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Cocokkan nomor resi toko dengan paket yang masuk,
                            lalu tandai sebagai diterima.
                        </p>
                    </motion.div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-2">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                }}
                            >
                                <div
                                    className={`mb-4 inline-flex size-11 items-center justify-center ${stat.bg} ${stat.color}`}
                                >
                                    <stat.icon size={22} />
                                </div>
                                <p className="text-2xl font-bold text-[var(--heading)]">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Kode Tracking
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            No. Resi Toko
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Penerima
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Zona
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Berat Est.
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Tidak Ada Paket"
                                                    description="Paket yang menunggu diterima akan muncul di sini."
                                                    icon={
                                                        <PackageEmpty className="h-32 w-40" />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        packages.data.map((pkg) => (
                                            <tr
                                                key={pkg.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {pkg.tracking_code}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-[var(--body)]">
                                                    {pkg.sender_tracking_number ??
                                                        '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.recipient_name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.zone?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.weight_estimated
                                                        ? `${pkg.weight_estimated.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block bg-[var(--warning-soft)] px-2 py-1 text-xs font-medium text-[var(--fg-warning)]">
                                                        {pkg.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {pkg.status ===
                                                        'waiting_for_collection' && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleCollect(
                                                                    pkg.id,
                                                                )
                                                            }
                                                        >
                                                            Terima
                                                        </Button>
                                                    )}
                                                    {pkg.status ===
                                                        'collected' && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                router.get(
                                                                    `/staff/surabaya/packages/${pkg.id}/weigh`,
                                                                )
                                                            }
                                                        >
                                                            Timbang
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
