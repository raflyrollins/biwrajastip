# Role, Permission & Scope — BiwraJastip

## 1. Roles

| Role             | Deskripsi                                            | Frontend       |
| ---------------- | ---------------------------------------------------- | -------------- |
| `customer`       | Pengguna akhir yang mengirim paket                   | Web            |
| `staff_surabaya` | Staf di Surabaya: collecting, bagging, batching      | Web + BiwraHub |
| `staff_ende`     | Staf di Ende: unbatching, unbagging, sorting, ending | Web + BiwraHub |
| `admin`          | Pengelola data master, verifikasi pembayaran, akun   | Web            |
| `owner`          | Oversight bisnis, laporan, kelola akun admin         | Web            |

---

## 2. Web Permissions

### 2.1 Package

| Permission              | Customer                     | Staff Surabaya   | Staff Ende | Admin | Owner |
| ----------------------- | ---------------------------- | ---------------- | ---------- | ----- | ----- |
| `package.view`          | Own                          | Role-based       | Role-based | All   | —     |
| `package.create`        | ✅                           | —                | —          | —     | —     |
| `package.update`        | Own (waiting_for_collection) | ✅ (data aktual) | —          | —     | —     |
| `package.cancel`        | Own (waiting_for_collection) | —                | —          | —     | —     |
| `package.pay`           | ✅ (upload bukti)            | —                | —          | —     | —     |
| `package.print_receipt` | —                            | ✅               | —          | —     | —     |

### 2.2 Bag

| Permission          | Staff Surabaya | Staff Ende    | Admin |
| ------------------- | -------------- | ------------- | ----- |
| `bag.view`          | ✅ (own)       | ✅ (unbagged) | All   |
| `bag.print`         | ✅             | —             | —     |
| `bag.check_content` | ✅             | ✅            | —     |

### 2.3 Batch

| Permission            | Staff Surabaya | Staff Ende     | Admin |
| --------------------- | -------------- | -------------- | ----- |
| `batch.view`          | ✅ (own)       | ✅ (unbatched) | All   |
| `batch.print`         | ✅             | —              | —     |
| `batch.check_content` | ✅             | ✅             | —     |

### 2.4 Master Data

| Permission      | Admin |
| --------------- | ----- |
| `kapal.manage`  | ✅    |
| `jadwal.manage` | ✅    |
| `zona.manage`   | ✅    |
| `tarif.manage`  | ✅    |

### 2.5 User & Role Management

| Permission       | Admin |
| ---------------- | ----- |
| `user.manage`    | ✅    |
| `role.manage`    | ✅    |
| `payment.verify` | ✅    |

### 2.6 Reports

| Permission    | Owner |
| ------------- | ----- |
| `report.view` | ✅    |

---

## 3. BiwraHub Permissions

| Permission            | Role           | Modul      | Aksi                                                               |
| --------------------- | -------------- | ---------- | ------------------------------------------------------------------ |
| `biwrahub.collecting` | Staff Surabaya | Collecting | Status `waiting_for_collection` → `collected`                      |
| `biwrahub.bagging`    | Staff Surabaya | Bagging    | Masukkan paket ke bag, status `paid` → `bagging`                   |
| `biwrahub.batching`   | Staff Surabaya | Batching   | Masukkan bag ke batch, status `bagging` → `berangkat_ke_pelabuhan` |
| `biwrahub.unbatching` | Staff Ende     | Unbatching | Terima batch, status `arrived` → `unbatched`                       |
| `biwrahub.unbagging`  | Staff Ende     | Unbagging  | Keluarkan paket dari bag, status `in_batch` → `unbagged`           |
| `biwrahub.sorting`    | Staff Ende     | Sorting    | Sortir paket, status → `siap_diambil` / `dalam_pengantaran`        |
| `biwrahub.ending`     | Staff Ende     | Ending     | Selesaikan paket, status → `selesai`                               |

---

## 4. Scopes

### 4.1 Package Scopes

| Scope               | Digunakan Oleh | Deskripsi                                                   |
| ------------------- | -------------- | ----------------------------------------------------------- |
| `scope:own`         | Customer       | Hanya lihat paket sendiri                                   |
| `scope:collectable` | Staff Surabaya | Paket status `waiting_for_collection` yang sudah di-collect |
| `scope:weighable`   | Staff Surabaya | Paket perlu ditimbang                                       |
| `scope:payable`     | Staff Surabaya | Paket sudah dibayar, perlu cetak resi                       |
| `scope:bagging`     | Staff Surabaya | Paket siap dibag                                            |
| `scope:batching`    | Staff Surabaya | Bag siap dibatch                                            |
| `scope:unbatched`   | Staff Ende     | Batch sudah di-unbatch                                      |
| `scope:unbagged`    | Staff Ende     | Paket sudah di-unbag                                        |
| `scope:sortable`    | Staff Ende     | Paket perlu sorting                                         |
| `scope:finishable`  | Staff Ende     | Paket siap di-ending                                        |

### 4.2 Bag Scopes

| Scope            | Digunakan Oleh | Deskripsi               |
| ---------------- | -------------- | ----------------------- |
| `scope:own`      | Staff Surabaya | Bag yang dibuat sendiri |
| `scope:unbagged` | Staff Ende     | Bag sudah di-unbag      |

### 4.3 Batch Scopes

| Scope             | Digunakan Oleh | Deskripsi                 |
| ----------------- | -------------- | ------------------------- |
| `scope:own`       | Staff Surabaya | Batch yang dibuat sendiri |
| `scope:unbatched` | Staff Ende     | Batch sudah di-unbatch    |

---

## 5. Default Role Assignments

```php
'customer' => [
    'package.view',
    'package.create',
    'package.update',
    'package.cancel',
    'package.pay',
],

'staff_surabaya' => [
    'package.view',
    'package.update',
    'package.print_receipt',
    'bag.view',
    'bag.print',
    'bag.check_content',
    'batch.view',
    'batch.print',
    'batch.check_content',
    'biwrahub.collecting',
    'biwrahub.bagging',
    'biwrahub.batching',
],

'staff_ende' => [
    'package.view',
    'bag.view',
    'bag.check_content',
    'batch.view',
    'batch.check_content',
    'biwrahub.unbatching',
    'biwrahub.unbagging',
    'biwrahub.sorting',
    'biwrahub.ending',
],

'admin' => [
    'package.view',
    'bag.view',
    'batch.view',
    'kapal.manage',
    'jadwal.manage',
    'zona.manage',
    'tarif.manage',
    'user.manage',
    'role.manage',
    'payment.verify',
],

'owner' => [
    'report.view',
],
```
