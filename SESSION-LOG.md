# BiwraJastip — Session Log

> File ini menyimpan progres dan keputusan dari sesi development.
> Diperbarui di akhir setiap sesi signifikan.

---

## Status Proyek

Laravel 13 + React 19 (Inertia v3) — cargo consolidation service (Surabaya → Ende).
Masih dalam tahap frontend awal, belum ada database/endpoint dinamis.

---

## Yang Sudah Dikerjakan

### 1. Design System & Konfigurasi

- **Font:** Gabarito (via `laravel-vite-plugin/fonts` + Bunny CDN), weight 400–700
- **Tailwind CSS v4** dengan CSS custom properties untuk semua token warna
- **Dark mode** via `html.dark` class + localStorage, automatic via CSS tokens
- **Zero border radius** di semua komponen (DESIGN.md rule)
- **Button variants:** `primary`, `secondary`, `outline`, `ghost`, `white` — masing-masing adaptif light/dark
- File: `resources/css/app.css`, `vite.config.ts`, `resources/views/app.blade.php`

### 2. Landing Page (`welcome.tsx`)

Sections (semua `bg-[var(--brand)]`):
- **Hero** — full-screen bg image + gradient overlay, stats card, CTA buttons
- **Fitur** (`#fitur`) — 3 kartu: Mudah & Praktis, Aman & Terpercaya, Harga Terjangkau
- **Alur Pengiriman** (`#alur-pengiriman`) — 4 step cards dengan gambar
- **Cek Ongkir** (`#check-shipping`) — CTA section, link ke `/check-shipping`
- **CTA** — "Siap Kirim Barang?" + daftar button

### 3. Auth Pages

- **Route:** `/login`, `/register` (guest middleware), `/logout` (auth middleware)
- **Controller:** `AuthController` — showLogin, login, showRegister, register, logout
- **Page:** `resources/js/pages/auth/Auth.tsx` — single page dengan `mode` prop
  - Split-panel animated layout (Framer Motion `AnimatePresence`)
  - Desktop: 50/50 panel, form bergantian dengan image, slide animation kiri/kanan
  - Mobile: stacked (image atas, form bawah), slide animation atas/bawah
  - `router.visit()` dengan `preserveState` + `replace` untuk smooth switch
- **Components:** `LoginForm.tsx`, `RegisterForm.tsx` (reuse dari biwratravel style)
- **Migration:** `phone` column ditambahkan ke users table
- **User model:** Updated fillable + docblock untuk include `phone`

### 4. Cek Ongkir Page (`/check-shipping`)

- **File:** `resources/js/pages/check-shipping.tsx`
- **Route:** `Route::inertia('/check-shipping', 'check-shipping')`
- **Form:** berat (kg), dimensi P×L×T (cm), zona tujuan (dropdown)
- **Input:** semua pakai `type="text"` + `inputMode` + regex `onInput` untuk filter angka
  - Weight: regex `/[^0-9.]/g` + cegah multi-titik
  - Dimensi: regex `/[^0-9]/g` (integer only)
- **Kalkulasi:** client-side, trigger via tombol "Cari" (bukan live)
  - `berat_volumetrik = (P × L × T) / 6000`
  - `berat_final = MAX(aktual, volumetrik)`
  - `ongkir = berat_final × tarif_per_kg`
  - `total = ongkir + biaya_antar_zona`
- **Data statis:** 10 zona Ende, tarif Rp12.000/kg — belum dari database

### 5. Komponen UI

| Komponen | File | Catatan |
|----------|------|---------|
| Button | `Button.tsx` | 5 variants: primary, secondary, outline, ghost, white. 2 sizes: default, large |
| Container | `Container.tsx` | `max-w-[1152px] px-6 mx-auto` |
| Navbar | `Navbar.tsx` | Fixed, backdrop-blur, auth-aware (login/logout) |
| Footer | `Footer.tsx` | 4-column grid, brand bg |
| ThemeToggle | `ThemeToggle.tsx` | Sun/Moon icons, localStorage + prefers-color-scheme |
| LoginForm | `LoginForm.tsx` | Inertia useForm, email+password+remember |
| RegisterForm | `RegisterForm.tsx` | Inertia useForm, name+email+phone+password+confirm |

### 6. Backend

- **Auth routes** di `routes/web.php`
- **AuthController** dengan validasi, Auth::attempt, Hash::make
- **HandleInertiaRequests** middleware — share `auth.user`
- **AppServiceProvider** — CarbonImmutable, strict password (production)

### 7. Role System & Dashboard

- **Migration:** `role` column (string, default 'customer') ditambahkan ke users table
- **User model:** Constants `ROLE_CUSTOMER`, `ROLE_STAFF_SURABAYA`, `ROLE_STAFF_ENDE`, `ROLE_ADMIN`, `ROLE_OWNER` + convenience methods (`isCustomer()`, dll.)
- **RoleMiddleware** (`app/Http/Middleware/RoleMiddleware.php`) — middleware `role:customer,admin` untuk proteksi route per-role, terdaftar sebagai alias di `bootstrap/app.php`
- **DashboardController** — `index()` membaca `$user->role` dan me-render view Inertia yang sesuai
- **Route:** `GET /dashboard` (auth) → dashboard sesuai role user

### 8. Dashboard Pages (React/Inertia)

| Role | Page | File |
|------|------|------|
| Customer | Dashboard customer | `dashboard/customer.tsx` |
| Staff Surabaya | Panel staff Surabaya | `dashboard/staff-surabaya.tsx` |
| Staff Ende | Panel staff Ende | `dashboard/staff-ende.tsx` |
| Admin | Panel admin | `dashboard/admin.tsx` |
| Owner | Panel owner | `dashboard/owner.tsx` |

- **DashboardLayout** (`components/DashboardLayout.tsx`) — layout bersama dengan sidebar navigasi spesifik per-role, top bar, user info, theme toggle, logout
- **Data surface:** `data-surface="dashboard"` diterapkan di root layout
- **Styling:** compact headings (max 24-28px), token-based, zero border radius, background alternating neutral
- **Auth type:** `UserRole` type ditambahkan, `role` field di `User`, `ROLE_LABELS` mapping
- **UserFactory:** states `staffSurabaya()`, `staffEnde()`, `admin()`, `owner()` untuk seeding
- **Navbar:** tombol "Dashboard" muncul untuk user yang sudah login

---

## Konvensi Penting

### Bahasa
- **UI (visible customer):** Bahasa Indonesia — label, pesan error, validasi
- **Code (non-visible):** Bahasa Inggris — nama variabel, fungsi, class, route, file, komentar

### Input Angka
- Semua input angka wajib pakai `type="text"` (bukan `type="number"`)
- Sertakan `inputMode="decimal"` atau `inputMode="numeric"`
- Filter via `onInput` regex: `/[^0-9]/g` (integer) atau `/[^0-9.]/g` + cegah multi-titik (desimal)

### Button Variants
| Variant | Background | Text | Untuk |
|---------|-----------|------|-------|
| `primary` | brand | white | CTA utama di neutral bg |
| `secondary` | dark | white | CTA sekunder di neutral bg |
| `outline` | transparent + border | heading | Alternatif halus |
| `ghost` | transparent | body | Aksi minor |
| `white` | white | brand | Di atas brand-colored bg |

### Styling
- Semua warna pakai CSS tokens (`var(--token-name)`), tidak hex langsung
- Zero border radius (`rounded-none`) di semua komponen
- Transisi: `transition-[background-color] duration-150` untuk buttons
- Font: Gabarito untuk semua heading dan body
- Landing page sections: semua `bg-[var(--brand)]`, tidak ada alternating neutral

---

## File Structure

```
resources/
├── css/app.css                          # Design tokens (light + dark)
├── views/app.blade.php                  # Inertia root template + @fonts
├── js/
│   ├── app.tsx                          # Inertia bootstrap
│   ├── components/
│   │   ├── Button.tsx                   # 5 variants, 2 sizes
│   │   ├── Container.tsx                # Max-width wrapper
│   │   ├── DashboardLayout.tsx          # Sidebar layout for dashboard pages
│   │   ├── Navbar.tsx                   # Fixed nav, auth-aware
│   │   ├── Footer.tsx                   # Brand bg footer
│   │   ├── ThemeToggle.tsx              # Dark/light toggle
│   │   ├── LoginForm.tsx                # Login form component
│   │   └── RegisterForm.tsx             # Register form component
│   ├── pages/
│   │   ├── welcome.tsx                  # Landing page
│   │   ├── auth/Auth.tsx                # Animated auth (login+register)
│   │   ├── check-shipping.tsx           # Cek ongkir page
│   │   └── dashboard/
│   │       ├── customer.tsx             # Customer dashboard
│   │       ├── staff-surabaya.tsx       # Staff Surabaya panel
│   │       ├── staff-ende.tsx           # Staff Ende panel
│   │       ├── admin.tsx                # Admin panel
│   │       └── owner.tsx                # Owner panel
│   └── types/
│       ├── auth.ts                      # User + Auth types + UserRole
│       ├── global.d.ts                  # Module augmentation
│       └── index.ts                     # Re-export
├── routes/web.php                       # Home, auth, check-shipping, dashboard
├── app/Http/Controllers/AuthController.php
├── app/Http/Controllers/DashboardController.php  # Role-based dashboard routing
├── app/Http/Middleware/RoleMiddleware.php          # Role check middleware
├── app/Models/User.php                  # +phone, +role field + constants
└── database/migrations/
    ├── 2026_07_06_000001_add_phone_to_users_table.php
    └── 2026_07_07_000001_add_role_to_users_table.php
```

---

## Yang Belum / Perlu Dikerjakan

- [ ] Database seeder untuk zona + tarif (ganti hardcode di check-shipping)
- [ ] API endpoint untuk kalkulasi ongkir (saat ini client-side)
- [ ] Landing page: social proof / testimonials section
- [x] Dashboard customer (setelah login)
- [ ] Form input paket (customer)
- [x] Dashboard staff Surabaya
- [x] Dashboard staff Ende
- [x] Dashboard admin
- [x] Dashboard owner
- [x] Role-based middleware (customer, staff, admin, owner)
- [ ] QR code generation untuk paket
- [ ] Notifikasi (WA/email/in-app)
- [ ] Upload foto barang
- [ ] Integrasi payment gateway

---

## Referensi

- **biwratravel** (`C:\herd\biwratravel`) — referensi untuk auth page animated panel, button system, font loading, dark mode setup
- **DESIGN.md** — design system spec (colors, typography, components, sections)
- **LOGIC.md** — business logic reference (alur paket, aturan bisnis, roles)

---

## Catatan Teknis

- Vite dev server perlu restart setelah install package baru
- Clear cache: hapus `node_modules/.vite` lalu restart
- `.npmrc` ada `ignore-scripts=true`
- React Compiler aktif via Babel plugin (experimental)
- Wayfinder generate routes otomatis ke `resources/js/routes/` dan `resources/js/actions/`
- PHPStan level 7, password strict di production
