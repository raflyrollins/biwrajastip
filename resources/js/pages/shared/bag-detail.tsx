import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

const statusColors: Record<string, string> = {
    bagging: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    tiba_di_ende: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    disortir: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    siap_diambil: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
};

interface Package {
    id: number;
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string | null;
    status: string;
    status_label: string;
}

interface Bag {
    id: number;
    uuid: string;
    code: string;
    status: string;
    status_label: string;
    total_packages: number;
    total_weight: number;
    batch: { code: string } | null;
    packages: Package[];
}

interface BagDetailProps {
    bag: Bag;
}

export default function BagDetail({ bag }: BagDetailProps) {
    const [checkedPackages, setCheckedPackages] = useState<Set<number>>(
        new Set(),
    );

    const togglePackage = (pkgId: number) => {
        setCheckedPackages((prev) => {
            const next = new Set(prev);

            if (next.has(pkgId)) {
                next.delete(pkgId);
            } else {
                next.add(pkgId);
            }

            return next;
        });
    };

    const allChecked =
        bag.packages.length > 0 && checkedPackages.size === bag.packages.length;

    const canUnbag = bag.status !== 'unbagged' && bag.status === 'in_batch';

    const handleUnbag = () => {
        if (!allChecked) {
            return;
        }

        router.post(
            '/api/v1/staff-ende/bags/unbag',
            {
                bag_id: bag.id,
                confirmed_package_ids: Array.from(checkedPackages),
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
            <Head title={`Bag ${bag.code}`} />

            <DashboardLayout title="Detail Bag">
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

                        <div className="mb-8 grid gap-6 sm:grid-cols-4">
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Kode Bag
                                </p>
                                <p className="mt-1 font-mono text-lg font-bold text-[var(--heading)]">
                                    {bag.code}
                                </p>
                            </div>
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Status
                                </p>
                                <p className="mt-1 text-lg font-bold text-[var(--heading)]">
                                    {bag.status_label}
                                </p>
                            </div>
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Batch
                                </p>
                                <p className="mt-1 font-mono text-lg font-bold text-[var(--heading)]">
                                    {bag.batch?.code ?? '-'}
                                </p>
                            </div>
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-4">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    Total
                                </p>
                                <p className="mt-1 text-lg font-bold text-[var(--heading)]">
                                    {bag.total_packages} paket /{' '}
                                    {bag.total_weight
                                        ? `${bag.total_weight.toLocaleString('id-ID')}g`
                                        : '0g'}
                                </p>
                            </div>
                        </div>

                        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
                            <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="text-lg font-bold text-[var(--heading)]">
                                    Daftar Paket
                                </h3>
                                {canUnbag && (
                                    <Button
                                        variant="primary"
                                        disabled={!allChecked}
                                        onClick={handleUnbag}
                                    >
                                        <Check size={16} />
                                        Unbag ({checkedPackages.size}/
                                        {bag.packages.length})
                                    </Button>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--border-default)]">
                                            {canUnbag && (
                                                <th className="w-12 px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={allChecked}
                                                        onChange={() => {
                                                            if (allChecked) {
                                                                setCheckedPackages(
                                                                    new Set(),
                                                                );
                                                            } else {
                                                                setCheckedPackages(
                                                                    new Set(
                                                                        bag.packages.map(
                                                                            (
                                                                                p,
                                                                            ) =>
                                                                                p.id,
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
                                                No Resi
                                            </th>
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Penerima
                                            </th>
                                            <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bag.packages.map((pkg) => (
                                            <tr
                                                key={pkg.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                {canUnbag && (
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedPackages.has(
                                                                pkg.id,
                                                            )}
                                                            onChange={() =>
                                                                togglePackage(
                                                                    pkg.id,
                                                                )
                                                            }
                                                            className="size-4 accent-[var(--brand)]"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {pkg.tracking_code}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.recipient_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[pkg.status] ?? 'bg-[var(--neutral-tertiary)] text-[var(--body)]'}`}
                                                    >
                                                        {pkg.status_label}
                                                    </span>
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
