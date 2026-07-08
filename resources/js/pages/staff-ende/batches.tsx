import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { BatchEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

const statusColors: Record<string, string> = {
    preparing: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    berangkat: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    di_kapal: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    tiba: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    unbatched: 'bg-[var(--neutral-tertiary)] text-[var(--body)]',
};

interface Batch {
    id: number;
    uuid: string;
    code: string;
    status: string;
    status_label: string;
    total_packages: number;
    total_weight: number;
    bags_count?: number;
    bags: Array<{
        id: number;
        code: string;
        packages_count?: number;
    }>;
    created_at: string;
}

interface PaginatedData {
    data: Batch[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface StaffEndeBatchesProps {
    batches: PaginatedData;
}

export default function StaffEndeBatches({ batches }: StaffEndeBatchesProps) {
    return (
        <>
            <Head title="Batch Masuk - Staff Ende" />

            <DashboardLayout title="Batch Masuk">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Batch Masuk
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Daftar batch yang tiba di Ende dari Surabaya.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <div className="border-b border-[var(--border-default)] px-6 py-4">
                            <h3 className="text-lg font-bold text-[var(--heading)]">
                                Daftar Batch
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Kode
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Bag
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Paket
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Berat Total
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Batch"
                                                    description="Batch akan muncul setelah dikirim dari Surabaya."
                                                    icon={
                                                        <BatchEmpty className="h-32 w-40" />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        batches.data.map((batch) => (
                                            <tr
                                                key={batch.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {batch.code}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[batch.status] ?? 'bg-[var(--neutral-tertiary)] text-[var(--body)]'}`}
                                                    >
                                                        {batch.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {batch.bags.length}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {batch.total_packages}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {batch.total_weight
                                                        ? `${batch.total_weight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            router.get(
                                                                `/batches/${batch.uuid}`,
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {batches.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-3">
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Halaman {batches.current_page} dari{' '}
                                    {batches.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {batches.current_page > 1 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    `/batches?page=${batches.current_page - 1}`,
                                                )
                                            }
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {batches.current_page <
                                        batches.last_page && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    `/batches?page=${batches.current_page + 1}`,
                                                )
                                            }
                                        >
                                            Selanjutnya
                                        </Button>
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
