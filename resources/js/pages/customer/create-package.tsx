import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface Zone {
    id: number;
    name: string;
    tarif_per_kg: number;
    biaya_antar: number;
}

interface CreatePackageProps {
    zones: Zone[];
}

export default function CreatePackage({ zones }: CreatePackageProps) {
    const { data, setData, post, processing, errors } = useForm({
        recipient_name: '',
        recipient_phone: '',
        zone_id: '',
        sender_tracking_number: '',
        weight_estimated: '',
        length: '',
        width: '',
        height: '',
        notes: '',
    });

    const selectedZone = zones.find((z) => String(z.id) === data.zone_id);

    const weightEstimated = Number(data.weight_estimated) || 0;
    const length = Number(data.length) || 0;
    const width = Number(data.width) || 0;
    const height = Number(data.height) || 0;

    const volumetricWeight =
        length && width && height
            ? Math.ceil((length * width * height) / 6000) * 1000
            : 0;

    const estimatedFinalWeight = Math.max(weightEstimated, volumetricWeight);

    const estimatedCost =
        selectedZone && estimatedFinalWeight
            ? Math.ceil(
                  (selectedZone.tarif_per_kg * estimatedFinalWeight) / 1000 +
                      selectedZone.biaya_antar,
              )
            : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/packages');
    };

    return (
        <>
            <Head title="Daftarkan Paket" />

            <DashboardLayout title="Daftarkan Paket">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <button
                            onClick={() => router.get('/customer/packages')}
                            className="mb-4 flex items-center gap-2 text-sm text-[var(--body-subtle)] hover:text-[var(--heading)]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Daftarkan Paket Baru
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Isi data paket yang akan dikirim. Berat dan dimensi
                            masih estimasi, akan ditimbang dan diukur oleh staff
                            saat paket fisik diterima.
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* ── Form Utama ── */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* ── Data Penerima ── */}
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                            <Package size={18} />
                                            Data Penerima
                                        </h3>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Nama Penerima *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.recipient_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'recipient_name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                placeholder="Nama lengkap penerima"
                                            />
                                            {errors.recipient_name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.recipient_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Telepon Penerima
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={data.recipient_phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'recipient_phone',
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                    placeholder="08xxx"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Zona Tujuan *
                                                </label>
                                                <select
                                                    value={data.zone_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            'zone_id',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                >
                                                    <option value="">
                                                        Pilih zona
                                                    </option>
                                                    {zones.map((z) => (
                                                        <option
                                                            key={z.id}
                                                            value={z.id}
                                                        >
                                                            {z.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.zone_id && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.zone_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ── Data Pengirim ── */}
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="text-lg font-bold text-[var(--heading)]">
                                            Data Pengirim (Toko)
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                No. Resi Toko Online / Ekspedisi
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    data.sender_tracking_number
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'sender_tracking_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                placeholder="Nomor resi dari toko online / ekspedisi"
                                            />
                                            <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                                Nomor ini akan dicocokkan oleh
                                                staff saat menerima paket fisik.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ── Dimensi & Berat (Estimasi) ── */}
                                <motion.div
                                    className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="text-lg font-bold text-[var(--heading)]">
                                            Estimasi Berat & Dimensi
                                        </h3>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Berat Estimasi (gram) *
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.weight_estimated}
                                                onChange={(e) =>
                                                    setData(
                                                        'weight_estimated',
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            '',
                                                        ),
                                                    )
                                                }
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                placeholder="contoh: 2000 (untuk 2 kg)"
                                            />
                                            {errors.weight_estimated && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.weight_estimated}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Panjang (cm)
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={data.length}
                                                    onChange={(e) =>
                                                        setData(
                                                            'length',
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                    placeholder="P"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Lebar (cm)
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={data.width}
                                                    onChange={(e) =>
                                                        setData(
                                                            'width',
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                    placeholder="L"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                    Tinggi (cm)
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={data.height}
                                                    onChange={(e) =>
                                                        setData(
                                                            'height',
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                    placeholder="T"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                                Catatan
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        'notes',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={2}
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                                placeholder="Catatan tambahan (opsional)"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* ── Ringkasan & Submit ── */}
                            <div className="space-y-6">
                                <motion.div
                                    className="sticky top-24 border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <div className="border-b border-[var(--border-default)] px-6 py-4">
                                        <h3 className="text-lg font-bold text-[var(--heading)]">
                                            Ringkasan
                                        </h3>
                                    </div>
                                    <div className="space-y-3 p-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Zona Tujuan
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {selectedZone?.name ?? '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Tarif/kg
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {selectedZone
                                                    ? `Rp${selectedZone.tarif_per_kg.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--body-subtle)]">
                                                Biaya Antar
                                            </span>
                                            <span className="font-medium text-[var(--heading)]">
                                                {selectedZone
                                                    ? `Rp${selectedZone.biaya_antar.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="border-t border-[var(--border-default)] pt-3">
                                            <p className="mb-2 text-xs font-medium text-[var(--body-subtle)]">
                                                Perhitungan Berat
                                            </p>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Berat Estimasi
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {weightEstimated
                                                        ? `${weightEstimated.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--body-subtle)]">
                                                    Berat Volumetrik
                                                </span>
                                                <span className="font-medium text-[var(--heading)]">
                                                    {volumetricWeight
                                                        ? `${volumetricWeight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[var(--body-subtle)]">
                                                (P×L×T ÷ 6000)
                                            </p>
                                            <div className="mt-2 flex justify-between text-sm">
                                                <span className="font-medium text-[var(--heading)]">
                                                    Berat Final
                                                </span>
                                                <span className="font-bold text-[var(--heading)]">
                                                    {estimatedFinalWeight
                                                        ? `${estimatedFinalWeight.toLocaleString('id-ID')}g`
                                                        : '-'}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[var(--body-subtle)]">
                                                max(berat, volumetrik)
                                            </p>
                                        </div>
                                        <div className="border-t border-[var(--border-default)] pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-[var(--heading)]">
                                                    Estimasi Ongkir
                                                </span>
                                                <span className="text-lg font-bold text-[var(--fg-brand-strong)]">
                                                    Rp
                                                    {estimatedCost.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                                Harga final ditentukan setelah
                                                penimbangan aktual.
                                            </p>
                                        </div>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={processing}
                                            className="mt-4 w-full"
                                        >
                                            {processing
                                                ? 'Mendaftarkan...'
                                                : 'Daftarkan Paket'}
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
