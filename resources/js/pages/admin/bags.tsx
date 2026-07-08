import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, Trash2, Printer, Eye } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { PackageEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

interface Bag {
    id: number;
    uuid: string;
    code: string;
    total_packages: number;
    total_weight: number;
    notes: string | null;
    created_at: string;
    batch: {
        code: string;
    } | null;
}

interface PaginatedData {
    data: Bag[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AdminBagsProps {
    bags: PaginatedData;
}

export default function AdminBags({ bags }: AdminBagsProps) {
    const stats = [
        {
            icon: Package,
            label: 'Total Bag',
            value: String(bags.total),
            color: 'text-[var(--fg-brand-strong)]',
            bg: 'bg-[var(--brand-softer)]',
        },
    ];

    return (
        <>
            <Head title="Bag - Admin" />

            <DashboardLayout title="Bag">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Bag
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Daftar semua bag yang sudah dibuat.
                            </p>
                        </div>
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

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <div className="border-b border-[var(--border-default)] px-6 py-4">
                            <h3 className="text-lg font-bold text-[var(--heading)]">
                                Daftar Bag
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
                                            Batch
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
                                    {bags.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Bag"
                                                    description="Bag akan dibuat melalui aplikasi mobile staff."
                                                    icon={
                                                        <PackageEmpty className="h-32 w-40" />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        bags.data.map((bag) => (
                                            <tr
                                                key={bag.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {bag.code}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {bag.batch?.code ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {bag.total_packages}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {bag.total_weight
                                                        ? `${bag.total_weight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body-subtle)]">
                                                    {new Date(
                                                        bag.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                router.get(
                                                                    `/bags/${bag.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/bags/${bag.uuid}/print`,
                                                                    '_blank',
                                                                )
                                                            }
                                                        >
                                                            <Printer
                                                                size={16}
                                                            />
                                                        </Button>
                                                        {!bag.batch && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            'Hapus bag ini?',
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            `/bags/${bag.uuid}`,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {bags.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-3">
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Halaman {bags.current_page} dari{' '}
                                    {bags.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {bags.current_page > 1 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    bags.data.length > 0
                                                        ? `/bags?page=${bags.current_page - 1}`
                                                        : '#',
                                                )
                                            }
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {bags.current_page < bags.last_page && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    `/bags?page=${bags.current_page + 1}`,
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
