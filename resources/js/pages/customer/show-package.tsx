import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    User,
    Hash,
    Scale,
    Calendar,
    FileText,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

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

interface PackageData {
    id: number;
    uuid: string;
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string | null;
    sender_tracking_number: string | null;
    zone: { name: string; tarif_per_kg: number; biaya_antar: number } | null;
    weight_estimated: number | null;
    length_estimated: number | null;
    width_estimated: number | null;
    height_estimated: number | null;
    volumetric_estimated: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    weight_actual: number | null;
    volumetric_actual: number | null;
    final_weight: number | null;
    shipping_cost: number;
    total_cost: number;
    status: string;
    status_label: string;
    payment_proof: string | null;
    notes: string | null;
    created_at: string;
}

interface ShowPackageProps {
    package: PackageData;
}

export default function ShowPackage({ package: pkg }: ShowPackageProps) {
    const estFinalWeight =
        pkg.weight_estimated && pkg.volumetric_estimated
            ? Math.max(pkg.weight_estimated, pkg.volumetric_estimated)
            : pkg.weight_estimated;

    const estCost =
        pkg.zone && estFinalWeight
            ? Math.ceil(
                  (pkg.zone.tarif_per_kg * estFinalWeight) / 1000 +
                      pkg.zone.biaya_antar,
              )
            : 0;

    const hasActual = pkg.shipping_cost > 0;

    return (
        <>
            <Head title={`Paket ${pkg.tracking_code}`} />

            <DashboardLayout title="Detail Paket">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <button
                            onClick={() => router.get('/packages')}
                            className="mb-4 flex items-center gap-2 text-sm text-[var(--body-subtle)] hover:text-[var(--heading)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--heading)]">
                                    {pkg.tracking_code}
                                </h2>
                                <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                    Detail paket yang sudah Anda daftarkan.
                                </p>
                            </div>
                            <span
                                className={`inline-block w-fit px-3 py-1 text-sm font-medium ${statusColors[pkg.status] ?? ''}`}
                            >
                                {pkg.status_label}
                            </span>
                        </div>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ── Info Utama ── */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* ── Data Penerima ── */}
                            <motion.div
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <div className="border-b border-[var(--border-default)] px-6 py-4">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                        <User size={18} />
                                        Data Penerima
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-6">
                                    <div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Nama Penerima
                                        </p>
                                        <p className="text-sm font-medium text-[var(--heading)]">
                                            {pkg.recipient_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Telepon
                                        </p>
                                        <p className="text-sm font-medium text-[var(--heading)]">
                                            {pkg.recipient_phone ?? '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Zona Tujuan
                                        </p>
                                        <p className="text-sm font-medium text-[var(--heading)]">
                                            {pkg.zone?.name ?? '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            No. Resi Toko
                                        </p>
                                        <p className="text-sm font-medium text-[var(--heading)]">
                                            {pkg.sender_tracking_number ?? '-'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Estimasi vs Aktual ── */}
                            <motion.div
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <div className="border-b border-[var(--border-default)] px-6 py-4">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                        <Scale size={18} />
                                        Berat & Dimensi (Estimasi vs Aktual)
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--border-default)]">
                                                <th className="pb-3 text-left font-medium text-[var(--body-subtle)]">
                                                    Data
                                                </th>
                                                <th className="pb-3 text-right font-medium text-[var(--body-subtle)]">
                                                    Estimasi (Anda)
                                                </th>
                                                <th className="pb-3 text-right font-medium text-[var(--body-subtle)]">
                                                    Aktual (Staff)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[var(--heading)]">
                                            <tr className="border-b border-[var(--border-default)]">
                                                <td className="py-3 text-[var(--body-subtle)]">
                                                    Berat
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.weight_estimated
                                                        ? `${pkg.weight_estimated.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.weight_actual ? (
                                                        `${pkg.weight_actual.toLocaleString('id-ID')}g`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            belum ditimbang
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-[var(--border-default)]">
                                                <td className="py-3 text-[var(--body-subtle)]">
                                                    Panjang
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.length_estimated
                                                        ? `${pkg.length_estimated}cm`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.length ? (
                                                        `${pkg.length}cm`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-[var(--border-default)]">
                                                <td className="py-3 text-[var(--body-subtle)]">
                                                    Lebar
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.width_estimated
                                                        ? `${pkg.width_estimated}cm`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.width ? (
                                                        `${pkg.width}cm`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-[var(--border-default)]">
                                                <td className="py-3 text-[var(--body-subtle)]">
                                                    Tinggi
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.height_estimated
                                                        ? `${pkg.height_estimated}cm`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.height ? (
                                                        `${pkg.height}cm`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-[var(--border-default)]">
                                                <td className="py-3 text-[var(--body-subtle)]">
                                                    Volumetrik (P×L×T÷6000)
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.volumetric_estimated
                                                        ? `${pkg.volumetric_estimated.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {pkg.volumetric_actual ? (
                                                        `${pkg.volumetric_actual.toLocaleString('id-ID')}g`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-medium text-[var(--heading)]">
                                                    Berat Final
                                                </td>
                                                <td className="py-3 text-right font-medium">
                                                    {estFinalWeight
                                                        ? `${estFinalWeight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right font-medium">
                                                    {pkg.final_weight ? (
                                                        `${pkg.final_weight.toLocaleString('id-ID')}g`
                                                    ) : (
                                                        <span className="text-[var(--body-subtle)]">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>

                            {pkg.notes && (
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                            <FileText size={18} />
                                            Catatan
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-[var(--body)]">
                                            {pkg.notes}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ── Sidebar Info ── */}
                        <div className="space-y-6">
                            <motion.div
                                className="sticky top-24 border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <div className="border-b border-[var(--border-default)] px-6 py-4">
                                    <h3 className="text-lg font-bold text-[var(--heading)]">
                                        Info Pengiriman
                                    </h3>
                                </div>
                                <div className="space-y-4 p-6">
                                    <div className="flex items-start gap-3">
                                        <Hash
                                            size={18}
                                            className="mt-0.5 text-[var(--fg-brand-strong)]"
                                        />
                                        <div>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                Kode Tracking
                                            </p>
                                            <p className="font-mono text-sm font-medium text-[var(--heading)]">
                                                {pkg.tracking_code}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={18}
                                            className="mt-0.5 text-[var(--fg-brand-strong)]"
                                        />
                                        <div>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                Zona Tujuan
                                            </p>
                                            <p className="text-sm font-medium text-[var(--heading)]">
                                                {pkg.zone?.name ?? '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar
                                            size={18}
                                            className="mt-0.5 text-[var(--fg-brand-strong)]"
                                        />
                                        <div>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                Tanggal Daftar
                                            </p>
                                            <p className="text-sm font-medium text-[var(--heading)]">
                                                {new Date(
                                                    pkg.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-[var(--border-default)] pt-4">
                                        <p className="mb-2 text-xs font-medium text-[var(--body-subtle)]">
                                            Perhitungan Estimasi
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Berat Estimasi
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {pkg.weight_estimated
                                                    ? `${pkg.weight_estimated.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Berat Volumetrik
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {pkg.volumetric_estimated
                                                    ? `${pkg.volumetric_estimated.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-[var(--heading)]">
                                                Berat Final Estimasi
                                            </span>
                                            <span className="font-bold text-[var(--heading)]">
                                                {estFinalWeight
                                                    ? `${estFinalWeight.toLocaleString('id-ID')}g`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            max(berat, volumetrik)
                                        </p>
                                        <div className="mt-3 flex justify-between">
                                            <span className="text-sm font-medium text-[var(--heading)]">
                                                Estimasi Ongkir
                                            </span>
                                            <span className="text-lg font-bold text-[var(--fg-brand-strong)]">
                                                Rp
                                                {estCost.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                        {hasActual && (
                                            <div className="mt-2 border-t border-[var(--border-default)] pt-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[var(--body-subtle)]">
                                                        Ongkir Aktual
                                                    </span>
                                                    <span className="font-medium text-[var(--heading)]">
                                                        Rp
                                                        {pkg.shipping_cost.toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                            Harga final setelah penimbangan.
                                        </p>
                                    </div>
                                    {pkg.status === 'waiting_for_payment' && (
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    `/packages/${pkg.uuid}/pay`,
                                                )
                                            }
                                            className="mt-4 w-full bg-[var(--fg-brand-strong)] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80"
                                        >
                                            Bayar Sekarang
                                        </button>
                                    )}
                                    {pkg.status === 'paid' &&
                                        pkg.payment_proof && (
                                            <p className="mt-2 text-xs text-[var(--fg-success-strong)]">
                                                Bukti pembayaran sudah
                                                dikonfirmasi.
                                            </p>
                                        )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
