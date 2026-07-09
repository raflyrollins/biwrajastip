# Role, Permission, & Status Flow

Dokumen ini adalah referensi tunggal untuk role, permission, scope, dan status flow aplikasi BiwraJastip. Menyatukan SCAFFOLD.md, LOGIC.md, dan ROLE_PERMISSION.md dalam satu sumber kebenaran.

---

## 1. Role Definitions

| Role               | Tanggung Jawab Utama                                                                                                         | Platform           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Customer**       | Input paket, bayar, pantau status, ambil/terima antaran                                                                      | Website            |
| **Staff Surabaya** | Terima barang fisik, timbang, hitung harga, cetak QR, bagging, batching, kelola pengiriman batch                             | Website + BiwraHub |
| **Staff Ende**     | Terima batch, sortir per paket via scan QR, kelola pengambilan/pengantaran                                                   | Website + BiwraHub |
| **Admin**          | Kelola data master (zona, tarif, kapal, jadwal), verifikasi pembayaran, kelola akun staff/customer, kelola role & permission | Website            |
| **Owner**          | Oversight bisnis: laporan performa & keuangan, kelola akun Admin                                                             | Website            |

> **Catatan:** BiwraHub adalah aplikasi mobile internal untuk operasi staff (collecting, bagging, batching, unbatching, unbagging, sorting, ending). Website adalah dashboard manajemen.

---

## 2. Permission Matrix

Format permission: `{entity}.{action}` untuk CRUD/action, `{entity}.scope.{range}` untuk scope data.

### 2.1 Packages

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

### 2.2 Bags

| Permission    | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ------------- | -------- | -------------- | ---------- | ----- | ----- |
| `bags.view`   | -        | ✅             | ✅         | ✅    | -     |
| `bags.create` | -        | ✅             | -          | ✅    | -     |
| `bags.update` | -        | ✅             | -          | ✅    | -     |
| `bags.delete` | -        | -              | -          | ✅    | -     |
| `bags.print`  | -        | ✅             | -          | ✅    | -     |

### 2.3 Batches

| Permission       | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ---------------- | -------- | -------------- | ---------- | ----- | ----- |
| `batches.view`   | -        | ✅             | ✅         | ✅    | -     |
| `batches.create` | -        | ✅             | -          | ✅    | -     |
| `batches.update` | -        | ✅             | ✅         | ✅    | -     |
| `batches.delete` | -        | -              | -          | ✅    | -     |
| `batches.print`  | -        | ✅             | -          | ✅    | -     |

### 2.4 Payments

| Permission        | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ----------------- | -------- | -------------- | ---------- | ----- | ----- |
| `payments.view`   | ✅       | -              | -          | ✅    | -     |
| `payments.verify` | -        | -              | -          | ✅    | -     |

### 2.5 Ships

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `ships.view`   | -        | -              | -          | ✅    | -     |
| `ships.create` | -        | -              | -          | ✅    | -     |
| `ships.update` | -        | -              | -          | ✅    | -     |
| `ships.delete` | -        | -              | -          | ✅    | -     |

### 2.6 Schedules

| Permission         | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ------------------ | -------- | -------------- | ---------- | ----- | ----- |
| `schedules.view`   | -        | -              | -          | ✅    | -     |
| `schedules.create` | -        | -              | -          | ✅    | -     |
| `schedules.update` | -        | -              | -          | ✅    | -     |
| `schedules.delete` | -        | -              | -          | ✅    | -     |

### 2.7 Zones

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `zones.view`   | ✅       | -              | -          | ✅    | -     |
| `zones.create` | -        | -              | -          | ✅    | -     |
| `zones.update` | -        | -              | -          | ✅    | -     |
| `zones.delete` | -        | -              | -          | ✅    | -     |

### 2.8 Users

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `users.view`   | -        | -              | -          | ✅    | ✅    |
| `users.create` | -        | -              | -          | ✅    | ✅    |
| `users.update` | -        | -              | -          | ✅    | ✅    |
| `users.delete` | -        | -              | -          | ✅    | ✅    |

### 2.9 Roles

| Permission     | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| -------------- | -------- | -------------- | ---------- | ----- | ----- |
| `roles.view`   | -        | -              | -          | ✅    | ✅    |
| `roles.manage` | -        | -              | -          | ✅    | ✅    |

### 2.10 Reports

| Permission       | Customer | Staff Surabaya | Staff Ende | Admin | Owner |
| ---------------- | -------- | -------------- | ---------- | ----- | ----- |
| `reports.view`   | -        | -              | -          | ✅    | ✅    |
| `reports.export` | -        | -              | -          | -     | ✅    |

---

## 3. Scope Rules

Scope membatasi data apa yang bisa dilihat/diakses oleh suatu role. Scope diperiksa **setelah** user memiliki permission `{entity}.view`.

### 3.1 Package Scope

| Scope                      | Role           | Query Filter                                                                                                                               |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages.scope.own`       | Customer       | `WHERE user_id = auth()->id()`                                                                                                             |
| `packages.scope.collected` | Staff Surabaya | `WHERE status IN ('collected', 'waiting_for_payment', 'paid', 'bagging')`                                                                  |
| `packages.scope.transit`   | Staff Ende     | `WHERE status IN ('berangkat_ke_pelabuhan', 'in_transit', 'arrived', 'ready_for_sorting', 'siap_diambil', 'dalam_pengantaran', 'selesai')` |
| `packages.scope.all`       | Admin, Owner   | No filter                                                                                                                                  |

### 3.2 Bag Scope

| Role           | Query Filter                                                                                              | Keterangan                                |
| -------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Staff Surabaya | `WHERE created_by = auth()->id() OR batch_id IN (SELECT id FROM batches WHERE created_by = auth()->id())` | Hanya bag yang dibuatnya sendiri          |
| Staff Ende     | `WHERE status = 'unbagged'`                                                                               | Hanya bag yang sudah tiba & siap di-unbag |
| Admin          | No filter                                                                                                 | Semua bag                                 |

### 3.3 Batch Scope

| Role           | Query Filter                      | Keterangan                                    |
| -------------- | --------------------------------- | --------------------------------------------- |
| Staff Surabaya | `WHERE created_by = auth()->id()` | Hanya batch yang dibuatnya sendiri            |
| Staff Ende     | `WHERE status = 'unbatched'`      | Hanya batch yang sudah tiba & siap di-unbatch |
| Admin          | No filter                         | Semua batch                                   |

---

## 4. Status Definitions

### 4.1 Package Status

| Status                   | Arti                                                         | Set Oleh       | Trigger                            |
| ------------------------ | ------------------------------------------------------------ | -------------- | ---------------------------------- |
| `waiting_for_collection` | Customer input paket, barang belum sampai di gudang Surabaya | Customer       | Create package                     |
| `collected`              | Barang fisik sudah diterima Staff Surabaya                   | Staff Surabaya | BiwraHub Collecting                |
| `waiting_for_payment`    | Berat & dimensi aktual sudah diinput, menunggu pembayaran    | System         | Staff input weight/dimensions      |
| `paid`                   | Pembayaran sudah diverifikasi                                | Admin          | Verify payment                     |
| `bagging`                | Sedang dimasukkan ke dalam Bag                               | System         | BiwraHub Bagging                   |
| `berangkat_ke_pelabuhan` | Bag sudah masuk Batch, menuju pelabuhan                      | System         | BiwraHub Batching                  |
| `in_transit`             | Kapal sedang berlayar ke Ende                                | System         | Kapal Berangkat (batch → departed) |
| `arrived`                | Kapal sudah tiba di Ende                                     | System         | Kapal Sampai (batch → arrived)     |
| `ready_for_sorting`      | Paket sudah dikeluarkan dari Bag, siap disortir              | System         | BiwraHub Unbagging                 |
| `siap_diambil`           | Paket siap diambil customer di pusat Ende                    | Staff Ende     | BiwraHub Sorting (zona pusat)      |
| `dalam_pengantaran`      | Paket sedang diantar ke luar kota                            | Staff Ende     | BiwraHub Sorting (zona luar)       |
| `selesai`                | Paket sudah diterima customer                                | Staff Ende     | BiwraHub Ending                    |

### 4.2 Bag Status

| Status     | Arti                                     | Set Oleh | Trigger            |
| ---------- | ---------------------------------------- | -------- | ------------------ |
| `created`  | Bag baru dibuat, paket sedang dimasukkan | System   | BiwraHub Bagging   |
| `in_batch` | Bag sudah dimasukkan ke dalam Batch      | System   | BiwraHub Batching  |
| `unbagged` | Bag sudah dibongkar di Ende              | System   | BiwraHub Unbagging |

### 4.3 Batch Status

| Status      | Arti                                | Set Oleh       | Trigger                    |
| ----------- | ----------------------------------- | -------------- | -------------------------- |
| `preparing` | Batch sedang dipersiapkan           | System         | BiwraHub Batching          |
| `departed`  | Kapal sudah berangkat dari Surabaya | Staff Surabaya | Kapal Berangkat (BiwraHub) |
| `arrived`   | Kapal sudah tiba di Ende            | Staff Ende     | Kapal Sampai (BiwraHub)    |
| `unbatched` | Batch sudah dibongkar, bag dirilis  | Staff Ende     | BiwraHub Unbatching        |

---

## 5. Status Flow Diagram

### 5.1 Package Lifecycle (Lengkap)

```
                    ┌──────────────────────────┐
                    │  waiting_for_collection   │  ← Customer create package
                    └──────────┬───────────────┘
                               │ [BiwraHub] Collecting
                               ▼
                    ┌──────────────────────────┐
                    │        collected          │  ← Staff SBY terima fisik
                    └──────────┬───────────────┘
                               │ Staff input weight & dimensions
                               ▼
                    ┌──────────────────────────┐
                    │    waiting_for_payment    │  ← Menunggu bayar
                    └──────────┬───────────────┘
                               │ [Customer] Upload bukti bayar
                               │ [Admin] Verifikasi pembayaran
                               ▼
                    ┌──────────────────────────┐
                    │          paid             │  ← Lunas, resi + QR dicetak
                    └──────────┬───────────────┘
                               │ [BiwraHub] Bagging
                               ▼
                    ┌──────────────────────────┐
                    │        bagging            │  ← Dalam bag
                    └──────────┬───────────────┘
                               │ [BiwraHub] Batching
                               ▼
                    ┌──────────────────────────┐
                    │ berangkat_ke_pelabuhan    │  ← Masuk batch, ke pelabuhan
                    └──────────┬───────────────┘
                               │ [BiwraHub] Kapal Berangkat
                               ▼
                    ┌──────────────────────────┐
                    │       in_transit          │  ← Di atas kapal
                    └──────────┬───────────────┘
                               │ [BiwraHub] Kapal Sampai
                               ▼
                    ┌──────────────────────────┐
                    │        arrived            │  ← Tiba di Ende
                    └──────────┬───────────────┘
                               │ [BiwraHub] Unbagging
                               ▼
                    ┌──────────────────────────┐
                    │   ready_for_sorting       │  ← Keluar dari bag
                    └──────────┬───────────────┘
                               │ [BiwraHub] Sorting
                    ┌──────────┴──────────┐
                    ▼                     ▼
        ┌─────────────────────┐  ┌─────────────────────┐
        │    siap_diambil     │  │  dalam_pengantaran   │
        │   (zona pusat)      │  │  (zona luar kota)    │
        └──────────┬──────────┘  └──────────┬──────────┘
                   │                        │
                   └──────────┬─────────────┘
                              │ [BiwraHub] Ending
                              ▼
                    ┌──────────────────────────┐
                    │        selesai            │  ← Customer terima barang
                    └──────────────────────────┘
```

### 5.2 Bag Lifecycle

```
    [Bagging]        [Batching]       [Unbagging]
  ┌─────────┐      ┌─────────┐      ┌─────────┐
  │ created │ ───→ │in_batch │ ───→ │unbagged │
  └─────────┘      └─────────┘      └─────────┘
```

### 5.3 Batch Lifecycle

```
  [Batching]    [Kapal Berangkat]   [Kapal Sampai]   [Unbatching]
  ┌─────────┐    ┌─────────┐        ┌─────────┐       ┌─────────┐
  │preparing│ ─→ │departed │ ─────→ │ arrived │ ────→ │unbatched│
  └─────────┘    └─────────┘        └─────────┘       └─────────┘
```

---

## 6. Cascade Logic: Batch → Bag → Package

Ini adalah inti dari hubungan antar entitas. Perubahan status di level atas (Batch) otomatis **cascade** ke bawah (Bag → Package).

### 6.1 Ringkasan Cascade

| Action          | Platform | Batch                    | Bag                     | Package                                                    |
| --------------- | -------- | ------------------------ | ----------------------- | ---------------------------------------------------------- |
| Bagging         | BiwraHub | -                        | `created`               | `paid` → `bagging`                                         |
| Batching        | BiwraHub | `preparing`              | `created` → `in_batch`  | `bagging` → `berangkat_ke_pelabuhan`                       |
| Kapal Berangkat | BiwraHub | `preparing` → `departed` | (tidak berubah)         | `berangkat_ke_pelabuhan` → `in_transit`                    |
| Kapal Sampai    | BiwraHub | `departed` → `arrived`   | (tidak berubah)         | `in_transit` → `arrived`                                   |
| Unbatching      | BiwraHub | `arrived` → `unbatched`  | (tidak berubah)         | (tidak berubah)                                            |
| Unbagging       | BiwraHub | -                        | `in_batch` → `unbagged` | `arrived` → `ready_for_sorting`                            |
| Sorting         | BiwraHub | -                        | -                       | `ready_for_sorting` → `siap_diambil` / `dalam_pengantaran` |
| Ending          | BiwraHub | -                        | -                       | → `selesai`                                                |

### 6.2 Detail Cascade

#### Bagging (Staff SBY via BiwraHub)

- **Package:** `paid` → `bagging`
- **Bag:** `created`
- **Batch:** (belum terlibat)
- **Catatan:** Staff scan QR paket, masukkan ke bag fisik. Satu bag bisa berisi banyak paket.

#### Batching (Staff SBY via BiwraHub)

- **Package:** `bagging` → `berangkat_ke_pelabuhan`
- **Bag:** `created` → `in_batch`
- **Batch:** `preparing`
- **Catatan:** Staff pilih jadwal kapal, scan QR bag untuk dimasukkan ke batch.

#### Kapal Berangkat (Staff SBY via BiwraHub)

- **Package:** `berangkat_ke_pelabuhan` → `in_transit`
- **Bag:** (tidak berubah — tetap `in_batch`)
- **Batch:** `preparing` → `departed`
- **Catatan:** Status batch diubah, semua package di dalam batch ikut berubah.

#### Kapal Sampai (Staff Ende via BiwraHub)

- **Package:** `in_transit` → `arrived`
- **Bag:** (tidak berubah — tetap `in_batch`)
- **Batch:** `departed` → `arrived`
- **Catatan:** Staff Ende scan QR batch di pelabuhan.

#### Unbatching (Staff Ende via BiwraHub)

- **Package:** (tidak berubah — tetap `arrived`)
- **Bag:** (tidak berubah — tetap `in_batch`)
- **Batch:** `arrived` → `unbatched`
- **Catatan:** Staff centang bag satu per satu, mencocokkan fisik. Batch selesai, bag dirilis.

#### Unbagging (Staff Ende via BiwraHub)

- **Package:** `arrived` → `ready_for_sorting`
- **Bag:** `in_batch` → `unbagged`
- **Batch:** (tidak berubah — tetap `unbatched`)
- **Catatan:** Staff scan QR bag, centang paket satu per satu.

#### Sorting (Staff Ende via BiwraHub)

- **Package:** `ready_for_sorting` → `siap_diambil` (zona pusat) / `dalam_pengantaran` (zona luar)
- **Bag/Batch:** (tidak berubah)
- **Catatan:** Tracking kembali ke per-paket (tidak lagi cascade dari batch).

#### Ending (Staff Ende via BiwraHub)

- **Package:** → `selesai`
- **Bag/Batch:** (tidak berubah)
- **Catatan:** Staff foto customer + nama penerima sebagai bukti.

---

## 7. Customer View

Customer hanya melihat **satu label status** di paketnya. Mereka tidak perlu tahu urusan Bag/Batch.

**Yang tampil ke customer saat lacak:**

| Status di System         | Label yang Dilihat Customer        | Keterangan untuk Customer                     |
| ------------------------ | ---------------------------------- | --------------------------------------------- |
| `waiting_for_collection` | Menunggu barang sampai di Surabaya | Barang sedang dalam perjalanan ke gudang kami |
| `collected`              | Barang sudah sampai di Surabaya    | Sedang diproses timbang & ukur                |
| `waiting_for_payment`    | Menunggu pembayaran                | Silakan lakukan pembayaran                    |
| `paid`                   | Pembayaran diterima                | Barang akan segera dikirim                    |
| `bagging`                | Dalam pengemasan                   | Barang sedang dikemas di Surabaya             |
| `berangkat_ke_pelabuhan` | Dalam perjalanan                   | Barang menuju pelabuhan Surabaya              |
| `in_transit`             | Dalam perjalanan                   | Barang sedang dalam perjalanan laut ke Ende   |
| `arrived`                | Barang sudah sampai di Ende        | Barang tiba di Ende, menunggu proses bongkar  |
| `ready_for_sorting`      | Barang sudah sampai di Ende        | Barang tiba di Ende, menunggu proses sortir   |
| `siap_diambil`           | Siap diambil                       | Silakan ambil barang di pusat Biwra Ende      |
| `dalam_pengantaran`      | Dalam pengantaran                  | Barang sedang diantar ke alamat tujuan        |
| `selesai`                | Selesai                            | Barang sudah diterima                         |

> **Catatan:** Beberapa status memiliki label customer yang sama (misal `berangkat_ke_pelabuhan`, `in_transit`, `arrived`, `ready_for_sorting` semuanya tampil sebagai "Dalam perjalanan" atau "Barang sudah sampai di Ende"). Ini untuk menyederhanakan informasi yang tidak perlu diketahui customer.

---

## 8. Conditional Actions

Action tertentu hanya bisa dilakukan jika memenuhi kondisi status tertentu, selain permission.

| Action                   | Role           | Permission        | Kondisi Status                                                        |
| ------------------------ | -------------- | ----------------- | --------------------------------------------------------------------- |
| Cancel package           | Customer       | `packages.update` | `status = 'waiting_for_collection'` AND `user_id = auth()->id()`      |
| Print receipt            | Staff Surabaya | `packages.print`  | `status = 'paid'`                                                     |
| Verify payment           | Admin          | `payments.verify` | `payment.status = 'pending'`                                          |
| Update weight/dimensions | Staff Surabaya | `packages.update` | `status IN ('collected', 'waiting_for_payment')`                      |
| Upload payment proof     | Customer       | `payments.view`   | `package.status = 'waiting_for_payment'` AND `user_id = auth()->id()` |

---

## 9. BiwraHub Actions Reference

Semua action di BiwraHub (mobile app internal) menggunakan API endpoint.

| Action          | Role           | Permission Check                               | Status Change (Package → Bag → Batch)                                                          |
| --------------- | -------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Collecting      | Staff Surabaya | `packages.update` + `packages.scope.collected` | `waiting_for_collection` → `collected`                                                         |
| Bagging         | Staff Surabaya | `bags.create`                                  | Package: `paid` → `bagging`, Bag: `created`                                                    |
| Batching        | Staff Surabaya | `batches.create`                               | Package: `bagging` → `berangkat_ke_pelabuhan`, Bag: `created` → `in_batch`, Batch: `preparing` |
| Kapal Berangkat | Staff Surabaya | `batches.update`                               | Package: `berangkat_ke_pelabuhan` → `in_transit`, Batch: `preparing` → `departed`              |
| Kapal Sampai    | Staff Ende     | `batches.update`                               | Package: `in_transit` → `arrived`, Batch: `departed` → `arrived`                               |
| Unbatching      | Staff Ende     | `batches.update`                               | Batch: `arrived` → `unbatched`                                                                 |
| Unbagging       | Staff Ende     | `bags.update`                                  | Package: `arrived` → `ready_for_sorting`, Bag: `in_batch` → `unbagged`                         |
| Sorting         | Staff Ende     | `packages.update`                              | Package: `ready_for_sorting` → `siap_diambil` / `dalam_pengantaran`                            |
| Ending          | Staff Ende     | `packages.update`                              | Package: → `selesai`                                                                           |

---

## 10. Ringkasan Relasi Entitas

```
Customer ──1:N──→ Package ──N:1──→ Bag ──N:1──→ Batch ──N:1──→ Ship
                    │                                        (via Schedule)
                    │
                    └────1:1──→ Payment
                    │
                    └────N:1──→ Zone
```

**Aturan:**

- Satu Customer → banyak Paket
- Satu Paket → satu Bag (setelah bagging)
- Satu Bag → satu Batch
- Satu Batch → satu Ship (via Schedule)
- Satu Paket → satu Payment
- Satu Paket → satu Zone tujuan
- Satu Batch → banyak Bag → banyak Paket (cascade status beruntun)

---

## Lampiran A: Status Enum Values (untuk implementasi)

### Package Status

```php
enum PackageStatus: string
{
    case WaitingForCollection = 'waiting_for_collection';
    case Collected = 'collected';
    case WaitingForPayment = 'waiting_for_payment';
    case Paid = 'paid';
    case Bagging = 'bagging';
    case BerangkatKePelabuhan = 'berangkat_ke_pelabuhan';
    case InTransit = 'in_transit';
    case Arrived = 'arrived';
    case ReadyForSorting = 'ready_for_sorting';
    case SiapDiambil = 'siap_diambil';
    case DalamPengantaran = 'dalam_pengantaran';
    case Selesai = 'selesai';
}
```

### Bag Status

```php
enum BagStatus: string
{
    case Created = 'created';
    case InBatch = 'in_batch';
    case Unbagged = 'unbagged';
}
```

### Batch Status

```php
enum BatchStatus: string
{
    case Preparing = 'preparing';
    case Departed = 'departed';
    case Arrived = 'arrived';
    case Unbatched = 'unbatched';
}
```

### Payment Status

```php
enum PaymentStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case Rejected = 'rejected';
}
```

---

## Lampiran B: Perubahan dari Dokumen Sebelumnya

| Item                 | LOGIC.md        | ROLE_PERMISSION.md  | Dokumen Ini                  |
| -------------------- | --------------- | ------------------- | ---------------------------- |
| Kapal berlayar       | `di_kapal`      | `in_transit`        | `in_transit` ✅              |
| Kapal sampai         | `tiba_di_ende`  | `arrived`           | `arrived` ✅                 |
| Setelah unbag        | `disortir`      | `ready_for_sorting` | `ready_for_sorting` ✅       |
| Owner reports export | (tidak disebut) | (tidak disebut)     | `reports.export` ✅ (tambah) |
