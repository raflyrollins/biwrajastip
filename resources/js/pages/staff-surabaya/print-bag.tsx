import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

interface BagData {
    code: string;
    total_packages: number;
    total_weight: number;
    notes: string | null;
    batch: {
        code: string;
    } | null;
    created_at: string;
}

interface PrintBagProps {
    bag: BagData;
}

export default function PrintBag({ bag }: PrintBagProps) {
    return (
        <>
            <Head title={`Bag ${bag.code}`} />

            <div className="mx-auto max-w-[320px] bg-white p-6 text-black print:mx-0 print:max-w-none">
                <div className="mb-4 text-center">
                    <h1 className="text-lg font-bold tracking-wide uppercase">
                        BiwraJastip
                    </h1>
                    <p className="text-xs text-gray-500">
                        Bag &mdash; Pengiriman Surabaya &rarr; Ende
                    </p>
                </div>

                <div className="mb-4 border border-black p-3 text-center">
                    <p className="text-xs text-gray-500">Kode Bag</p>
                    <p className="font-mono text-xl font-bold tracking-widest">
                        {bag.code}
                    </p>
                </div>

                <div className="mb-4 flex justify-center">
                    <QRCodeSVG
                        value={bag.code}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                    />
                </div>

                <div className="mb-4 border border-black p-3">
                    <p className="mb-2 text-xs font-bold tracking-wide text-gray-500 uppercase">
                        Detail Bag
                    </p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Jumlah Paket</span>
                            <span className="font-medium">
                                {bag.total_packages}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Berat Total</span>
                            <span className="font-medium">
                                {bag.total_weight
                                    ? `${bag.total_weight.toLocaleString('id-ID')}g`
                                    : '-'}
                            </span>
                        </div>
                        {bag.batch && (
                            <div className="flex justify-between border-t border-gray-300 pt-1">
                                <span className="text-gray-500">Batch</span>
                                <span className="font-medium">
                                    {bag.batch.code}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {bag.notes && (
                    <div className="mb-4 border border-black p-3">
                        <p className="mb-1 text-xs font-bold tracking-wide text-gray-500 uppercase">
                            Catatan
                        </p>
                        <p className="text-sm">{bag.notes}</p>
                    </div>
                )}

                <div className="mb-6 text-center text-xs text-gray-400">
                    Dicetak:{' '}
                    {new Date().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>

                <div className="my-6 h-0 w-full border-t border-dashed border-gray-400" />
                <div className="text-center text-sm text-gray-400">
                    --- Potong disini ---
                </div>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="rounded-none bg-black px-8 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-80"
                >
                    Cetak Bag
                </button>
            </div>
        </>
    );
}
