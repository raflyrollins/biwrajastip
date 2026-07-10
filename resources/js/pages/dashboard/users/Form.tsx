import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import SelectSearch from '@/components/ui/SelectSearch';
import { useAlert } from '@/contexts/AlertContext';

interface Role {
    uuid: string;
    name: string;
    label: string;
}

interface User {
    uuid: string;
    name: string;
    email: string;
    phone: string;
    roles: { name: string; label: string }[];
}

interface PageProps {
    user?: User;
    roles: Role[];
}

export default function UsersForm() {
    const { user, roles } = usePage().props as unknown as PageProps;
    const isEdit = Boolean(user);
    const alert = useAlert();

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState(user?.roles?.[0]?.name ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const roleOptions = roles.map((r) => ({
        value: r.uuid,
        label: r.label,
    }));

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload: Record<string, string | undefined> = {
            name,
            email,
            phone,
            role,
            _method: isEdit ? 'PUT' : undefined,
        };

        if (isEdit) {
            if (password) {
                payload.password = password;
                payload.password_confirmation = passwordConfirmation;
            }
        } else {
            payload.password = password;
            payload.password_confirmation = passwordConfirmation;
        }

        router.post(
            isEdit ? '/dashboard/users/' + user!.uuid : '/dashboard/users',
            payload,
            {
                onSuccess: () => {
                    alert(
                        isEdit
                            ? 'Pengguna berhasil diperbarui.'
                            : 'Pengguna berhasil ditambahkan.',
                    );
                },
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    const firstError = Object.values(errs).flat()[0];

                    if (firstError) {
                        alert(firstError as string);
                    }
                },
            },
        );
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />

            <DashboardLayout
                title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
            >
                <Link
                    href={'/dashboard/users'}
                    className="mb-6 flex w-fit items-center gap-2 border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <div className="mx-auto max-w-lg border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Telepon
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Role
                            </label>
                            <SelectSearch
                                options={roleOptions}
                                value={role}
                                onChange={setRole}
                                placeholder="Pilih role..."
                            />
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                Password
                                {isEdit ? ' (kosongkan jika tidak diubah)' : ''}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isEdit}
                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {(password || !isEdit) && (
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) =>
                                        setPasswordConfirmation(e.target.value)
                                    }
                                    required={!isEdit}
                                    className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2.5 text-sm text-[var(--heading)] transition-colors outline-none placeholder:text-[var(--body-subtle)] focus:border-[var(--brand)]"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Link
                                href={'/dashboard/users'}
                                className="border border-[var(--border-default)] px-6 py-2.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="cursor-pointer border-none bg-[var(--brand)] px-6 py-2.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                            >
                                {isEdit ? 'Simpan' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
