import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAlert } from '@/contexts/AlertContext';

interface PackageOption {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    total_price: number;
}

interface PaymentFormProps {
    packages: PackageOption[];
}

export default function PaymentForm({ packages }: PaymentFormProps) {
    const alert = useAlert();
    const [packageId, setPackageId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('transfer_bank');
    const [proofImage, setProofImage] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        router.post('/dashboard/payments', {
            package_id: packageId,
            amount,
            payment_method: paymentMethod,
            proof_image: proofImage || null,
        }, {
            onSuccess: () => {
                alert('Bukti pembayaran berhasil dikirim.');
            },
        });
    }

    const selectedPkg = packages.find((p) => p.uuid === packageId);

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

                {packages.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-8 text-center text-sm text-[var(--body-subtle)]">
                        Tidak ada paket yang menunggu pembayaran.
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto max-w-lg space-y-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
                    >
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Pilih Paket
                            </label>
                            <select
                                value={packageId}
                                onChange={(e) => {
                                    setPackageId(e.target.value);
                                    const pkg = packages.find(
                                        (p) => p.uuid === e.target.value,
                                    );

                                    if (pkg) {
                                        setAmount(String(pkg.total_price));
                                    }
                                }}
                                required
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                            >
                                <option value="">-- Pilih Paket --</option>
                                {packages.map((p) => (
                                    <option key={p.uuid} value={p.uuid}>
                                        {p.tracking_number_biwra ?? p.tracking_number}
                                        {' — Rp '}
                                        {p.total_price.toLocaleString('id-ID')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPkg && (
                            <div className="rounded border border-[var(--border-default)] bg-[var(--neutral-tertiary)] p-3 text-sm text-[var(--body-subtle)]">
                                Total yang harus dibayar:{' '}
                                <span className="font-semibold text-[var(--heading)]">
                                    Rp {selectedPkg.total_price.toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Jumlah Bayar (Rp)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0"
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Metode Pembayaran
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                            >
                                <option value="transfer_bank">
                                    Transfer Bank
                                </option>
                                <option value="cash">Tunai</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Bukti Pembayaran
                            </label>
                            <div className="relative">
                                <Upload
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--body-subtle)]"
                                />
                                <input
                                    type="text"
                                    value={proofImage}
                                    onChange={(e) =>
                                        setProofImage(e.target.value)
                                    }
                                    placeholder="URL gambar bukti transfer"
                                    maxLength={2048}
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] py-2.5 pl-10 pr-3 text-sm text-[var(--body)] outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                />
                            </div>
                            <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                Masukkan URL gambar bukti transfer (fitur upload akan menyusul)
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            Kirim Bukti Pembayaran
                        </button>
                    </form>
                )}
            </DashboardLayout>
        </>
    );
}
