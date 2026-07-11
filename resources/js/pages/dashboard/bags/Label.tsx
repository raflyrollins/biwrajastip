import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

import PrintableDocument from '@/components/print/PrintableDocument';

interface PackageMinimal {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    receiver_name: string;
    final_weight: number | null;
    zone: { name: string } | null;
}

interface BagData {
    code: string;
    status: string;
    weight: number | null;
    created_at: string;
    packages: PackageMinimal[];
    batch: { code: string } | null;
}

interface BagLabelProps {
    bag: BagData;
}

export default function BagLabel({ bag }: BagLabelProps) {
    const totalFinalWeight = bag.packages.reduce((sum, pkg) => {
        return sum + (pkg.final_weight ?? 0);
    }, 0);

    const labelContent = (
        <>
            <div className="header">
                <h1>BiwraJastip</h1>
                <p>Label Bag</p>
            </div>

            <div className="no-break">
                <div className="info-grid">
                    <div className="box" style={{ gridColumn: '1 / -1' }}>
                        <p className="label">Kode Bag</p>
                        <p className="value" style={{ fontSize: '1.6em', color: '#7c3aed', textAlign: 'center' }}>
                            {bag.code}
                        </p>
                    </div>
                    <div className="box" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        <QRCodeSVG
                            value={bag.code}
                            size={72}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#000000"
                            style={{ display: 'inline-block' }}
                        />
                    </div>
                </div>
            </div>

            <div className="no-break">
                <div className="info-grid">
                    <div className="box">
                        <p className="label">Jumlah Paket</p>
                        <p className="value">{bag.packages.length}</p>
                    </div>
                    <div className="box">
                        <p className="label">Berat Aktual Total</p>
                        <p className="value">
                            {bag.weight ? `${bag.weight / 1000} kg` : '-'}
                        </p>
                    </div>
                    <div className="box">
                        <p className="label">Berat Final Total</p>
                        <p className="value">
                            {totalFinalWeight > 0 ? `${totalFinalWeight / 1000} kg` : '-'}
                        </p>
                    </div>
                    <div className="box">
                        <p className="label">Tanggal Dibuat</p>
                        <p className="value">
                            {new Date(bag.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="no-break">
                <div className="info-grid">
                    <div className="box">
                        <p className="label">Dari</p>
                        <p className="value">Staff Surabaya</p>
                    </div>
                    <div className="box">
                        <p className="label">Ke</p>
                        <p className="value">Staff Ende</p>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p style={{ fontFamily: 'monospace', letterSpacing: 2, fontSize: '0.9em' }}>
                    {bag.code}
                </p>
                <p>
                    Dicetak {new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </>
    );

    return (
        <>
            <Head title={`Label Bag - ${bag.code}`} />

            <div className="min-h-screen bg-white">
                <PrintableDocument title="Label Bag" size="thermal">
                    {labelContent}
                </PrintableDocument>
            </div>
        </>
    );
}
