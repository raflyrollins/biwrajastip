import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Clock,
    PackageCheck,
    Wallet,
    CheckCircle,
    Layers,
    Printer,
} from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

interface PackageItem {
    id: number;
    uuid: string;
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string | null;
    sender_tracking_number: string | null;
    zone: { name: string } | null;
    weight_estimated: number | null;
    weight_actual: number | null;
    final_weight: number | null;
    shipping_cost: number;
    total_cost: number;
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
    stats: {
        waiting: number;
        collected: number;
        waiting_for_payment: number;
        paid: number;
        bagging: number;
    };
    tab: string;
}

const tabs = [
    { key: 'waiting', label: 'Menunggu', icon: Clock },
    { key: 'collected', label: 'Dikumpulkan', icon: PackageCheck },
    { key: 'waiting_for_payment', label: 'Menunggu Bayar', icon: Wallet },
    { key: 'paid', label: 'Lunas', icon: CheckCircle },
    { key: 'bagging', label: 'Dikirim', icon: Layers },
];

const statusColors: Record<string, string> = {
    waiting_for_collection: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    collected: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    waiting_for_payment: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    paid: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    bagging: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    berangkat_ke_pelabuhan: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    di_kapal: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    tiba_di_ende: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    disortir: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    siap_diambil: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    dalam_pengantaran: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    selesai: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
};

export default function StaffSurabayaPackages({
    packages,
    stats,
    tab,
}: StaffSurabayaPackagesProps) {
    const handleCollect = (uuid: string) => {
        router.put(
            `/staff/surabaya/packages/${uuid}/collect`,
            {},
            { preserveState: true },
        );
    };

    const switchTab = (key: string) => {
        router.get(
            '/staff/surabaya/packages',
            { tab: key },
            { preserveState: true, replace: true },
        );
    };

    const statCards = [
        {
            icon: Clock,
            label: 'Menunggu Diterima',
            value: String(stats.waiting),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
            tabKey: 'waiting',
        },
        {
            icon: PackageCheck,
            label: 'Sudah Dikumpulkan',
            value: String(stats.collected),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
            tabKey: 'collected',
        },
        {
            icon: Wallet,
            label: 'Menunggu Bayar',
            value: String(stats.waiting_for_payment),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
            tabKey: 'waiting_for_payment',
        },
        {
            icon: CheckCircle,
            label: 'Lunas',
            value: String(stats.paid),
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
            tabKey: 'paid',
        },
        {
            icon: Layers,
            label: 'Dalam Pengiriman',
            value: String(stats.bagging),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
            tabKey: 'bagging',
        },
    ];

    return (
        <>
            <Head title="Daftar Paket - Staff Surabaya" />

            <DashboardLayout title="Daftar Paket">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Daftar Paket
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Kelola paket dari diterima hingga siap kirim.
                        </p>
                    </motion.div>

                    {/* Stat Cards */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {statCards.map((stat, index) => (
                            <motion.button
                                key={stat.label}
                                onClick={() => switchTab(stat.tabKey)}
                                className={`cursor-pointer border p-6 text-left transition-colors ${
                                    tab === stat.tabKey
                                        ? 'border-[var(--fg-brand-strong)] bg-[var(--brand-soft)]'
                                        : 'border-[var(--border-default)] bg-[var(--neutral-primary-soft)] hover:border-[var(--fg-brand-strong)]'
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
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
                            </motion.button>
                        ))}
                    </div>

                    {/* Tab Filter */}
                    <div className="mb-6 flex flex-wrap gap-1">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => switchTab(t.key)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    tab === t.key
                                        ? 'bg-[var(--fg-brand-strong)] text-white'
                                        : 'border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] text-[var(--body)] hover:border-[var(--fg-brand-strong)]'
                                }`}
                            >
                                <t.icon size={16} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
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
                                            Berat
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Ongkir
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
                                                colSpan={8}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Tidak Ada Paket"
                                                    description="Tidak ada paket dengan status ini."
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
                                                    {pkg.final_weight
                                                        ? `${pkg.final_weight.toLocaleString('id-ID')}g`
                                                        : pkg.weight_estimated
                                                          ? `${pkg.weight_estimated.toLocaleString('id-ID')}g`
                                                          : '-'}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                                    {pkg.total_cost > 0
                                                        ? `Rp${pkg.total_cost.toLocaleString('id-ID')}`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[pkg.status] ?? 'bg-[var(--neutral-secondary-medium)] text-[var(--body)]'}`}
                                                    >
                                                        {pkg.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {pkg.status ===
                                                            'waiting_for_collection' && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleCollect(
                                                                        pkg.uuid,
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
                                                                        `/staff/surabaya/packages/${pkg.uuid}/weigh`,
                                                                    )
                                                                }
                                                            >
                                                                Timbang
                                                            </Button>
                                                        )}
                                                        {pkg.status ===
                                                            'paid' && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    router.get(
                                                                        `/staff/surabaya/packages/${pkg.uuid}/print`,
                                                                    )
                                                                }
                                                            >
                                                                <Printer
                                                                    size={16}
                                                                />
                                                                Cetak Resi
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {packages.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-3">
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Halaman {packages.current_page} dari{' '}
                                    {packages.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {packages.current_page > 1 && (
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    '/staff/surabaya/packages',
                                                    {
                                                        tab,
                                                        page:
                                                            packages.current_page -
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                            className="px-3 py-1 text-sm text-[var(--body)] hover:bg-[var(--neutral-secondary-medium)]"
                                        >
                                            Sebelumnya
                                        </button>
                                    )}
                                    {packages.current_page <
                                        packages.last_page && (
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    '/staff/surabaya/packages',
                                                    {
                                                        tab,
                                                        page:
                                                            packages.current_page +
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                            className="px-3 py-1 text-sm text-[var(--body)] hover:bg-[var(--neutral-secondary-medium)]"
                                        >
                                            Selanjutnya
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
