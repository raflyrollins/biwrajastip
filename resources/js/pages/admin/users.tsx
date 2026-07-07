import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Search, X, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import { UserEmpty } from '@/components/EmptyIllustrations';
import EmptyState from '@/components/EmptyState';

const roleColors: Record<string, string> = {
    customer: 'bg-[var(--brand-softer)] text-[var(--fg-brand-strong)]',
    staff_surabaya: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    staff_ende: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    admin: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    owner: 'bg-[var(--neutral-tertiary)] text-[var(--heading)]',
};

const roleLabels: Record<string, string> = {
    customer: 'Customer',
    staff_surabaya: 'Staff Surabaya',
    staff_ende: 'Staff Ende',
    admin: 'Admin',
    owner: 'Owner',
};

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    roles: { name: string }[];
}

interface PaginatedData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AdminUsersProps {
    users: PaginatedData;
    filters: { search?: string; role?: string };
}

export default function AdminUsers({ users, filters }: AdminUsersProps) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData({
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            role: 'customer',
        });
        setShowForm(true);
    };

    const openEdit = (user: User) => {
        setEditing(user);
        setData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: '',
            password_confirmation: '',
            role: user.roles[0]?.name ?? 'customer',
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            const payload: Record<string, string> = { ...data };

            if (!payload.password) {
                delete payload.password;
                delete payload.password_confirmation;
            }

            put(`/admin/users/${editing.id}`, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditing(null);
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Hapus pengguna "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/admin/users',
            { search: value, role: filters.role },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Pengguna - Admin" />

            <DashboardLayout title="Pengguna">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--heading)]">
                                Pengguna
                            </h2>
                            <p className="mt-1 text-sm text-[var(--body-subtle)]">
                                Kelola akun pengguna, staff, dan admin.
                            </p>
                        </div>
                        <Button variant="primary" onClick={openCreate}>
                            <Plus size={18} />
                            Tambah Pengguna
                        </Button>
                    </motion.div>

                    <motion.div
                        className="mb-6 flex flex-col gap-3 sm:flex-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--body-subtle)]"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Cari pengguna..."
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-2.5 pr-4 pl-10 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                            />
                        </div>
                    </motion.div>

                    {showForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <motion.div
                                className="w-full max-w-md border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-[var(--heading)]">
                                        {editing
                                            ? 'Edit Pengguna'
                                            : 'Tambah Pengguna'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditing(null);
                                            reset();
                                        }}
                                        className="text-[var(--body-subtle)] hover:text-[var(--heading)]"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Nama *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Telepon *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Role *
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) =>
                                                setData('role', e.target.value)
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        >
                                            {Object.entries(roleLabels).map(
                                                ([value, label]) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.role && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.role}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Kata Sandi{' '}
                                            {editing
                                                ? '(kosongkan jika tidak diubah)'
                                                : '*'}
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-[var(--heading)]">
                                            Konfirmasi Kata Sandi
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-3 py-2 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditing(null);
                                                reset();
                                            }}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    <motion.div
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--border-default)]">
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Nama
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Telepon
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 font-medium text-[var(--heading)]">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12"
                                            >
                                                <EmptyState
                                                    title="Belum Ada Pengguna"
                                                    description="Pengguna yang terdaftar akan muncul di sini."
                                                    icon={
                                                        <UserEmpty className="h-32 w-40" />
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-[var(--border-default)] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--body)]">
                                                    {user.phone}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium ${roleColors[user.roles[0]?.name] ?? ''}`}
                                                    >
                                                        {roleLabels[
                                                            user.roles[0]?.name
                                                        ] ??
                                                            user.roles[0]?.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEdit(user)
                                                            }
                                                            className="p-1 text-[var(--body-subtle)] hover:text-[var(--fg-brand-strong)]"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user,
                                                                )
                                                            }
                                                            className="p-1 text-[var(--body-subtle)] hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-[var(--border-default)] px-6 py-4">
                                <p className="text-sm text-[var(--body-subtle)]">
                                    Halaman {users.current_page} dari{' '}
                                    {users.last_page} ({users.total} pengguna)
                                </p>
                                <div className="flex gap-2">
                                    {users.current_page > 1 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    '/admin/users',
                                                    {
                                                        ...filters,
                                                        page:
                                                            users.current_page -
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Sebelumnya
                                        </Button>
                                    )}
                                    {users.current_page < users.last_page && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                router.get(
                                                    '/admin/users',
                                                    {
                                                        ...filters,
                                                        page:
                                                            users.current_page +
                                                            1,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        >
                                            Selanjutnya
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </DashboardLayout>
        </>
    );
}
