import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calculator,
    ChevronDown,
    Package,
    ShieldCheck,
    Truck,
    Zap,
} from 'lucide-react';

import Button from '@/components/Button';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const HERO_IMG =
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80';

const STEP_IMAGES: Record<string, string> = {
    collect:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    consolidate:
        'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80',
    ship: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=600&q=80',
    pickup: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=600&q=80',
};

const PEOPLE = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
];

export default function Welcome() {
    return (
        <>
            <Head title="Selamat Datang" />

            <Navbar />

            {/* ── Hero ── */}
            <section
                id="beranda"
                className="relative min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HERO_IMG})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/85 to-[var(--brand)]/60" />
                <div className="absolute inset-0 bg-black/20" />

                <Container className="relative z-10 grid min-h-screen items-center gap-12 pt-24 md:grid-cols-2 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="mb-6 text-[32px] leading-[1.1] font-bold text-[var(--on-brand)] md:text-[40px] lg:text-[56px] lg:tracking-[-0.8px]">
                            Belanja Online,
                            <br />
                            Kirim ke Ende
                        </h1>
                        <p className="mb-8 max-w-[65ch] text-lg leading-[1.7] text-[var(--on-brand-muted)] md:text-xl">
                            Layanan konsolidasi cargo laut dari Surabaya ke
                            Ende. Belanja barang dari Shopee atau toko online
                            lainnya, kirim ke alamat collecting kami, dan kami
                            konsolidasi pengiriman Anda.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="white" size="large">
                                Cek Ongkir
                                <Calculator size={20} />
                            </Button>
                            <Button variant="white" size="large">
                                Alur Pengiriman
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center md:items-end"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="w-full max-w-sm rounded-none border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                            <div className="mb-6 flex items-center">
                                <div className="flex">
                                    {PEOPLE.map((src, i) => (
                                        <img
                                            key={src}
                                            src={src}
                                            alt=""
                                            className="size-11 rounded-none border-2 border-[var(--brand)] object-cover"
                                            style={{
                                                marginLeft:
                                                    i === 0 ? 0 : '-8px',
                                                zIndex: PEOPLE.length - i,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="mb-1 text-2xl font-bold text-[var(--on-brand)]">
                                500+ Paket
                            </p>
                            <p className="mb-4 text-sm text-[var(--on-brand-muted)]">
                                Telah kami konsolidasi dan kirim ke Ende
                            </p>

                            <div className="mb-4 border-t border-white/15" />

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[var(--on-brand)]">
                                    <Truck size={14} />
                                    Surabaya → Ende
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[var(--on-brand)]">
                                    <ShieldCheck size={14} />
                                    Aman
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* ── Features ── */}
            <section id="fitur" className="bg-[var(--brand)] py-24">
                <Container>
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]">
                            Kenapa Memilih BiwraJastip?
                        </h2>
                        <p className="mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]">
                            Kami hadir untuk membuat pengiriman barang dari Jawa
                            ke Ende lebih mudah dan terjangkau.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.article
                                key={feature.title}
                                className="group rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-8 transition-colors duration-150 hover:bg-[var(--neutral-secondary-medium)]"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                }}
                            >
                                <motion.div
                                    className="mb-5 inline-flex size-14 items-center justify-center rounded-none bg-[var(--brand-softer)] text-[var(--brand-strong)] transition-colors duration-150"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <feature.icon size={24} />
                                </motion.div>
                                <h3 className="mb-2 text-xl font-medium text-[var(--heading)]">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-[1.7] text-[var(--body)]">
                                    {feature.description}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── How It Works ── */}
            <section id="alur-pengiriman" className="bg-[var(--brand)] py-24">
                <Container>
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]">
                            Alur Pengiriman
                        </h2>
                        <p className="mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]">
                            Proses pengiriman barang dari Surabaya ke Ende yang
                            transparan dan terpercaya.
                        </p>
                    </motion.div>

                    <div className="relative grid gap-6 md:grid-cols-2">
                        <div className="pointer-events-none absolute top-0 left-[27px] hidden h-full w-px border-l-2 border-dashed border-white/30 max-md:block" />

                        {steps.map((step, index) => (
                            <motion.article
                                key={step.title}
                                className="group relative flex flex-col overflow-hidden rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.12,
                                }}
                            >
                                <div className="aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-48 md:w-56">
                                    <motion.div
                                        className="h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${step.image})`,
                                        }}
                                        whileHover={{ scale: 1.08 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                                <div className="relative flex flex-1 flex-col justify-center p-6">
                                    <span className="mb-3 inline-flex size-8 items-center justify-center rounded-none bg-[var(--brand)] text-sm font-bold text-[var(--on-brand)]">
                                        {index + 1}
                                    </span>

                                    <h3 className="mb-1 text-lg font-medium text-[var(--heading)]">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-[1.6] text-[var(--body-subtle)]">
                                        {step.description}
                                    </p>
                                </div>

                                {index < steps.length - 1 && (
                                    <ChevronDown
                                        size={20}
                                        className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-white/50 md:hidden"
                                    />
                                )}
                            </motion.article>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── Cek Ongkir CTA ── */}
            <section id="check-shipping" className="bg-[var(--brand)] py-24">
                <Container className="flex flex-col items-center text-center">
                    <motion.h2
                        className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Cek Estimasi Ongkir
                    </motion.h2>
                    <motion.p
                        className="mb-10 max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Masukkan estimasi berat dan dimensi barang Anda untuk
                        melihat perkiraan biaya pengiriman ke Ende.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link href="/check-shipping">
                            <Button variant="white" size="large">
                                Cek Ongkir
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </motion.div>
                </Container>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[var(--brand)] py-24">
                <Container className="flex flex-col items-center text-center">
                    <motion.h2
                        className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Siap Kirim Barang?
                    </motion.h2>
                    <motion.p
                        className="mb-10 max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Daftar sekarang dan mulai kirim barang Anda dari Jawa ke
                        Ende dengan mudah.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link href="/register">
                            <Button variant="white" size="large">
                                Daftar Sekarang
                                <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </motion.div>
                </Container>
            </section>

            <Footer />
        </>
    );
}

const features = [
    {
        icon: Package,
        title: 'Mudah & Praktis',
        description:
            'Cukup kirim barang ke alamat collecting kami di Surabaya. Kami yang akan mengurus pengiriman ke Ende untuk Anda.',
    },
    {
        icon: ShieldCheck,
        title: 'Aman & Terpercaya',
        description:
            'Setiap paket dilacak dengan QR code. Pantau status pengiriman Anda dari Surabaya hingga tiba di Ende.',
    },
    {
        icon: Zap,
        title: 'Harga Terjangkau',
        description:
            'Biaya pengiriman lebih hemat karena barang Anda dikonsolidasi dengan paket lain dalam satu batch pengiriman.',
    },
];

const steps = [
    {
        title: 'Beli Barang Online',
        description:
            'Belanja barang dari Shopee atau toko online lainnya. Kirim ke alamat collecting BiwraJastip di Surabaya dengan nama "biwrajastip (nama Anda/penerima di Ende)".',
        image: STEP_IMAGES.collect,
    },
    {
        title: 'Paket Diterima & Dihitung',
        description:
            'Staff Surabaya menerima barang Anda, menimbang berat aktual, dan menghitung harga final berdasarkan berat terbesar (aktual vs volumetrik).',
        image: STEP_IMAGES.consolidate,
    },
    {
        title: 'Bayar & Paket Dikirim',
        description:
            'Setelah membayar, paket Anda masuk ke dalam Bag dan Batch pengiriman. Batch berangkat via kapal dari Surabaya ke Ende.',
        image: STEP_IMAGES.ship,
    },
    {
        title: 'Paket Tiba di Ende',
        description:
            'Paket tiba di Ende, disortir berdasarkan zona tujuan. Ambil di pusat jastip atau minta diantar ke alamat Anda.',
        image: STEP_IMAGES.pickup,
    },
];
