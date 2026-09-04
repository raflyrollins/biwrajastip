import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CircleDashed,
    Dices,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/Button';
import { DateTimePicker } from '@/components/DateTimePicker';
import { TextInput } from '@/components/TextInput';

type PromoCode = {
    id: number;
    uuid: string;
    code: string;
    name: string;
    description: string | null;
    type: string;
    value: number;
    min_order_total: number;
    max_discount_amount: number | null;
    starts_at: string | null;
    ends_at: string | null;
    max_uses: number | null;
    used_count: number;
    is_active: boolean;
    creator: { name: string } | null;
};

type Paginated = {
    data: PromoCode[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PromoCodeForm = {
    code: string;
    description: string;
    discount_type: string;
    discount_value: string;
    min_order_subtotal: string;
    max_discount_amount: string;
    starts_at: string;
    ends_at: string;
    max_uses: string;
    is_active: boolean;
};

function digitsOnly(raw: string): string {
    return raw.replace(/[^0-9]/g, '');
}

function generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BWR';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function PromoCodes() {
    const { props } = usePage();
    const promoCodes = props.promoCodes as Paginated;
    const success = (props.flash as Record<string, string>)?.success as
        | string
        | undefined;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<PromoCode | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset } =
        useForm<PromoCodeForm>({
            code: '',
            description: '',
            discount_type: 'fixed',
            discount_value: '10000',
            min_order_subtotal: '0',
            max_discount_amount: '',
            starts_at: '',
            ends_at: '',
            max_uses: '100',
            is_active: true,
        });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData('code', generateCode());
        setShowForm(true);
    };

    const openEdit = (pc: PromoCode) => {
        setEditing(pc);
        setData({
            code: pc.code,
            description: pc.description ?? '',
            discount_type: pc.type,
            discount_value: String(pc.value),
            min_order_subtotal: String(pc.min_order_total),
            max_discount_amount: pc.max_discount_amount
                ? String(pc.max_discount_amount)
                : '',
            starts_at: pc.starts_at
                ? (() => {
                      const d = new Date(pc.starts_at);
                      return `${d.toISOString().split('T')[0]}T${d.toTimeString().slice(0, 5)}`;
                  })()
                : '',
            ends_at: pc.ends_at
                ? (() => {
                      const d = new Date(pc.ends_at);
                      return `${d.toISOString().split('T')[0]}T${d.toTimeString().slice(0, 5)}`;
                  })()
                : '',
            max_uses: pc.max_uses ? String(pc.max_uses) : '',
            is_active: pc.is_active,
        });
        setShowForm(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            discount_value: digitsOnly(prev.discount_value),
            min_order_subtotal: digitsOnly(prev.min_order_subtotal),
            max_discount_amount: digitsOnly(prev.max_discount_amount),
            max_uses: digitsOnly(prev.max_uses),
        }));
        if (editing) {
            put(`/promo-codes/${editing.uuid}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post('/promo-codes', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const toggle = (uuid: string) => {
        router.post(
            `/promo-codes/${uuid}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const destroy = (uuid: string) => {
        router.delete(`/promo-codes/${uuid}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    return (
        <>
            <Head title="Kode Promo" />

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
                            Kode Promo
                        </h2>
                        <p className="text-body mt-1">
                            Kelola kode promo yang bisa dimasukkan pelanggan
                            saat checkout.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="h-5 w-5" />
                        Buat Kode Promo
                    </Button>
                </div>

                {success && (
                    <div className="border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        {success}
                    </div>
                )}

                {promoCodes.data.length === 0 ? (
                    <div className="border-border-default bg-neutral-primary border p-10 text-center">
                        <p className="text-heading font-medium">
                            Belum ada kode promo
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {promoCodes.data.map((pc) => (
                            <div
                                key={pc.uuid}
                                className="border-border-default bg-neutral-primary flex flex-col gap-3 border p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <code className="text-heading bg-neutral-tertiary px-2 py-0.5 text-sm font-bold tracking-wider">
                                            {pc.code}
                                        </code>
                                        {pc.description && (
                                            <p className="text-body mt-1 text-sm">
                                                {pc.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggle(pc.uuid)}
                                        className="shrink-0"
                                    >
                                        {pc.is_active ? (
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
                                            {pc.type === 'percentage'
                                                ? `${pc.value}%`
                                                : `Rp ${pc.value.toLocaleString('id-ID')}`}
                                        </span>
                                    </p>
                                    {pc.min_order_total > 0 && (
                                        <p className="text-body text-xs">
                                            Min. order: Rp{' '}
                                            {pc.min_order_total.toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    )}
                                    {pc.max_discount_amount && (
                                        <p className="text-body text-xs">
                                            Maks. diskon: Rp{' '}
                                            {pc.max_discount_amount.toLocaleString(
                                                'id-ID',
                                            )}
                                        </p>
                                    )}
                                    <p className="text-body text-xs">
                                        Digunakan: {pc.used_count}
                                        {pc.max_uses ? ` / ${pc.max_uses}` : ''}
                                    </p>
                                    {pc.ends_at && (
                                        <p className="text-body text-xs">
                                            Berlaku sampai:{' '}
                                            {new Date(
                                                pc.ends_at,
                                            ).toLocaleDateString('id-ID')}
                                        </p>
                                    )}
                                </div>

                                <div className="border-border-default mt-auto flex gap-2 border-t pt-3">
                                    <Button
                                        variant="white"
                                        onClick={() => openEdit(pc)}
                                        className="flex-1"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Ubah
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            setConfirmDelete(pc.uuid)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {confirmDelete === pc.uuid && (
                                    <div className="bg-dark/50 fixed inset-0 z-50 grid place-items-center">
                                        <div className="bg-neutral-primary mx-4 max-w-sm border p-6 text-center">
                                            <p className="text-heading font-medium">
                                                Hapus kode promo "{pc.code}"?
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
                                                        destroy(pc.uuid)
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
                                {editing
                                    ? 'Ubah Kode Promo'
                                    : 'Buat Kode Promo'}
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

                        {!editing && (
                            <div>
                                <label className="text-heading mb-1 block text-sm font-medium">
                                    Kode
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData(
                                                'code',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        className="bg-neutral-secondary-medium text-heading placeholder:text-body border-border-default-medium focus:border-brand focus:ring-brand flex-1 rounded-none border px-3 py-2.5 text-sm font-bold tracking-wider focus:ring-1 focus:outline-none"
                                    />
                                    <Button
                                        type="button"
                                        variant="white"
                                        onClick={() =>
                                            setData('code', generateCode())
                                        }
                                    >
                                        <Dices className="h-4 w-4" />
                                    </Button>
                                </div>
                                {errors.code && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.code}
                                    </p>
                                )}
                            </div>
                        )}

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

                        <TextInput
                            id="discount_value"
                            label="Nilai Diskon"
                            inputMode="numeric"
                            placeholder="cth: 10000"
                            value={data.discount_value}
                            onInput={(e) =>
                                setData(
                                    'discount_value',
                                    digitsOnly(e.currentTarget.value),
                                )
                            }
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                id="min_order_subtotal"
                                label="Min. Order (Rp)"
                                inputMode="numeric"
                                placeholder="0"
                                value={data.min_order_subtotal}
                                onInput={(e) =>
                                    setData(
                                        'min_order_subtotal',
                                        digitsOnly(e.currentTarget.value),
                                    )
                                }
                            />
                            <TextInput
                                id="max_discount_amount"
                                label="Maks. Diskon (Rp)"
                                inputMode="numeric"
                                placeholder="Tanpa batas"
                                value={data.max_discount_amount}
                                onInput={(e) =>
                                    setData(
                                        'max_discount_amount',
                                        digitsOnly(e.currentTarget.value),
                                    )
                                }
                            />
                        </div>

                        <TextInput
                            id="max_uses"
                            label="Maks. Penggunaan"
                            inputMode="numeric"
                            placeholder="Tidak terbatas"
                            value={data.max_uses}
                            onInput={(e) =>
                                setData(
                                    'max_uses',
                                    digitsOnly(e.currentTarget.value),
                                )
                            }
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <DateTimePicker
                                label="Berlaku Dari"
                                value={data.starts_at}
                                onChange={(v) => setData('starts_at', v)}
                            />
                            <DateTimePicker
                                label="Berlaku Sampai"
                                value={data.ends_at}
                                onChange={(v) => setData('ends_at', v)}
                            />
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

PromoCodes.layout = (page: ReactNode) => (
    <AppLayout title="Kode Promo">{page}</AppLayout>
);
