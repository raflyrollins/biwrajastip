import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, Users, Ship, DollarSign, TrendingUp } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface AdminDashboardProps {
    stats: {
        total: number;
        active_customers: number;
        active_batches: number;
        revenue_this_month: number;
    };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const statCards = [
        {
            icon: Package,
            label: 'Total Paket',
            value: String(stats.total),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
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
            label: 'Batch Aktif',
            value: String(stats.active_batches),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
        },
        {
            icon: DollarSign,
            label: 'Pendapatan Bulan Ini',
            value: `Rp${stats.revenue_this_month.toLocaleString('id-ID')}`,
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
    ];

    return (
        <>
            <Head title="Dashboard - Admin" />

            <DashboardLayout title="Panel Admin">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Panel Admin
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Kelola data master, verifikasi pembayaran, dan
                            monitor operasional.
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
                                <h3 className="text-lg font-bold text-[var(--heading)]">
                                    Aktivitas Terbaru
                                </h3>
                            </div>
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                    <Package size={24} />
                                </div>
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Belum ada aktivitas.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="text-lg font-bold text-[var(--heading)]">
                                    Tren Pengiriman
                                </h3>
                            </div>
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Data akan tersedia setelah ada pengiriman.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
