import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAlert } from '@/contexts/AlertContext';

interface Permission {
    uuid: string;
    name: string;
    label: string;
    group: string;
}

interface Role {
    uuid: string;
    name: string;
    label: string;
    permissions: { uuid: string; name: string; label: string; group: string }[];
}

interface PageProps {
    role: Role;
    groups: Record<string, Permission[]>;
}

export default function RolesForm() {
    const { role, groups } = usePage().props as unknown as PageProps;
    const alert = useAlert();

    const initialPermissions = new Set(role.permissions.map((p) => p.uuid));

    const [selected, setSelected] = useState<Set<string>>(initialPermissions);

    function toggle(uuid: string) {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(uuid)) {
                next.delete(uuid);
            } else {
                next.add(uuid);
            }

            return next;
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            permissions: Array.from(selected),
            _method: 'PUT' as const,
        };

        router.post('/dashboard/roles/' + role.uuid, payload, {
            onSuccess: () => alert('Permission role berhasil diperbarui.'),
            onError: (errs) => {
                const msg = Object.values(errs).flat().join(', ');
                alert(msg || 'Gagal memperbarui permission.');
            },
        });
    }

    return (
        <>
            <Head title={`Edit Role: ${role.label}`} />

            <DashboardLayout title={`Edit Role: ${role.label}`}>
                <Link
                    href={'/dashboard/roles'}
                    className="mb-6 flex w-fit items-center gap-2 border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <div className="mx-auto max-w-2xl border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <form onSubmit={handleSubmit}>
                        {Object.entries(groups).map(([group, permissions]) => (
                            <div key={group} className="mb-8 last:mb-0">
                                <h3 className="mb-3 text-base font-bold text-[var(--heading)] capitalize">
                                    {group}
                                </h3>
                                <div className="space-y-2">
                                    {permissions.map((perm) => (
                                        <label
                                            key={perm.uuid}
                                            className="flex cursor-pointer items-center gap-3 border border-[var(--border-default)] px-4 py-2.5 transition-colors hover:bg-[var(--neutral-tertiary)] has-[:checked]:border-[var(--brand)] has-[:checked]:bg-[var(--brand-softer)]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.has(
                                                    perm.uuid,
                                                )}
                                                onChange={() =>
                                                    toggle(perm.uuid)
                                                }
                                                className="size-4 accent-[var(--brand)]"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--heading)]">
                                                    {perm.label}
                                                </p>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    {perm.name}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href={'/dashboard/roles'}
                                className="border border-[var(--border-default)] px-6 py-2.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="cursor-pointer border-none bg-[var(--brand)] px-6 py-2.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
