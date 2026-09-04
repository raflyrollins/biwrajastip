import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';

type ReceiptProps = {
    package: {
        uuid: string;
        biwrajastip_tracking_number: string | null;
        store_tracking_number: string | null;
        receiver_name: string | null;
        delivery_address: string | null;
        delivery_zone: string | null;
        estimated_weight_kg: string | null;
        actual_weight_kg: string | null;
        billed_weight_kg: string | null;
        created_at: string | null;
    };
    payment: {
        order_id: string;
        payment_method: string;
        amount: number;
        admin_fee: number;
        paid_at: string | null;
    };
    qr_code: string;
    customer_name: string | null;
    customer_email: string | null;
};

const paymentMethodLabel: Record<string, string> = {
    va_bca: 'BCA Virtual Account',
    va_bni: 'BNI Virtual Account',
    va_mandiri: 'Mandiri Virtual Account',
    va_bri: 'BRI Virtual Account',
    qris: 'QRIS',
};

export default function Receipt({
    package: pkg,
    payment,
    qr_code,
    customer_name,
}: ReceiptProps) {
    useEffect(() => {
        const handleAfterPrint = () => {
            window.close();
        };

        window.addEventListener('afterprint', handleAfterPrint);
        return () => window.removeEventListener('afterprint', handleAfterPrint);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const weight = pkg.actual_weight_kg ?? pkg.estimated_weight_kg;

    return (
        <>
            <Head title="Cetak Resi" />

            <div className="no-print mx-auto max-w-2xl space-y-4 px-4 py-6 print:hidden">
                <div className="flex items-center justify-between">
                    <Link
                        href={`/packages/${pkg.uuid}/payment`}
                        className="text-body hover:text-heading inline-flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <Button onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Cetak
                    </Button>
                </div>
            </div>

            <div className="print-area mx-auto max-w-lg bg-white px-6 py-8 print:px-4 print:py-4">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-heading text-xl font-bold tracking-wide print:text-lg">
                        BIWRAJASTIP
                    </h1>
                    <p className="text-body mt-1 text-xs">
                        Forwarding &amp; Consolidation Service — Surabaya → Ende
                    </p>
                    <div className="border-border-default mx-auto mt-3 w-32 border-t" />
                </div>

                {/* QR Code */}
                <div className="mb-6 flex justify-center">
                    <div
                        dangerouslySetInnerHTML={{ __html: qr_code }}
                        className="h-32 w-32 print:h-24 print:w-24"
                    />
                </div>

                {/* Tracking number */}
                <div className="bg-neutral-primary mb-6 border p-4 text-center print:p-3">
                    <p className="text-body text-xs tracking-widest uppercase">
                        Nomor Resi
                    </p>
                    <p className="text-heading mt-1 font-mono text-lg font-bold print:text-base">
                        {pkg.biwrajastip_tracking_number ?? '—'}
                    </p>
                </div>

                {/* Package info table */}
                <table className="mb-6 w-full text-sm print:text-xs">
                    <tbody>
                        <Row
                            label="Penerima"
                            value={pkg.receiver_name ?? '—'}
                        />
                        <Row
                            label="Alamat Tujuan"
                            value={
                                [pkg.delivery_address, pkg.delivery_zone]
                                    .filter(Boolean)
                                    .join(', ') || '—'
                            }
                        />
                        {pkg.store_tracking_number && (
                            <Row
                                label="No. Resi Toko"
                                value={pkg.store_tracking_number}
                            />
                        )}
                        {weight && (
                            <Row
                                label="Berat"
                                value={`${Number(weight).toLocaleString('id-ID')} kg`}
                            />
                        )}
                        {pkg.billed_weight_kg && (
                            <Row
                                label="Berat Tagih"
                                value={`${Number(pkg.billed_weight_kg).toLocaleString('id-ID')} kg`}
                            />
                        )}
                        {customer_name && (
                            <Row label="Customer" value={customer_name} />
                        )}
                    </tbody>
                </table>

                {/* Divider */}
                <div className="border-border-default mb-6 border-t border-dashed" />

                {/* Payment info */}
                <table className="mb-6 w-full text-sm print:text-xs">
                    <tbody>
                        <Row label="Order ID" value={payment.order_id} />
                        <Row
                            label="Metode Pembayaran"
                            value={
                                paymentMethodLabel[payment.payment_method] ??
                                payment.payment_method
                            }
                        />
                        <Row
                            label="Biaya Paket"
                            value={`Rp ${payment.amount.toLocaleString('id-ID')}`}
                        />
                        {payment.admin_fee > 0 && (
                            <Row
                                label="Biaya Admin"
                                value={`Rp ${payment.admin_fee.toLocaleString('id-ID')}`}
                            />
                        )}
                        <Row
                            label="Total Dibayar"
                            value={`Rp ${(payment.amount + payment.admin_fee).toLocaleString('id-ID')}`}
                            bold
                        />
                        {payment.paid_at && (
                            <Row
                                label="Tanggal Bayar"
                                value={new Date(payment.paid_at).toLocaleString(
                                    'id-ID',
                                )}
                            />
                        )}
                    </tbody>
                </table>

                {/* Footer */}
                <div className="text-body mt-8 text-center text-[10px]">
                    <p>Dokumen ini dicetak secara otomatis.</p>
                    <p className="mt-1">
                        {pkg.created_at
                            ? `Paket didaftarkan: ${new Date(pkg.created_at).toLocaleString('id-ID')}`
                            : ''}
                    </p>
                </div>
            </div>
        </>
    );
}

function Row({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <tr>
            <td className="text-body w-1/3 py-1.5 pr-3 align-top">{label}</td>
            <td
                className={`text-heading py-1.5 ${bold ? 'font-bold' : 'font-medium'}`}
            >
                {value}
            </td>
        </tr>
    );
}

Receipt.layout = (page: ReactNode) => (
    <AppLayout title="Cetak Resi">{page}</AppLayout>
);
