import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CircleDashed,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';

type Promotion = {
    id: number;
    uuid: string;
    name: string;
    description: string | null;
    type: string;
    value: number;
    min_order_total: number;
    max_discount_amount: number | null;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
};

type Paginated = {
    data: Promotion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PromotionForm = {
    name: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_order_subtotal: number;
    max_discount_amount: number | null;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
};

function splitDateTime(dt: string | null): { date: string; time: string } {
    if (!dt) {
        return { date: '', time: '' };
    }
    const d = new Date(dt);
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().slice(0, 5);
    return { date, time };
}

export default function Promotions() {
    const { props } = usePage();
    const promotions = props.promotions as Paginated;
    const success = (props.flash as Record<string, string>)?.success as
        | string
        | undefined;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Promotion | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } =
        useForm<PromotionForm>({
            name: '',
            description: '',
            discount_type: 'percentage',
            discount_value: 10,
            min_order_subtotal: 0,
            max_discount_amount: null,
            starts_at: '',
            ends_at: '',
            is_active: true,
        });

    const openCreate = () => {
        setEditing(null);
        reset();
        setShowForm(true);
    };

    const openEdit = (p: Promotion) => {
        setEditing(p);
        const s = splitDateTime(p.starts_at);
        const e = splitDateTime(p.ends_at);
        setData({
            name: p.name,
            description: p.description ?? '',
            discount_type: p.type,
            discount_value: p.value,
            min_order_subtotal: p.min_order_total,
            max_discount_amount: p.max_discount_amount,
            starts_at: s.date ? `${s.date}T${s.time}` : '',
            ends_at: e.date ? `${e.date}T${e.time}` : '',
            is_active: p.is_active,
        });
        setShowForm(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(`/promotions/${editing.uuid}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post('/promotions', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const toggle = (uuid: string) => {
        router.post(`/promotions/${uuid}/toggle`, {}, { preserveScroll: true });
    };

    const destroy = (uuid: string) => {
        router.delete(`/promotions/${uuid}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    return (
        <>
            <Head title="Promosi" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/settings"
                            className="text-body hover:text-heading inline-flex items-center gap-1 text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Pengaturan
                        </Link>
                        <h2 className="text-heading mt-2 text-2xl font-bold">
                            Promosi
                        </h2>
                        <p className="text-body mt-1">
                            Kelola diskon otomatis yang berlaku untuk semua
                            pelanggan.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="h-5 w-5" />
                        Buat Promosi
                    </Button>
                </div>

                {success && (
                    <div className="border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        {success}
                    </div>
                )}

                {promotions.data.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <p className="text-heading font-medium">
                            Belum ada promosi
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {promotions.data.map((p) => (
                            <div
                                key={p.uuid}
                                className="border-border-default bg-neutral-primary flex flex-col gap-3 border p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-heading font-semibold">
                                            {p.name}
                                        </h3>
                                        {p.description && (
                                            <p className="text-body mt-0.5 text-sm">
                                                {p.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggle(p.uuid)}
                                        className="shrink-0"
                                    >
                                        {p.is_active ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <CircleDashed className="text-body-subtle h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="text-heading space-y-1 text-sm">
                                    <p>
                                        Diskon:{' '}
                                        <span className="font-medium">
                                            {p.type === 'percentage'
                                                ? `${p.value}%`
                                                : `Rp ${p.value.toLocaleString('id-ID')}`}
                                        </span>
                                    </p>
                                    {p.min_order_total > 0 && (
                                        <p className="text-body text-xs">
                                            Min. order: Rp{' '}
                                            {p.min_order_total.toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    )}
                                    {p.max_discount_amount && (
                                        <p className="text-body text-xs">
                                            Maks. diskon: Rp{' '}
                                            {p.max_discount_amount.toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    )}
                                    {p.starts_at && (
                                        <p className="text-body text-xs">
                                            {new Date(
                                                p.starts_at,
                                            ).toLocaleDateString('id-ID')}
                                            {p.ends_at &&
                                                ` – ${new Date(p.ends_at).toLocaleDateString('id-ID')}`}
                                        </p>
                                    )}
                                </div>

                                <div className="border-border-default mt-auto flex gap-2 border-t pt-3">
                                    <Button
                                        variant="white"
                                        onClick={() => openEdit(p)}
                                        className="flex-1"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Ubah
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => setConfirmDelete(p.uuid)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {confirmDelete === p.uuid && (
                                    <div className="bg-dark/50 fixed inset-0 z-50 grid place-items-center">
                                        <div className="bg-neutral-primary mx-4 max-w-sm border p-6 text-center">
                                            <p className="text-heading font-medium">
                                                Hapus promosi "{p.name}"?
                                            </p>
                                            <p className="text-body mt-1 text-sm">
                                                Tindakan ini tidak dapat
                                                dibatalkan.
                                            </p>
                                            <div className="mt-4 flex gap-3">
                                                <Button
                                                    variant="white"
                                                    onClick={() =>
                                                        setConfirmDelete(null)
                                                    }
                                                    className="flex-1"
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        destroy(p.uuid)
                                                    }
                                                    className="flex-1"
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="bg-dark/50 fixed inset-0 z-50 grid place-items-center">
                    <form
                        onSubmit={submit}
                        className="bg-neutral-primary mx-4 max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto border p-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-heading text-lg font-bold">
                                {editing ? 'Ubah Promosi' : 'Buat Promosi'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditing(null);
                                }}
                            >
                                <X className="text-body h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <label className="text-heading mb-1 block text-sm font-medium">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-heading mb-1 block text-sm font-medium">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={2}
                                className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('discount_type', 'percentage')
                                }
                                className={`flex-1 border py-2.5 text-sm font-medium ${
                                    data.discount_type === 'percentage'
                                        ? 'border-fg-brand bg-brand/10 text-fg-brand'
                                        : 'border-border-default text-heading'
                                }`}
                            >
                                Persen (%)
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setData('discount_type', 'fixed')
                                }
                                className={`flex-1 border py-2.5 text-sm font-medium ${
                                    data.discount_type === 'fixed'
                                        ? 'border-fg-brand bg-brand/10 text-fg-brand'
                                        : 'border-border-default text-heading'
                                }`}
                            >
                                Nominal (Rp)
                            </button>
                        </div>

                        <div>
                            <label className="text-heading mb-1 block text-sm font-medium">
                                Nilai Diskon
                            </label>
                            <input
                                type="number"
                                value={data.discount_value}
                                onChange={(e) =>
                                    setData(
                                        'discount_value',
                                        Number(e.target.value),
                                    )
                                }
                                min={1}
                                className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                            />
                            {errors.discount_value && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.discount_value}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-heading mb-1 block text-sm font-medium">
                                    Min. Order (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={data.min_order_subtotal}
                                    onChange={(e) =>
                                        setData(
                                            'min_order_subtotal',
                                            Number(e.target.value),
                                        )
                                    }
                                    min={0}
                                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-heading mb-1 block text-sm font-medium">
                                    Maks. Diskon (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={data.max_discount_amount ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'max_discount_amount',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        )
                                    }
                                    min={0}
                                    placeholder="Tanpa batas"
                                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-heading mb-1 block text-sm font-medium">
                                    Berlaku Dari
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) =>
                                        setData('starts_at', e.target.value)
                                    }
                                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-heading mb-1 block text-sm font-medium">
                                    Berlaku Sampai
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) =>
                                        setData('ends_at', e.target.value)
                                    }
                                    className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand w-full rounded-none border px-3 py-2.5 text-sm focus:ring-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="border-border-default text-fg-brand focus:ring-brand h-4 w-4"
                            />
                            <span className="text-heading text-sm font-medium">
                                Aktif
                            </span>
                        </label>

                        <div className="flex gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="white"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditing(null);
                                }}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1"
                            >
                                {editing ? 'Simpan' : 'Buat'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

Promotions.layout = (page: ReactNode) => (
    <AppLayout title="Promosi">{page}</AppLayout>
);
