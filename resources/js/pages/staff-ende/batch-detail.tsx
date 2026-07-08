import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

const statusColors: Record<string, string> = {
    in_batch: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    unbagged: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
};

interface Bag {
    id: number;
    code: string;
    status: string;
    status_label: string;
    total_packages: number;
    total_weight: number;
    packages_count: number;
}

interface Batch {
    id: number;
    uuid: string;
    code: string;
    status: string;
    status_label: string;
    total_packages: number;
    total_weight: number;
    bags: Bag[];
}

interface BatchDetailProps {
    batch: Batch;
}

export default function BatchDetail({ batch }: BatchDetailProps) {
    const [checkedBags, setCheckedBags] = useState<Set<number>>(new Set());

    const toggleBag = (bagId: number) => {
        setCheckedBags((prev) => {
            const next = new Set(prev);

            if (next.has(bagId)) {
                next.delete(bagId);
            } else {
                next.add(bagId);
            }

            return next;
        });
    };

    const allChecked =
        batch.bags.length > 0 && checkedBags.size === batch.bags.length;

    const handleUnbatch = () => {
        if (!allChecked) {
            return;
        }

        router.post(
            '/api/v1/staff-ende/batches/unbatch',
            {
                batch_id: batch.id,
                confirmed_bag_ids: Array.from(checkedBags),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                },
            },
        );
    };

    return (
        <>
            <Head title={`Batch ${batch.code} - Staff Ende`} />

            <DashboardLayout title="Detail Batch">
                <div className="p-6 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            href="/batches"
                            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--body-subtle)] no-underline hover:text-[var(--heading)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>

                        <div className="mb-8 grid gap-6 sm:grid-cols-3">
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Kode Batch
                                </p>
                                <p className="mt-1 font-mono text-lg font-bold text-[var(--heading)]">
                                    {batch.code}
                                </p>
                            </div>
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Status
                                </p>
                                <p className="mt-1 text-lg font-bold text-[var(--heading)]">
                                    {batch.status_label}
                                </p>
                            </div>
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Total
                                </p>
                                <p className="mt-1 text-lg font-bold text-[var(--heading)]">
                                    {batch.bags.length} bag /{' '}
                                    {batch.total_packages} paket
                                </p>
                            </div>
                        </div>

                        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
                            <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="text-lg font-bold text-[var(--heading)]">
                                    Daftar Bag
                                </h3>
                                {batch.status === 'tiba' && (
                                    <Button
                                        variant="primary"
                                        disabled={!allChecked}
                                        onClick={handleUnbatch}
                                    >
                                        <Check size={16} />
                                        Unbatch ({checkedBags.size}/
                                        {batch.bags.length})
                                    </Button>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--border-default)]">
                                            {batch.status === 'tiba' && (
                                                <th className="w-12 px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={allChecked}
                                                        onChange={() => {
                                                            if (allChecked) {
                                                                setCheckedBags(
                                                                    new Set(),
                                                                );
                                                            } else {
                                                                setCheckedBags(
                                                                    new Set(
                                                                        batch.bags.map(
                                                                            (
                                                                                b,
                                                                            ) =>
                                                                                b.id,
                                                                        ),
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                        className="size-4 accent-[var(--brand)]"
                                                    />
                                                </th>
                                            )}
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Kode Bag
                                            </th>
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Paket
                                            </th>
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Berat
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batch.bags.map((bag) => (
                                            <tr
                                                key={bag.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                {batch.status === 'tiba' && (
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedBags.has(
                                                                bag.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleBag(
                                                                    bag.id,
                                                                )
                                                            }
                                                            className="size-4 accent-[var(--brand)]"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    <Link
                                                        href={`/bags/${bag.id}`}
                                                        className="text-[var(--brand)] underline-offset-2 hover:underline"
                                                    >
                                                        {bag.code}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[bag.status] ?? 'bg-[var(--neutral-tertiary)] text-[var(--body)]'}`}
                                                    >
                                                        {bag.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {bag.packages_count}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {bag.total_weight
                                                        ? `${bag.total_weight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
