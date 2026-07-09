# Role & Permission Design

## Permission Types

| Type       | Format                   | Fungsi                                   |
| ---------- | ------------------------ | ---------------------------------------- |
| **CRUD**   | `{entity}.{action}`      | Aksi dasar: view, create, update, delete |
| **Action** | `{entity}.{action}`      | Aksi tambahan: print, verify             |
| **Scope**  | `{entity}.scope.{range}` | Range data yang bisa dilihat             |

---

## Permission Matrix

### Packages

| Permission                 | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------------------- | -------- | -------------- | ---------- | ----- | ----- |
| `packages.view`            | ✅       | ✅             | ✅         | ✅    | -     |
| `packages.create`          | ✅       | -              | -          | ✅    | -     |
| `packages.update`          | ✅       | ✅             | ✅         | ✅    | -     |
| `packages.delete`          | -        | -              | -          | ✅    | -     |
| `packages.print`           | -        | ✅             | -          | ✅    | -     |
| `packages.scope.own`       | ✅       | -              | -          | -     | -     |
| `packages.scope.collected` | -        | ✅             | -          | -     | -     |
| `packages.scope.transit`   | -        | -              | ✅         | -     | -     |
| `packages.scope.all`       | -        | -              | -          | ✅    | ✅    |

### Bags

| Permission    | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ------------- | -------- | -------------- | ---------- | ----- | ----- |
| `bags.view`   | -        | ✅             | ✅         | ✅    | -     |
| `bags.create` | -        | ✅             | -          | ✅    | -     |
| `bags.update` | -        | ✅             | -          | ✅    | -     |
| `bags.delete` | -        | -              | -          | ✅    | -     |
| `bags.print`  | -        | ✅             | -          | ✅    | -     |

### Batches

| Permission       | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ---------------- | -------- | -------------- | ---------- | ----- | ----- |
| `batches.view`   | -        | ✅             | ✅         | ✅    | -     |
| `batches.create` | -        | ✅             | -          | ✅    | -     |
| `batches.update` | -        | ✅             | -          | ✅    | -     |
| `batches.delete` | -        | -              | -          | ✅    | -     |
| `batches.print`  | -        | ✅             | -          | ✅    | -     |

### Payments

| Permission        | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ----------------- | -------- | -------------- | ---------- | ----- | ----- |
| `payments.view`   | ✅       | -              | -          | ✅    | -     |
| `payments.verify` | -        | -              | -          | ✅    | -     |

### Ships

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `ships.view`   | -        | -              | -          | ✅    | -     |
| `ships.create` | -        | -              | -          | ✅    | -     |
| `ships.update` | -        | -              | -          | ✅    | -     |
| `ships.delete` | -        | -              | -          | ✅    | -     |

### Schedules

| Permission         | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ------------------ | -------- | -------------- | ---------- | ----- | ----- |
| `schedules.view`   | -        | -              | -          | ✅    | -     |
| `schedules.create` | -        | -              | -          | ✅    | -     |
| `schedules.update` | -        | -              | -          | ✅    | -     |
| `schedules.delete` | -        | -              | -          | ✅    | -     |

### Zones

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `zones.view`   | ✅       | -              | -          | ✅    | -     |
| `zones.create` | -        | -              | -          | ✅    | -     |
| `zones.update` | -        | -              | -          | ✅    | -     |
| `zones.delete` | -        | -              | -          | ✅    | -     |

### Users

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `users.view`   | -        | -              | -          | ✅    | ✅    |
| `users.create` | -        | -              | -          | ✅    | ✅    |
| `users.update` | -        | -              | -          | ✅    | ✅    |
| `users.delete` | -        | -              | -          | ✅    | ✅    |

### Roles

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `roles.view`   | -        | -              | -          | ✅    | ✅    |
| `roles.manage` | -        | -              | -          | ✅    | ✅    |

### Reports

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `reports.view` | -        | -              | -          | ✅    | ✅    |

---

## Scope Rules (Backend Logic)

### Package Scope

| Scope                      | Query Filter                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages.scope.own`       | `WHERE user_id = auth()->id()`                                                                                                             |
| `packages.scope.collected` | `WHERE status IN ('collected', 'waiting_for_payment', 'paid', 'bagging')`                                                                  |
| `packages.scope.transit`   | `WHERE status IN ('berangkat_ke_pelabuhan', 'in_transit', 'arrived', 'ready_for_sorting', 'siap_diambil', 'dalam_pengantaran', 'selesai')` |
| `packages.scope.all`       | No filter                                                                                                                                  |

### Bag Scope

| Role           | Query Filter                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Staff Surabaya | `WHERE created_by = auth()->id()` atau `WHERE batch_id IN (SELECT id FROM batches WHERE created_by = auth()->id())` |
| Staff Ende     | `WHERE status = 'unbagged'`                                                                                         |
| Admin          | No filter                                                                                                           |

### Batch Scope

| Role           | Query Filter                      |
| -------------- | --------------------------------- |
| Staff Surabaya | `WHERE created_by = auth()->id()` |
| Staff Ende     | `WHERE status = 'unbatched'`      |
| Admin          | No filter                         |

---

## Conditional Actions

| Action         | Condition                                                        | Permission        |
| -------------- | ---------------------------------------------------------------- | ----------------- |
| Cancel package | `status = 'waiting_for_collection'` AND `user_id = auth()->id()` | `packages.update` |
| Print receipt  | `status = 'paid'`                                                | `packages.print`  |
| Verify payment | `status = 'pending'`                                             | `payments.verify` |

---

## Default Accounts

| Account | Email                 | Password | Role  |
| ------- | --------------------- | -------- | ----- |
| Admin   | admin@biwrajastip.com | password | admin |
| Owner   | owner@biwrajastip.com | password | owner |

---

## BiwraHub Actions (via API)

| Action          | Role           | Permission                                     | Status Change                                                                     |
| --------------- | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Collecting      | Staff Surabaya | `packages.update` + `packages.scope.collected` | `waiting_for_collection` → `collected`                                            |
| Bagging         | Staff Surabaya | `bags.create`                                  | package: `paid` → `bagging`, bag: `created`                                       |
| Batching        | Staff Surabaya | `batches.create`                               | package: `bagging` → `berangkat_ke_pelabuhan`, bag: `created` → `in_batch`        |
| Kapal Berangkat | Staff Surabaya | `batches.update`                               | batch: `preparing` → `departed`, package: `berangkat_ke_pelabuhan` → `in_transit` |
| Kapal Sampai    | Staff Ende     | `batches.update`                               | batch: `departed` → `arrived`, package: `in_transit` → `arrived`                  |
| Unbatching      | Staff Ende     | `batches.update`                               | batch: `arrived` → `unbatched`                                                    |
| Unbagging       | Staff Ende     | `bags.update`                                  | bag: `in_batch` → `unbagged`, package: `arrived` → `ready_for_sorting`            |
| Sorting         | Staff Ende     | `packages.update`                              | package: `ready_for_sorting` → `siap_diambil`/`dalam_pengantaran`                 |
| Ending          | Staff Ende     | `packages.update`                              | package: → `selesai`                                                              |
