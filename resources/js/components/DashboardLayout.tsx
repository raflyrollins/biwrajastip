import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

import ThemeToggle from '@/components/ThemeToggle';
import type { Auth } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function DashboardLayout({
    children,
    title,
}: DashboardLayoutProps) {
    const { auth } = usePage().props as { auth: Auth };
    const user = auth.user;

    return (
        <div data-surface="dashboard" className="flex min-h-dvh">
            {/* ── Sidebar ── */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[var(--border-default)] bg-[var(--neutral-primary-soft)] md:flex">
                <div className="flex h-16 items-center border-b border-[var(--border-default)] px-6">
                    <Link
                        href="/"
                        className="text-lg font-bold text-[var(--heading)] no-underline"
                    >
                        biwrajastip
                    </Link>
                </div>

                <div className="flex-1" />

                <div className="border-t border-[var(--border-default)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-none bg-[var(--brand-softer)] text-sm font-bold text-[var(--fg-brand-strong)]">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--heading)]">
                                {user.name}
                            </p>
                            <p className="truncate text-xs text-[var(--body-subtle)]">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Mobile top bar ── */}
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 md:hidden">
                <Link
                    href="/"
                    className="text-base font-bold text-[var(--heading)] no-underline"
                >
                    biwrajastip
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-2 text-sm text-[var(--body)] transition-colors hover:text-[var(--heading)]"
                        aria-label="Keluar"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* ── Main content ── */}
            <div className="flex flex-1 flex-col md:ml-64">
                <header className="hidden h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-8 md:flex">
                    <h1 className="text-xl font-bold text-[var(--heading)]">
                        {title ?? 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="flex cursor-pointer items-center gap-2 border-none bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            <LogOut size={16} />
                            Keluar
                        </button>
                    </div>
                </header>
                <main className="flex-1 bg-[var(--neutral-secondary-soft)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
