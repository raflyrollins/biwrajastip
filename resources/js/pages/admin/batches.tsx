import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Ship,
    Plus,
    X,
    Package,
    Clock,
    Truck,
    Printer,
    Eye,
} from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { BatchEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

const statusColors: Record<string, string> = {
    preparing: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    berangkat: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    di_kapal: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    tiba: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
};

interface Batch {
    id: number;
    uuid: string;
    code: string;
    status: string;
    status_label: string;
    total_packages: number;
    total_weight: number;
    notes: string | null;
    departure_at: string | null;
    arrival_at: string | null;
    created_at: string;
    bags: Array<{
        id: number;
        code: string;
        total_packages: number;
        total_weight: number;
    }>;
}

interface PaginatedData {
    data: Batch[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AdminBatchesProps {
    batches: PaginatedData;
}

export default function AdminBatches({ batches }: AdminBatchesProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/batches', {
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    const stats = [
        {
            icon: Ship,
            label: 'Total Batch',
            value: String(batches.total),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: Package,
            label: 'Total Paket Dikirim',
            value: String(
                batches.data.reduce((sum, b) => sum + b.total_packages, 0),
            ),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
        {
            icon: Clock,
            label: 'Persiapan',
            value: String(
                batches.data.filter((b) => b.status === 'preparing').length,
            ),
            color: 'text-[var(--fg-warning)]',
            bg: 'bg-[var(--warning-soft)]',
        },
        {
            icon: Truck,
            label: 'Dalam Perjalanan',
            value: String(
                batches.data.filter((b) =>
                    ['berangkat', 'di_kapal'].includes(b.status),
                ).length,
            ),
            color: 'text-[var(--fg-success-strong)]',
            bg: 'bg-[var(--success-soft)]',
        },
    ];

    return (
        <>
            <Head title="Batch Kirim - Admin" />

            <DashboardLayout title="Batch Kirim">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Batch Kirim
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Kelola batch pengiriman dari Surabaya ke Ende.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={18} />
                            Buat Batch Baru
                        </Button>
                    </motion.div>

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

                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <motion.div
                                className="w-full max-w-md border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[var(--heading)]">
                                        Buat Batch Baru
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            reset();
                                        }}
                                        className="text-[var(--body-subtle)] hover:text-[var(--heading)]"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Catatan
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            rows={3}
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            placeholder="Catatan batch (opsional)"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                reset();
                                            }}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Membuat...'
                                                : 'Buat Batch'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

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
                                            Paket
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Berat Total
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Dibuat
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
                                                colSpan={5}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Batch"
                                                    description="Buat batch baru untuk mulai mengirim paket."
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
                                                    {batch.total_packages}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {batch.total_weight
                                                        ? `${batch.total_weight}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body-subtle)]">
                                                    {new Date(
                                                        batch.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/batches/${batch.uuid}`,
                                                                    '_blank',
                                                                )
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/batches/${batch.uuid}/print`,
                                                                    '_blank',
                                                                )
                                                            }
                                                        >
                                                            <Printer
                                                                size={16}
                                                            />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
