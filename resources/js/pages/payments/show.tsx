import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, Printer, XCircle } from 'lucide-react';
import { type ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { PaymentIcon } from '@/components/PaymentIcon';
import payments from '@/routes/payments';

type DiscountInfo = {
    type: string;
    value: number;
    amount: number;
    code?: string;
    name?: string;
};

type PaymentProps = {
    package: {
        uuid: string;
        biwrajastip_tracking_number: string | null;
        receiver_name: string | null;
        base_amount: number;
        discount_total: number;
        discount_snapshot: DiscountInfo | null;
        total_amount: number;
    };
    payment: {
        order_id: string;
        status: string;
        payment_method: string;
        amount: number;
        admin_fee: number;
        total_paid: number;
        expired_at: string | null;
        paid_at: string | null;
    };
};

const statusConfig: Record<
    string,
    { label: string; icon: typeof CheckCircle2; color: string }
> = {
    pending: {
        label: 'Menunggu pembayaran',
        icon: Clock,
        color: 'text-yellow-600',
    },
    settled: {
        label: 'Pembayaran berhasil',
        icon: CheckCircle2,
        color: 'text-green-600',
    },
    failed: {
        label: 'Pembayaran gagal',
        icon: XCircle,
        color: 'text-red-600',
    },
    expired: {
        label: 'Pembayaran kedaluwarsa',
        icon: XCircle,
        color: 'text-red-600',
    },
};

export default function PaymentShow({ package: pkg, payment }: PaymentProps) {
    const current = statusConfig[payment.status] ?? statusConfig.pending;
    const Icon = current.icon;
    const isPending = payment.status === 'pending';
    const isSettled = payment.status === 'settled';

    return (
        <>
            <Head title="Detail Pembayaran" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <Link
                        href="/packages"
                        className="text-body hover:text-heading inline-flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke paket
                    </Link>
                    <h2 className="text-heading mt-3 text-2xl font-bold">
                        Detail Pembayaran
                    </h2>
                    <p className="text-body mt-1">
                        Paket{' '}
                        <span className="text-heading font-medium">
                            {pkg.biwrajastip_tracking_number ?? '—'}
                        </span>
                    </p>
                </div>

                <div className="border-border-default bg-neutral-primary border p-6 text-center">
                    <Icon className={`mx-auto h-12 w-12 ${current.color}`} />
                    <p
                        className={`text-heading mt-3 text-lg font-semibold ${current.color}`}
                    >
                        {current.label}
                    </p>
                    {isPending && (
                        <p className="text-body mt-1 text-sm">
                            Selesaikan pembayaran di jendela Midtrans yang
                            terbuka. Jika jendela tertutup, silakan bayar ulang.
                        </p>
                    )}
                    {isSettled && payment.paid_at && (
                        <p className="text-body mt-1 text-sm">
                            Dibayar pada{' '}
                            {new Date(payment.paid_at).toLocaleString('id-ID')}
                        </p>
                    )}
                </div>

                <dl className="border-border-default bg-neutral-primary grid grid-cols-2 gap-4 border p-5 text-sm">
                    <div>
                        <dt className="text-body">Nomor pesanan</dt>
                        <dd className="text-heading font-medium">
                            {payment.order_id}
                        </dd>
                    </div>
                    <div className="text-right">
                        <dt className="text-body">Total tagihan</dt>
                        <dd className="text-fg-brand text-lg font-bold">
                            Rp {payment.total_paid.toLocaleString('id-ID')}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-body">Biaya paket</dt>
                        <dd className="text-heading font-medium">
                            Rp {pkg.base_amount.toLocaleString('id-ID')}
                        </dd>
                    </div>
                    {pkg.discount_total > 0 && (
                        <div className="text-right">
                            <dt className="text-body">Diskon</dt>
                            <dd className="text-fg-brand font-medium">
                                −Rp {pkg.discount_total.toLocaleString('id-ID')}
                                {pkg.discount_snapshot?.code && (
                                    <span className="text-body ml-1 text-xs">
                                        ({pkg.discount_snapshot.code})
                                    </span>
                                )}
                            </dd>
                        </div>
                    )}
                    <div>
                        <dt className="text-body">Subtotal</dt>
                        <dd className="text-heading font-medium">
                            Rp {pkg.total_amount.toLocaleString('id-ID')}
                        </dd>
                    </div>
                    {payment.admin_fee > 0 && (
                        <div className="text-right">
                            <dt className="text-body">Biaya admin</dt>
                            <dd className="text-heading font-medium">
                                Rp {payment.admin_fee.toLocaleString('id-ID')}
                            </dd>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <dt className="text-body">Metode</dt>
                        <dd className="text-heading flex items-center gap-2 font-medium">
                            <PaymentIcon method={payment.payment_method} />
                        </dd>
                    </div>
                    {payment.expired_at && (
                        <div>
                            <dt className="text-body">Batas pembayaran</dt>
                            <dd className="text-heading font-medium">
                                {new Date(payment.expired_at).toLocaleString(
                                    'id-ID',
                                )}
                            </dd>
                        </div>
                    )}
                </dl>

                <div className="flex gap-3">
                    {isPending && (
                        <Link
                            href={payments.checkout.url(pkg.uuid)}
                            className="flex-1"
                        >
                            <Button variant="white" fullWidth>
                                Bayar ulang
                            </Button>
                        </Link>
                    )}
                    {isSettled && (
                        <Link
                            href={`/packages/${pkg.uuid}/receipt`}
                            className="flex-1"
                            target="_blank"
                        >
                            <Button fullWidth>
                                <Printer className="h-4 w-4" />
                                Cetak Resi
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

PaymentShow.layout = (page: ReactNode) => (
    <AppLayout title="Detail Pembayaran">{page}</AppLayout>
);
