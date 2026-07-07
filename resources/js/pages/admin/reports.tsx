import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Package, DollarSign, Users, Ship } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { ReportEmpty } from '@/components/EmptyIllustrations';

interface ReportsStats {
    total_packages: number;
    packages_this_month: number;
    total_revenue: number;
    revenue_this_month: number;
    active_customers: number;
    total_batches: number;
    active_batches: number;
}

interface PackageByZone {
    name: string;
    total: number;
}

interface MonthlyRevenue {
    month: string;
    total: number;
}

interface AdminReportsProps {
    stats: ReportsStats;
    packages_by_zone: PackageByZone[];
    monthly_revenue: MonthlyRevenue[];
}

export default function AdminReports({
    stats,
    packages_by_zone,
    monthly_revenue,
}: AdminReportsProps) {
    const statCards = [
        {
            icon: Package,
            label: 'Total Paket',
            value: String(stats.total_packages),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: DollarSign,
            label: 'Pendapatan Total',
            value: `Rp${stats.total_revenue.toLocaleString('id-ID')}`,
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
        {
            icon: Users,
            label: 'Customer Aktif',
            value: String(stats.active_customers),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: Ship,
            label: 'Total Batch',
            value: String(stats.total_batches),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
        },
    ];

    return (
        <>
            <Head title="Laporan - Admin" />

            <DashboardLayout title="Laporan">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Laporan
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Pantau performa operasional dan keuangan.
                        </p>
                    </motion.div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                    <div className="grid gap-6 lg:grid-cols-2">
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <BarChart3 size={18} />
                                    Pendapatan per Bulan
                                </h3>
                            </div>
                            <div className="p-6">
                                {monthly_revenue.length === 0 ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <ReportEmpty className="h-32 w-40" />
                                        <p className="mt-4 mb-1 text-sm font-medium text-[var(--heading)]">
                                            Belum Ada Data
                                        </p>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Grafik akan muncul setelah ada
                                            transaksi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {monthly_revenue.map((item) => (
                                            <div
                                                key={item.month}
                                                className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 last:border-b-0"
                                            >
                                                <span className="text-sm text-[var(--body)]">
                                                    {item.month}
                                                </span>
                                                <span className="text-sm font-bold text-[var(--heading)]">
                                                    Rp
                                                    {item.total.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Package size={18} />
                                    Paket per Zona
                                </h3>
                            </div>
                            <div className="p-6">
                                {packages_by_zone.length === 0 ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <ReportEmpty className="h-32 w-40" />
                                        <p className="mt-4 mb-1 text-sm font-medium text-[var(--heading)]">
                                            Belum Ada Data
                                        </p>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Data akan tersedia setelah ada
                                            pengiriman.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {packages_by_zone.map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center justify-between border-b border-[var(--border-default)] pb-3 last:border-b-0"
                                            >
                                                <span className="text-sm text-[var(--body)]">
                                                    {item.name}
                                                </span>
                                                <span className="text-sm font-bold text-[var(--heading)]">
                                                    {item.total} paket
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
