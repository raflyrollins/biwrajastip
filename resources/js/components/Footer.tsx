import { Link } from '@inertiajs/react';

import Container from '@/components/Container';

export default function Footer() {
    return (
        <footer className="bg-[var(--brand)] py-12">
            <Container>
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            className="text-lg font-bold text-[var(--on-brand)] no-underline"
                        >
                            biwrajastip
                        </Link>
                        <p className="mt-3 max-w-sm text-sm leading-[1.6] text-[var(--on-brand-muted)]">
                            Layanan konsolidasi cargo laut dari Surabaya ke
                            Ende. Belanja online, kirim ke collecting, kami
                            konsolidasi dan kirim ke Ende.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[var(--on-brand)]">
                            Navigasi
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--on-brand-muted)]">
                            {[
                                ['Beranda', '#beranda'],
                                ['Cek Ongkir', '#check-shipping'],
                                ['Fitur', '#fitur'],
                                ['Alur Pengiriman', '#alur-pengiriman'],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="transition-colors hover:text-[var(--on-brand)]"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[var(--on-brand)]">
                            Kontak
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--on-brand-muted)]">
                            <li>Surabaya (Collecting)</li>
                            <li>Ende (Pusat Jastip)</li>
                            <li>info@biwrajastip.com</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-[var(--on-brand-muted)]">
                    &copy; {new Date().getFullYear()} BiwraJastip. All rights
                    reserved.
                </div>
            </Container>
        </footer>
    );
}
