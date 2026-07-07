import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { ZoneEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

interface Zone {
    id: number;
    name: string;
    tarif_per_kg: number;
    biaya_antar: number;
}

interface AdminZonesProps {
    zones: Zone[];
}

export default function AdminZones({ zones }: AdminZonesProps) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Zone | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        tarif_per_kg: '12000',
        biaya_antar: '0',
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData({ name: '', tarif_per_kg: '12000', biaya_antar: '0' });
        setShowForm(true);
    };

    const openEdit = (zone: Zone) => {
        setEditing(zone);
        setData({
            name: zone.name,
            tarif_per_kg: String(zone.tarif_per_kg),
            biaya_antar: String(zone.biaya_antar),
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            put(`/admin/zones/${editing.id}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post('/admin/zones', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (zone: Zone) => {
        if (confirm(`Hapus zona "${zone.name}"?`)) {
            router.delete(`/admin/zones/${zone.id}`);
        }
    };

    return (
        <>
            <Head title="Zona & Tarif - Admin" />

            <DashboardLayout title="Zona & Tarif">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Zona & Tarif
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Kelola zona tujuan dan tarif pengiriman per kg.
                            </p>
                        </div>
                        <Button variant="primary" onClick={openCreate}>
                            <Plus size={18} />
                            Tambah Zona
                        </Button>
                    </motion.div>

                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <motion.div
                                className="w-full max-w-md border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[var(--heading)]">
                                        {editing ? 'Edit Zona' : 'Tambah Zona'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditing(null);
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
                                            Nama Zona *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            placeholder="Contoh: Ende Kota"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Tarif/kg (Rp) *
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.tarif_per_kg}
                                                onChange={(e) =>
                                                    setData(
                                                        'tarif_per_kg',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                            {errors.tarif_per_kg && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.tarif_per_kg}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Biaya Antar (Rp) *
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.biaya_antar}
                                                onChange={(e) =>
                                                    setData(
                                                        'biaya_antar',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                            />
                                            {errors.biaya_antar && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.biaya_antar}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditing(null);
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

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="border-b border-[var(--border-default)] px-6 py-4">
                            <h3 className="text-lg font-bold text-[var(--heading)]">
                                Daftar Zona
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Nama Zona
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Tarif/kg
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Biaya Antar
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {zones.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Zona"
                                                    description="Tambahkan zona tujuan untuk mengatur tarif pengiriman."
                                                    icon={
                                                        <ZoneEmpty className="h-32 w-40" />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        zones.map((zone) => (
                                            <tr
                                                key={zone.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                                    {zone.name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    Rp
                                                    {zone.tarif_per_kg.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    Rp
                                                    {zone.biaya_antar.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEdit(zone)
                                                            }
                                                            className="p-1 text-[var(--body-subtle)] hover:text-[var(--fg-brand-strong)]"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    zone,
                                                                )
                                                            }
                                                            className="p-1 text-[var(--body-subtle)] hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
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
