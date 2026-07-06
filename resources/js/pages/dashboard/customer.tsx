import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Package,
    Clock,
    CheckCircle,
    Plus,
    Truck,
} from 'lucide-react';

import Button from '@/components/Button';
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
        icon: Clock,
        label: 'Dalam Proses',
        value: '0',
        color: 'text-[var(--fg-warning)]',
        bg: 'bg-[var(--warning-soft)]',
    },
    {
        icon: CheckCircle,
        label: 'Selesai',
        value: '0',
        color: 'text-[var(--fg-success-strong)]',
        bg: 'bg-[var(--success-soft)]',
    },
];

export default function CustomerDashboard() {
    return (
        <>
            <Head title="Dashboard - Customer" />

            <DashboardLayout title="Dashboard Customer">
                <div className="p-6 md:p-8">
                    {/* ── Welcome ── */}
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
                            Kelola pengiriman barang Anda dari Surabaya ke Ende.
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
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <h3 className="mb-4 text-lg font-bold text-[var(--heading)]">
                            Aksi Cepat
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Link
                                href="/check-shipping"
                                className="flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-11 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]">
                                        <Truck size={22} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--heading)]">
                                            Cek Ongkir
                                        </p>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Lihat estimasi biaya pengiriman
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="text-[var(--body-subtle)]"
                                />
                            </Link>

                            <Link
                                href="#"
                                className="flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 transition-colors hover:bg-[var(--neutral-secondary-medium)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-11 items-center justify-center bg-[var(--success-soft)] text-[var(--fg-success-strong)]">
                                        <Package size={22} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--heading)]">
                                            Input Paket Baru
                                        </p>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Daftarkan paket untuk dikirim
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="text-[var(--body-subtle)]"
                                />
                            </Link>
                        </div>
                    </motion.div>

                    {/* ── Recent Packages ── */}
                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
                            <h3 className="text-lg font-bold text-[var(--heading)]">
                                Paket Terbaru
                            </h3>
                            <span className="text-xs text-[var(--body-subtle)]">
                                Belum ada paket
                            </span>
                        </div>
                        <div className="flex flex-col items-center px-6 py-12 text-center">
                            <div className="mb-4 flex size-14 items-center justify-center bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                <Package size={24} />
                            </div>
                            <p className="mb-1 text-sm font-medium text-[var(--heading)]">
                                Belum Ada Paket
                            </p>
                            <p className="mb-6 text-sm text-[var(--body-subtle)]">
                                Anda belum memiliki paket yang dikirim. Mulai
                                kirim barang sekarang!
                            </p>
                            <Button variant="primary">
                                <Plus size={18} />
                                Input Paket Baru
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
