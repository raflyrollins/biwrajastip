import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Package } from 'lucide-react';
import { useMemo } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface PackageData {
    id: number;
    tracking_code: string;
    recipient_name: string;
    sender_tracking_number: string | null;
    zone: { name: string; tarif_per_kg: number; biaya_antar: number } | null;
    weight_estimated: number | null;
    length_estimated: number | null;
    width_estimated: number | null;
    height_estimated: number | null;
    volumetric_estimated: number | null;
}

interface WeighProps {
    package: PackageData;
}

export default function StaffSurabayaWeigh({ package: pkg }: WeighProps) {
    const { data, setData, post, processing, errors } = useForm({
        weight_actual: '',
        length: '',
        width: '',
        height: '',
    });

    const actualWeight = Number(data.weight_actual) || 0;
    const length = Number(data.length) || 0;
    const width = Number(data.width) || 0;
    const height = Number(data.height) || 0;

    const volumetricWeight = useMemo(() => {
        if (!length || !width || !height) {
            return 0;
        }

        return Math.ceil((length * width * height) / 6000);
    }, [length, width, height]);

    const finalWeight = Math.max(actualWeight, volumetricWeight);

    const estimatedCost = useMemo(() => {
        if (!pkg.zone || !finalWeight) {
            return 0;
        }

        return Math.ceil(
            (pkg.zone.tarif_per_kg * finalWeight) / 1000 + pkg.zone.biaya_antar,
        );
    }, [pkg.zone, finalWeight]);

    const estFinalWeight = useMemo(() => {
        if (!pkg.weight_estimated || !pkg.volumetric_estimated) {
            return pkg.weight_estimated ?? 0;
        }

        return Math.max(pkg.weight_estimated, pkg.volumetric_estimated);
    }, [pkg.weight_estimated, pkg.volumetric_estimated]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/staff/surabaya/packages/${pkg.id}/weigh`);
    };

    return (
        <>
            <Head title={`Timbang ${pkg.tracking_code}`} />

            <DashboardLayout title="Timbang & Ukur Paket">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <button
                            onClick={() =>
                                router.get('/staff/surabaya/packages')
                            }
                            className="mb-4 flex items-center gap-2 text-sm text-[var(--body-subtle)] hover:text-[var(--heading)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Timbang & Ukur Paket
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Input berat aktual dan dimensi fisik paket. Harga
                            akan dihitung otomatis menggunakan rumus volumetrik.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* ── Form Input ── */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* ── Info Paket + Estimasi Customer ── */}
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                            <Package size={18} />
                                            Info Paket & Estimasi Customer
                                        </h3>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    Kode Tracking
                                                </p>
                                                <p className="font-mono text-sm font-medium text-[var(--heading)]">
                                                    {pkg.tracking_code}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    Penerima
                                                </p>
                                                <p className="text-sm font-medium text-[var(--heading)]">
                                                    {pkg.recipient_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    No. Resi Toko
                                                </p>
                                                <p className="font-mono text-sm font-medium text-[var(--heading)]">
                                                    {pkg.sender_tracking_number ??
                                                        '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    Zona
                                                </p>
                                                <p className="text-sm font-medium text-[var(--heading)]">
                                                    {pkg.zone?.name ?? '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border-t border-[var(--border-default)] pt-4">
                                            <p className="mb-2 text-xs font-medium text-[var(--body-subtle)]">
                                                Perhitungan Estimasi Customer
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-[var(--body-subtle)]">
                                                        Berat Estimasi
                                                    </p>
                                                    <p className="font-medium text-[var(--heading)]">
                                                        {pkg.weight_estimated
                                                            ? `${pkg.weight_estimated.toLocaleString('id-ID')}g`
                                                            : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--body-subtle)]">
                                                        Dimensi (P×L×T)
                                                    </p>
                                                    <p className="font-medium text-[var(--heading)]">
                                                        {pkg.length_estimated &&
                                                        pkg.width_estimated &&
                                                        pkg.height_estimated
                                                            ? `${pkg.length_estimated}×${pkg.width_estimated}×${pkg.height_estimated}cm`
                                                            : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--body-subtle)]">
                                                        Berat Volumetrik
                                                    </p>
                                                    <p className="font-medium text-[var(--heading)]">
                                                        {pkg.volumetric_estimated
                                                            ? `${pkg.volumetric_estimated.toLocaleString('id-ID')}g`
                                                            : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[var(--body-subtle)]">
                                                        Berat Final Estimasi
                                                    </p>
                                                    <p className="font-bold text-[var(--heading)]">
                                                        {estFinalWeight
                                                            ? `${estFinalWeight.toLocaleString('id-ID')}g`
                                                            : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ── Input Aktual ── */}
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                            <Scale size={18} />
                                            Data Aktual (Hasil Timbang & Ukur)
                                        </h3>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Berat Aktual (gram) *
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.weight_actual}
                                                onChange={(e) =>
                                                    setData(
                                                        'weight_actual',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                placeholder="berat dalam gram"
                                            />
                                            {errors.weight_actual && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.weight_actual}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Panjang (cm) *
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
                                                    placeholder="P"
                                                />
                                                {errors.length && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.length}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Lebar (cm) *
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
                                                    placeholder="L"
                                                />
                                                {errors.width && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.width}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Tinggi (cm) *
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
                                                    placeholder="T"
                                                />
                                                {errors.height && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.height}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* ── Ringkasan Harga ── */}
                            <div className="space-y-6">
                                <motion.div
                                    className="sticky top-24 border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="text-lg font-bold text-[var(--heading)]">
                                            Perhitungan Harga
                                        </h3>
                                    </div>
                                    <div className="space-y-3 p-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Berat Aktual
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {actualWeight
                                                    ? `${actualWeight.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Berat Volumetrik
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {volumetricWeight
                                                    ? `${volumetricWeight.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            P×L×T ÷ 6000
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-[var(--heading)]">
                                                Berat Final
                                            </span>
                                            <span className="font-bold text-[var(--heading)]">
                                                {finalWeight
                                                    ? `${finalWeight.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            max(berat, volumetrik)
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Tarif/kg
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {pkg.zone
                                                    ? `Rp${pkg.zone.tarif_per_kg.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Biaya Antar
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {pkg.zone
                                                    ? `Rp${pkg.zone.biaya_antar.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="border-t border-[var(--border-default)] pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-[var(--heading)]">
                                                    Total Ongkir
                                                </span>
                                                <span className="text-lg font-bold text-[var(--fg-brand-strong)]">
                                                    Rp
                                                    {estimatedCost.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {estFinalWeight > 0 &&
                                            finalWeight > 0 && (
                                                <div className="border-t border-[var(--border-default)] pt-3">
                                                    <p className="text-xs text-[var(--body-subtle)]">
                                                        Estimasi:{' '}
                                                        {estFinalWeight.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                        g → Aktual:{' '}
                                                        {finalWeight.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                        g
                                                    </p>
                                                </div>
                                            )}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={processing}
                                            className="mt-4 w-full"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan & Hitung Harga'}
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
