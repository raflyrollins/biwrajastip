import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, Clock, PackageCheck, ArrowRight } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface StaffSurabayaDashboardProps {
    stats: { waiting: number; collected: number; waiting_payment: number };
}

export default function StaffSurabayaDashboard({
    stats,
}: StaffSurabayaDashboardProps) {
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
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: Package,
            label: 'Menunggu Pembayaran',
            value: String(stats.waiting_payment),
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
    ];

    return (
        <>
            <Head title="Dashboard - Staff Surabaya" />

            <DashboardLayout title="Dashboard">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Panel Staff Surabaya
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Terima paket fisik, cocokkan resi, dan lakukan
                            penimbangan.
                        </p>
                    </motion.div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-3">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Link
                            href="/staff/surabaya/packages"
                            className="flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]">
                                    <Package size={22} />
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--heading)]">
                                        Kelola Paket Masuk
                                    </p>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        Terima, cocokkan resi, dan timbang paket
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
