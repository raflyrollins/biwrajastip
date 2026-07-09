import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import NumericInput from '@/components/ui/NumericInput';
import { useAlert } from '@/contexts/AlertContext';

interface Zone {
    uuid: string;
    name: string;
    delivery_fee: number;
}

interface PackageData {
    uuid: string;
    tracking_number: string;
    receiver_name: string;
    weight_estimated: string | null;
    length_estimated: string | null;
    width_estimated: string | null;
    height_estimated: string | null;
    zone: Zone | null;
}

interface TimbangProps {
    package: PackageData;
    tariffPerKg: number;
}

function calculatePrice(
    length: number,
    width: number,
    height: number,
    weightActual: number,
    tariffPerKg: number,
    deliveryFee: number,
): { volumetric: number; finalWeight: number; price: number; total: number } {
    if (length <= 0 || width <= 0 || height <= 0 || weightActual <= 0) {
        return { volumetric: 0, finalWeight: 0, price: 0, total: 0 };
    }

    const volumetric = Math.ceil((length * width * height) / 6000) * 1000;
    const finalWeight = Math.max(weightActual * 1000, volumetric);
    const weightKg = finalWeight / 1000;
    const roundedWeight = Math.ceil(weightKg / 0.6) * 0.6;
    const price = Math.ceil(tariffPerKg * roundedWeight);
    const total = price + deliveryFee;

    return { volumetric, finalWeight, price, total };
}

export default function Timbang({ package: pkg, tariffPerKg }: TimbangProps) {
    const alert = useAlert();

    const [lengthActual, setLengthActual] = useState(
        pkg.length_estimated ?? '',
    );
    const [widthActual, setWidthActual] = useState(pkg.width_estimated ?? '');
    const [heightActual, setHeightActual] = useState(
        pkg.height_estimated ?? '',
    );
    const [weightActual, setWeightActual] = useState(
        pkg.weight_estimated ?? '',
    );

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const deliveryFee = pkg.zone?.delivery_fee ?? 0;

    const priceBreakdown = useMemo(() => {
        const l = Number(lengthActual) || 0;
        const w = Number(widthActual) || 0;
        const h = Number(heightActual) || 0;
        const wt = Number(weightActual) || 0;

        if (l > 0 && w > 0 && h > 0 && wt > 0) {
            return calculatePrice(l, w, h, wt, tariffPerKg, deliveryFee);
        }

        return null;
    }, [
        lengthActual,
        widthActual,
        heightActual,
        weightActual,
        tariffPerKg,
        deliveryFee,
    ]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setSubmitting(true);
        setErrors({});

        const payload = {
            weight_actual: String(weightActual),
            length_actual: String(lengthActual),
            width_actual: String(widthActual),
            height_actual: String(heightActual),
        };

        router.post(`/dashboard/packages/${pkg.uuid}/timbang`, payload, {
            onSuccess: () => {
                setSubmitting(false);
                alert('Data timbangan berhasil disimpan.');
            },
            onError: (errs: Record<string, string>) => {
                setSubmitting(false);
                setErrors(errs);
            },
        });
    }

    return (
        <>
            <Head title="Timbang Paket" />

            <DashboardLayout title="Timbang Paket">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-2 text-base font-bold text-[var(--heading)]">
                            Informasi Paket
                        </h2>
                        <div className="grid gap-2 text-sm text-[var(--body)]">
                            <p>
                                No. Tracking:{' '}
                                <span className="font-medium text-[var(--heading)]">
                                    {pkg.tracking_number}
                                </span>
                            </p>
                            <p>
                                Penerima:{' '}
                                <span className="font-medium text-[var(--heading)]">
                                    {pkg.receiver_name}
                                </span>
                            </p>
                            <p>
                                Zona:{' '}
                                <span className="font-medium text-[var(--heading)]">
                                    {pkg.zone?.name ?? '-'}
                                </span>
                            </p>
                            {pkg.weight_estimated && (
                                <p>
                                    Estimasi berat:{' '}
                                    <span className="font-medium text-[var(--heading)]">
                                        {pkg.weight_estimated} kg
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                            <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                                Dimensi & Berat Aktual
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body)]">
                                        Panjang
                                    </label>
                                    <NumericInput
                                        value={lengthActual}
                                        onChange={setLengthActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.length_actual && (
                                        <p className="mt-1 text-xs text-[var(--warning)]">
                                            {errors.length_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body)]">
                                        Lebar
                                    </label>
                                    <NumericInput
                                        value={widthActual}
                                        onChange={setWidthActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.width_actual && (
                                        <p className="mt-1 text-xs text-[var(--warning)]">
                                            {errors.width_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body)]">
                                        Tinggi
                                    </label>
                                    <NumericInput
                                        value={heightActual}
                                        onChange={setHeightActual}
                                        placeholder="0"
                                        suffix="cm"
                                    />
                                    {errors.height_actual && (
                                        <p className="mt-1 text-xs text-[var(--warning)]">
                                            {errors.height_actual}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-[var(--body)]">
                                        Berat (kg)
                                    </label>
                                    <NumericInput
                                        value={weightActual}
                                        onChange={setWeightActual}
                                        placeholder="0"
                                        suffix="kg"
                                    />
                                    {errors.weight_actual && (
                                        <p className="mt-1 text-xs text-[var(--warning)]">
                                            {errors.weight_actual}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {priceBreakdown && (
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                                <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                                    Kalkulasi Harga
                                </h2>
                                <div className="space-y-2 text-sm text-[var(--body)]">
                                    <div className="flex justify-between">
                                        <span>Berat Volumetrik</span>
                                        <span className="font-medium text-[var(--heading)]">
                                            {(
                                                priceBreakdown.volumetric / 1000
                                            ).toFixed(2)}{' '}
                                            kg
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Berat Final</span>
                                        <span className="font-medium text-[var(--heading)]">
                                            {(
                                                priceBreakdown.finalWeight /
                                                1000
                                            ).toFixed(2)}{' '}
                                            kg
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tarif per kg</span>
                                        <span className="font-medium text-[var(--heading)]">
                                            Rp{' '}
                                            {tariffPerKg.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Biaya Kirim</span>
                                        <span className="font-medium text-[var(--heading)]">
                                            Rp{' '}
                                            {priceBreakdown.price.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Biaya Antar (Zona)</span>
                                        <span className="font-medium text-[var(--heading)]">
                                            Rp{' '}
                                            {deliveryFee.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                    <hr className="border-[var(--border-default)]" />
                                    <div className="flex justify-between text-base font-bold text-[var(--brand-strong)]">
                                        <span>Total</span>
                                        <span>
                                            Rp{' '}
                                            {priceBreakdown.total.toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={submitting || !priceBreakdown}
                                className="cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:opacity-50"
                            >
                                {submitting
                                    ? 'Menyimpan...'
                                    : 'Simpan & Lanjutkan'}
                            </button>
                            <Link
                                href="/dashboard/packages"
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-3 text-sm text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary)]"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
