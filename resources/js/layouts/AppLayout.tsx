import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    FolderArchive,
    LayoutDashboard,
    LogOut,
    Package,
    PackageSearch,
    Settings,
    User,
} from 'lucide-react';
import { type ComponentType, type ReactNode, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

type IconComponent = ComponentType<{ className?: string }>;

type MenuItem = {
    label: string;
    href: string;
    icon: IconComponent;
    permission?: string;
};

// Menu definitions are derived from permissions (menu.*), never hardcoded per
// role. A menu only renders when the logged-in account owns the permission.
// The dashboard is the authenticated shell's landing page, so it is always
// available to any logged-in account (gate: auth).
const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Paket',
        href: '/packages',
        icon: Package,
        permission: 'menu.packages',
    },
    {
        label: 'Bag',
        href: '/bags',
        icon: FolderArchive,
        permission: 'menu.bags',
    },
    {
        label: 'Batch',
        href: '/batches',
        icon: Boxes,
        permission: 'menu.batches',
    },
    {
        label: 'Laporan',
        href: '/reports',
        icon: BarChart3,
        permission: 'reports.view',
    },
    {
        label: 'Pengaturan',
        href: '/settings',
        icon: Settings,
        permission: 'settings.manage',
    },
];

type AppLayoutProps = {
    title: string;
    children: ReactNode;
};

export default function AppLayout({ title, children }: AppLayoutProps) {
    const { props, url } = usePage();
    const auth = props.auth;
    const permissions = auth.permissions ?? [];
    const user = auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    // Active state uses an exact pathname match on the item's own href (never a
    // wildcard prefix), so at most one item can ever be active at a time.
    const currentPath = url.split('?')[0];

    const visibleItems = MENU_ITEMS.filter(
        (item) => !item.permission || permissions.includes(item.permission),
    );

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = (href: string) => currentPath === href;

    const SidebarNav = (
        <nav className="flex h-full flex-col">
            <Link
                href="/dashboard"
                className="text-brand flex items-center gap-2 px-6 py-5 text-xl font-bold"
            >
                biwrajastip
            </Link>

            <div className="flex-1 space-y-1 px-3 py-2">
                {visibleItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium',
                                active
                                    ? 'bg-brand text-on-brand'
                                    : 'text-heading hover:bg-neutral-quaternary',
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'h-5 w-5',
                                    active ? 'text-on-brand' : 'text-brand',
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="border-border-default border-t px-3 py-4">
                <Link
                    href="/profile"
                    className="text-heading hover:bg-neutral-quaternary flex items-center gap-3 px-3 py-2 text-sm font-medium"
                >
                    <User className="text-brand h-5 w-5" />
                    Profil
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-fg-danger-strong hover:bg-danger-soft mt-1 flex w-full items-center gap-3 px-3 py-2 text-sm font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    Keluar
                </button>
            </div>
        </nav>
    );

    return (
        <div className="bg-neutral-tertiary-soft min-h-screen">
            {/* Topbar */}
            <header className="border-border-default bg-neutral-primary/80 sticky top-0 z-30 border-b backdrop-blur">
                <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="text-heading hover:bg-neutral-quaternary inline-flex h-10 w-10 items-center justify-center lg:hidden"
                        aria-label="Buka menu"
                        aria-expanded={menuOpen}
                    >
                        <PackageSearch className="h-5 w-5" />
                    </button>

                    <div className="hidden lg:block">
                        <h1 className="text-heading text-lg font-bold">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {user && (
                            <div className="flex items-center gap-2">
                                <span className="bg-brand text-on-brand inline-flex h-9 w-9 items-center justify-center text-sm font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="text-heading hidden text-sm font-medium sm:block">
                                    {user.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="border-border-default bg-neutral-primary hidden w-64 shrink-0 border-r lg:block">
                    <div className="sticky top-16 h-[calc(100vh-4rem)]">
                        {SidebarNav}
                    </div>
                </aside>

                {/* Mobile drawer */}
                {menuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="bg-dark/50 absolute inset-0"
                            onClick={() => setMenuOpen(false)}
                            aria-hidden="true"
                        />
                        <aside className="bg-neutral-primary absolute inset-y-0 left-0 w-72">
                            {SidebarNav}
                        </aside>
                    </div>
                )}

                <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <h1 className="text-heading mb-6 text-xl font-bold lg:hidden">
                        {title}
                    </h1>
                    {children}
                </main>
            </div>
        </div>
    );
}
