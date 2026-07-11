import { useState } from 'react';

import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({
    children,
    title,
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div data-surface="dashboard" className="flex min-h-dvh">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="min-w-0 flex flex-1 flex-col md:ml-64">
                {/* ── Top bar (mobile) ── */}
                <header className="flex h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body)] hover:text-[var(--heading)] md:hidden"
                            aria-label="Buka sidebar"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-[var(--heading)]">
                            {title ?? 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </header>

                {/* ── Main content ── */}
                <main className="min-w-0 flex-1 bg-[var(--neutral-secondary-soft)] p-6 md:p-8">
                    <div id="dashboard-content" className="w-full">
                        {children}
                    </div>
                </main>

                <style>{`
                    #dashboard-content > .mx-auto,
                    #dashboard-content form.mx-auto {
                        margin-left: 0 !important;
                        margin-right: auto !important;
                    }
                `}</style>
            </div>
        </div>
    );
}
