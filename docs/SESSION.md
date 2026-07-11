# Sesi

## 11 Juli 2026

### Payment Flow
- **Upload bukti:** kompresi GD (1920px, JPEG quality 70) di `PaymentController::compressAndStore()`
- **Status flow:** `pending` → `verified` / `rejected` (cek resubmit saat pending, izinkan ulang saat rejected)
- **Admin actions:** verifikasi & tolak dengan alasan (modal textarea)
- `Payment.php` — proofImage accessor auto `Storage::url`
- **QRIS** di halaman bayar masih placeholder

### Print Pages (Receipt, Label, Manifest)
- Semua hapus `DashboardLayout` — standalone pages tanpa sidebar, dibuka via `target="_blank"`
- `PrintableDocument.tsx` — reusable wrapper: `@page`, `@media print`, 3 ukuran (thermal/a6/a4)
- Fix `QRCode` → `QRCodeSVG` di ketiga print page

### Pricing & Weight Fixes
- Hilangkan `.00` desimal: cast `decimal:2` → `float` di Package, Zone, Payment, Bag
- **Shipping cost:** hapus `ceil(weightKg / 0.6) * 0.6` — sekarang pakai `ceil(tarif_per_kg × final_weight / 1000) + delivery_fee`
- Tampilkan berat volumetrik (unrounded, 3 desimal) + berat aktual di kalkulasi Weigh
- **Bag weight:** dihitung dari sum `final_weight` package saat bagging (`BiwraHubController`)

### Tracking & Index Pages
- `tracking_number_biwra` auto-generated (`BWR` + ID pad 8 digit) saat package dibuat
- Bag & Batch Index: controller fetch + paginate data, frontend tabel lengkap
- **SearchFilters component** (search input + date from/to DatePicker + year dropdown)
- **HasFilters trait** — `applyFilters()` search LIKE + date filter + year filter
- Search + date filter di **semua** index pages: Bags, Batches, Payments, Users, Roles, Zones, Ships, Schedules, Packages
- FULLTEXT search 500 error: try-catch fallback ke `LIKE`
- **DatePicker:** tambah year selector dropdown

### Scope & Permissions
- Package scope (existing): `packages.scope.own/collected/transit/all`
- **Bag scope (baru):** `bags.scope.own` (staff_surabaya), `bags.scope.unbagged` (staff_ende), `bags.scope.all` (admin/owner)
- **Batch scope (baru):** `batches.scope.own` (staff_surabaya), `batches.scope.unbatched` (staff_ende), `batches.scope.all` (admin/owner)
- `BagController` & `BatchController` pakai permission-based scope resolution (sama pattern dengan `PackageController`)
- **Role edit 403:** tambah `roles.create`, `roles.update`, `roles.delete` di seeder + assign ke admin & owner

### Layout
- Dashboard content rata kiri (`#dashboard-content` + CSS override)

### Files Baru / Diubah
- `app/Http/Controllers/PaymentController.php` — verify/reject + compressAndStore
- `app/Http/Controllers/Traits/HasFilters.php` — trait baru
- `resources/js/components/ui/SearchFilters.tsx` — komponen baru
- `resources/js/components/ui/DatePicker.tsx` — tambah year dropdown
- `resources/js/components/print/PrintableDocument.tsx` — komponen baru
- `resources/js/pages/dashboard/payments/Form.tsx` — upload + status-aware
- `resources/js/pages/dashboard/payments/Index.tsx` — verify/reject actions
- `resources/js/pages/dashboard/packages/Receipt.tsx`, `bags/Label.tsx`, `batches/Manifest.tsx` — standalone print
- `database/seeders/RolePermissionSeeder.php` — scope perms + roles CRUD

---

## 10 Juli 2026

## Project
**BiwraJastip** — Aplikasi cargo consolidation (jastip) Laravel 13 + React 19 (Inertia v3) + Tailwind CSS v4 + Vite 8. PHP 8.3.

## Yang sudah dibangun

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
| Packages | `/dashboard/packages` | `Index.tsx`, `Form.tsx`, `Weigh.tsx`, `Receipt.tsx` |
| Payments | `/dashboard/payments` | `Index.tsx`, `Form.tsx` |
| Reports | `/dashboard/reports` | `Index.tsx` |
| Batches | `/dashboard/batches` | `Index.tsx`, `Manifest.tsx` |
| Bags | `/dashboard/bags` | `Index.tsx`, `Label.tsx` |
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
- **BiwraHub API**: `BiwraHubController.php` — 14 endpoint di `/api/biwrahub/*` dengan `auth:sanctum`
- **Seeders**: 5 akun: admin@mail.com, staff@mail.com, staf2@mail.com, customer@mail.com, customer2@mail.com (pass: password)

### 6. Migrations
Semua migrasi sudah dijalankan & database tables exist. Role-based permissions via Spatie Permission (`config/permission.php`).

## Package Status Flow

```
waiting_for_collection → collected → waiting_for_payment → paid → bagging
→ batched → heading_to_port → at_port → in_transit → arrived
→ arrived_at_warehouse → ready_for_sorting → ready_for_pickup / in_delivery
→ completed
```

### BiwraHub Endpoints
| Action | Method | Path | Status Change |
|--------|--------|------|---------------|
| Collecting | POST | `/collecting` | → `collected` |
| Bagging | POST | `/bagging` | → `bagging`, Bag: `created` |
| Batching | POST | `/batching` | → `batched`, Bag: `in_batch`, Batch: `preparing` |
| Send to Port | POST | `/send-to-port` | → `heading_to_port` |
| Arrive at Port | POST | `/arrive-at-port` | → `at_port` |
| Ship Depart | POST | `/ship-depart` | → `in_transit`, Batch: `departed` |
| Ship Arrive | POST | `/ship-arrive` | → `arrived`, Batch: `arrived` |
| Unbatching | POST | `/unbatching` | → `arrived_at_warehouse`, Batch: `unbatched` |
| Unbagging | POST | `/unbagging` | → `ready_for_sorting`, Bag: `unbagged` |
| Sorting | POST | `/sorting` | → `ready_for_pickup` / `in_delivery` |
| Ending | POST | `/ending` | → `completed` |

## Naming & Code Conventions
- **Semua code = English** — enums, API routes, controller methods, DB columns, variabel, fungsi, filename
- **Hanya UI labels & validation messages = Bahasa Indonesia**
- ✅ Enum values sudah English (batched, heading_to_port, at_port, arrived_at_warehouse, ready_for_pickup, in_delivery, completed)
- ✅ API routes English (send-to-port, arrive-at-port, ship-depart, ship-arrive)
- ✅ Zone column `is_central` (ex `is_pusat`)
- ✅ `Weigh.tsx` (ex `Timbang.tsx`)

## Safety Fixes (BiwraHubController)
- ✅ **Transactions** — `bagging()`, `batching()`, `sendToPort()`, `arriveAtPort()`, `shipDepart()`, `shipArrive()`, `unbatching()`, `unbagging()` dibungkus `DB::transaction()`
- ✅ **Row locking** — `lockForUpdate()` di tiap method multi-ID untuk cegah race condition
- ✅ **Bug fix unbagging** — fetch packages dulu sebelum update (sebelumnya query setelah set `bag_id = null`, return kosong)

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
- ✅ Lint, types: PASS (10 Jul)
- ✅ Tests: PASS
- ✅ Migrations & seeders: applied
- ✅ DB column `is_pusat` → `is_central`
- ✅ Enum values migrated
- ✅ Search + date filter di semua index pages
- ✅ Bag/Batch permission scope (bukan hardcoded role)
- ✅ Role edit 403 fixed (tambah perms CRUD roles)
- ✅ Print pages standalone tanpa sidebar
- ✅ Upload bukti bayar dengan kompresi GD
- ✅ Payment verify/reject flow

## Catatan untuk sesi berikutnya
- Isi placeholder QRIS di halaman bayar dengan QRIS asli
- Buat feature tests untuk BiwraHub endpoints
- Pastikan fitur export laporan (reports) jalan
- Cek konsistensi permission scope di seluruh BiwraHub action controller
- Dashboard widget/statistik homepage
- Real-time notification via Reverb
- Implementasi mobile BiwraHub hub
