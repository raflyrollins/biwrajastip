import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Clock, Upload } from 'lucide-react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAlert } from '@/contexts/AlertContext';

interface PackageDetail {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    total_price: number;
    price: number;
    delivery_fee: number;
    final_weight: number | null;
    weight_actual: number | null;
    receiver_name: string;
    zone_name: string | null;
}

interface ExistingPayment {
    status: 'pending' | 'rejected';
    notes: string | null;
    created_at: string;
}

interface PaymentFormProps {
    package: PackageDetail;
    existingPayment: ExistingPayment | null;
}

export default function PaymentForm({ package: pkg, existingPayment }: PaymentFormProps) {
    const alert = useAlert();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];

        if (!selected) {
            setFile(null);
            setPreview(null);

            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!file) {
            alert('Pilih file bukti transfer terlebih dahulu.');

            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('package_id', pkg.uuid);
        formData.append('amount', String(pkg.total_price));
        formData.append('payment_method', 'transfer_bank');
        formData.append('proof_image', file);

        router.post('/dashboard/payments', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onSuccess: () => {
                alert('Bukti pembayaran berhasil dikirim.');
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    }

    if (existingPayment?.status === 'pending') {
        return (
            <>
                <Head title="Bayar Paket" />

                <DashboardLayout title="Bayar Paket">
                    <div className="mb-6">
                        <Link
                            href="/dashboard/packages"
                            className="inline-flex items-center gap-1 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--body)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>
                    </div>

                    <div className="mx-auto max-w-lg text-center">
                        <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-8">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--warning)]/20">
                                <Clock size={32} className="text-[var(--warning)]" />
                            </div>
                            <h2 className="mb-2 text-lg font-bold text-[var(--heading)]">
                                Menunggu Verifikasi
                            </h2>
                            <p className="text-sm text-[var(--body)]">
                                Bukti pembayaran Anda telah dikirim pada{' '}
                                {new Date(existingPayment.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                . Silakan tunggu verifikasi dari admin.
                            </p>
                            <p className="mt-4 text-xs text-[var(--body-subtle)]">
                                Anda akan menerima notifikasi setelah pembayaran diverifikasi.
                            </p>
                        </div>
                    </div>
                </DashboardLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Bayar Paket" />

            <DashboardLayout title="Bayar Paket">
                <div className="mb-6">
                    <Link
                        href="/dashboard/packages"
                        className="inline-flex items-center gap-1 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--body)]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                {existingPayment?.status === 'rejected' && (
                    <div className="mx-auto mb-6 max-w-2xl border border-[var(--fg-brand-strong)] bg-[var(--fg-brand-strong)]/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="mt-0.5 shrink-0 text-[var(--fg-brand-strong)]" />
                            <div>
                                <p className="text-sm font-medium text-[var(--fg-brand-strong)]">
                                    Pembayaran Ditolak
                                </p>
                                {existingPayment.notes && (
                                    <p className="mt-1 text-sm text-[var(--body)]">
                                        Alasan: {existingPayment.notes}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                    Silakan upload ulang bukti pembayaran yang benar.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Invoice */}
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Rincian Pembayaran
                        </h2>
                        <table className="w-full text-sm">
                            <tbody className="text-[var(--body)]">
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">No. Resi</td>
                                    <td className="py-2 text-right font-medium text-[var(--heading)]">
                                        {pkg.tracking_number_biwra ?? pkg.tracking_number}
                                    </td>
                                </tr>
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Penerima</td>
                                    <td className="py-2 text-right font-medium text-[var(--heading)]">
                                        {pkg.receiver_name}
                                    </td>
                                </tr>
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Zona Tujuan</td>
                                    <td className="py-2 text-right font-medium text-[var(--heading)]">
                                        {pkg.zone_name ?? '-'}
                                    </td>
                                </tr>
                                {pkg.weight_actual && (
                                    <tr className="border-b border-[var(--border-default)]">
                                        <td className="py-2">Berat Aktual</td>
                                        <td className="py-2 text-right font-medium text-[var(--heading)]">
                                            {pkg.weight_actual} kg
                                        </td>
                                    </tr>
                                )}
                                {pkg.final_weight && (
                                    <tr className="border-b border-[var(--border-default)]">
                                        <td className="py-2">Berat Final</td>
                                        <td className="py-2 text-right font-medium text-[var(--heading)]">
                                            {pkg.final_weight / 1000} kg
                                        </td>
                                    </tr>
                                )}
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Biaya Kirim</td>
                                    <td className="py-2 text-right font-medium text-[var(--heading)]">
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Biaya Antar</td>
                                    <td className="py-2 text-right font-medium text-[var(--heading)]">
                                        Rp {pkg.delivery_fee.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-semibold text-[var(--heading)]">
                                        Total
                                    </td>
                                    <td className="py-2 text-right text-base font-bold text-[var(--brand)]">
                                        Rp {pkg.total_price.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Instructions */}
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Instruksi Pembayaran
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div className="border border-[var(--border-default)] bg-[var(--neutral-tertiary)] p-4">
                                <p className="mb-2 font-medium text-[var(--heading)]">
                                    Transfer Bank
                                </p>
                                <div className="space-y-1 text-[var(--body)]">
                                    <p>Bank BNI — 1234567890</p>
                                    <p>a.n. BiwraJastip</p>
                                    <p className="text-xs text-[var(--body-subtle)]">
                                        Konfirmasi via WhatsApp setelah transfer
                                    </p>
                                </div>
                            </div>

                            <div className="border border-[var(--border-default)] bg-[var(--neutral-tertiary)] p-4 text-center">
                                <p className="mb-2 font-medium text-[var(--heading)]">
                                    QRIS
                                </p>
                                <div className="inline-flex items-center justify-center border border-[var(--border-default)] bg-white p-2">
                                    <div className="flex size-32 items-center justify-center text-xs text-[var(--body-subtle)]">
                                        QRIS STATIS
                                        <br />
                                        (placeholder)
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                    Scan QRIS di atas untuk pembayaran
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Proof */}
                    <form onSubmit={handleSubmit} className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Upload Bukti Pembayaran
                        </h2>

                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                File Bukti Transfer
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        fileInputRef.current?.click();
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--border-default)] bg-[var(--neutral-tertiary)] p-6 transition-colors hover:border-[var(--brand)]"
                            >
                                <Upload size={24} className="mb-2 text-[var(--body-subtle)]" />
                                {file ? (
                                    <p className="text-sm text-[var(--heading)]">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-[var(--body)]">
                                            Klik untuk memilih file
                                        </p>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            JPEG / PNG, maks. 5 MB
                                        </p>
                                    </>
                                )}
                            </div>

                            {preview && (
                                <div className="mt-3">
                                    <img
                                        src={preview}
                                        alt="Preview bukti transfer"
                                        className="max-h-48 w-full border border-[var(--border-default)] object-contain"
                                    />
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !file}
                            className="w-full cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:opacity-50"
                        >
                            {submitting ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
                        </button>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
