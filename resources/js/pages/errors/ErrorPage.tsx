import { Head, Link } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
}

interface ErrorContent {
    title: string;
    heading: string;
    message: string;
    image: string;
    alt: string;
}

const CONTENT: Record<number, ErrorContent> = {
    403: {
        title: '403 - Akses Ditolak',
        heading: 'Akses Ditolak',
        message: 'Maaf, kamu tidak memiliki izin untuk mengakses halaman ini.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&fit=crop&q=80',
        alt: 'Gembok pagar - akses terbatas',
    },
    404: {
        title: '404 - Halaman Tidak Ditemukan',
        heading: 'Halaman Tidak Ditemukan',
        message: 'Maaf, halaman yang kamu cari tidak dapat ditemukan.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&fit=crop&q=80',
        alt: 'Jalan kosong menuju gunung',
    },
    500: {
        title: '500 - Kesalahan Server',
        heading: 'Kesalahan Server',
        message: 'Maaf, terjadi kesalahan pada server kami.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&fit=crop&q=80',
        alt: 'Ilustrasi error server',
    },
    503: {
        title: '503 - Layanan Tidak Tersedia',
        heading: 'Layanan Tidak Tersedia',
        message: 'Maaf, kami sedang melakukan pemeliharaan. Silakan coba lagi nanti.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&fit=crop&q=80',
        alt: 'Ilustrasi layanan tidak tersedia',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const content = CONTENT[status] ?? CONTENT[500];

    return (
        <>
            <Head title={content.title} />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <img
                    src={content.image}
                    alt={content.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/75" />

                <div className="relative z-10 flex flex-col items-center px-6">
                    <h1
                        className="mb-2 text-8xl font-black tracking-tight text-white"
                        style={{ fontFamily: 'Gabarito, sans-serif' }}
                    >
                        {status}
                    </h1>

                    <h2 className="mb-3 text-xl font-bold text-white/90">
                        {content.heading}
                    </h2>

                    <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-white/70">
                        {content.message}
                    </p>

                    <Link
                        href="/dashboard"
                        className="inline-block border-none bg-[var(--brand)] px-8 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}
