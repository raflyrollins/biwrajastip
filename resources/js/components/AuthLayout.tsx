import { Link } from '@inertiajs/react';
import { MapPin, Package } from 'lucide-react';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
};

export default function AuthLayout({
    title,
    subtitle,
    children,
}: AuthLayoutProps) {
    return (
        <div className="bg-neutral-primary-soft grid min-h-screen lg:grid-cols-2">
            {/* Image side */}
            <div className="relative hidden lg:block">
                <img
                    src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-12">
                    <p className="text-sm font-medium text-white/90">
                        <MapPin className="mr-1 inline h-4 w-4" />
                        Surabaya → Ende
                    </p>
                    <h1 className="mt-3 max-w-md text-3xl leading-tight font-bold text-white">
                        Titip beli & kirim barang, terlacak sampai tiba.
                    </h1>
                    <div className="mt-6 flex items-center gap-3 border border-white/25 bg-white/10 p-4 backdrop-blur">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-white">
                            <Package className="text-brand h-5 w-5" />
                        </span>
                        <p className="text-sm text-white/90">
                            Setiap paket discan dan melintasi alur yang jelas,
                            dari membeli sampai tiba di Ende.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form side */}
            <div className="flex items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="text-brand mb-10 inline-block text-2xl font-bold"
                    >
                        biwrajastip
                    </Link>

                    <h2 className="text-heading text-3xl font-bold">{title}</h2>
                    <p className="text-body mt-3">{subtitle}</p>

                    <div className="mt-10">{children}</div>
                </div>
            </div>
        </div>
    );
}
