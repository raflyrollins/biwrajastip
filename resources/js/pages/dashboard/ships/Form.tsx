import { Head, Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAlert } from '@/contexts/AlertContext';

interface Ship {
    uuid: string;
    name: string;
    description: string | null;
    is_active: boolean;
}

interface PageProps {
    ship?: Ship;
    errors?: Record<string, string>;
    flash?: { success?: string };
}

export default function ShipsForm() {
    const { ship, errors, flash } = usePage().props as PageProps;
    const isEditing = !!ship;
    const alert = useAlert();

    const [name, setName] = useState(ship?.name ?? '');
    const [description, setDescription] = useState(ship?.description ?? '');
    const [isActive, setIsActive] = useState(ship?.is_active ?? true);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            name,
            description: description || null,
            is_active: isActive,
        };

        if (isEditing) {
            router.put('/dashboard/ships/' + ship.uuid, payload, {
                onSuccess: () => alert('Kapal berhasil diperbarui.'),
            });
        } else {
            router.post('/dashboard/ships', payload, {
                onSuccess: () => alert('Kapal berhasil ditambahkan.'),
            });
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Kapal' : 'Tambah Kapal'} />

            <DashboardLayout title={isEditing ? 'Edit Kapal' : 'Tambah Kapal'}>
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
                            Nama Kapal
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            placeholder="Contoh: KM. Leuser"
                        />
                        {errors?.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
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

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Status
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body)]">
                                <input
                                    type="radio"
                                    name="is_active"
                                    checked={isActive}
                                    onChange={() => setIsActive(true)}
                                    className="cursor-pointer accent-[var(--brand)]"
                                />
                                Aktif
                            </label>
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body)]">
                                <input
                                    type="radio"
                                    name="is_active"
                                    checked={!isActive}
                                    onChange={() => setIsActive(false)}
                                    className="cursor-pointer accent-[var(--brand)]"
                                />
                                Nonaktif
                            </label>
                        </div>
                        {errors?.is_active && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.is_active}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Link
                            href={'/dashboard/ships'}
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
