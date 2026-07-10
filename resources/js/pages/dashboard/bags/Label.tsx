import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { QRCode } from 'qrcode.react';
import { useEffect } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface PackageMinimal {
    uuid: string;
    tracking_number: string;
    tracking_number_biwra: string | null;
    receiver_name: string;
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
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Label Bag - {bag.code}" />

            <DashboardLayout title="Label Bag">
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                    >
                        <Printer size={16} className="inline-block" /> Cetak
                    </button>
                </div>

                <div className="mx-auto max-w-sm border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold text-[var(--heading)]">
                                BiwraJastip
                            </h1>
                            <p className="text-xs text-[var(--body-subtle)]">
                                Label Bag
                            </p>
                        </div>
                        <div className="shrink-0">
                            <QRCode
                                value={bag.code}
                                size={72}
                                level="M"
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </div>
                    </div>

                    <div className="mb-4 text-center">
                        <p className="text-xs text-[var(--body-subtle)]">
                            Kode Bag
                        </p>
                        <p className="text-xl font-bold text-[var(--brand)]">
                            {bag.code}
                        </p>
                    </div>

                    <div className="mb-4 text-xs text-[var(--body-subtle)]">
                        <p>Status: {bag.status}</p>
                        <p>
                            Berat:{' '}
                            {bag.weight
                                ? `${(bag.weight / 1000).toFixed(2)} kg`
                                : '-'}
                        </p>
                        <p>
                            Tanggal:{' '}
                            {new Date(bag.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        {bag.batch && <p>Batch: {bag.batch.code}</p>}
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-medium text-[var(--body-subtle)]">
                            Isi Paket ({bag.packages.length})
                        </p>
                        <div className="max-h-48 space-y-1 overflow-y-auto">
                            {bag.packages.map((pkg) => (
                                <div
                                    key={pkg.uuid}
                                    className="border border-[var(--border-default)] p-2 text-xs"
                                >
                                    <p className="font-medium text-[var(--heading)]">
                                        {pkg.tracking_number_biwra ?? pkg.tracking_number}
                                    </p>
                                    <p className="text-[var(--body-subtle)]">
                                        {pkg.receiver_name} - {pkg.zone?.name ?? '-'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 border-t border-[var(--border-default)] pt-3 text-center text-xs text-[var(--body-subtle)]">
                        Dicetak{' '}
                        {new Date().toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
