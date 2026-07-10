# Sesi — 10 Juli 2026

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
| Packages | `/dashboard/packages` | `Index.tsx`, `Form.tsx`, `Weigh.tsx` |
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
- ✅ Lint, types: PASS
- ✅ Tests: PASS
- ✅ Migrations & seeders: applied
- ✅ DB column `is_pusat` → `is_central`
- ✅ Enum values migrated

## Catatan untuk sesi berikutnya
- Tambah test feature untuk BiwraHub endpoints baru (send-to-port, arrive-at-port)
- Integrasi payment gateway
- Dashboard widget/statistik homepage
- Filter & sorting di Index pages
- Real-time notification via Reverb
- Implementasi mobile BiwraHub hub
