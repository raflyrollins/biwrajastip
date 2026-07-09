import { Head } from '@inertiajs/react';

import DashboardLayout from '@/components/DashboardLayout';
import { BatchEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import { useCan } from '@/lib/permissions';

export default function BatchesIndex() {
    const canCreate = useCan('batches.create');
    const canPrint = useCan('batches.print');

    return (
        <>
            <Head title="Batch" />

            <DashboardLayout title="Batch">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[var(--body-subtle)]">
                        Daftar Batch pengiriman
                    </p>
                    <div className="flex gap-2">
                        {canPrint && (
                            <button
                                type="button"
                                className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                            >
                                Cetak
                            </button>
                        )}
                        {canCreate && (
                            <button
                                type="button"
                                className="cursor-pointer border-none bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                            >
                                + Buat Batch
                            </button>
                        )}
                    </div>
                </div>

                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                    <EmptyState
                        title="Belum ada Batch"
                        description="Batch akan muncul setelah kamu melakukan batching di BiwraHub."
                        icon={<BatchEmpty className="size-40" />}
                    />
                </div>
            </DashboardLayout>
        </>
    );
}
