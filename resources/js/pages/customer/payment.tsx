import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Banknote,
    CreditCard,
    Upload,
    CheckCircle,
} from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface PackageData {
    id: number;
    uuid: string;
    tracking_code: string;
    recipient_name: string;
    zone: { name: string; tarif_per_kg: number; biaya_antar: number } | null;
    final_weight: number | null;
    shipping_cost: number;
    total_cost: number;
    payment_proof: string | null;
    status_label: string;
}

interface PaymentProps {
    package: PackageData;
}

export default function CustomerPayment({ package: pkg }: PaymentProps) {
    const { setData, post, processing, errors } = useForm({
        payment_proof: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/customer/packages/${pkg.uuid}/pay`);
    };

    return (
        <>
            <Head title={`Bayar - ${pkg.tracking_code}`} />

            <DashboardLayout title="Pembayaran">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <button
                            onClick={() =>
                                router.get(`/customer/packages/${pkg.uuid}`)
                            }
                            className="mb-4 flex items-center gap-2 text-sm text-[var(--body-subtle)] hover:text-[var(--heading)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Pembayaran
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Kode Tracking: {pkg.tracking_code}
                        </p>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* ── Info Pembayaran ── */}
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Banknote size={18} />
                                    Info Pembayaran
                                </h3>
                            </div>
                            <div className="space-y-4 p-6">
                                <div className="bg-[var(--brand-soft)] p-4">
                                    <p className="mb-3 text-sm font-bold text-[var(--heading)]">
                                        Total Pembayaran
                                    </p>
                                    <p className="text-3xl font-bold text-[var(--fg-brand-strong)]">
                                        Rp
                                        {pkg.total_cost.toLocaleString(
                                            'id-ID',
                                        )}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-[var(--heading)]">
                                        Transfer ke:
                                    </p>
                                    <div className="flex items-center gap-3 border border-[var(--border-default)] p-3">
                                        <CreditCard
                                            size={24}
                                            className="text-[var(--fg-brand-strong)]"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-[var(--heading)]">
                                                Bank BCA
                                            </p>
                                            <p className="font-mono text-sm text-[var(--body)]">
                                                1234567890
                                            </p>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                a.n. BiwraJastip
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 border border-[var(--border-default)] p-3">
                                        <CreditCard
                                            size={24}
                                            className="text-[var(--fg-brand-strong)]"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-[var(--heading)]">
                                                Bank Mandiri
                                            </p>
                                            <p className="font-mono text-sm text-[var(--body)]">
                                                9876543210
                                            </p>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                a.n. BiwraJastip
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border border-dashed border-[var(--border-default)] p-4 text-center">
                                        <p className="text-sm font-medium text-[var(--heading)]">
                                            QRIS
                                        </p>
                                        <div className="mx-auto my-3 flex size-40 items-center justify-center bg-white">
                                            <p className="text-xs text-gray-400">
                                                (QRIS Image)
                                            </p>
                                        </div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Scan QRIS di atas untuk
                                            pembayaran
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Upload Bukti ── */}
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Upload size={18} />
                                    Upload Bukti Transfer
                                </h3>
                            </div>
                            <div className="p-6">
                                {pkg.payment_proof ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[var(--fg-success-strong)]">
                                            <CheckCircle size={20} />
                                            <p className="text-sm font-medium">
                                                Bukti pembayaran sudah
                                                diupload. Menunggu konfirmasi
                                                admin.
                                            </p>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                router.get(
                                                    `/customer/packages/${pkg.uuid}`,
                                                )
                                            }
                                        >
                                            Kembali ke Detail Paket
                                        </Button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Screenshot Bukti Transfer *
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target
                                                            .files?.[0] ??
                                                        null;
                                                    setData(
                                                        'payment_proof',
                                                        file,
                                                    );
                                                }}
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] file:mr-3 file:border-0 file:bg-[var(--fg-brand-strong)] file:px-3 file:py-1 file:text-xs file:text-white"
                                            />
                                            {errors.payment_proof && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.payment_proof}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                                Format: JPG/PNG, maks. 2MB
                                            </p>
                                        </div>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            {processing
                                                ? 'Mengupload...'
                                                : 'Upload Bukti Pembayaran'}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
