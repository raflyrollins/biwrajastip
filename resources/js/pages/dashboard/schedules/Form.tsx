import { Head, Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/ui/DatePicker';
import SelectSearch from '@/components/ui/SelectSearch';
import { useAlert } from '@/contexts/AlertContext';

interface Schedule {
    uuid: string;
    ship_id: string;
    departure_date: string;
    arrival_date: string | null;
    notes: string | null;
}

interface ShipOption {
    value: string;
    label: string;
}

interface PageProps {
    schedule?: Schedule;
    ships: ShipOption[];
    errors?: Record<string, string>;
    flash?: { success?: string };
}

export default function SchedulesForm() {
    const { schedule, ships, errors, flash } = usePage()
        .props as unknown as PageProps;
    const isEditing = !!schedule;
    const alert = useAlert();

    const [shipId, setShipId] = useState(schedule?.ship_id ?? '');
    const [departureDate, setDepartureDate] = useState(
        schedule?.departure_date ?? '',
    );
    const [arrivalDate, setArrivalDate] = useState(
        schedule?.arrival_date ?? '',
    );
    const [notes, setNotes] = useState(schedule?.notes ?? '');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            ship_id: shipId,
            departure_date: departureDate,
            arrival_date: arrivalDate || null,
            notes: notes || null,
        };

        if (isEditing) {
            router.put('/dashboard/schedules/' + schedule.uuid, payload, {
                onSuccess: () => alert('Jadwal berhasil diperbarui.'),
            });
        } else {
            router.post('/dashboard/schedules', payload, {
                onSuccess: () => alert('Jadwal berhasil ditambahkan.'),
            });
        }
    }

    return (
        <>
            <Head title={isEditing ? 'Edit Jadwal' : 'Tambah Jadwal'} />

            <DashboardLayout
                title={isEditing ? 'Edit Jadwal' : 'Tambah Jadwal'}
            >
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
                            Kapal
                        </label>
                        <SelectSearch
                            options={ships}
                            value={shipId}
                            onChange={setShipId}
                            placeholder="Pilih kapal..."
                        />
                        {errors?.ship_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.ship_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Tanggal Berangkat
                        </label>
                        <DatePicker
                            value={departureDate}
                            onChange={setDepartureDate}
                            placeholder="Pilih tanggal keberangkatan..."
                        />
                        {errors?.departure_date && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.departure_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Tanggal Tiba
                        </label>
                        <DatePicker
                            value={arrivalDate}
                            onChange={setArrivalDate}
                            placeholder="Pilih tanggal kedatangan (opsional)..."
                        />
                        {errors?.arrival_date && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.arrival_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Catatan
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full resize-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            placeholder="Catatan (opsional)"
                        />
                        {errors?.notes && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Link
                            href={'/dashboard/schedules'}
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
