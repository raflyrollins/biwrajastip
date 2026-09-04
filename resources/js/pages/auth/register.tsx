import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { GoogleOAuthButton } from '@/components/GoogleOAuthButton';
import { TextInput } from '@/components/TextInput';
import google from '@/routes/auth/google';
import { register } from '@/routes';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(register.url());
    };

    return (
        <>
            <Head title="Daftar" />

            <AuthLayout
                title="Buat akun baru"
                subtitle="Mulai titip & kirim barang dari Surabaya ke Ende."
            >
                <form onSubmit={submit} noValidate className="grid gap-5">
                    <GoogleOAuthButton href={google.redirect.url()}>
                        Daftar dengan Google
                    </GoogleOAuthButton>

                    <div className="text-body flex items-center gap-3 text-xs">
                        <span className="bg-border h-px flex-1" />
                        atau
                        <span className="bg-border h-px flex-1" />
                    </div>

                    <TextInput
                        id="name"
                        label="Nama lengkap"
                        autoComplete="name"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />

                    <TextInput
                        id="email"
                        label="Alamat email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />

                    <TextInput
                        id="phone"
                        label="Nomor HP (opsional)"
                        type="text"
                        inputMode="tel"
                        autoComplete="tel"
                        hint="Hanya angka, awalan + boleh."
                        value={data.phone}
                        onChange={(e) =>
                            setData(
                                'phone',
                                (e.target.value.match(/^\+?[0-9]*$/) ?? [
                                    '',
                                ])[0],
                            )
                        }
                        error={errors.phone}
                    />

                    <div className="relative">
                        <TextInput
                            id="password"
                            label="Kata sandi"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            error={errors.password}
                            pattern=".{8,}"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="text-body hover:text-heading absolute top-9 right-3 inline-flex h-6 w-6 items-center justify-center"
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    <TextInput
                        id="password_confirmation"
                        label="Konfirmasi kata sandi"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        error={errors.password_confirmation}
                        pattern=".{8,}"
                    />

                    <Button type="submit" fullWidth disabled={processing}>
                        Daftar
                    </Button>

                    <p className="text-body text-center text-sm">
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="text-fg-brand font-medium underline underline-offset-4 hover:no-underline"
                        >
                            Masuk
                        </Link>
                    </p>
                </form>
            </AuthLayout>
        </>
    );
}
