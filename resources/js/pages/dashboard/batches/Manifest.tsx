import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { QRCode } from 'qrcode.react';
import { useEffect } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

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
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 500);

        return () => clearTimeout(timer);
    }, []);

    const totalWeight = batch.bags.reduce(
        (sum, bag) => sum + (bag.weight ?? 0),
        0,
    );
    const totalPackages = batch.bags.reduce(
        (sum, bag) => sum + bag.packages.length,
        0,
    );

    return (
        <>
            <Head title="Manifest Batch - {batch.code}" />

            <DashboardLayout title="Manifest Batch">
                <div className="mb-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                    >
                        <Printer size={16} className="inline-block" /> Cetak
                    </button>
                </div>

                <div className="mx-auto max-w-3xl border border-[var(--border-default)] bg-[var(--neutral-primary)] p-8">
                    <div className="mb-6 flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--heading)]">
                                BiwraJastip
                            </h1>
                            <p className="text-sm text-[var(--body-subtle)]">
                                Manifest Batch
                            </p>
                        </div>
                        <div className="shrink-0">
                            <QRCode
                                value={batch.code}
                                size={80}
                                level="M"
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="text-xs text-[var(--body-subtle)]">Kode Batch</p>
                            <p className="font-bold text-[var(--brand)]">{batch.code}</p>
                        </div>
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="text-xs text-[var(--body-subtle)]">Status</p>
                            <p className="font-medium text-[var(--heading)]">{batch.status}</p>
                        </div>
                        {batch.ship && (
                            <div className="border border-[var(--border-default)] p-3">
                                <p className="text-xs text-[var(--body-subtle)]">Kapal</p>
                                <p className="font-medium text-[var(--heading)]">
                                    {batch.ship.name}
                                </p>
                            </div>
                        )}
                        {batch.schedule && (
                            <div className="border border-[var(--border-default)] p-3">
                                <p className="text-xs text-[var(--body-subtle)]">Jadwal</p>
                                <p className="font-medium text-[var(--heading)]">
                                    {new Date(batch.schedule.departure_date).toLocaleDateString(
                                        'id-ID',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}{' '}
                                    →{' '}
                                    {new Date(batch.schedule.arrival_date).toLocaleDateString(
                                        'id-ID',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </p>
                            </div>
                        )}
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="text-xs text-[var(--body-subtle)]">Total Bag</p>
                            <p className="font-medium text-[var(--heading)]">{batch.bags.length}</p>
                        </div>
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="text-xs text-[var(--body-subtle)]">Total Paket</p>
                            <p className="font-medium text-[var(--heading)]">{totalPackages}</p>
                        </div>
                        <div className="border border-[var(--border-default)] p-3">
                            <p className="text-xs text-[var(--body-subtle)]">Total Berat</p>
                            <p className="font-medium text-[var(--heading)]">
                                {(totalWeight / 1000).toFixed(2)} kg
                            </p>
                        </div>
                    </div>

                    {batch.notes && (
                        <div className="mb-6 rounded border border-[var(--border-default)] bg-[var(--neutral-tertiary)] p-3 text-sm text-[var(--body)]">
                            {batch.notes}
                        </div>
                    )}

                    <div>
                        <h2 className="mb-3 text-sm font-semibold text-[var(--heading)]">
                            Daftar Bag
                        </h2>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-default)]">
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Kode Bag
                                    </th>
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Berat
                                    </th>
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Jml Paket
                                    </th>
                                    <th className="pb-2 text-xs font-medium text-[var(--body-subtle)]">
                                        Penerima
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--body)]">
                                {batch.bags.map((bag) => (
                                    <tr
                                        key={bag.uuid}
                                        className="border-b border-[var(--border-default)]"
                                    >
                                        <td className="py-2 font-medium text-[var(--heading)]">
                                            {bag.code}
                                        </td>
                                        <td className="py-2">
                                            {bag.weight
                                                ? `${(bag.weight / 1000).toFixed(2)} kg`
                                                : '-'}
                                        </td>
                                        <td className="py-2">{bag.packages.length}</td>
                                        <td className="py-2">
                                            {bag.packages
                                                .slice(0, 3)
                                                .map((p) => p.receiver_name)
                                                .join(', ')}
                                            {bag.packages.length > 3 && '...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 border-t border-[var(--border-default)] pt-4 text-center text-xs text-[var(--body-subtle)]">
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
