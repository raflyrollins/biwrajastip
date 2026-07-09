# SCAFFOLD.md

Dokumen ini mendefinisikan mekanisme, alur kerja, dan aturan bisnis aplikasi BiwraJastip.

---

## 1. Roles

| Role               | Tanggung Jawab Utama                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Customer**       | Input paket, bayar, pantau status, ambil/terima antaran                                                                              |
| **Staff Surabaya** | Terima barang fisik, timbang, hitung harga, cetak QR, kelola bag, kelola batch                                                       |
| **Staff Ende**     | Terima batch, unbatch, unbagging, sortir paket                                                                                       |
| **Admin**          | Kelola data master (zona, tarif), verifikasi pembayaran, lihat bag dan batch, kelola akun staff/customer, kelola role dan permission |
| **Owner**          | Oversight bisnis: laporan performa & keuangan, kelola akun Admin                                                                     |

---

## 2. SideApp — biwrahub (Aplikasi Mobile Internal)

### Staff Surabaya

- **Collecting**
    - Menerima paket dan mengubah status dari `waiting_for_collection` → `collected`

- **Bagging**
    - Memasukkan barang ke bag. Status paket `paid` → `bagging`. Status bag: `created`

- **Batching**
    - Memasukkan bag ke dalam batch. Status paket `bagging` → `berangkat_ke_pelabuhan`. Status bag `created` → `in_batch`. Status batch: `preparing`

### Staff Ende

- **Unbatching**
    - Proses receiving. Menginput/menscan QR batch → memunculkan list bag → mencentang bag → unbatch selesai. Status batch: `arrived` → `unbatched`

- **Unbagging**
    - Mengeluarkan paket dari bag. Menginput/menscan QR bag → memunculkan list paket → mencentang paket → unbag selesai. Status bag `in_batch` → `unbagged`. Status paket `arrived` → `ready_for_sorting`

- **Sorting**
    - Menginput/menscan QR paket → status paket berubah menjadi `siap_diambil` atau `dalam_pengantaran`

- **Ending**
    - Menginput/menscan QR paket → mengambil foto customer dan nama penerima → status paket `selesai`

### Catatan

Semua pengerjaan dilakukan dengan menginput nomor resi/bag/batch atau scan QR code. Khusus untuk collecting, masih menggunakan resi toko online karena paket belum diproses untuk mendapatkan resi BiwraJastip.

---

## 3. Entitas Konseptual

- **Bag** — Kumpulan beberapa paket yang dikelompokkan jadi satu kemasan fisik
- **Batch** — Satu keberangkatan kapal, berisi banyak Bag

---

## 4. Alur Kerja Role

### Customer

1. Login dan masuk ke dashboard.
2. Ke halaman paket, melihat list paket dan data paket.
3. Menambahkan paket baru di halaman buat paket:
    - Mengisi nama dan nomor telepon penerima paket di Ende.
    - Mengisi nomor resi dari toko online/ekspedisi/referensi lainnya.
        - Pastikan saat belanja menggunakan alamat collecting BiwraJastip.
        - Penerima: `biwraJastip (nama_penerima)`.
    - Memilih zona pengantaran.
    - Memasukkan estimasi berat, panjang, lebar, dan tinggi untuk melihat estimasi harga.
4. Setelah paket berstatus `waiting_for_payment` (batas 72 jam sebelum di-cancel otomatis):
    - Menuju ke halaman pembayaran untuk transfer/rekening atau scan QR statis.
    - Mengupload bukti pembayaran dan mengirimnya.
5. Paket akan diproses sesuai prosedur BiwraJastip.

### Staff Surabaya

1. Menerima paket dari pihak toko online/ekspedisi.
2. Melakukan proses collecting lewat biwrahub:
    - Buka biwrahub → pilih modul Collecting.
    - Input/scan QR resi dari toko online.
    - Dapat men-collect banyak paket dalam sekali proses.
3. Login ke website, masuk ke halaman list paket.
    - Paket yang muncul adalah paket yang sudah ter-collecting lewat biwrahub.
4. Melakukan proses menimbang dan mengukur dimensi paket.
5. Memasukkan data aktual berat, panjang, lebar, dan tinggi → harga muncul.
6. Setelah paket berstatus `paid`, mencetak resi (data paket + QR code) dan ditempelkan di paket.
7. Melakukan bagging untuk paket yang sudah `paid`:
    - Buka biwrahub → pilih modul Bagging.
    - Input/scan QR resi BiwraJastip sambil memasukkan paket ke bag.
    - Pastikan jumlah paket sesuai sebelum menekan Finish.
8. Mencetak nomor bag dan QR code di halaman Bag di website.
9. Melakukan batching untuk bag yang akan berangkat:
    - Buka biwrahub → pilih modul Batching.
    - Pilih jadwal berangkat batch.
    - Input/scan QR nomor bag.
10. Mencetak batch ke format A4 (nomor batch, QR, tanggal berangkat, daftar bag & berat, tanda tangan staff, tanda tangan ekspedisi).
11. Cetakan batch disimpan sebagai arsip dan diserahkan ke pihak ekspedisi.

### Staff Ende

1. **Unbatching:**
    - Pergi ke pelabuhan/ekspedisi → terima kertas batch dari pihak ekspedisi.
    - Buka biwrahub → modul Unbatching.
    - Input/scan QR batch → memunculkan list bag.
    - Centang bag sambil mencocokkan kondisi fisik.
    - Proses unbatching selesai.

2. **Unbagging:**
    - Bawa semua bag hasil unbatching ke gudang.
    - Buka biwrahub → modul Unbagging.
    - Input/scan QR nomor bag → memunculkan list paket.
    - Centang paket yang dikeluarkan untuk memastikan kelengkapan.

3. **Sorting:**
    - Buka biwrahub → modul Sorting.
    - Input/scan QR paket (banyak paket dalam sekali proses).
    - Status paket berubah sesuai hasil sorting.

4. **Ending:**
    - Saat paket sudah diambil/diantar.
    - Buka biwrahub → modul Ending.
    - Input/scan QR paket → ambil foto customer & nama penerima → selesai.

---

## 5. Dashboard — Halaman, Visibility, dan Permission

### Dashboard

- Menampilkan data sesuai role akun yang login.

### Data Kapal

- **Visibility:** Admin
- **Permission:** Admin — CRUD data kapal

### Jadwal

- **Visibility:** Admin
- **Permission:** Admin — CRUD jadwal

### Paket

- **Visibility:** Admin, Customer, Staff Surabaya, Staff Ende
- **Permission:**
    - **Admin:** Readonly semua paket dengan filter
    - **Customer:** Read & Update/Cancel paket punya sendiri yang masih `waiting_for_collection`; melihat paket yang perlu pembayaran dan melakukan pembayaran
    - **Staff Surabaya:** Mengelola paket yang perlu ditimbang dan diproses; mencetak resi paket yang sudah dibayarkan
    - **Staff Ende:** Melihat paket yang sudah selesai di-unbag/sorted/ending

### Bag

- **Visibility:** Admin, Staff Surabaya, Staff Ende
- **Permission:**
    - **Admin:** Readonly semua bag dengan filter
    - **Staff Surabaya:** Melihat list bag yang dibuat dari biwrahub; mengecek isi bag (list paket); mencetak nomor/QR bag
    - **Staff Ende:** Melihat list bag yang sudah di-unbag di biwrahub; mengecek isi bag (list paket)

### Batch

- **Visibility:** Admin, Staff Surabaya, Staff Ende
- **Permission:**
    - **Admin:** Readonly semua batch dengan filter
    - **Staff Surabaya:** Melihat list batch yang dubuat dari biwrahub; mengecek isi batch (list bag); mencetak batch ke format A4
    - **Staff Ende:** Melihat list batch yang sudah di-unbatch di biwrahub; mengecek isi batch (list bag)

### Halaman Lain

- Admin: Kelola akun, role, dan permission
- Owner: Laporan dan oversight

---

## 6. Aturan Bisnis Kunci

### Perhitungan Fee

- `berat_final = MAX(berat_aktual, berat_volumetrik)`
- `berat_volumetrik = ceil((Panjang × Lebar × Tinggi) / 6000) × 1000` (satuan: gram)
- Semua zona ongkirnya sama, yang membedakan hanya biaya antar.

### Hitungan Berat dan Satuan

- Setiap 0.6 kg dibulatkan ke atas.
- Input: gram (berat), cm (panjang, lebar, tinggi).
- Sistem: kg.

### Biaya Antar

- Ditentukan oleh zona tujuan customer.
- Zone pusat Ende = tanpa biaya tambahan.
- Zone luar kota = biaya sesuai tarif zona tersebut.

### Pembatalan Paket

- Hanya customer sendiri yang dapat membatalkan, selama status masih `waiting_for_collection`.
- Admin bisa memantau paket yang lama menggantung di status ini dan mengingatkan customer via WA (di luar sistem).

### Ketidaksesuaian Data (Estimasi vs Aktual)

- Tidak ada validasi otomatis atau blokir alur.
- Sistem tetap lanjut ke `waiting_for_payment` dengan harga final berdasar data aktual.
- Penanganan selisih signifikan dilakukan manual oleh Admin via WA.

### Barang Hilang/Rusak

- Tidak ada status atau flag khusus di sistem.
- Ditangani manual di luar sistem.
- Nanti buatkan halaman khusus admin untuk mengelola masalah ini.

### Kapasitas Bag/Batch

- Tidak ada batas otomatis (berat maksimum atau jumlah paket maksimum).
- Sepenuhnya keputusan manual staff yang mengelola.

### Notifikasi (WA/Email/In-App)

- Belum termasuk dalam scope logic ini.
- Akan didiskusikan terpisah di kemudian hari.
