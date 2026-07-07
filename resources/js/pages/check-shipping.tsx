import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Info, Package, Truck } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const VOLUMETRIC_FACTOR = 6000;

const ZONES = [
    { id: 'pusat', name: 'Pusat Kota Ende', deliveryFee: 0 },
    { id: 'lodtimbuk', name: 'Lodtimbuk', deliveryFee: 15000 },
    { id: 'ndona', name: 'Ndona', deliveryFee: 20000 },
    { id: 'wolowaru', name: 'Wolowaru', deliveryFee: 25000 },
    { id: 'maukere', name: 'Maukere', deliveryFee: 30000 },
    { id: 'detumbewa', name: 'Detumbewa', deliveryFee: 35000 },
    { id: 'kotabaru', name: 'Kotabaru', deliveryFee: 40000 },
    { id: 'larantuka', name: 'Larantuka', deliveryFee: 50000 },
    { id: 'maumere', name: 'Maumere', deliveryFee: 60000 },
    { id: 'bajawa', name: 'Bajawa', deliveryFee: 75000 },
];

const TARIFF_PER_KG = 12000;

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function CheckShipping() {
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [zoneId, setZoneId] = useState('');

    const [result, setResult] = useState<{
        volumetricWeight: number;
        finalWeight: number;
        shippingCost: number;
        deliveryFee: number;
        totalCost: number;
        zoneName: string;
    } | null>(null);

    function handleSubmit() {
        const w = parseFloat(weight);
        const l = parseFloat(length);
        const wi = parseFloat(width);
        const h = parseFloat(height);

        if (!w || !l || !wi || !h || !zoneId) {
            return;
        }

        const volumetricWeight = (l * wi * h) / VOLUMETRIC_FACTOR;
        const finalWeight = Math.max(w, volumetricWeight);
        const zone = ZONES.find((z) => z.id === zoneId);
        const shippingCost = finalWeight * TARIFF_PER_KG;
        const totalCost = shippingCost + (zone?.deliveryFee ?? 0);

        setResult({
            volumetricWeight,
            finalWeight,
            shippingCost,
            deliveryFee: zone?.deliveryFee ?? 0,
            totalCost,
            zoneName: zone?.name ?? '',
        });
    }

    return (
        <>
            <Head title="Cek Ongkir" />

            <Navbar />

            <section className="min-h-screen bg-[var(--brand)] pt-24 pb-24">
                <Container>
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/"
                            className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--on-brand-muted)] no-underline transition-colors hover:text-[var(--on-brand)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Beranda
                        </Link>

                        <h1 className="mb-2 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px]">
                            Cek Ongkir
                        </h1>
                        <p className="max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]">
                            Masukkan estimasi berat dan dimensi barang Anda
                            untuk melihat perkiraan biaya pengiriman ke Ende.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-5">
                        {/* ── Form ── */}
                        <motion.div
                            className="md:col-span-3"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 shadow-sm md:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-none bg-[var(--brand-softer)] text-[var(--brand-strong)]">
                                        <Calculator size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-[var(--heading)]">
                                            Estimasi Biaya
                                        </h2>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Isi data barang Anda di bawah ini
                                        </p>
                                    </div>
                                </div>

                                <form
                                    className="flex flex-col gap-5"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    {/* Weight */}
                                    <div>
                                        <label
                                            htmlFor="weight"
                                            className="mb-2 block text-sm font-medium text-[var(--heading)]"
                                        >
                                            Berat Aktual (kg)
                                        </label>
                                        <input
                                            id="weight"
                                            type="text"
                                            inputMode="decimal"
                                            value={weight}
                                            onChange={(e) =>
                                                setWeight(e.target.value)
                                            }
                                            onInput={(e) => {
                                                const target =
                                                    e.target as HTMLInputElement;
                                                target.value = target.value
                                                    .replace(/[^0-9.]/g, '')
                                                    .replace(/(\..*)\./g, '$1');
                                            }}
                                            className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
                                            placeholder="Contoh: 5"
                                        />
                                    </div>

                                    {/* Dimensions */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[var(--heading)]">
                                            Dimensi (cm)
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label
                                                    htmlFor="length"
                                                    className="mb-1 block text-xs text-[var(--body-subtle)]"
                                                >
                                                    Panjang
                                                </label>
                                                <input
                                                    id="length"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={length}
                                                    onChange={(e) =>
                                                        setLength(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onInput={(e) => {
                                                        const target =
                                                            e.target as HTMLInputElement;
                                                        target.value =
                                                            target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            );
                                                    }}
                                                    className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
                                                    placeholder="P"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="width"
                                                    className="mb-1 block text-xs text-[var(--body-subtle)]"
                                                >
                                                    Lebar
                                                </label>
                                                <input
                                                    id="width"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={width}
                                                    onChange={(e) =>
                                                        setWidth(e.target.value)
                                                    }
                                                    onInput={(e) => {
                                                        const target =
                                                            e.target as HTMLInputElement;
                                                        target.value =
                                                            target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            );
                                                    }}
                                                    className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
                                                    placeholder="L"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="height"
                                                    className="mb-1 block text-xs text-[var(--body-subtle)]"
                                                >
                                                    Tinggi
                                                </label>
                                                <input
                                                    id="height"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={height}
                                                    onChange={(e) =>
                                                        setHeight(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onInput={(e) => {
                                                        const target =
                                                            e.target as HTMLInputElement;
                                                        target.value =
                                                            target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            );
                                                    }}
                                                    className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
                                                    placeholder="T"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Zone */}
                                    <div>
                                        <label
                                            htmlFor="zone"
                                            className="mb-2 block text-sm font-medium text-[var(--heading)]"
                                        >
                                            Zona Tujuan
                                        </label>
                                        <select
                                            id="zone"
                                            value={zoneId}
                                            onChange={(e) =>
                                                setZoneId(e.target.value)
                                            }
                                            className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
                                        >
                                            <option value="">
                                                Pilih zona tujuan
                                            </option>
                                            {ZONES.map((zone) => (
                                                <option
                                                    key={zone.id}
                                                    value={zone.id}
                                                >
                                                    {zone.name}
                                                    {zone.deliveryFee > 0
                                                        ? ` (+${formatCurrency(zone.deliveryFee)})`
                                                        : ' (Gratis)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        variant="primary"
                                        size="large"
                                        type="button"
                                        onClick={handleSubmit}
                                        className="mt-2 w-full"
                                    >
                                        Cari
                                        <Calculator size={20} />
                                    </Button>
                                </form>
                            </div>
                        </motion.div>

                        {/* ── Result ── */}
                        <motion.div
                            className="md:col-span-2"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="sticky top-28 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6 shadow-sm md:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-none bg-[var(--brand-softer)] text-[var(--brand-strong)]">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-medium text-[var(--heading)]">
                                            Ringkasan
                                        </h2>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Estimasi biaya pengiriman
                                        </p>
                                    </div>
                                </div>

                                {result ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start gap-3 rounded-none bg-[var(--brand-softer)] p-4">
                                            <Info
                                                size={18}
                                                className="mt-0.5 shrink-0 text-[var(--brand-strong)]"
                                            />
                                            <p className="text-sm leading-[1.6] text-[var(--body)]">
                                                Berat final dihitung dari berat
                                                terbesar antara berat aktual dan
                                                berat volumetrik.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 border-t border-[var(--border-default)] pt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Berat aktual
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {parseFloat(weight)} kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Berat volumetrik
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {result.volumetricWeight.toFixed(
                                                        2,
                                                    )}{' '}
                                                    kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Berat final
                                                </span>
                                                <span className="font-medium text-[var(--brand-strong)]">
                                                    {result.finalWeight.toFixed(
                                                        2,
                                                    )}{' '}
                                                    kg
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 border-t border-[var(--border-default)] pt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Ongkir (
                                                    {TARIFF_PER_KG.toLocaleString(
                                                        'id-ID',
                                                    )}{' '}
                                                    /kg ×{' '}
                                                    {result.finalWeight.toFixed(
                                                        2,
                                                    )}{' '}
                                                    kg)
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {formatCurrency(
                                                        result.shippingCost,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Biaya antar{' '}
                                                    {result.zoneName}
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {result.deliveryFee > 0
                                                        ? formatCurrency(
                                                              result.deliveryFee,
                                                          )
                                                        : 'Gratis'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-[var(--border-default)] pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-base font-medium text-[var(--heading)]">
                                                    Total Estimasi
                                                </span>
                                                <span className="text-xl font-bold text-[var(--brand-strong)]">
                                                    {formatCurrency(
                                                        result.totalCost,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <div className="mb-4 flex size-14 items-center justify-center rounded-none bg-[var(--neutral-tertiary)] text-[var(--body-subtle)]">
                                            <Package size={24} />
                                        </div>
                                        <p className="text-sm text-[var(--body-subtle)]">
                                            Isi data barang di sebelah kiri
                                            untuk melihat estimasi biaya
                                            pengiriman.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            <Footer />
        </>
    );
}
