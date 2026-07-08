# Session Log — 2026-07-08

## URL Refactoring: Role-Free Clean URLs

### Goal
Remove all role prefixes (`/admin/`, `/staff/surabaya/`, `/staff/ende/`, `/customer/`) from web URLs. Role middleware handles access control — URLs should never expose role names. If role names change in the future, only middleware config changes; zero URL changes needed.

### What Changed

**Routes (`routes/web.php`)** — Complete rewrite:
- All list pages use clean dispatch via `DashboardController`: `/packages`, `/bags`, `/batches`
- Shared detail routes: `/bags/{bag}`, `/batches/{batch}` (any authenticated user)
- All CRUD actions under clean paths: `/packages`, `/bags`, `/batches`, `/zones`, `/users`, `/reports`, `/settings`
- Role middleware (`role:admin`, `role:staff_surabaya`, `role:customer`) applied per-route
- Closures for disambiguation where multiple roles share a path (e.g., `/packages` POST for customer create vs admin create)

**DashboardController (`app/Http/Controllers/DashboardController.php`)**:
- Added `packages()`, `bags()`, `batches()` methods that dispatch to role-specific controllers based on user role

**ItemController (`app/Http/Controllers/ItemController.php`)**:
- Shared bag/batch detail pages — renders `shared/bag-detail.tsx` and `shared/batch-detail.tsx`

**Shared Pages**:
- `resources/js/pages/shared/bag-detail.tsx` — bag detail (any role)
- `resources/js/pages/shared/batch-detail.tsx` — batch detail (any role)

**15 page files updated** (38 occurrences total):

| File | Changes |
|------|---------|
| `admin/zones.tsx` | 3 URLs |
| `admin/users.tsx` | 6 URLs |
| `admin/settings.tsx` | 2 URLs |
| `admin/packages.tsx` | 4 URLs |
| `admin/batches.tsx` | 2 URLs |
| `admin/bags.tsx` | 2 URLs (+ added Eye icon button) |
| `staff-surabaya/packages.tsx` | 3 URLs |
| `staff-surabaya/weigh.tsx` | 1 URL |
| `staff-surabaya/batches.tsx` | 1 URL |
| `staff-surabaya/bags.tsx` | 1 URL |
| `dashboard/customer.tsx` | 2 URLs |
| `customer/show-package.tsx` | 2 URLs |
| `customer/payment.tsx` | 3 URLs |
| `customer/create-package.tsx` | 2 URLs |
| `customer/packages.tsx` | 4 URLs |

**Sidebar (`DashboardLayout.tsx`)** — all roles now use clean URLs:
- customer: `/packages`
- staff_surabaya: `/packages`, `/bags`, `/batches`
- staff_ende: `/batches`
- admin: `/packages`, `/bags`, `/batches`, `/zones`, `/users`, `/reports`, `/settings`

### Final URL Map

| Path | Methods | Access |
|------|---------|--------|
| `/dashboard` | GET | any authenticated |
| `/packages` | GET | role-based dispatch |
| `/packages/create` | GET | customer |
| `/packages` | POST | customer (store) |
| `/packages/{package}` | GET | role-based dispatch |
| `/packages/{package}` | PUT | admin |
| `/packages/{package}` | DELETE | admin |
| `/packages/{package}/confirm-payment` | PUT | admin |
| `/packages/{package}/collect` | PUT | staff_surabaya |
| `/packages/{package}/weigh` | GET, POST | staff_surabaya |
| `/packages/{package}/print` | GET | staff_surabaya |
| `/packages/{package}/pay` | GET, POST | customer |
| `/bags` | GET | role-based dispatch |
| `/bags/{bag}` | GET | any authenticated |
| `/bags/{bag}` | DELETE | admin |
| `/bags/{bag}/print` | GET | staff_surabaya, admin |
| `/batches` | GET | role-based dispatch |
| `/batches` | POST | admin |
| `/batches/{batch}` | GET | any authenticated |
| `/batches/{batch}` | PUT, DELETE | admin |
| `/batches/{batch}/print` | GET | staff_surabaya, admin |
| `/zones` | GET, POST, PUT, DELETE | admin |
| `/users` | GET, POST, PUT, DELETE | admin |
| `/reports` | GET | admin |
| `/settings` | GET | admin |
| `/settings/profile` | PUT | admin |
| `/settings/password` | PUT | admin |

### Verification Status

- [x] PHP Lint (Pint) — PASS
- [x] JS Lint (ESLint) — PASS
- [x] TypeScript check — PASS
- [x] Prettier — PASS
- [x] Tests (Pest) — PASS (2/2)
- [ ] **Manual browser testing — NOT YET DONE**
- [ ] **Feature testing (login, collect, weigh, bag, batch, unbatch, unbag, sort) — NOT YET DONE**
- [ ] **Postman API re-test — NOT YET DONE**

### Still Needs Manual Testing

1. Login as each role → verify sidebar links work
2. Staff Surabaya: packages list → collect → weigh → print receipt
3. Staff Surabaya: bags list → detail → print bag
4. Staff Surabaya: batches list → detail → print batch
5. Staff Ende: batches list → detail → unbatch → bag detail → unbag → sort
6. Admin: packages list → confirm payment
7. Admin: bags list → detail → delete → print
8. Admin: batches list → create → update status → detail → delete → print
9. Admin: zones CRUD
10. Admin: users CRUD
11. Admin: settings profile + password
12. Customer: create package → list → show → pay
13. Role switching: login as different roles, verify correct pages load
14. Edge cases: unauthorized access returns 403 or redirects

### Previous Session Progress (Still Valid)

- Sanctum API auth working (login, logout, token-based)
- Bag & Batch models with status columns and constants
- PackageSeeder: 16 packages, 4 bags, 1 batch (status: tiba)
- All API endpoints functional (staff_surabaya, staff_ende)
- Status cascade: batch status → bag status → package status
- Postman collection updated with bearer auth + `sender_tracking_numbers`
