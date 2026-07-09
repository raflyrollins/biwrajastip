import { Head, Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import NumericInput from '@/components/ui/NumericInput';
import { useAlert } from '@/contexts/AlertContext';

interface Zone {
    uuid: string;
    name: string;
    delivery_fee: string;
    is_pusat: boolean;
    description: string | null;
}

interface PageProps {
    zone?: Zone;
    errors?: Record<string, string>;
    flash?: { success?: string };
}

export default function ZonesForm() {
    const { zone, errors, flash } = usePage().props as PageProps;
    const isEditing = !!zone;
    const alert = useAlert();

    const [name, setName] = useState(zone?.name ?? '');
    const [deliveryFee, setDeliveryFee] = useState(
        zone?.delivery_fee?.toString() ?? '',
    );
    const [isPusat, setIsPusat] = useState(zone?.is_pusat ?? false);
    const [description, setDescription] = useState(zone?.description ?? '');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            name,
            delivery_fee: deliveryFee,
            is_pusat: isPusat,
            description: description || null,
        };

        if (isEditing) {
            router.put('/dashboard/zones/' + zone.uuid, payload, {
                onSuccess: () => alert('Zona berhasil diperbarui.'),
            });
        } else {
            router.post('/dashboard/zones', payload, {
                onSuccess: () => alert('Zona berhasil ditambahkan.'),
            });
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Zona' : 'Tambah Zona'} />

            <DashboardLayout title={isEditing ? 'Edit Zona' : 'Tambah Zona'}>
                {flash?.success && (
                    <div className="mb-4 border border-[var(--border-default)] bg-[var(--brand-softer)] px-4 py-3 text-sm text-[var(--brand-strong)]">
                        {flash.success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-lg space-y-5"
                >
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Nama Zona
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            placeholder="Contoh: Ende 1"
                        />
                        {errors?.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Biaya Kirim
                        </label>
                        <NumericInput
                            value={deliveryFee}
                            onChange={setDeliveryFee}
                            placeholder="0"
                        />
                        {errors?.delivery_fee && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.delivery_fee}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Tipe Zona
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body)]">
                                <input
                                    type="radio"
                                    name="is_pusat"
                                    checked={!isPusat}
                                    onChange={() => setIsPusat(false)}
                                    className="cursor-pointer accent-[var(--brand)]"
                                />
                                Cabang
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body)]">
                                <input
                                    type="radio"
                                    name="is_pusat"
                                    checked={isPusat}
                                    onChange={() => setIsPusat(true)}
                                    className="cursor-pointer accent-[var(--brand)]"
                                />
                                Pusat
                            </label>
                        </div>
                        {errors?.is_pusat && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.is_pusat}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Deskripsi
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full resize-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            placeholder="Deskripsi (opsional)"
                        />
                        {errors?.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Link
                            href={'/dashboard/zones'}
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-2.5 text-sm text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            className="cursor-pointer border-none bg-[var(--brand)] px-6 py-2.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </DashboardLayout>
        </>
    );
}
