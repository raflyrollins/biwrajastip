import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Loader2, Tag, X } from 'lucide-react';
import React, { type ReactNode, useEffect, useMemo, useRef } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { PaymentIcon } from '@/components/PaymentIcon';
import { openSnapPayment } from '@/lib/midtrans';
import payments from '@/routes/payments';

type Method = {
    value: string;
    label: string;
    group: string;
    group_sort: number;
    admin_fee: number;
};

type SnapData = {
    token: string;
    client_key: string;
    script: string;
};

type DiscountInfo = {
    type: string;
    value: number;
    amount: number;
    code?: string;
    name?: string;
};

type CheckoutProps = {
    package: {
        uuid: string;
        biwrajastip_tracking_number: string | null;
        receiver_name: string | null;
        base_amount: number;
        discount_total: number;
        discount_snapshot: DiscountInfo | null;
        total_amount: number;
        status: string;
    };
    methods: Method[];
    snap?: SnapData;
};

export default function Checkout({
    package: pkg,
    methods,
    snap,
}: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm<{
        method: string;
        promo_code: string;
    }>({ method: '', promo_code: '' });

    const snapOpened = useRef(false);

    const [promoResult, setPromoResult] = React.useState<{
        valid: boolean;
        message?: string;
        code?: string;
        name?: string;
        type?: string;
        value?: number;
        discount?: number;
    } | null>(null);
    const [promoLoading, setPromoLoading] = React.useState(false);
    const [promoApplied, setPromoApplied] = React.useState(
        pkg.discount_snapshot?.type === 'promo_code'
            ? {
                  code: pkg.discount_snapshot.code ?? '',
                  name: pkg.discount_snapshot.name ?? '',
                  discount: pkg.discount_total,
              }
            : null,
    );

    useEffect(() => {
        if (!snap || snapOpened.current) {
            return;
        }

        snapOpened.current = true;

        openSnapPayment({
            token: snap.token,
            clientKey: snap.client_key,
            script: snap.script,
            onSuccess() {
                router.visit(payments.show.url(pkg.uuid));
            },
            onPending() {
                router.visit(payments.show.url(pkg.uuid));
            },
            onClose() {
                router.visit(payments.show.url(pkg.uuid));
            },
        });
    }, [snap, pkg.uuid]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(payments.charge.url(pkg.uuid));
    };

    const checkPromo = async () => {
        if (!data.promo_code.trim()) return;

        setPromoLoading(true);
        setPromoResult(null);

        try {
            const response = await fetch(`/packages/${pkg.uuid}/promo-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': decodeURIComponent(
                        document.cookie
                            .split('; ')
                            .find((c) => c.startsWith('XSRF-TOKEN='))
                            ?.split('=')[1] ?? '',
                    ),
                },
                body: JSON.stringify({ code: data.promo_code }),
            });

            const result = await response.json();
            setPromoResult(result);

            if (result.valid) {
                setPromoApplied({
                    code: result.code,
                    name: result.name,
                    discount: result.discount,
                });
            }
        } catch {
            setPromoResult({
                valid: false,
                message: 'Gagal memeriksa kode promo.',
            });
        } finally {
            setPromoLoading(false);
        }
    };

    const removePromo = () => {
        setPromoApplied(null);
        setPromoResult(null);
        setData('promo_code', '');
    };

    const selectedMethod = useMemo(
        () => methods.find((m) => m.value === data.method),
        [methods, data.method],
    );

    const discount = promoApplied?.discount ?? pkg.discount_total;
    const grandTotal = pkg.total_amount + (selectedMethod?.admin_fee ?? 0);
    const adminFee = selectedMethod?.admin_fee ?? 0;

    const grouped = useMemo(() => {
        const map = new Map<string, Method[]>();

        for (const method of methods) {
            const list = map.get(method.group) ?? [];
            list.push(method);
            map.set(method.group, list);
        }

        return map;
    }, [methods]);

    if (snap) {
        return (
            <>
                <Head title="Pembayaran" />
                <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="text-fg-brand h-8 w-8 animate-spin" />
                    <p className="text-heading text-sm font-medium">
                        Membuka popup pembayaran...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Pembayaran" />

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
                        Pembayaran
                    </h2>
                    <p className="text-body mt-1">
                        Pilih metode pembayaran untuk paket{' '}
                        <span className="text-heading font-medium">
                            {pkg.biwrajastip_tracking_number ?? '—'}
                        </span>
                    </p>
                </div>

                <dl className="border-border-default bg-neutral-primary grid grid-cols-2 gap-4 border p-5 text-sm">
                    <div>
                        <dt className="text-body">Penerima</dt>
                        <dd className="text-heading font-medium">
                            {pkg.receiver_name ?? '—'}
                        </dd>
                    </div>
                    <div className="text-right">
                        <dt className="text-body">Total tagihan</dt>
                        <dd className="text-fg-brand text-lg font-bold">
                            {grandTotal
                                ? `Rp ${grandTotal.toLocaleString('id-ID')}`
                                : '—'}
                        </dd>
                    </div>
                </dl>

                <form onSubmit={submit} className="grid gap-5">
                    {[...grouped.entries()].map(([groupName, groupMethods]) => (
                        <fieldset key={groupName} className="grid gap-2">
                            <legend className="text-body text-xs font-semibold tracking-wide uppercase">
                                {groupName}
                            </legend>
                            {groupMethods.map((method) => {
                                const isSelected = data.method === method.value;
                                const feeLabel =
                                    method.admin_fee > 0
                                        ? method.admin_fee <= 10_000
                                            ? `Rp ${method.admin_fee.toLocaleString('id-ID')}`
                                            : `${((method.admin_fee / pkg.total_amount) * 100).toFixed(1)}%`
                                        : 'Gratis';

                                return (
                                    <label
                                        key={method.value}
                                        className={`border-border-default bg-neutral-primary flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                                            isSelected
                                                ? 'border-fg-brand ring-fg-brand ring-1'
                                                : 'hover:border-fg-brand/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="method"
                                            value={method.value}
                                            checked={isSelected}
                                            onChange={() =>
                                                setData('method', method.value)
                                            }
                                            className="sr-only"
                                        />
                                        <PaymentIcon method={method.value} />
                                        <div className="min-w-0 flex-1">
                                            <span className="text-heading block truncate text-sm font-medium">
                                                {method.label}
                                            </span>
                                            <span className="text-body block text-xs">
                                                Biaya admin {feeLabel}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-fg-brand flex shrink-0 items-center transition-colors ${
                                                isSelected
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </span>
                                    </label>
                                );
                            })}
                        </fieldset>
                    ))}

                    {errors.method && (
                        <p className="text-sm font-medium text-red-600">
                            {errors.method}
                        </p>
                    )}

                    {/* Promo code section */}
                    {discount <= 0 && !promoApplied && (
                        <div className="border-border-default bg-neutral-primary border p-4">
                            <label
                                htmlFor="promo-code"
                                className="text-heading mb-2 flex items-center gap-2 text-sm font-medium"
                            >
                                <Tag className="h-4 w-4" />
                                Kode Promo
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="promo-code"
                                    type="text"
                                    placeholder="Masukkan kode promo"
                                    value={data.promo_code}
                                    onChange={(e) => {
                                        setData(
                                            'promo_code',
                                            e.target.value.toUpperCase(),
                                        );
                                        setPromoResult(null);
                                    }}
                                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand flex-1 rounded-none border px-3 py-2.5 text-sm shadow-xs transition-colors duration-200 focus:ring-1 focus:outline-none"
                                />
                                <Button
                                    type="button"
                                    onClick={checkPromo}
                                    disabled={
                                        promoLoading || !data.promo_code.trim()
                                    }
                                >
                                    {promoLoading ? 'Cek...' : 'Terapkan'}
                                </Button>
                            </div>
                            {promoResult && !promoResult.valid && (
                                <p className="mt-2 text-sm text-red-600">
                                    {promoResult.message}
                                </p>
                            )}
                        </div>
                    )}

                    {promoApplied && (
                        <div className="border-border-default bg-neutral-primary flex items-center justify-between border p-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Tag className="text-fg-brand h-4 w-4" />
                                <span className="text-heading font-medium">
                                    {promoApplied.code}
                                </span>
                                <span className="text-body">
                                    — {promoApplied.name}
                                </span>
                                <span className="text-fg-brand font-medium">
                                    −Rp{' '}
                                    {promoApplied.discount.toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={removePromo}
                                className="text-body-subtle hover:text-fg-danger-strong ml-2 shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="border-border-default bg-neutral-secondary border-t pt-4">
                        <dl className="mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-body">Biaya paket</dt>
                                <dd className="text-heading font-medium">
                                    Rp {pkg.base_amount.toLocaleString('id-ID')}
                                </dd>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-body">Diskon</dt>
                                    <dd className="text-fg-brand font-medium">
                                        −Rp {discount.toLocaleString('id-ID')}
                                    </dd>
                                </div>
                            )}
                            {adminFee > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-body">
                                        Biaya admin ({selectedMethod?.label})
                                    </dt>
                                    <dd className="text-heading font-medium">
                                        Rp {adminFee.toLocaleString('id-ID')}
                                    </dd>
                                </div>
                            )}
                            <div className="border-border-default flex justify-between border-t pt-2">
                                <dt className="text-heading text-base font-bold">
                                    Total yang harus dibayar
                                </dt>
                                <dd className="text-fg-brand text-base font-bold">
                                    Rp {grandTotal.toLocaleString('id-ID')}
                                </dd>
                            </div>
                        </dl>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={processing || data.method === ''}
                        >
                            Bayar sekarang
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Checkout.layout = (page: ReactNode) => (
    <AppLayout title="Pembayaran">{page}</AppLayout>
);
