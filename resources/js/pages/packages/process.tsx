import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, PackageCheck } from 'lucide-react';
import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';

const VOLUMETRIC_DIVISOR = 6000;
const ROUND_UP_BUFFER_GRAMS = 300;

type ProcessProps = {
    package: {
        uuid: string;
        biwrajastip_tracking_number: string | null;
        store_tracking_number: string | null;
        receiver_name: string | null;
        delivery_address: string | null;
        status: string;
        estimated_weight_kg: number | null;
        estimated_length_cm: number | null;
        estimated_width_cm: number | null;
        estimated_height_cm: number | null;
        actual_weight_kg: number | null;
        actual_length_cm: number | null;
        actual_width_cm: number | null;
        actual_height_cm: number | null;
        volumetric_weight_kg: number | null;
        billed_weight_kg: number | null;
        shipping_fee: number | null;
        delivery_fee: number | null;
        total_amount: number | null;
        delivery_zone: string | null;
    };
    flatShippingFee: number;
};

const toNumber = (value: string | number | null): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value ?? '');
    return Number.isFinite(parsed) ? parsed : 0;
};

function digitsOnly(raw: string): string {
    return raw.replace(/[^0-9]/g, '');
}

const bidWeightKg = (
    weightGrams: number,
    lengthCm: number,
    widthCm: number,
    heightCm: number,
): number => {
    const volGrams =
        (lengthCm * widthCm * heightCm * 1000) / VOLUMETRIC_DIVISOR;
    let grams = Math.max(weightGrams, volGrams);
    if (grams <= 0) return 0;
    const residual = grams % 1000;
    if (residual > ROUND_UP_BUFFER_GRAMS) {
        grams = grams - residual + 1000;
    } else {
        grams -= residual;
    }
    return Math.max(1000, grams) / 1000;
};

const formatRp = (value: number): string =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

export default function ProcessPackage({
    package: pkg,
    flatShippingFee,
}: ProcessProps) {
    const toGrams = (kg: number | null): string => {
        const g = Math.round((kg ?? 0) * 1000);
        return g > 0 ? String(g) : '';
    };

    const [weightGrams, setWeightGrams] = useState(
        toGrams(pkg.actual_weight_kg),
    );
    const [length, setLength] = useState(pkg.actual_length_cm ?? '');
    const [width, setWidth] = useState(pkg.actual_width_cm ?? '');
    const [height, setHeight] = useState(pkg.actual_height_cm ?? '');

    const deliveryFee = useMemo(
        () => pkg.delivery_fee ?? 0,
        [pkg.delivery_fee],
    );

    const estimate = useMemo(() => {
        const grams = toNumber(weightGrams);
        const billedKg = bidWeightKg(
            grams,
            toNumber(length),
            toNumber(width),
            toNumber(height),
        );
        const shipping = flatShippingFee * billedKg;
        return {
            billedKg,
            volumetricKg:
                (toNumber(length) * toNumber(width) * toNumber(height)) /
                VOLUMETRIC_DIVISOR,
            shipping,
            delivery: deliveryFee,
            total: shipping + deliveryFee,
        };
    }, [weightGrams, length, width, height, flatShippingFee, deliveryFee]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        router.put(`/packages/${pkg.uuid}/process`, new FormData(form), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Proses Barang" />

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
                        Proses Barang
                    </h2>
                    <p className="text-body mt-1">
                        Masukkan berat & dimensi aktual untuk menghitung biaya
                        riil.
                    </p>
                </div>

                <dl className="border-border-default bg-neutral-primary grid grid-cols-2 gap-4 border p-5 text-sm">
                    <div>
                        <dt className="text-body">No. Resi Toko</dt>
                        <dd className="text-heading font-medium">
                            {pkg.store_tracking_number ?? '—'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-body">Penerima</dt>
                        <dd className="text-heading font-medium">
                            {pkg.receiver_name ?? '—'}
                        </dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-body">Alamat di Ende</dt>
                        <dd className="text-heading font-medium">
                            {pkg.delivery_address ?? '—'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-body">Zona antar</dt>
                        <dd className="text-heading font-medium">
                            {pkg.delivery_zone ?? 'Ambil di kantor Ende'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-body">Estimasi awal</dt>
                        <dd className="text-heading font-medium">
                            {pkg.estimated_weight_kg
                                ? `${Number(pkg.estimated_weight_kg).toFixed(3)} kg`
                                : '—'}
                        </dd>
                    </div>
                </dl>

                <form
                    onSubmit={handleSubmit}
                    className="border-border-default bg-neutral-primary space-y-4 border p-6"
                >
                    <TextInput
                        id="actual_weight_g"
                        name="actual_weight_g"
                        label="Berat Aktual (gram)"
                        inputMode="numeric"
                        placeholder="cth: 2516"
                        required
                        value={weightGrams}
                        onInput={(e) =>
                            setWeightGrams(digitsOnly(e.currentTarget.value))
                        }
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                        <TextInput
                            id="actual_length_cm"
                            name="actual_length_cm"
                            label="Panjang (cm)"
                            inputMode="decimal"
                            placeholder="0"
                            value={length}
                            onInput={(e) =>
                                setLength(
                                    e.currentTarget.value.replace(
                                        /[^0-9.]/g,
                                        '',
                                    ),
                                )
                            }
                        />
                        <TextInput
                            id="actual_width_cm"
                            name="actual_width_cm"
                            label="Lebar (cm)"
                            inputMode="decimal"
                            placeholder="0"
                            value={width}
                            onInput={(e) =>
                                setWidth(
                                    e.currentTarget.value.replace(
                                        /[^0-9.]/g,
                                        '',
                                    ),
                                )
                            }
                        />
                        <TextInput
                            id="actual_height_cm"
                            name="actual_height_cm"
                            label="Tinggi (cm)"
                            inputMode="decimal"
                            placeholder="0"
                            value={height}
                            onInput={(e) =>
                                setHeight(
                                    e.currentTarget.value.replace(
                                        /[^0-9.]/g,
                                        '',
                                    ),
                                )
                            }
                        />
                    </div>

                    <div className="border-border-default bg-neutral-secondary-soft space-y-2 border p-4">
                        <p className="text-heading text-sm font-semibold">
                            Biaya Aktual
                        </p>
                        <dl className="text-body space-y-1 text-sm">
                            <div className="flex justify-between">
                                <dt>Berat tagihan</dt>
                                <dd className="text-heading font-medium">
                                    {estimate.billedKg.toFixed(3)} kg
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Berat volume</dt>
                                <dd className="text-heading font-medium">
                                    {estimate.volumetricKg.toFixed(3)} kg
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>
                                    Biaya jastip ({formatRp(flatShippingFee)}
                                    /kg)
                                </dt>
                                <dd>{formatRp(estimate.shipping)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Biaya antar (flat zona)</dt>
                                <dd>{formatRp(estimate.delivery)}</dd>
                            </div>
                            <div className="border-border-default border-t pt-2">
                                <div className="flex justify-between">
                                    <dt className="text-heading font-semibold">
                                        Total biaya riil
                                    </dt>
                                    <dd className="text-fg-brand font-bold">
                                        {formatRp(estimate.total)}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit">
                            <PackageCheck className="h-5 w-5" />
                            Simpan Proses
                        </Button>
                        <Link
                            href="/packages"
                            className="text-body hover:text-heading text-sm font-medium"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

ProcessPackage.layout = (page: ReactNode) => (
    <AppLayout title="Proses Barang">{page}</AppLayout>
);
