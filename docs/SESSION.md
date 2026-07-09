# Sesi — 9 Juli 2026

## Project
**BiwraJastip** — Aplikasi cargo consolidation (jastip) Laravel 13 + React 19 (Inertia v3) + Tailwind CSS v4 + Vite 8. PHP 8.3.

## Apa yang sudah dibangun

### 1. Dashboard Layout
- `DashboardLayout.tsx` — layout utama dengan sidebar + navbar
- `Sidebar.tsx` — navigasi berbasis role (customer/staff_surabaya/admin), active-link logic pakai `url.startsWith(item.href)`, dashboard exact match saja
- `Navbar.tsx` — breadcrumb, theme toggle, user menu
- `Footer.tsx` — footer sederhana

### 2. Auth
- `LoginForm.tsx` + `RegisterForm.tsx` — form login/register
- `Auth.tsx` — halaman auth layout

### 3. Pages CRUD (11 halaman Index + beberapa Form)
| Entity | Route Path | Halaman |
|--------|-----------|---------|
| Dashboard | `/dashboard` | `Index.tsx` |
| Zones | `/dashboard/zones` | `Index.tsx`, `Form.tsx` |
| Ships | `/dashboard/ships` | `Index.tsx`, `Form.tsx` |
| Schedules | `/dashboard/schedules` | `Index.tsx`, `Form.tsx` |
| Packages | `/dashboard/packages` | `Index.tsx`, `Form.tsx`, `Timbang.tsx` |
| Payments | `/dashboard/payments` | `Index.tsx` |
| Reports | `/dashboard/reports` | `Index.tsx` |
| Batches | `/dashboard/batches` | `Index.tsx` |
| Bags | `/dashboard/bags` | `Index.tsx` |
| Users | `/dashboard/users` | `Index.tsx`, `Form.tsx` |
| Roles | `/dashboard/roles` | `Index.tsx`, `Form.tsx` |

### 4. Komponen UI Kustom
- `AlertContext.tsx` — alert/notifikasi global
- `Confirm` — konfirmasi dialog
- `SelectSearch` — combobox search
- `DatePicker` — date picker
- `NumericInput` — input angka dengan format

### 5. Backend (Laravel)
- **Controllers**: ZoneController, ShipController, ScheduleController, PackageController, PaymentController, UserController, RoleController (full CRUD + Inertia)
- **FormRequests**: validation per entity
- **Routes**: grouped under `auth` + role middleware (`role:customer`, `role:staff_surabaya`, `role:admin`)
- **BiwraHub API**: `BiwraHubController.php` — 12 endpoint di `/api/biwrahub/*` dengan `auth:sanctum`
- **Seeders**: 5 akun: admin@mail.com, staff@mail.com, staf2@mail.com, customer@mail.com, customer2@mail.com (pass: password)

### 6. Migrations
Semua migrasi sudah dijalankan & database tables exist. Role-based permissions via Spatie Permission (`config/permission.php`).

## Konvensi Penting

### Naming
- Semua code/naming = **English** (file, folder, DB, variable, function, class)
- Hanya UI labels & validation messages = **Bahasa Indonesia**

### Route Binding
- Semua model pakai **UUID** (`Model::getRouteKeyName()` return `uuid`)
- Frontend pass UUID, bukan numeric ID

### Route `route()` di Frontend
- **TIDAK ADA** global `route()` function di JS
- Semua URL ditulis langsung sebagai string: `'/dashboard/zones/' + zone.uuid`

### Volumetric Formula
```
ceil(L × W × H / 6000) * 1000  → hasil dalam gram
final_weight = max(actual_weight, volumetric)
shipping_cost = ceil((tarif_per_kg × final_weight / 1000) + biaya_antar)
```

### Role-Based Access
- Middleware: `role:customer`, `role:staff_surabaya`, `role:admin` via `routes/web.php`
- Sidebar menu difilter via `roleNav` map di `DashboardLayout.tsx`
- Frontend permission check: `useCan('entity.action')` dari `@/lib/permissions`

### CSS
- Zero border radius everywhere
- CSS custom properties, jangan pernah pakai raw hex
- Dark mode automatic via CSS variables
- Font: Instrument Sans (body), Gabarito (heading)
- Tailwind v4 + `prettier-plugin-tailwindcss` (class sorting otomatis)

### Form Requests
Di Form halaman Index, method submit selalu pake `router.post()` (Inertia) dengan `_method: 'PUT'` untuk update.

## Tipe Casting
Di frontend, props dari Inertia dicasting dengan pola:
```tsx
const { data } = (usePage().props as unknown) as { data: SomeType };
```
Bukan `as SomeType` langsung.

## Key Commands
```bash
composer dev           # full dev stack
npm run lint           # ESLint auto-fix
npm run types:check    # tsc --noEmit
npm run format         # Prettier
php artisan test       # Pest (SQLite in-memory)
composer ci:check      # full pipeline
```

## Status
- ✅ Lint, format, types: PASS
- ✅ PHPStan level 7: PASS (pre-existing errors only)
- ✅ Tests: PASS
- ✅ Migrations & seeders: applied

## Catatan untuk sesi berikutnya
- Tambah test feature untuk endpoint baru
- Integrasi payment gateway
- Dashboard widget/statistik homepage
- Filter & sorting di Index pages
- Batch processing untuk packages
- Real-time notification via Reverb
