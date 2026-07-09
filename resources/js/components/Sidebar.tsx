import { Link, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    BarChart3,
    Box,
    CalendarDays,
    LayoutDashboard,
    Layers,
    LogOut,
    MapPin,
    Package,
    ShieldCheck,
    Ship,
    Users,
    X,
} from 'lucide-react';

import { usePermissions } from '@/lib/permissions';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        permission: null,
    },
    {
        label: 'Paket',
        href: '/dashboard/packages',
        icon: Package,
        permission: 'packages.view',
    },
    {
        label: 'Bag',
        href: '/dashboard/bags',
        icon: Box,
        permission: 'bags.view',
    },
    {
        label: 'Batch',
        href: '/dashboard/batches',
        icon: Layers,
        permission: 'batches.view',
    },
    {
        label: 'Pembayaran',
        href: '/dashboard/payments',
        icon: Banknote,
        permission: 'payments.view',
    },
    {
        label: 'Kapal',
        href: '/dashboard/ships',
        icon: Ship,
        permission: 'ships.view',
    },
    {
        label: 'Jadwal',
        href: '/dashboard/schedules',
        icon: CalendarDays,
        permission: 'schedules.view',
    },
    {
        label: 'Zona',
        href: '/dashboard/zones',
        icon: MapPin,
        permission: 'zones.view',
    },
    {
        label: 'Pengguna',
        href: '/dashboard/users',
        icon: Users,
        permission: 'users.view',
    },
    {
        label: 'Roles',
        href: '/dashboard/roles',
        icon: ShieldCheck,
        permission: 'roles.view',
    },
    {
        label: 'Laporan',
        href: '/dashboard/reports',
        icon: BarChart3,
        permission: 'reports.view',
    },
] as const;

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { url } = usePage();
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                roles: { name: string; label: string }[];
            } | null;
        };
    };

    const permissions = usePermissions();
    const filteredNav = navItems.filter(
        (item) =>
            item.permission === null || permissions.includes(item.permission),
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--border-default)] bg-[var(--neutral-primary-soft)] transition-transform duration-200 md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* ── Header ── */}
                <div className="flex h-16 items-center justify-between border-b border-[var(--border-default)] px-6">
                    <Link
                        href="/"
                        className="text-lg font-bold text-[var(--heading)] no-underline"
                    >
                        biwrajastip
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] hover:text-[var(--heading)] md:hidden"
                        aria-label="Tutup sidebar"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Nav ── */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {filteredNav.map((item) => {
                            const isActive =
                                item.href === '/dashboard'
                                    ? url === '/dashboard'
                                    : url.startsWith(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium no-underline transition-colors duration-150',
                                            isActive
                                                ? 'bg-[var(--brand)] text-[var(--on-brand)]'
                                                : 'text-[var(--body)] hover:bg-[var(--neutral-tertiary)] hover:text-[var(--heading)]',
                                        )}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* ── User info ── */}
                <div className="border-t border-[var(--border-default)] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center border border-[var(--brand)] bg-[var(--brand-softer)] text-sm font-bold text-[var(--brand-strong)]">
                            {auth?.user?.name.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--heading)]">
                                {auth?.user?.name}
                            </p>
                            <p className="truncate text-xs text-[var(--body-subtle)]">
                                {auth?.user?.roles
                                    ?.map((r) => r.label)
                                    .join(', ')}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-2 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary)]"
                    >
                        <LogOut size={16} />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}
