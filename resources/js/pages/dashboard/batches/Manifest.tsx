import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

import PrintableDocument from '@/components/print/PrintableDocument';

interface BagMinimal {
    uuid: string;
    code: string;
    weight: number | null;
    packages: { tracking_number: string; tracking_number_biwra: string | null; receiver_name: string }[];
}

interface ShipData {
    name: string;
}

interface ScheduleData {
    departure_date: string;
    arrival_date: string;
}

interface BatchData {
    code: string;
    status: string;
    departure_date: string;
    notes: string | null;
    created_at: string;
    ship: ShipData | null;
    schedule: ScheduleData | null;
    bags: BagMinimal[];
}

interface BatchManifestProps {
    batch: BatchData;
}

export default function BatchManifest({ batch }: BatchManifestProps) {
    const totalWeight = batch.bags.reduce(
        (sum, bag) => sum + (bag.weight ?? 0),
        0,
    );
    const totalPackages = batch.bags.reduce(
        (sum, bag) => sum + bag.packages.length,
        0,
    );

    const manifestContent = (
        <>
            <div className="header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ margin: 0 }}>BiwraJastip</h1>
                    <p style={{ margin: '2px 0', fontSize: '0.9em', color: '#555' }}>
                        Manifest Batch — Unbatching
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <QRCodeSVG
                        value={batch.code}
                        size={70}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        style={{ display: 'inline-block' }}
                    />
                </div>
            </div>

            <div className="no-break" style={{ marginBottom: 12 }}>
                <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="box">
                        <p className="label">No. Batch</p>
                        <p className="value" style={{ color: '#7c3aed' }}>{batch.code}</p>
                    </div>
                    <div className="box">
                        <p className="label">Tanggal</p>
                        <p className="value">
                            {new Date(batch.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="box">
                        <p className="label">Status</p>
                        <p className="value">{batch.status}</p>
                    </div>
                </div>

                <div className="info-grid" style={{ marginTop: 4 }}>
                    <div className="box">
                        <p className="label">Asal</p>
                        <p className="value">Staff Surabaya</p>
                    </div>
                    <div className="box">
                        <p className="label">Tujuan</p>
                        <p className="value">Staff Ende</p>
                    </div>
                    {batch.ship && (
                        <div className="box">
                            <p className="label">Moda</p>
                            <p className="value">{batch.ship.name} (Laut)</p>
                        </div>
                    )}
                </div>
            </div>

            <table className="no-break">
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>No</th>
                        <th>Kode Bag</th>
                        <th style={{ textAlign: 'right' }}>Jml Paket</th>
                        <th style={{ textAlign: 'right' }}>Berat (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    {batch.bags.map((bag, i) => (
                        <tr key={bag.uuid}>
                            <td>{i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{bag.code}</td>
                            <td style={{ textAlign: 'right' }}>{bag.packages.length}</td>
                            <td style={{ textAlign: 'right' }}>
                                {bag.weight ? `${bag.weight / 1000}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="totals no-break" style={{ marginBottom: 16 }}>
                <div className="row">
                    <span>Total Bag</span>
                    <span>{batch.bags.length}</span>
                </div>
                <div className="row">
                    <span>Total Paket</span>
                    <span>{totalPackages}</span>
                </div>
                <div className="row total">
                    <span>Total Berat</span>
                    <span>{totalWeight / 1000} kg</span>
                </div>
            </div>

            {batch.notes && (
                <div className="no-break" style={{ marginBottom: 12, padding: 6, border: '1px solid #ccc', fontSize: '0.85em' }}>
                    <strong>Catatan:</strong> {batch.notes}
                </div>
            )}

            <div className="signatures no-break">
                <div className="sig-box">
                    <p className="label">Staff Asal (Surabaya)</p>
                    <div className="line">&nbsp;</div>
                </div>
                <div className="sig-box">
                    <p className="label">Ekspedisi/Kurir</p>
                    <div className="line">&nbsp;</div>
                </div>
                <div className="sig-box">
                    <p className="label">Staff Tujuan (Ende)</p>
                    <div className="line">&nbsp;</div>
                </div>
            </div>

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
                <p style={{ marginTop: 4, fontFamily: 'monospace' }}>
                    {batch.code}
                </p>
            </div>
        </>
    );

    return (
        <>
            <Head title={`Manifest Batch - ${batch.code}`} />

            <div className="min-h-screen bg-white">
                <PrintableDocument title="Manifest" size="a4">
                    {manifestContent}
                </PrintableDocument>
            </div>
        </>
    );
}
