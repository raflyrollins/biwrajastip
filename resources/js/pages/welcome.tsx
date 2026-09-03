import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Boxes,
    Check,
    Menu,
    MapPin,
    Package,
    Ship,
    ShoppingBag,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1600&q=80',
        title: 'Titip beli & kirim barang dari Surabaya ke Ende',
        subtitle:
            'Kami urus pembelian, pengepakan per bag & batch, hingga pengiriman lewat kapal — terlacak sampai tiba.',
    },
    {
        image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80',
        title: 'Transparan per bag & batch',
        subtitle:
            'Setiap paket discan QR dan melintasi alur waktu yang tercatat. Status selalu diperbarui real-time.',
    },
    {
        image: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&w=1600&q=80',
        title: 'Aman, terlacak, sampai di Ende',
        subtitle:
            'Pantau paketmu kapan saja dari satu tempat dan terima dengan aman di tangan penerima.',
    },
];

const steps = [
    {
        icon: ShoppingBag,
        title: 'Beli & Titipkan',
        description:
            'Beritahu barang yang ingin dibeli dari Surabaya, atau titipkan paket belanjaanmu. Kami catat estimasi berat & dimensi.',
    },
    {
        icon: Package,
        title: 'Proses & Kemas',
        description:
            'Barang diukur aktual, dihitung ongkir transparan, lalu dikemas per bag dan batch untuk pengiriman yang rapi.',
    },
    {
        icon: Ship,
        title: 'Kapal ke Ende',
        description:
            'Batch diberangkatkan dari Surabaya via kapal. Status diperbarui di setiap titik: bagging, batching, tiba, dibongkar.',
    },
    {
        icon: MapPin,
        title: 'Terima di Ende',
        description:
            'Paket di-sortir dan diantar sesuai zona tarif di Ende. Kamu bisa pantau sampai tiba dengan aman.',
    },
];

const features = [
    {
        icon: ShieldCheck,
        title: 'Aman & Terverifikasi',
        description:
            'Setiap paket discan QR dan melintasi alur waktu yang tercatat, jelas ada di mana.',
    },
    {
        icon: Boxes,
        title: 'Lacak per Bag & Batch',
        description:
            'Paket masuk ke bag lalu ke batch — semua terhubung dan bisa dilacak kapan pun.',
    },
    {
        icon: MapPin,
        title: 'Tarif Antar Jelas',
        description:
            'Harga ongkir fair dihitung dari zona & berat, dengan rincian transparan dari hulu ke hilir.',
    },
];

function Header() {
    const [open, setOpen] = useState(false);

    const nav = [
        { href: '#alur', label: 'Alur' },
        { href: '#keunggulan', label: 'Keunggulan' },
        { href: '#daerah', label: 'Daerah' },
    ];

    return (
        <header className="border-border-default bg-neutral-primary-soft/90 sticky top-0 z-50 border-b backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="text-brand inline-flex items-center gap-2 text-lg font-bold"
                    aria-label="biwrajastip beranda"
                >
                    <img
                        src="/images/logo.png"
                        alt="Logo biwrajastip"
                        className="h-8 w-auto"
                    />
                    biwrajastip
                </Link>

                <nav
                    className="hidden items-center gap-8 md:flex"
                    aria-label="Navigasi utama"
                >
                    {nav.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-body hover:text-heading text-sm font-medium underline-offset-4"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="text-body hover:text-heading text-sm font-medium underline-offset-4"
                    >
                        Masuk
                    </Link>
                    <Link
                        href="/register"
                        className="bg-brand text-on-brand hover:bg-brand-strong px-6 py-2.5 text-sm font-medium transition-colors"
                    >
                        Daftar Gratis
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-heading inline-flex h-11 w-11 items-center justify-center md:hidden"
                    aria-label={open ? 'Tutup menu' : 'Buka menu'}
                    aria-expanded={open}
                >
                    {open ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {open ? (
                <div className="border-border-default bg-neutral-primary-soft border-t px-6 py-4 md:hidden">
                    <nav
                        className="flex flex-col gap-3"
                        aria-label="Navigasi mobile"
                    >
                        {nav.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="text-body hover:text-heading text-sm font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="mt-2 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-body-subtle text-sm">
                                    Mode tampilan
                                </span>
                                <ThemeToggle />
                            </div>
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="text-body hover:text-heading text-sm font-medium"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setOpen(false)}
                                className="bg-brand text-on-brand hover:bg-brand-strong px-6 py-3 text-center text-sm font-medium"
                            >
                                Daftar Gratis
                            </Link>
                        </div>
                    </nav>
                </div>
            ) : null}
        </header>
    );
}

function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((i) => (i + 1) % total);
        }, 6000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <section className="dark:bg-neutral-primary relative h-[560px] overflow-hidden bg-white sm:h-[600px] md:h-[640px] lg:h-[560px]">
            <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                    backgroundImage: `url(${slides[current].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                aria-hidden="true"
            />
            <div className="dark:from-neutral-primary/95 dark:via-neutral-primary/80 dark:to-neutral-primary/40 absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/40" />

            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
                <span className="border-brand/30 bg-brand-softer text-fg-brand-strong dark:bg-brand/20 dark:border-brand/40 inline-flex items-center gap-2 border px-4 py-1.5 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    Surabaya → Ende
                </span>

                <div className="mt-6 flex min-h-[200px] flex-col justify-start sm:min-h-[220px] md:min-h-[240px]">
                    <h1 className="text-heading max-w-3xl text-4xl leading-tight font-bold md:text-6xl">
                        {slides[current].title}
                    </h1>
                    <p className="text-body mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
                        {slides[current].subtitle}
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/register"
                        className="bg-brand text-on-brand hover:bg-brand-strong focus:ring-brand/50 inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:outline-none active:translate-y-0 active:scale-[0.98]"
                    >
                        Mulai Titip Barang
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/login"
                        className="border-border-default text-heading hover:bg-neutral-tertiary dark:bg-neutral-primary-medium dark:border-neutral-primary-strong dark:hover:bg-neutral-primary-strong focus:ring-brand/50 inline-flex items-center justify-center gap-2 border bg-white px-10 py-5 text-lg font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:outline-none active:translate-y-0 active:scale-[0.98] dark:text-white"
                    >
                        Masuk ke Akun
                    </Link>
                </div>

                <div
                    className="mt-10 flex items-center gap-2"
                    role="group"
                    aria-label="Pilih slide"
                >
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            onClick={() => setCurrent(index)}
                            aria-label={`Slide ${index + 1}`}
                            aria-current={index === current}
                            className={`h-2 rounded-none transition-all ${
                                index === current
                                    ? 'bg-brand w-10'
                                    : 'bg-neutral-quaternary w-6'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Welcome() {
    return (
        <>
            <Head title="Beranda" />

            <div className="bg-neutral-primary-soft min-h-screen">
                <Header />

                <main>
                    <HeroCarousel />

                    {/* Alur */}
                    <section id="alur" className="bg-neutral-primary-soft">
                        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                            <div className="max-w-2xl">
                                <span className="text-fg-brand text-sm font-medium">
                                    Bagaimana cara kerjanya
                                </span>
                                <h2 className="text-heading mt-3 text-3xl font-bold md:text-4xl">
                                    Alur yang jelas dari toko sampai ke tanganmu
                                </h2>
                                <p className="text-body mt-4">
                                    Tak perlu cemas barang hilang atau nyasar.
                                    Setiap tahap tercatat rapi.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className="border-border-default dark:bg-neutral-primary-medium border bg-white p-8 shadow-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="bg-brand-softer dark:bg-brand/20 inline-flex h-12 w-12 items-center justify-center">
                                                <step.icon className="text-fg-brand-strong dark:text-brand-medium h-6 w-6" />
                                            </span>
                                            <span className="text-body-subtle text-sm font-bold">
                                                0{index + 1}
                                            </span>
                                        </div>
                                        <h3 className="text-heading mt-6 text-xl font-bold">
                                            {step.title}
                                        </h3>
                                        <p className="text-body mt-3 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Keunggulan */}
                    <section
                        id="keunggulan"
                        className="bg-neutral-secondary-soft"
                    >
                        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                            <div className="max-w-2xl">
                                <span className="text-fg-brand text-sm font-medium">
                                    Keunggulan
                                </span>
                                <h2 className="text-heading mt-3 text-3xl font-bold md:text-4xl">
                                    Kenapa memilih biwrajastip
                                </h2>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="border-border-default dark:bg-neutral-primary-medium border bg-white p-8 shadow-sm"
                                    >
                                        <span className="bg-brand-softer dark:bg-brand/20 inline-flex h-12 w-12 items-center justify-center">
                                            <feature.icon className="text-fg-brand-strong dark:text-brand-medium h-6 w-6" />
                                        </span>
                                        <h3 className="text-heading mt-6 text-xl font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-body mt-3 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Parallax */}
                    <section
                        className="bg-cover bg-fixed bg-center"
                        style={{
                            backgroundImage:
                                'url(https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&w=1600&q=80)',
                        }}
                    >
                        <div className="from-brand/85 to-brand/40 bg-gradient-to-r px-6 py-24 md:py-32">
                            <div className="mx-auto max-w-3xl text-center">
                                <Package
                                    className="mx-auto h-10 w-10 text-white"
                                    aria-hidden="true"
                                />
                                <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
                                    Dari Surabaya sampai Ende, satu alur yang
                                    pasti
                                </h2>
                                <p className="mt-4 text-lg text-white/90">
                                    Pengepakan rapi, jadwal kapal, dan sortir di
                                    kota tujuan — semua terhubung dalam satu
                                    sistem.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-neutral-primary-soft">
                        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                            <div className="border-border-default from-brand-softer dark:from-neutral-primary-strong dark:via-neutral-primary-medium dark:to-neutral-primary relative overflow-hidden bg-gradient-to-br via-white to-white p-10 md:p-16">
                                <div className="relative">
                                    <h2 className="text-heading max-w-2xl text-3xl font-bold md:text-4xl">
                                        Siap kirim barangmu dari Surabaya ke
                                        Ende?
                                    </h2>
                                    <p className="text-body mt-4 max-w-2xl">
                                        Daftar akun gratis dan mulai titip
                                        barangmu sekarang. Bagikan barangnya,
                                        kami yang urus pengiriman sampai tiba.
                                    </p>
                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                        <Link
                                            href="/register"
                                            className="bg-brand text-on-brand hover:bg-brand-strong inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-medium transition-colors duration-150"
                                        >
                                            Buat Akun Gratis
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Daerah */}
                    <section id="daerah" className="bg-neutral-secondary-soft">
                        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
                            <div className="max-w-2xl">
                                <h2 className="text-heading text-3xl font-bold md:text-4xl">
                                    Melayani rute Surabaya → Ende
                                </h2>
                                <p className="text-body mt-4">
                                    Pengiriman rutin lewat kapal dengan jadwal
                                    yang bisa dipantau langsung dari dashboard.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {[
                                    {
                                        label: 'Pengambilan di Surabaya',
                                        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
                                    },
                                    {
                                        label: 'Antar di Ende',
                                        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
                                    },
                                    {
                                        label: 'Pantau real-time',
                                        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="group border-border-default dark:bg-neutral-primary-medium overflow-hidden border bg-white shadow-xs"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.label}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 p-6">
                                            <span className="bg-brand-softer dark:bg-brand/20 inline-flex h-8 w-8 shrink-0 items-center justify-center">
                                                <Check className="text-fg-brand-strong dark:text-brand-medium h-4 w-4" />
                                            </span>
                                            <span className="text-heading font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-border-default bg-neutral-primary-soft border-t">
                    <div className="mx-auto max-w-6xl px-6 py-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <span className="text-brand inline-flex items-center gap-2 text-lg font-bold">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo biwrajastip"
                                    className="h-6 w-auto"
                                />
                                biwrajastip
                            </span>
                            <p className="text-body-subtle text-sm">
                                © {new Date().getFullYear()} biwrajastip.
                                Surabaya → Ende.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
