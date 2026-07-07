import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

const statusColors: Record<string, string> = {
    waiting_for_collection: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    collected: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    waiting_for_payment: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    paid: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    bagging: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    berangkat_ke_pelabuhan:
        'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    di_kapal: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    tiba_di_ende: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    disortir: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    siap_diambil: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    dalam_pengantaran: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    selesai: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
};

interface PackageItem {
    id: number;
    uuid: string;
    tracking_code: string;
    recipient_name: string;
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

interface CustomerPackagesProps {
    packages: PaginatedData;
}

export default function CustomerPackages({ packages }: CustomerPackagesProps) {
    return (
        <>
            <Head title="Paket Saya" />

            <DashboardLayout title="Paket Saya">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Paket Saya
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Semua paket yang sudah Anda daftarkan.
                            </p>
                        </div>
                        <Link href="/customer/packages/create">
                            <Button variant="primary">
                                <Plus size={18} />
                                Daftarkan Paket
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Kode Tracking
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
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Paket"
                                                    description="Daftarkan paket pertama Anda untuk mulai mengirim."
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
                                                className="cursor-pointer border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--neutral-secondary-medium)]"
                                                    onClick={() =>
                                                        router.get(
                                                            `/customer/packages/${pkg.uuid}`,
                                                        )
                                                    }
                                            >
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {pkg.tracking_code}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.recipient_name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.zone?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.weight_estimated
                                                        ? `${pkg.weight_estimated}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[pkg.status] ?? ''}`}
                                                    >
                                                        {pkg.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body-subtle)]">
                                                    {new Date(
                                                        pkg.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                                                    '/customer/packages',
                                                    {
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
                                                    '/customer/packages',
                                                    {
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
