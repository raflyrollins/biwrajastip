# Database Setup Plan

## Overview
Setup semua tabel domain aplikasi BiwraJastip sesuai SCAFFOLD.md.

## Tables

### 1. ships
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| name | string | |
| description | text | nullable |
| timestamps | | |

FULLTEXT: name, description

### 2. zones
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| name | string | unique (e.g., "Pusat Ende", "Luar Kota Ende") |
| delivery_fee | decimal(12,2) | biaya antar |
| timestamps | | |

FULLTEXT: name

### 3. schedules
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| ship_id | bigint (FK) | → ships.id |
| departure_date | date | |
| arrival_date | date | nullable, estimated |
| status | enum | preparing, departed, arrived |
| timestamps | | |

### 4. packages
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| user_id | bigint (FK) | → users.id (customer) |
| sender_name | string | nama pengirim di BiwraJastip |
| sender_phone | string | |
| receiver_name | string | nama penerima di Ende |
| receiver_phone | string | |
| tracking_number | string | resi toko online |
| tracking_number_biwra | string | nullable, resi BiwraJastip (dibuat saat collecting) |
| zone_id | bigint (FK) | → zones.id |
| status | enum | waiting_for_collection, collected, waiting_for_payment, paid, bagging, berangkat_ke_pelabuhan, siap_diambil, dalam_pengantaran, selesai, cancelled |
| weight_estimated | decimal(8,2) | gram, input customer |
| length_estimated | decimal(8,2) | cm, input customer |
| width_estimated | decimal(8,2) | cm, input customer |
| height_estimated | decimal(8,2) | cm, input customer |
| weight_actual | decimal(8,2) | nullable, gram, input staff |
| length_actual | decimal(8,2) | nullable, cm, input staff |
| width_actual | decimal(8,2) | nullable, cm, input staff |
| height_actual | decimal(8,2) | nullable, cm, input staff |
| price | decimal(12,2) | nullable, harga final |
| delivery_fee | decimal(12,2) | nullable, biaya antar dari zona |
| total_price | decimal(12,2) | nullable, price + delivery_fee |
| bag_id | bigint (FK) | nullable → bags.id |
| batch_id | bigint (FK) | nullable → batches.id |
| collected_at | timestamp | nullable |
| timestamps | | |

FULLTEXT: tracking_number, tracking_number_biwra, sender_name, receiver_name
UNIQUE: tracking_number_biwra

### 5. bags
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| code | string | unique, format: BAG-YYYYMMDD-XXX |
| qr_code | string | nullable, path/URL to QR image |
| status | enum | created, in_batch |
| batch_id | bigint (FK) | nullable → batches.id |
| timestamps | | |

### 6. batches
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| code | string | unique, format: BATCH-YYYYMMDD-XXX |
| qr_code | string | nullable, path/URL to QR image |
| ship_id | bigint (FK) | → ships.id |
| schedule_id | bigint (FK) | → schedules.id |
| departure_date | date | |
| status | enum | preparing, departed, arrived |
| timestamps | | |

### 7. payments
| Column | Type | Notes |
|--------|------|-------|
| id | bigint (PK) | auto-increment |
| uuid | uuid | unique |
| package_id | bigint (FK) | → packages.id |
| amount | decimal(12,2) | jumlah pembayaran |
| payment_method | enum | transfer, ewallet |
| proof_image | string | path to uploaded image |
| status | enum | pending, verified, rejected |
| verified_by | bigint (FK) | nullable → users.id (admin) |
| verified_at | timestamp | nullable |
| notes | text | nullable, catatan admin |
| timestamps | | |

## Code Generation Logic
- Bag code: `BAG-{YYYYMMDD}-{XXX}` where XXX is daily sequence (001, 002, ...)
- Batch code: `BATCH-{YYYYMMDD}-{XXX}` same format
- Sequence resets daily
- Generate in model boot() or helper function

## Package Status Flow
```
waiting_for_collection → collected → waiting_for_payment → paid → bagging → berangkat_ke_pelabuhan → siap_diambil/dalam_pengantaran → selesai
                                                                                                    ↓
                                                                                               cancelled
```

## Migration Order
1. ships
2. zones
3. schedules (depends on ships)
4. bags
5. batches (depends on ships, schedules)
6. packages (depends on users, zones, bags, batches)
7. payments (depends on packages, users)

## Models to Create
- Ship
- Zone
- Schedule
- Package
- Bag
- Batch
- Payment

## Model Relationships
- Ship hasMany Schedule
- Zone hasMany Package
- Schedule belongsTo Ship, hasMany Batch
- Package belongsTo User, Zone, Bag, Batch; hasMany Payment
- Bag belongsTo Batch, hasMany Package
- Batch belongsTo Ship, Schedule, hasMany Bag
- Payment belongsTo Package, belongsTo User (verified_by)

## Conventions
- All tables have uuid after id
- English naming for everything
- FULLTEXT on searchable text columns
- Use `HasUuid` trait or manual boot() for UUID generation
