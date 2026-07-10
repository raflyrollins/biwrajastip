import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import NumericInput from '@/components/ui/NumericInput';
import SelectSearch from '@/components/ui/SelectSearch';
import { useAlert } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface Zone {
    uuid: string;
    name: string;
}

interface Package {
    uuid: string;
    user_id: number;
    sender_name: string;
    sender_phone: string;
    receiver_name: string;
    receiver_phone: string;
    tracking_number: string;
    description: string | null;
    zone_id: number;
    zone: Zone | null;
    weight_estimated: string | null;
    length_estimated: string | null;
    width_estimated: string | null;
    height_estimated: string | null;
    weight_actual: string | null;
    length_actual: string | null;
    width_actual: string | null;
    height_actual: string | null;
    status: string;
}

interface FormProps {
    package?: Package;
    zones: Zone[];
}

export default function PackagesForm({ package: pkg, zones }: FormProps) {
    const isEdit = Boolean(pkg);
    const alert = useAlert();
    const canUpdatePkg = useCan('packages.update');
    const canCollectedScope = useCan('packages.scope.collected');
    const canUpdateStaff = canUpdatePkg && canCollectedScope;

    const [senderName, setSenderName] = useState(pkg?.sender_name ?? '');
    const [senderPhone, setSenderPhone] = useState(pkg?.sender_phone ?? '');
    const [receiverName, setReceiverName] = useState(pkg?.receiver_name ?? '');
    const [receiverPhone, setReceiverPhone] = useState(
        pkg?.receiver_phone ?? '',
    );
    const [trackingNumber, setTrackingNumber] = useState(
        pkg?.tracking_number ?? '',
    );
    const [zoneId, setZoneId] = useState(pkg?.zone?.uuid ?? '');
    const [description, setDescription] = useState(pkg?.description ?? '');
    const [weightEstimated, setWeightEstimated] = useState(
        pkg?.weight_estimated ?? '',
    );
    const [lengthEstimated, setLengthEstimated] = useState(
        pkg?.length_estimated ?? '',
    );
    const [widthEstimated, setWidthEstimated] = useState(
        pkg?.width_estimated ?? '',
    );
    const [heightEstimated, setHeightEstimated] = useState(
        pkg?.height_estimated ?? '',
    );

    const [weightActual, setWeightActual] = useState(pkg?.weight_actual ?? '');
    const [lengthActual, setLengthActual] = useState(pkg?.length_actual ?? '');
    const [widthActual, setWidthActual] = useState(pkg?.width_actual ?? '');
    const [heightActual, setHeightActual] = useState(pkg?.height_actual ?? '');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const zoneOptions = useMemo(
        () =>
            zones.map((z) => ({
                value: z.uuid,
                label: z.name,
            })),
        [zones],
    );

    const estimatedPrice = useMemo(() => {
        const l = Number(lengthEstimated) || 0;
        const w = Number(widthEstimated) || 0;
        const h = Number(heightEstimated) || 0;
        const wt = Number(weightEstimated) || 0;

        if (l > 0 && w > 0 && h > 0 && wt > 0) {
            const volumetric = Math.ceil((l * w * h) / 6000) * 1000;
            const finalWeight = Math.max(wt * 1000, volumetric);
            const weightKg = finalWeight / 1000;
            const roundedWeight = Math.ceil(weightKg / 0.6) * 0.6;
            const price = Math.ceil(15000 * roundedWeight);

            return price;
        }

        return null;
    }, [lengthEstimated, widthEstimated, heightEstimated, weightEstimated]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setSubmitting(true);
        setErrors({});

        const payload: Record<string, string> = {
            sender_name: senderName,
            sender_phone: senderPhone,
            receiver_name: receiverName,
            receiver_phone: receiverPhone,
            tracking_number: trackingNumber,
            zone_id: zoneId,
            description,
            weight_estimated: String(weightEstimated),
            length_estimated: String(lengthEstimated),
            width_estimated: String(widthEstimated),
            height_estimated: String(heightEstimated),
        };

        if (canUpdateStaff) {
            payload.weight_actual = String(weightActual);
            payload.length_actual = String(lengthActual);
            payload.width_actual = String(widthActual);
            payload.height_actual = String(heightActual);
        }

        const options = {
            onSuccess: () => {
                setSubmitting(false);
                alert(
                    isEdit
                        ? 'Paket berhasil diperbarui.'
                        : 'Paket berhasil dibuat.',
                );
            },
            onError: (errs: Record<string, string>) => {
                setSubmitting(false);
                setErrors(errs);
            },
        };

        if (isEdit) {
            router.put(`/dashboard/packages/${pkg!.uuid}`, payload, options);
        } else {
            router.post('/dashboard/packages', payload, options);
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Paket' : 'Buat Paket'} />

            <DashboardLayout title={isEdit ? 'Edit Paket' : 'Buat Paket'}>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-2xl space-y-6"
                >
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Data Pengirim
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    Nama Pengirim
                                </label>
                                <input
                                    type="text"
                                    value={senderName}
                                    onChange={(e) =>
                                        setSenderName(e.target.value)
                                    }
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                    placeholder="Nama pengirim"
                                />
                                {errors.sender_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.sender_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    No. Telepon Pengirim
                                </label>
                                <input
                                    type="text"
                                    value={senderPhone}
                                    onChange={(e) =>
                                        setSenderPhone(e.target.value)
                                    }
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                    placeholder="No. telepon pengirim"
                                />
                                {errors.sender_phone && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.sender_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Data Penerima
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    Nama Penerima
                                </label>
                                <input
                                    type="text"
                                    value={receiverName}
                                    onChange={(e) =>
                                        setReceiverName(e.target.value)
                                    }
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                    placeholder="Nama penerima"
                                />
                                {errors.receiver_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.receiver_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    No. Telepon Penerima
                                </label>
                                <input
                                    type="text"
                                    value={receiverPhone}
                                    onChange={(e) =>
                                        setReceiverPhone(e.target.value)
                                    }
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                    placeholder="No. telepon penerima"
                                />
                                {errors.receiver_phone && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.receiver_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Detail Paket
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    No. Tracking
                                </label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) =>
                                        setTrackingNumber(e.target.value)
                                    }
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                    placeholder="No. tracking"
                                />
                                {errors.tracking_number && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.tracking_number}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body)]">
                                    Zona Tujuan
                                </label>
                                <SelectSearch
                                    options={zoneOptions}
                                    value={zoneId}
                                    onChange={setZoneId}
                                    placeholder="Pilih zona..."
                                />
                                {errors.zone_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.zone_id}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="mb-1 block text-sm text-[var(--body)]">
                                Deskripsi
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full resize-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                placeholder="Deskripsi paket (opsional)"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <h3 className="mt-6 mb-3 text-sm font-medium text-[var(--body)]">
                            Estimasi Dimensi & Berat
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                    Panjang
                                </label>
                                <NumericInput
                                    value={lengthEstimated}
                                    onChange={setLengthEstimated}
                                    placeholder="0"
                                    suffix="cm"
                                />
                                {errors.length_estimated && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.length_estimated}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                    Lebar
                                </label>
                                <NumericInput
                                    value={widthEstimated}
                                    onChange={setWidthEstimated}
                                    placeholder="0"
                                    suffix="cm"
                                />
                                {errors.width_estimated && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.width_estimated}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                    Tinggi
                                </label>
                                <NumericInput
                                    value={heightEstimated}
                                    onChange={setHeightEstimated}
                                    placeholder="0"
                                    suffix="cm"
                                />
                                {errors.height_estimated && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.height_estimated}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                    Berat (kg)
                                </label>
                                <NumericInput
                                    value={weightEstimated}
                                    onChange={setWeightEstimated}
                                    placeholder="0"
                                    suffix="kg"
                                />
                                {errors.weight_estimated && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.weight_estimated}
                                    </p>
                                )}
                            </div>
                        </div>

                        {estimatedPrice !== null && (
                            <div className="mt-4 border border-[var(--border-default)] bg-[var(--brand-softer)] px-4 py-3">
                                <p className="text-sm text-[var(--body)]">
                                    Estimasi harga:{' '}
                                    <span className="font-bold text-[var(--brand-strong)]">
                                        Rp{' '}
                                        {estimatedPrice.toLocaleString('id-ID')}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {canUpdateStaff && (
                        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                            <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                                Data Aktual (Staff)
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                        Panjang Aktual
                                    </label>
                                    <NumericInput
                                        value={lengthActual}
                                        onChange={setLengthActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.length_actual && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.length_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                        Lebar Aktual
                                    </label>
                                    <NumericInput
                                        value={widthActual}
                                        onChange={setWidthActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.width_actual && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.width_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                        Tinggi Aktual
                                    </label>
                                    <NumericInput
                                        value={heightActual}
                                        onChange={setHeightActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.height_actual && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.height_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body-subtle)]">
                                        Berat Aktual (kg)
                                    </label>
                                    <NumericInput
                                        value={weightActual}
                                        onChange={setWeightActual}
                                        placeholder="0"
                                        suffix="kg"
                                    />
                                    {errors.weight_actual && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.weight_actual}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:opacity-50"
                        >
                            {submitting
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Simpan Perubahan'
                                  : 'Buat Paket'}
                        </button>
                        <Link
                            href="/dashboard/packages"
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-3 text-sm text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </DashboardLayout>
        </>
    );
}
