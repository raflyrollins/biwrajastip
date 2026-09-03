import { Head, Link, router } from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { SearchableSelect } from '@/components/SearchableSelect';
import { TextInput } from '@/components/TextInput';

const VOLUMETRIC_DIVISOR = 6000;
const ROUND_UP_BUFFER_GRAMS = 300;

type DeliveryRate = {
    id: number;
    delivery_zone_id: number;
    max_weight_kg: number;
    price_per_kg: number;
};

type DeliveryZone = {
    id: number;
    name: string;
    district: string;
    rates: DeliveryRate[];
};

type CreatePackageProps = {
    deliveryZones: DeliveryZone[];
    flatShippingFee: number;
};

const toNumber = (value: string): number => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

// Keep only digits (integer input).
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

const zoneFlatFee = (zone: DeliveryZone | undefined): number => {
    if (!zone || zone.rates.length === 0) return 0;
    const sorted = [...zone.rates].sort(
        (a, b) => a.max_weight_kg - b.max_weight_kg,
    );
    return sorted[0].price_per_kg;
};

const formatRp = (value: number): string =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

export default function CreatePackage(props: CreatePackageProps) {
    const { deliveryZones, flatShippingFee } = props;

    const [selectedZoneId, setZoneId] = useState<string>('');
    const [weightGrams, setWeightGrams] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const zoneOptions = useMemo(
        () =>
            deliveryZones.map((zone) => ({
                value: String(zone.id),
                label: zone.name,
                hint: `${zone.district} · biaya antar ${formatRp(zoneFlatFee(zone))}`,
            })),
        [deliveryZones],
    );

    const zone = useMemo(
        () =>
            deliveryZones.find((z) => String(z.id) === String(selectedZoneId)),
        [deliveryZones, selectedZoneId],
    );

    const estimate = useMemo(() => {
        const grams = toNumber(weightGrams);
        const billedKg = bidWeightKg(
            grams,
            toNumber(length),
            toNumber(width),
            toNumber(height),
        );
        const delivery = zoneFlatFee(zone);
        return {
            billedKg,
            volumetricKg:
                (toNumber(length) * toNumber(width) * toNumber(height)) /
                VOLUMETRIC_DIVISOR,
            delivery,
            total: flatShippingFee + delivery,
        };
    }, [
        selectedZoneId,
        weightGrams,
        length,
        width,
        height,
        flatShippingFee,
        zone,
    ]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        router.post('/packages', new FormData(form), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Daftar Paket" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">
                        Daftar Paket Baru
                    </h2>
                    <p className="text-body mt-1">
                        Isi estimasi paket Anda untuk didaftarkan ke layanan
                        biwrajastip.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="border-border-default bg-neutral-primary space-y-4 border p-6"
                >
                    <TextInput
                        id="store_tracking_number"
                        name="store_tracking_number"
                        label="Nomor Resi Toko Online / Referensi"
                        placeholder="cth: JNE/Shopee/Tokopedia ..."
                        required
                    />

                    <TextInput
                        id="receiver_name"
                        name="receiver_name"
                        label="Nama Penerima (biwrajastip)"
                        placeholder="cth: biwrajastip (rafly akbar)"
                        required
                    />

                    <SearchableSelect
                        id="delivery_zone_id"
                        label="Zona Pengantaran"
                        options={zoneOptions}
                        value={selectedZoneId}
                        onChange={setZoneId}
                        hint="Cari zona; biaya antar flat per zona. Kosongkan untuk ambil di kantor Ende."
                    />

                    {/* Hidden field keeps the selected zone keyed for submission */}
                    <input
                        type="hidden"
                        name="delivery_zone_id"
                        value={selectedZoneId}
                        readOnly
                    />

                    <TextInput
                        id="delivery_address"
                        name="delivery_address"
                        label="Alamat di Ende"
                        placeholder="Alamat tujuan pengantaran di Ende"
                        required
                    />

                    <TextInput
                        id="estimated_weight_g"
                        name="estimated_weight_g"
                        label="Estimasi Berat (gram)"
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
                            id="estimated_length_cm"
                            name="estimated_length_cm"
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
                            id="estimated_width_cm"
                            name="estimated_width_cm"
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
                            id="estimated_height_cm"
                            name="estimated_height_cm"
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

                    {/* Live estimation panel */}
                    <div className="border-border-default bg-neutral-secondary-soft space-y-2 border p-4">
                        <p className="text-heading text-sm font-semibold">
                            Estimasi Biaya
                        </p>
                        <dl className="text-body space-y-1 text-sm">
                            <div className="flex justify-between">
                                <dt>Berat tagihan</dt>
                                <dd className="text-heading font-medium">
                                    {estimate.billedKg.toFixed(3)} kg
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Biaya jastip (flat)</dt>
                                <dd>{formatRp(flatShippingFee)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Biaya antar</dt>
                                <dd>{formatRp(estimate.delivery)}</dd>
                            </div>
                            <div className="border-border-default border-t pt-2">
                                <div className="flex justify-between">
                                    <dt className="text-heading font-semibold">
                                        Total estimasi
                                    </dt>
                                    <dd className="text-heading font-bold">
                                        {formatRp(estimate.total)}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                        <p className="text-body-subtle text-xs">
                            Berat tagihan diambil dari nilai lebih besar antara
                            berat timbang vs berat volume (dibagi 6000),
                            dibulatkan ke atas melewati 300 gram. Biaya antar
                            flat per zona.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit">
                            <PackagePlus className="h-5 w-5" />
                            Simpan Paket
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

CreatePackage.layout = (page: ReactNode) => (
    <AppLayout title="Daftar Paket">{page}</AppLayout>
);
