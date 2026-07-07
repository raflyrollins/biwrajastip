import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Package,
    Clock,
    Truck,
    CheckCircle,
    Plus,
    ArrowRight,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface CustomerDashboardProps {
    stats: {
        total: number;
        waiting: number;
        in_transit: number;
        delivered: number;
    };
}

export default function CustomerDashboard({ stats }: CustomerDashboardProps) {
    const statCards = [
        {
            icon: Package,
            label: 'Total Paket',
            value: String(stats.total),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: Clock,
            label: 'Menunggu Diterima',
            value: String(stats.waiting),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
        },
        {
            icon: Truck,
            label: 'Dalam Perjalanan',
            value: String(stats.in_transit),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: CheckCircle,
            label: 'Selesai',
            value: String(stats.delivered),
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
    ];

    return (
        <>
            <Head title="Dashboard - Customer" />

            <DashboardLayout title="Dashboard">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Selamat Datang!
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Daftarkan paket Anda untuk dikirim dari Surabaya ke
                            Ende.
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

                    <motion.div
                        className="mb-8 grid gap-4 sm:grid-cols-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Link
                            href="/customer/packages/create"
                            className="flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]">
                                    <Plus size={22} />
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--heading)]">
                                        Daftarkan Paket
                                    </p>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        Isi data paket baru
                                    </p>
                                </div>
                            </div>
                            <ArrowRight
                                size={18}
                                className="text-[var(--body-subtle)]"
                            />
                        </Link>
                        <Link
                            href="/customer/packages"
                            className="flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center bg-[var(--success-soft)] text-[var(--fg-success-strong)]">
                                    <Package size={22} />
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--heading)]">
                                        Paket Saya
                                    </p>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        Lihat semua paket
                                    </p>
                                </div>
                            </div>
                            <ArrowRight
                                size={18}
                                className="text-[var(--body-subtle)]"
                            />
                        </Link>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
