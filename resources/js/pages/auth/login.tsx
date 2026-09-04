import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/Button';
import { GoogleOAuthButton } from '@/components/GoogleOAuthButton';
import { TextInput } from '@/components/TextInput';
import google from '@/routes/auth/google';
import { login } from '@/routes';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.url(), {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <AuthLayout
                title="Masuk ke akun"
                subtitle="Lacak paketmu atau kelola pengiriman dari satu tempat."
            >
                <form onSubmit={submit} noValidate className="grid gap-5">
                    <TextInput
                        id="email"
                        label="Alamat email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />

                    <div className="relative">
                        <TextInput
                            id="password"
                            label="Kata sandi"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
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

                    <label className="text-body flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="h-4 w-4 shrink-0"
                        />
                        Ingat saya
                    </label>

                    <Button type="submit" fullWidth disabled={processing}>
                        Masuk
                    </Button>

                    <div className="text-body flex items-center gap-3 text-xs">
                        <span className="bg-border h-px flex-1" />
                        atau
                        <span className="bg-border h-px flex-1" />
                    </div>

                    <GoogleOAuthButton href={google.redirect.url()}>
                        Masuk dengan Google
                    </GoogleOAuthButton>

                    <p className="text-body text-center text-sm">
                        Belum punya akun?{' '}
                        <Link
                            href="/register"
                            className="text-fg-brand font-medium underline underline-offset-4 hover:no-underline"
                        >
                            Daftar gratis
                        </Link>
                    </p>
                </form>
            </AuthLayout>
        </>
    );
}
