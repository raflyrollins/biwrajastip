import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { Package } from 'lucide-react';
import { Search, Plus, X } from 'lucide-react';
import { useState } from 'react';

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

interface Package {
    id: number;
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string | null;
    sender_name: string | null;
    sender_store: string | null;
    final_weight: number | null;
    shipping_cost: number;
    status: string;
    status_label: string;
    zone: { name: string } | null;
    user: { name: string; email: string } | null;
}

interface PaginatedData {
    data: Package[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Zone {
    id: number;
    name: string;
    tarif_per_kg: number;
    biaya_antar: number;
}

interface AdminPackagesProps {
    packages: PaginatedData;
    zones: Zone[];
    filters: { search?: string; status?: string };
}

export default function AdminPackages({
    packages,
    zones,
    filters,
}: AdminPackagesProps) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_name: '',
        recipient_phone: '',
        zone_id: '',
        sender_name: '',
        sender_store: '',
        sender_tracking_number: '',
        weight_estimated: '',
        length: '',
        width: '',
        height: '',
        notes: '',
    });

    const handleSearch = (search: string) => {
        router.get(
            '/admin/packages',
            { search, status: filters.status },
            { preserveState: true, replace: true },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/packages', {
            onSuccess: () => {
                setShowForm(false);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Semua Paket - Admin" />

            <DashboardLayout title="Semua Paket">
                <div className="p-6 md:p-8">
                    {/* ── Header ── */}
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Semua Paket
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Kelola dan pantau semua paket dalam sistem.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={18} />
                            Input Paket
                        </Button>
                    </motion.div>

                    {/* ── Filters ── */}
                    <motion.div
                        className="mb-6 flex flex-col gap-3 sm:flex-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--body-subtle)]"
                            />
                            <input
                                type="text"
                                placeholder="Cari paket..."
                                defaultValue={filters.search ?? ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-2.5 pr-4 pl-10 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                            />
                        </div>
                    </motion.div>

                    {/* ── Form Modal ── */}
                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <motion.div
                                className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[var(--heading)]">
                                        Input Paket Baru
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
                                            Nama Penerima *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.recipient_name}
                                            onChange={(e) =>
                                                setData(
                                                    'recipient_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                        {errors.recipient_name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.recipient_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Telepon Penerima
                                        </label>
                                        <input
                                            type="text"
                                            value={data.recipient_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'recipient_phone',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Zona Tujuan
                                        </label>
                                        <select
                                            value={data.zone_id}
                                            onChange={(e) =>
                                                setData(
                                                    'zone_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        >
                                            <option value="">Pilih zona</option>
                                            {zones.map((z) => (
                                                <option key={z.id} value={z.id}>
                                                    {z.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Nama Pengirim
                                            </label>
                                            <input
                                                type="text"
                                                value={data.sender_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'sender_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Toko
                                            </label>
                                            <input
                                                type="text"
                                                value={data.sender_store}
                                                onChange={(e) =>
                                                    setData(
                                                        'sender_store',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            No Resi Toko
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sender_tracking_number}
                                            onChange={(e) =>
                                                setData(
                                                    'sender_tracking_number',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Berat (g)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.weight_estimated}
                                                onChange={(e) =>
                                                    setData(
                                                        'weight_estimated',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                P (cm)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.length}
                                                onChange={(e) =>
                                                    setData(
                                                        'length',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                L (cm)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.width}
                                                onChange={(e) =>
                                                    setData(
                                                        'width',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                T (cm)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.height}
                                                onChange={(e) =>
                                                    setData(
                                                        'height',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Catatan
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            rows={2}
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
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
                                                ? 'Menyimpan...'
                                                : 'Simpan'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* ── Table ── */}
                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Kode Tracking
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Pengirim
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Penerima
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Zona
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Berat
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Status
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
                                                    description="Paket yang masuk akan muncul di sini."
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
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                                    {pkg.tracking_code}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.sender_name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.recipient_name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.zone?.name ?? '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {pkg.final_weight
                                                        ? `${pkg.final_weight}g`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${statusColors[pkg.status] ?? 'bg-[var(--neutral-tertiary)] text-[var(--body)]'}`}
                                                    >
                                                        {pkg.status_label}
                                                    </span>
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
                                    Menampilkan {packages.data.length} dari{' '}
                                    {packages.total} paket
                                </p>
                                <div className="flex gap-1">
                                    {Array.from(
                                        { length: packages.last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                router.get(
                                                    '/admin/packages',
                                                    { ...filters, page },
                                                    {
                                                        preserveState: true,
                                                        replace: true,
                                                    },
                                                )
                                            }
                                            className={`px-3 py-1 text-sm ${page === packages.current_page ? 'bg-[var(--brand)] text-[var(--on-brand)]' : 'text-[var(--body)] hover:bg-[var(--neutral-secondary-medium)]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
