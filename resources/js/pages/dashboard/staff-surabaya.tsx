import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Package,
    PackageCheck,
    Clock,
    Scan,
    Weight,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

const stats = [
    {
        icon: Package,
        label: 'Paket Diterima Hari Ini',
        value: '0',
        color: 'text-[var(--fg-brand-strong)]',
        bg: 'bg-[var(--brand-softer)]',
    },
    {
        icon: Clock,
        label: 'Menunggu Timbang',
        value: '0',
        color: 'text-[var(--fg-warning)]',
        bg: 'bg-[var(--warning-soft)]',
    },
    {
        icon: PackageCheck,
        label: 'Siap Bagging',
        value: '0',
        color: 'text-[var(--fg-success-strong)]',
        bg: 'bg-[var(--success-soft)]',
    },
];

export default function StaffSurabayaDashboard() {
    return (
        <>
            <Head title="Dashboard - Staff Surabaya" />

            <DashboardLayout title="Staff Surabaya">
                <div className="p-6 md:p-8">
                    {/* ── Welcome ── */}
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
                            Terima, timbang, dan kemas paket untuk dikirim ke
                            Ende.
                        </p>
                    </motion.div>

                    {/* ── Stats ── */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
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
                        className="mb-8 grid gap-4 sm:grid-cols-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <div className="flex cursor-pointer items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]">
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]">
                                    <Scan size={22} />
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--heading)]">
                                        Scan QR Paket
                                    </p>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        Pindai kode QR paket masuk
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex cursor-pointer items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]">
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center bg-[var(--success-soft)] text-[var(--fg-success-strong)]">
                                    <Weight size={22} />
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--heading)]">
                                        Timbang Paket
                                    </p>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        Input berat & dimensi paket
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Recent Activity ── */}
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
                            <p className="mb-1 text-sm font-medium text-[var(--heading)]">
                                Belum Ada Aktivitas
                            </p>
                            <p className="text-sm text-[var(--body-subtle)]">
                                Aktivitas hari ini akan muncul di sini.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
