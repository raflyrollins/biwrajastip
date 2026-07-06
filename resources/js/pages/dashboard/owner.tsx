import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    DollarSign,
    Package,
    Ship,
    TrendingUp,
    Users,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

const stats = [
    {
        icon: Package,
        label: 'Total Paket',
        value: '0',
        color: 'text-[var(--fg-brand-strong)]',
        bg: 'bg-[var(--brand-softer)]',
    },
    {
        icon: Ship,
        label: 'Batch Dikirim',
        value: '0',
        color: 'text-[var(--fg-brand-strong)]',
        bg: 'bg-[var(--brand-softer)]',
    },
    {
        icon: DollarSign,
        label: 'Pendapatan Bulan Ini',
        value: 'Rp 0',
        color: 'text-[var(--fg-success-strong)]',
        bg: 'bg-[var(--success-soft)]',
    },
    {
        icon: Users,
        label: 'Total Customer',
        value: '0',
        color: 'text-[var(--fg-brand-strong)]',
        bg: 'bg-[var(--brand-softer)]',
    },
];

export default function OwnerDashboard() {
    return (
        <>
            <Head title="Dashboard - Owner" />

            <DashboardLayout title="Panel Owner">
                <div className="p-6 md:p-8">
                    {/* ── Welcome ── */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Panel Owner
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Pantau performa bisnis, keuangan, dan kelola akses
                            admin.
                        </p>
                    </motion.div>

                    {/* ── Stats ── */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
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

                    {/* ── Insight Cards ── */}
                    <div className="mb-8 grid gap-6 lg:grid-cols-2">
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <BarChart3 size={18} />
                                    Ringkasan Performa
                                </h3>
                            </div>
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                    <TrendingUp size={24} />
                                </div>
                                <p className="mb-1 text-sm font-medium text-[var(--heading)]">
                                    Belum Ada Data
                                </p>
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Grafik performa akan muncul setelah ada
                                    aktivitas pengiriman.
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
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Ship size={18} />
                                    Status Batch Terbaru
                                </h3>
                            </div>
                            <div className="flex flex-col items-center px-6 py-12 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                    <Ship size={24} />
                                </div>
                                <p className="mb-1 text-sm font-medium text-[var(--heading)]">
                                    Belum Ada Batch
                                </p>
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Status batch pengiriman akan muncul di sini.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Quick Actions ── */}
                    <motion.div
                        className="grid gap-4 sm:grid-cols-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        {[
                            {
                                icon: BarChart3,
                                label: 'Laporan Keuangan',
                                desc: 'Lihat laporan pendapatan & pengeluaran',
                            },
                            {
                                icon: Users,
                                label: 'Kelola Admin',
                                desc: 'Atur akun admin & staff',
                            },
                            {
                                icon: TrendingUp,
                                label: 'Analitik Bisnis',
                                desc: 'Pantau tren & pertumbuhan bisnis',
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex cursor-pointer items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-11 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--heading)]">
                                            {item.label}
                                        </p>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
