import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { QRCode } from 'qrcode.react';
import { useEffect } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface Zone {
    name: string;
    delivery_fee: number;
    shipping_price: number;
}

interface PackageData {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    sender_name: string;
    sender_phone: string;
    receiver_name: string;
    receiver_phone: string;
    weight_actual: number | null;
    weight_estimated: number | null;
    length_actual: number | null;
    width_actual: number | null;
    height_actual: number | null;
    volumetric_weight: number | null;
    final_weight: number | null;
    price: number | null;
    delivery_fee: number | null;
    total_price: number | null;
    status: string;
    created_at: string;
    zone: Zone | null;
}

interface PaymentData {
    uuid: string;
    amount: number;
    payment_method: string | null;
    verified_at: string | null;
    user: { name: string } | null;
}

interface ReceiptProps {
    package: PackageData;
    payment: PaymentData | null;
}

export default function Receipt({ package: pkg, payment }: ReceiptProps) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Resi - {pkg.tracking_number}" />

            <DashboardLayout title="Resi Pengiriman">
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                    >
                        <Printer size={16} className="inline-block" /> Cetak
                    </button>
                </div>

                <div className="mx-auto max-w-2xl border border-[var(--border-default)] bg-[var(--neutral-primary)] p-8">
                    <div className="mb-6 border-b border-[var(--border-default)] pb-4">
                        <h1 className="text-2xl font-bold text-[var(--heading)]">
                            BiwraJastip
                        </h1>
                        <p className="text-sm text-[var(--body-subtle)]">
                            Resi Pengiriman
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    No. Resi Biwra
                                </p>
                                <p className="text-lg font-bold text-[var(--brand)]">
                                    {pkg.tracking_number_biwra ?? pkg.tracking_number}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <QRCode
                                    value={pkg.tracking_number_biwra ?? pkg.tracking_number}
                                    size={80}
                                    level="M"
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                />
                            </div>
                        </div>
                        {pkg.tracking_number_biwra && (
                            <div className="mt-1 text-center">
                                <p className="text-xs text-[var(--body-subtle)]">
                                    No. Resi Asal
                                </p>
                                <p className="text-sm text-[var(--body)]">
                                    {pkg.tracking_number}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="mb-1 text-xs font-medium text-[var(--body-subtle)]">
                                Pengirim
                            </p>
                            <p className="text-sm font-medium text-[var(--heading)]">
                                {pkg.sender_name}
                            </p>
                            <p className="text-xs text-[var(--body)]">
                                {pkg.sender_phone}
                            </p>
                        </div>
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="mb-1 text-xs font-medium text-[var(--body-subtle)]">
                                Penerima
                            </p>
                            <p className="text-sm font-medium text-[var(--heading)]">
                                {pkg.receiver_name}
                            </p>
                            <p className="text-xs text-[var(--body)]">
                                {pkg.receiver_phone}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-default)]">
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Detail
                                    </th>
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Nilai
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--body)]">
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Zona Tujuan</td>
                                    <td className="py-2 font-medium">
                                        {pkg.zone?.name ?? '-'}
                                    </td>
                                </tr>
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Berat Aktual</td>
                                    <td className="py-2 font-medium">
                                        {pkg.weight_actual
                                            ? `${pkg.weight_actual} kg`
                                            : `${pkg.weight_estimated ?? '-'} kg (est)`}
                                    </td>
                                </tr>
                                {pkg.volumetric_weight && (
                                    <tr className="border-b border-[var(--border-default)]">
                                        <td className="py-2">
                                            Berat Volumetrik
                                        </td>
                                        <td className="py-2 font-medium">
                                            {(pkg.volumetric_weight / 1000).toFixed(2)} kg
                                        </td>
                                    </tr>
                                )}
                                {pkg.final_weight && (
                                    <tr className="border-b border-[var(--border-default)]">
                                        <td className="py-2">Berat Final</td>
                                        <td className="py-2 font-medium">
                                            {(pkg.final_weight / 1000).toFixed(2)} kg
                                        </td>
                                    </tr>
                                )}
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Biaya Kirim</td>
                                    <td className="py-2 font-medium">
                                        Rp {Number(pkg.price).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                                <tr className="border-b border-[var(--border-default)]">
                                    <td className="py-2">Biaya Antar</td>
                                    <td className="py-2 font-medium">
                                        Rp {Number(pkg.delivery_fee).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-semibold text-[var(--heading)]">
                                        Total
                                    </td>
                                    <td className="py-2 font-bold text-[var(--brand)]">
                                        Rp {Number(pkg.total_price).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {payment && (
                        <div className="border-t border-[var(--border-default)] pt-4 text-xs text-[var(--body-subtle)]">
                            <p>
                                Pembayaran:{' '}
                                <span className="font-medium text-[var(--success)]">
                                    Lunas
                                </span>
                            </p>
                            {payment.verified_at && (
                                <p>
                                    Diverifikasi:{' '}
                                    {new Date(
                                        payment.verified_at,
                                    ).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-8 border-t border-[var(--border-default)] pt-4 text-center text-xs text-[var(--body-subtle)]">
                        Resi ini dicetak pada{' '}
                        {new Date().toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
