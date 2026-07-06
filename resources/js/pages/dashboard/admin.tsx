import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Package,
    Users,
    Ship,
    DollarSign,
    TrendingUp,
    Activity,
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
        icon: Users,
        label: 'Customer Aktif',
        value: '0',
        color: 'text-[var(--fg-brand-strong)]',
        bg: 'bg-[var(--brand-softer)]',
    },
    {
        icon: Ship,
        label: 'Batch Aktif',
        value: '0',
        color: 'text-[var(--fg-warning)]',
        bg: 'bg-[var(--warning-soft)]',
    },
    {
        icon: DollarSign,
        label: 'Pendapatan Bulan Ini',
        value: 'Rp 0',
        color: 'text-[var(--fg-success-strong)]',
        bg: 'bg-[var(--success-soft)]',
    },
];

export default function AdminDashboard() {
    return (
        <>
            <Head title="Dashboard - Admin" />

            <DashboardLayout title="Panel Admin">
                <div className="p-6 md:p-8">
                    {/* ── Welcome ── */}
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

                    {/* ── Quick Actions ── */}
                    <motion.div
                        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        {[
                            {
                                icon: MapPin,
                                label: 'Zona & Tarif',
                                desc: 'Atur zona tujuan dan tarif pengiriman',
                            },
                            {
                                icon: Users,
                                label: 'Kelola Pengguna',
                                desc: 'Atur akun staff, admin, dan customer',
                            },
                            {
                                icon: Activity,
                                label: 'Monitoring',
                                desc: 'Pantau status pengiriman real-time',
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

                    {/* ── Recent Activity ── */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
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
                            transition={{ duration: 0.4, delay: 0.45 }}
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

function MapPin(props: { size: number; className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
