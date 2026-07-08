import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

interface PackageData {
    tracking_code: string;
    recipient_name: string;
    recipient_phone: string | null;
    sender_tracking_number: string | null;
    zone: {
        name: string;
        tarif_per_kg: number;
        biaya_antar: number;
    } | null;
    user: {
        name: string;
        phone: string | null;
    } | null;
    weight_estimated: number | null;
    weight_actual: number | null;
    length_estimated: number | null;
    width_estimated: number | null;
    height_estimated: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    volumetric_estimated: number | null;
    volumetric_actual: number | null;
    final_weight: number | null;
    shipping_cost: number;
    delivery_fee: number;
    total_cost: number;
    status_label: string;
    notes: string | null;
    created_at: string;
}

interface PrintReceiptProps {
    package: PackageData;
}

export default function PrintReceipt({ package: pkg }: PrintReceiptProps) {
    return (
        <>
            <Head title={`Resi ${pkg.tracking_code}`} />

            <div className="mx-auto max-w-[320px] bg-white p-6 text-black print:mx-0 print:max-w-none">
                {/* ── Judul ── */}
                <div className="mb-4 text-center">
                    <h1 className="text-lg font-bold tracking-wide uppercase">
                        BiwraJastip
                    </h1>
                    <p className="text-xs text-gray-500">
                        Pengiriman Surabaya &rarr; Ende
                    </p>
                </div>

                <div className="mb-4 border border-black p-3 text-center">
                    <p className="text-xs text-gray-500">Kode Tracking</p>
                    <p className="font-mono text-xl font-bold tracking-widest">
                        {pkg.tracking_code}
                    </p>
                </div>

                {/* ── QR Code ── */}
                <div className="mb-4 flex justify-center">
                    <QRCodeSVG
                        value={pkg.tracking_code}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                    />
                </div>

                {/* ── Penerima ── */}
                <div className="mb-4 border border-black p-3">
                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">
                        Penerima
                    </p>
                    <p className="text-base font-bold">{pkg.recipient_name}</p>
                    {pkg.recipient_phone && (
                        <p className="text-sm text-gray-600">
                            {pkg.recipient_phone}
                        </p>
                    )}
                    <p className="mt-1 text-sm font-medium">
                        Zona: {pkg.zone?.name ?? '-'}
                    </p>
                </div>

                {/* ── Pengirim ── */}
                <div className="mb-4 border border-black p-3">
                    <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">
                        Pengirim
                    </p>
                    <p className="text-sm font-medium">
                        {pkg.user?.name ?? '-'}
                    </p>
                    {pkg.user?.phone && (
                        <p className="text-sm text-gray-600">
                            {pkg.user?.phone}
                        </p>
                    )}
                    {pkg.sender_tracking_number && (
                        <p className="mt-1 text-xs text-gray-500">
                            Resi Toko: {pkg.sender_tracking_number}
                        </p>
                    )}
                </div>

                {/* ── Detail Paket ── */}
                <div className="mb-4 border border-black p-3">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
                        Detail Paket
                    </p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Berat Aktual</span>
                            <span className="font-medium">
                                {pkg.weight_actual
                                    ? `${pkg.weight_actual.toLocaleString('id-ID')}g`
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Dimensi</span>
                            <span className="font-medium">
                                {pkg.length && pkg.width && pkg.height
                                    ? `${pkg.length}×${pkg.width}×${pkg.height}cm`
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Volumetrik</span>
                            <span className="font-medium">
                                {pkg.volumetric_actual
                                    ? `${pkg.volumetric_actual.toLocaleString('id-ID')}g`
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-1 font-bold">
                            <span>Berat Final</span>
                            <span>
                                {pkg.final_weight
                                    ? `${pkg.final_weight.toLocaleString('id-ID')}g`
                                    : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Harga ── */}
                <div className="mb-4 border border-black p-3">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
                        Rincian Biaya
                    </p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Tarif/kg (
                                {pkg.zone?.tarif_per_kg
                                    ? `Rp${pkg.zone.tarif_per_kg.toLocaleString('id-ID')}`
                                    : '-'}
                                )
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Biaya Antar</span>
                            <span className="font-medium">
                                {pkg.delivery_fee > 0
                                    ? `Rp${pkg.delivery_fee.toLocaleString('id-ID')}`
                                    : pkg.zone
                                      ? `Rp${pkg.zone.biaya_antar.toLocaleString('id-ID')}`
                                      : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-1 text-base font-bold">
                            <span>Total</span>
                            <span>
                                Rp
                                {pkg.total_cost.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Status ── */}
                <div className="mb-6 text-center text-sm">
                    <span className="font-medium">Status: </span>
                    <span>{pkg.status_label}</span>
                </div>

                {pkg.notes && (
                    <div className="mb-4 border border-black p-3">
                        <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">
                            Catatan
                        </p>
                        <p className="text-sm">{pkg.notes}</p>
                    </div>
                )}

                <div className="mb-6 text-center text-xs text-gray-400">
                    Dicetak:{' '}
                    {new Date().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>

                <div className="my-6 h-0 w-full border-t border-dashed border-gray-400" />
                <div className="text-center text-sm text-gray-400">
                    --- Potong disini ---
                </div>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="rounded-none bg-black px-8 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-80"
                >
                    Cetak Resi
                </button>
            </div>
        </>
    );
}
