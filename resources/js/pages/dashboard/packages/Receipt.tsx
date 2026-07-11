import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

import PrintableDocument from '@/components/print/PrintableDocument';

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
    const receiptContent = (
        <>
            <div className="header">
                <h1>BiwraJastip</h1>
                <p>Resi Pengiriman</p>
            </div>

            <div className="no-break">
                <div className="info-grid">
                    <div className="box">
                        <p className="label">No. Resi Biwra</p>
                        <p className="value" style={{ fontSize: '1.2em', color: '#7c3aed' }}>
                            {pkg.tracking_number_biwra ?? pkg.tracking_number}
                        </p>
                    </div>
                    <div className="box" style={{ textAlign: 'right' }}>
                        <QRCodeSVG
                            value={pkg.tracking_number_biwra ?? pkg.tracking_number}
                            size={60}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#000000"
                            style={{ display: 'inline-block' }}
                        />
                    </div>
                </div>

                {pkg.tracking_number_biwra && (
                    <div style={{ marginBottom: 6, fontSize: '0.85em', color: '#666' }}>
                        No. Resi Asal: <strong>{pkg.tracking_number}</strong>
                    </div>
                )}
            </div>

            <div className="no-break">
                <div className="info-grid">
                    <div className="box">
                        <p className="label">Pengirim</p>
                        <p className="value">{pkg.sender_name}</p>
                        <p style={{ fontSize: '0.85em', color: '#555' }}>{pkg.sender_phone}</p>
                    </div>
                    <div className="box">
                        <p className="label">Penerima</p>
                        <p className="value">{pkg.receiver_name}</p>
                        <p style={{ fontSize: '0.85em', color: '#555' }}>{pkg.receiver_phone}</p>
                    </div>
                </div>
            </div>

            <table className="no-break">
                <thead>
                    <tr>
                        <th>Detail</th>
                        <th style={{ textAlign: 'right' }}>Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Zona Tujuan</td>
                        <td style={{ textAlign: 'right', fontWeight: 500 }}>{pkg.zone?.name ?? '-'}</td>
                    </tr>
                    <tr>
                        <td>Berat Aktual</td>
                        <td style={{ textAlign: 'right' }}>
                            {pkg.weight_actual
                                ? `${pkg.weight_actual} kg`
                                : `${pkg.weight_estimated ?? '-'} kg (est)`}
                        </td>
                    </tr>
                    {pkg.volumetric_weight && (
                        <tr>
                            <td>Berat Volumetrik</td>
                            <td style={{ textAlign: 'right' }}>{pkg.volumetric_weight / 1000} kg</td>
                        </tr>
                    )}
                    {pkg.final_weight && (
                        <tr>
                            <td>Berat Final</td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{pkg.final_weight / 1000} kg</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="totals no-break">
                <div className="row">
                    <span>Biaya Kirim</span>
                    <span>Rp {Number(pkg.price).toLocaleString('id-ID')}</span>
                </div>
                <div className="row">
                    <span>Biaya Antar</span>
                    <span>Rp {Number(pkg.delivery_fee).toLocaleString('id-ID')}</span>
                </div>
                <div className="row total">
                    <span>Total</span>
                    <span style={{ color: '#7c3aed' }}>
                        Rp {Number(pkg.total_price).toLocaleString('id-ID')}
                    </span>
                </div>
            </div>

            {payment && (
                <div className="no-break" style={{ marginTop: 6, fontSize: '0.85em', color: '#555' }}>
                    <p>
                        Pembayaran:{' '}
                        <strong style={{ color: '#16a34a' }}>Lunas</strong>
                    </p>
                    {payment.verified_at && (
                        <p>
                            Diverifikasi:{' '}
                            {new Date(payment.verified_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            )}

            <div className="footer">
                <p>
                    Dicetak {new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <p style={{ marginTop: 4, fontFamily: 'monospace', letterSpacing: 2 }}>
                    {pkg.tracking_number_biwra ?? pkg.tracking_number}
                </p>
            </div>
        </>
    );

    return (
        <>
            <Head title={`Resi - ${pkg.tracking_number_biwra ?? pkg.tracking_number}`} />

            <div className="min-h-screen bg-white">
                <PrintableDocument title="Resi" size="thermal">
                    {receiptContent}
                </PrintableDocument>
            </div>
        </>
    );
}
