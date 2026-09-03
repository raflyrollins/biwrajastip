import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import type { Auth } from '@/types';

export default function Profile() {
    const auth = usePage<{ auth: Auth }>().props.auth;
    const user = auth.user;

    if (!user) return null;

    const roleLabels: Record<string, string> = {
        customer: 'Customer',
        admin: 'Admin',
        'staff-surabaya': 'Staff Surabaya',
        'staff-ende': 'Staff Ende',
    };

    return (
        <>
            <Head title="Profil" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-heading text-2xl font-bold">Profil</h2>
                </div>

                <section className="border-border-default bg-neutral-primary border">
                    <header className="border-border-default flex items-center gap-3 border-b px-5 py-4">
                        <span className="bg-brand text-on-brand inline-flex h-12 w-12 items-center justify-center text-lg font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <h3 className="text-heading font-semibold">
                                {user.name}
                            </h3>
                            <p className="text-body-subtle text-sm">
                                {user.email}
                            </p>
                        </div>
                    </header>

                    <dl className="divide-y text-sm">
                        <div className="flex items-center justify-between px-5 py-4">
                            <dt className="text-body">Peran</dt>
                            <dd className="text-heading">
                                {user.roles
                                    .map((r) => roleLabels[r] ?? r)
                                    .join(', ') || '—'}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-4">
                            <dt className="text-body">Telepon</dt>
                            <dd className="text-heading">
                                {user.phone ?? '—'}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
        </>
    );
}

Profile.layout = (page: ReactNode) => (
    <AppLayout title="Profil">{page}</AppLayout>
);
