import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import { PaymentEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SearchFilters from '@/components/ui/SearchFilters';
import { useAlert, useConfirm } from '@/contexts/AlertContext';
import { useCan } from '@/lib/permissions';

interface PackageInfo {
    uuid: string;
    tracking_number: string;
}

interface UserInfo {
    name: string;
}

interface Payment {
    uuid: string;
    amount: string;
    payment_method: string;
    proof_image: string;
    status: string;
    notes: string | null;
    created_at: string;
    package: PackageInfo | null;
    user: UserInfo | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    verified: 'Terverifikasi',
    rejected: 'Ditolak',
};

function getStatusColor(status: string): string {
    switch (status) {
        case 'pending':
            return 'var(--warning)';
        case 'verified':
            return 'var(--success)';
        case 'rejected':
            return 'var(--fg-brand-strong)';
        default:
            return 'var(--body)';
    }
}

interface PaymentsIndexProps {
    payments: PaginatedData<Payment>;
    filters?: { search?: string; date_from?: string; date_to?: string; year?: string };
}

export default function PaymentsIndex({ payments, filters }: PaymentsIndexProps) {
    const canVerify = useCan('payments.verify');
    const alert = useAlert();
    const confirm = useConfirm();

    const [rejecting, setRejecting] = useState<Payment | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    async function handleVerify(payment: Payment) {
        const confirmed = await confirm(
            `Yakin ingin memverifikasi pembayaran Rp ${Number(payment.amount).toLocaleString('id-ID')} dari ${payment.user?.name ?? '-'}?`,
        );

        if (!confirmed) {
            return;
        }

        router.put(
            `/dashboard/payments/${payment.uuid}/verify`,
            {},
            {
                onSuccess: () => {
                    alert('Pembayaran berhasil diverifikasi.');
                },
            },
        );
    }

    function handleRejectClick(payment: Payment) {
        setRejecting(payment);
        setRejectReason('');
    }

    function handleRejectSubmit() {
        if (!rejecting || !rejectReason.trim()) {
            return;
        }

        router.put(
            `/dashboard/payments/${rejecting.uuid}/reject`,
            { notes: rejectReason.trim() },
            {
                onSuccess: () => {
                    alert('Pembayaran ditolak.');
                    setRejecting(null);
                    setRejectReason('');
                },
                onError: () => {
                    setRejecting(null);
                    setRejectReason('');
                },
            },
        );
    }

    return (
        <>
            <Head title="Pembayaran" />

            <DashboardLayout title="Pembayaran">
                {canVerify && (
                    <p className="mb-6 text-sm text-[var(--body-subtle)]">
                        Verifikasi pembayaran dari customer.
                    </p>
                )}

                <SearchFilters
                    baseRoute="/dashboard/payments"
                    search={filters?.search ?? ''}
                    dateFrom={filters?.date_from ?? ''}
                    dateTo={filters?.date_to ?? ''}
                    searchPlaceholder="Cari customer atau no. resi..."
                    showDateFilter
                />

                {payments.data.length === 0 ? (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <EmptyState
                            title="Belum ada pembayaran"
                            description="Pembayaran akan muncul saat customer mengupload bukti transfer."
                            icon={<PaymentEmpty className="size-40" />}
                        />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)] text-[var(--body-subtle)]">
                                        <th className="px-4 py-3 font-medium">Customer</th>
                                        <th className="px-4 py-3 font-medium">Paket</th>
                                        <th className="px-4 py-3 font-medium">Jumlah</th>
                                        <th className="px-4 py-3 font-medium">Metode</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Bukti</th>
                                        <th className="px-4 py-3 font-medium">Tanggal</th>
                                        {canVerify && (
                                            <th className="px-4 py-3 font-medium">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.data.map((payment) => (
                                        <tr
                                            key={payment.uuid}
                                            className="border-b border-[var(--border-default)] last:border-0"
                                        >
                                            <td className="px-4 py-3 text-[var(--heading)]">
                                                {payment.user?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {payment.package?.tracking_number ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[var(--heading)]">
                                                Rp {Number(payment.amount).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body)]">
                                                {payment.payment_method}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-block px-2.5 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: getStatusColor(payment.status) + '20',
                                                        color: getStatusColor(payment.status),
                                                    }}
                                                >
                                                    {STATUS_LABELS[payment.status] ?? payment.status}
                                                </span>
                                                {payment.status === 'rejected' && payment.notes && (
                                                    <p className="mt-1 max-w-48 text-xs text-[var(--body-subtle)]">
                                                        {payment.notes}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payment.proof_image ? (
                                                    <a
                                                        href={payment.proof_image}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[var(--brand)] no-underline hover:text-[var(--brand-strong)]"
                                                    >
                                                        <ExternalLink size={14} />
                                                        Lihat
                                                    </a>
                                                ) : (
                                                    <span className="text-[var(--body-subtle)]">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-[var(--body-subtle)]">
                                                {new Date(payment.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            {canVerify && (
                                                <td className="px-4 py-3">
                                                    {payment.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleVerify(payment)}
                                                                className="inline-flex cursor-pointer items-center gap-1 border-none bg-[var(--success)] px-3 py-1.5 text-xs font-medium text-[var(--on-brand)] transition-colors hover:brightness-110"
                                                            >
                                                                <CheckCircle size={14} />
                                                                Verifikasi
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRejectClick(payment)}
                                                                className="inline-flex cursor-pointer items-center gap-1 border border-[var(--fg-brand-strong)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--fg-brand-strong)] transition-colors hover:bg-[var(--fg-brand-strong)] hover:text-[var(--on-brand)]"
                                                            >
                                                                <XCircle size={14} />
                                                                Tolak
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination meta={payments} />
                    </>
                )}
            </DashboardLayout>

            {/* Reject Modal */}
            {rejecting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6 shadow-xl">
                        <p className="mb-2 text-base font-bold text-[var(--heading)]">
                            Tolak Pembayaran
                        </p>
                        <p className="mb-4 text-sm text-[var(--body)]">
                            Pembayaran Rp {Number(rejecting.amount).toLocaleString('id-ID')} dari{' '}
                            {rejecting.user?.name ?? '-'}
                        </p>

                        <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                            Alasan Penolakan
                        </label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Contoh: Nominal kurang dari tagihan"
                            rows={3}
                            maxLength={1000}
                            className="mb-5 w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] p-2.5 text-sm text-[var(--body)] outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setRejecting(null)}
                                className="cursor-pointer border border-[var(--border-default)] bg-[var(--neutral-primary)] px-5 py-2.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim()}
                                className="cursor-pointer border-none bg-[var(--fg-brand-strong)] px-5 py-2.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:brightness-110 disabled:opacity-50"
                            >
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
