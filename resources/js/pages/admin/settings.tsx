import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Settings, Save, Shield } from 'lucide-react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
    name: string;
    email: string;
    phone: string;
}

interface AdminSettingsProps {
    user: User;
}

export default function AdminSettings({ user }: AdminSettingsProps) {
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/settings/profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/settings/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <>
            <Head title="Pengaturan - Admin" />

            <DashboardLayout title="Pengaturan">
                <div className="p-6 md:p-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-[var(--heading)]">
                            Pengaturan
                        </h2>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Kelola pengaturan sistem dan akun Anda.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Settings size={18} />
                                    Profil
                                </h3>
                            </div>
                            <form
                                onSubmit={handleProfileSubmit}
                                className="p-6"
                            >
                                {profileForm.recentlySuccessful && (
                                    <div className="mb-4 border border-[var(--success-soft)] bg-[var(--success-soft)] p-3 text-sm text-[var(--fg-success-strong)]">
                                        Profil berhasil diperbarui.
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                    {profileForm.errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {profileForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                    {profileForm.errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {profileForm.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Telepon
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.phone}
                                        onChange={(e) =>
                                            profileForm.setData(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                    {profileForm.errors.phone && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {profileForm.errors.phone}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={profileForm.processing}
                                >
                                    <Save size={16} />
                                    {profileForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Profil'}
                                </Button>
                            </form>
                        </motion.div>

                        <motion.div
                            className="border border-[var(--border-default)] bg-[var(--neutral-primary-soft)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="border-b border-[var(--border-default)] px-6 py-4">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--heading)]">
                                    <Shield size={18} />
                                    Keamanan
                                </h3>
                            </div>
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="p-6"
                            >
                                {passwordForm.recentlySuccessful && (
                                    <div className="mb-4 border border-[var(--success-soft)] bg-[var(--success-soft)] p-3 text-sm text-[var(--fg-success-strong)]">
                                        Kata sandi berhasil diubah.
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Kata Sandi Saat Ini
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            passwordForm.data.current_password
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {
                                                passwordForm.errors
                                                    .current_password
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Kata Sandi Baru
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="mb-1.5 block text-sm font-medium text-[var(--heading)]">
                                        Konfirmasi Kata Sandi
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            passwordForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] px-4 py-2.5 text-sm text-[var(--heading)] outline-none focus:border-[var(--fg-brand-strong)]"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={passwordForm.processing}
                                >
                                    <Save size={16} />
                                    {passwordForm.processing
                                        ? 'Menyimpan...'
                                        : 'Ubah Kata Sandi'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
