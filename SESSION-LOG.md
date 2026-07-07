# BiwraJastip — Session Log

## Current State (2026-07-07)

### Design System
- Tailwind CSS v4, zero border radius, dark mode via localStorage
- Gabarito font, Instrument Sans (body), bold/energetic style
- CSS custom properties for colors, Bahasa Indonesia for UI labels
- lucide-react icons, Framer Motion animations
- Number inputs: `type="text"` + `inputMode="numeric"` + regex filter

### Tech Stack
- Laravel 13.18.1, PHP 8.4, React 19.2.7, Inertia v3
- Spatie laravel-permission v8.3.0 (guard: `web`)
- Vite 8, Wayfinder, Laravel Reverb
- SQLite in-memory for tests, MySQL for dev
- PHPStan level 7, React Compiler (Babel)

### Database Tables
- `users` — with Spatie roles
- `packages` — core table (see schema below)
- `zones` — 14 Ende zones seeded
- `batches` — batch shipping
- `model_has_roles`, `model_has_permissions`, `roles`, `permissions`

### Packages Table Schema (post-migration)
```
id, user_id, tracking_code, sender_name, sender_store, sender_tracking_number,
recipient_name, recipient_phone, zone_id,
weight_estimated, length_estimated, width_estimated, height_estimated, volumetric_estimated,
length, width, height, weight_actual, volumetric_actual, final_weight,
shipping_cost, delivery_fee, total_cost, status, bag_id, notes,
payment_proof, paid_at,
created_at, updated_at
```

**Key design decision:** `length_estimated/width_estimated/height_estimated` are customer's input. `length/width/height` are staff's actual input. They do NOT overwrite each other.

### Roles & Permissions
- `customer` — register packages with estimated data
- `staff_surabaya` — receive physical packages, weigh & measure
- `staff_ende` — NOT YET BUILT
- `admin` — manage all data
- `owner` — NOT YET BUILT

### Sample Users (password: `password`)
- admin@admin.com (admin)
- surabaya@biwrajastip.com (staff_surabaya)
- customer@biwrajastip.com (customer)

### Package Status Flow
```
waiting_for_collection → collected → waiting_for_payment → (customer uploads proof)
→ paid (admin confirms) → bagging
→ berangkat_ke_pelabuhan → di_kapal → tiba_di_ende → disortir
→ siap_diambil / dalam_pengantaran → selesai
```

### Volumetric Weight Formula
```
volumetric = ceil(P × L × T / 6000)   // in grams
final_weight = max(actual_weight, volumetric)
shipping_cost = ceil((tarif_per_kg × final_weight / 1000) + biaya_antar)
```
- Applies to BOTH estimated (customer input) AND actual (staff input)
- `tarif_per_kg` is stored per-zone in grams
- `biaya_antar` is flat delivery fee per-zone

---

## What's Built & Working

### Landing & Auth
- `welcome.tsx` — landing page
- `check-shipping.tsx` — Cek Ongkir page
- Auth (login/register) — `AuthController`
- Logout

### Spatie Permission Integration
- Config, middleware aliases, `HasRoles` trait on User model
- `RolePermissionSeeder` — creates roles, permissions, sample users
- Middleware `role:` in `HandleInertiaRequests` via `roleNav` map
- `useRole()`, `useHasRole()`, `useCan()` in `resources/js/lib/permissions.ts`

### Design System Components
- `Button.tsx` — variants: primary, secondary, danger, ghost
- `ThemeToggle.tsx` — dark/light mode
- `Container.tsx`, `Footer.tsx`, `Navbar.tsx`
- `EmptyState.tsx` — centered empty state with illustration
- `EmptyIllustrations.tsx` — custom SVGs: PackageEmpty, BatchEmpty, ZoneEmpty, UserEmpty, ReportEmpty, ShipEmpty, SettingsEmpty
- `DashboardLayout.tsx` — role-based sidebar via `roleNav`, mobile hamburger menu

### Admin Menu (all connected to backend)
- **Packages** (`admin/packages.tsx`) — list, search, create modal, edit modal, delete, status badges, pagination
- **Batches** (`admin/batches.tsx`) — list, create, delete, status badges
- **Zones** (`admin/zones.tsx`) — list, create, edit, delete
- **Users** (`admin/users.tsx`) — list, create, edit, delete, search
- **Reports** (`admin/reports.tsx`) — stats cards
- **Settings** (`admin/settings.tsx`) — profile + password

### Admin Backend
- `Admin\PackageController` — CRUD + search + pagination
- `Admin\BatchController` — CRUD
- `Admin\ZoneController` — CRUD
- `Admin\UserController` — CRUD
- `Admin\ReportController` — index
- `Admin\SettingController` — index, updateProfile, updatePassword

### Dashboard
- `DashboardController` — role-based: customer/staff_surabaya/admin
- `dashboard/admin.tsx` — real stats from DB
- `dashboard/customer.tsx` — stat cards + quick actions
- `dashboard/staff-surabaya.tsx` — stat cards + quick actions

### Customer Flow ✅
- `Customer\PackageController` — index, create, store, show
- `customer/packages.tsx` — list with status colors, pagination, empty state
- `customer/create-package.tsx` — form: recipient info, store tracking number, estimated weight/dimensions, zone select, live cost estimate sidebar with volumetric calculation
- `customer/show-package.tsx` — detail page: estimated vs actual comparison table with volumetric breakdown

### Staff Surabaya Flow ✅
- `StaffSurabaya\PackageController` — index (with tab filter), collect, showWeigh, weigh, printReceipt
- `staff-surabaya/packages.tsx` — full package list with 5 tabs (menunggu/dikumpulkan/menunggu bayar/lunas/dikirim), stat cards per tab, action buttons per status
- `staff-surabaya/weigh.tsx` — weigh form: live volumetric weight calculation + price computation, shows customer's estimated data for reference
- `staff-surabaya/print-receipt.tsx` — printable receipt page for `paid` packages

### Payment Flow ✅
- Customer uploads payment proof on `/customer/packages/{package}/pay` (Customer\PaymentController)
- Payment info: Bank BCA, Bank Mandiri, QRIS (static for now)
- File upload stored in `storage/app/public/payment-proofs/`
- Admin confirms payment via `/admin/packages/{package}/confirm-payment` → status `paid`, `paid_at` set
- `payment_proof` + `paid_at` columns via migration

---

## What's NOT Built Yet

### Staff Ende
- No controller, no pages, no routes
- Needs: view incoming packages, update status (received at Ende), delivery flow

### Owner
- No dashboard, no controller
- Needs: overview dashboard, reports, possibly batch management

### Batch-to-Package Linking
- Batches exist but aren't linked to packages
- Needs: assign packages to batch, batch status updates propagate

### QR Code on Receipt
- Print receipt exists but no QR code/barcode on it yet

### Auto-assignment to Batch
- Packages don't auto-join batches
- Needs: batch assignment logic

---

## Key Files

### Backend
```
app/Http/Controllers/
├── AuthController.php
├── DashboardController.php
├── Customer/
│   ├── PackageController.php
│   └── PaymentController.php
├── StaffSurabaya/PackageController.php
└── Admin/
    ├── PackageController.php (includes confirmPayment)
    ├── BatchController.php
    ├── ZoneController.php
    ├── UserController.php
    ├── ReportController.php
    └── SettingController.php

app/Models/
├── User.php (HasRoles trait)
├── Package.php (calculateVolumetric, calculateFinalWeight, generateTrackingCode)
├── Zone.php
└── Batch.php (generateCode, status_label)

app/Http/Middleware/HandleInertiaRequests.php
├── shares auth user, role, permissions

database/seeders/
├── ZoneSeeder.php (14 Ende zones)
└── RolePermissionSeeder.php (roles, permissions, sample users)

routes/web.php
├── Auth routes (guest)
├── Dashboard route (auth)
├── Customer routes (role:customer, /customer/*)
│   ├── Package CRUD
│   └── Payment (pay + upload proof)
├── Staff Surabaya routes (role:staff_surabaya, /staff/surabaya/*)
│   ├── Packages list (tab filter), collect, weigh
│   └── Print receipt (for paid packages)
└── Admin routes (role:admin, /admin/*)
    ├── CRUD packages, batches, zones, users
    └── confirmPayment
```

### Frontend
```
resources/js/
├── app.tsx (entry)
├── components/
│   ├── Button.tsx
│   ├── Container.tsx
│   ├── DashboardLayout.tsx (role-based sidebar)
│   ├── EmptyIllustrations.tsx
│   ├── EmptyState.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── RegisterForm.tsx
│   ├── LoginForm.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── permissions.ts (useAuth, useRole, useHasRole, useCan, etc.)
│   └── utils.ts
├── pages/
│   ├── welcome.tsx
│   ├── check-shipping.tsx
│   ├── auth/Auth.tsx
│   ├── dashboard/
│   │   ├── admin.tsx
│   │   ├── customer.tsx
│   │   └── staff-surabaya.tsx
│   ├── customer/
│   │   ├── packages.tsx
│   │   ├── create-package.tsx
│   │   ├── show-package.tsx (includes Bayar button + estimated cost breakdown)
│   │   └── payment.tsx (bank info + upload proof)
│   ├── staff-surabaya/
│   │   ├── packages.tsx (tab filter, full status colors, action per status)
│   │   ├── weigh.tsx
│   │   └── print-receipt.tsx (printable receipt for paid packages)
│   └── admin/
│       ├── packages.tsx (includes Konfirmasi Bayar button)
│       ├── batches.tsx
│       ├── zones.tsx
│       ├── users.tsx
│       ├── reports.tsx
│       └── settings.tsx
└── types/
    ├── auth.ts
    ├── global.d.ts
    ├── index.ts
    └── vite-env.d.ts
```

---

## Commands

```bash
composer dev                    # Full dev stack
composer lint / lint:check      # PHP Pint
composer types:check            # PHPStan level 7
composer ci:check               # Full CI (lint + format + types + test)

npm run lint / lint:check       # ESLint
npm run format / format:check   # Prettier
npm run types:check             # tsc --noEmit

php artisan test                # Pest (SQLite in-memory)
php artisan migrate             # Run migrations
```

---

## Design Decisions Log

1. **Customer creates packages, admin does NOT** — per LOGIC.md, customer shops online → ships to Surabaya address → staff consolidates
2. **`sender_tracking_number`** = store/expedition tracking number (NOT system tracking code `BWJ-XXXXXXXX`)
3. **Dimensi tidak di-overwrite** — customer isi di `length_estimated/width_estimated/height_estimated`, staff isi di `length/width/height`
4. **Volumetric applies to both** — rumus yang sama untuk estimasi dan aktual. **Harus dalam gram** (konversi ×1000 dari hasil `P×L×T/6000`)
5. **Harga = `ceil((tarif_per_kg × final_weight / 1000) + biaya_antar)`** — `tarif_per_kg` dalam gram
6. **Role-based sidebar** — `roleNav` object maps each role to its menu items
7. **Mobile responsive** — hamburger menu with slide-in sidebar for DashboardLayout
8. **Per-role dashboards** — customer/staff_surabaya/admin each have their own dashboard view
9. **Payment confirmation by admin ONLY** — staff_surabaya can collect, weigh, and print receipt, but cannot confirm payment
10. **Customer uploads payment proof** — no payment gateway integration; manual transfer with proof upload. Bank info static for now

---

## Session 2026-07-07 — Fix Link 404 (Uncommitted)

### Problem
`Package` model uses `getRouteKeyName()` returning `'uuid'` for implicit route model binding, but frontend pages sent numeric `id` instead of `uuid` in URL paths, causing 404 errors.

### Fixed Files (working tree, NOT committed)
- **`customer/packages.tsx`**: Changed `router.get('/customer/packages/${pkg.id}')` → `${pkg.uuid}`. Added `uuid` to `PackageItem` interface.
- **`staff-surabaya/packages.tsx`**: Changed all `pkg.id` → `pkg.uuid` in `collect`, `weigh`, and `print` URL paths. Added `uuid` + missing fields to `PackageItem`. Added 5-tab filter, stat cards, pagination, status colors.
- **`staff-surabaya/weigh.tsx`**: Changed `post('/staff/surabaya/packages/${pkg.id}/weigh')` → `${pkg.uuid}`. Added `uuid` to interface. Fixed volumetric formula: `Math.ceil(.../6000)` → `Math.ceil(.../6000) * 1000`.

### New Files Added (untracked, NOT committed)
- `PaymentController.php` — `showPayment()` + `uploadProof()`
- `customer/payment.tsx` — bank info + upload proof page
- `staff-surabaya/print-receipt.tsx` — printable receipt for `paid` packages
- Migration: `add_payment_fields_to_packages_table` (`payment_proof`, `paid_at`)
- Migration: `add_uuid_and_fulltext_to_tables` (uuid columns + fulltext index)

### Routes Added (uncommitted)
- `customer.packages.pay` — GET `/customer/packages/{package}/pay`
- `customer.packages.pay.upload` — POST `/customer/packages/{package}/pay`
- `staff-sby.packages.print` — GET `/staff/surabaya/packages/{package}/print`
- `admin.packages.confirm-payment` — PUT `/admin/packages/{package}/confirm-payment`

### Key Insight
Always check that frontend URL parameters match the model's route key (uuid vs id). The `PackageItem` interface in every page must include `uuid` field.

---

## Next Session Checklist

When continuing, ask user:
1. Which role to build next? (staff_ende, owner, or something else)
2. Want to build batch-to-package linking?
3. Want to add QR code generation? (barcode on receipt)
