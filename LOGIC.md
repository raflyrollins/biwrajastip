# BiwraJastip — Business Logic Reference

> Dokumen ini adalah referensi logic bisnis untuk web **biwrajastip** (nama brand ditulis lowercase). Fokus dokumen ini murni pada alur bisnis, aturan, dan struktur data konseptual — bukan implementasi teknis (kode, tabel database, atau kolom akan ditentukan saat development).

## Konvensi Development

- **Kode/coding**: sepenuhnya menggunakan bahasa Inggris (nama variabel, fungsi, class, komentar, dsb).
- **Bahasa Indonesia**: hanya dipakai di sisi UI yang terlihat customer/staff — label tampilan, dan terutama **pesan validasi input/error**.
- Styling dan konvensi UI mengikuti DESIGN.md dan menggunakan lucide icon.

---

## 1. Gambaran Bisnis

BiwraJastip adalah layanan konsolidasi cargo laut: customer belanja barang secara online (Shopee atau toko lain, umumnya di Jawa), mengirimkan barang tersebut ke **alamat collecting jastip di Surabaya**, lalu barang dikonsolidasikan dan dikirim secara batch via kapal ke **Ende**. Customer mengambil barang di pusat jastip Ende, atau meminta diantar ke luar kota dengan biaya tambahan.

---

## 2. Roles

| Role               | Tanggung Jawab Utama                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer**       | Input paket, bayar, pantau status, ambil/terima antaran                                                                                  |
| **Staff Surabaya** | Terima barang fisik, timbang, hitung harga, cetak QR, bagging, kelola pengiriman batch                                                   |
| **Staff Ende**     | Terima batch, sortir per paket via scan QR, kelola pengambilan/pengantaran                                                               |
| **Admin**          | Kelola data master (zona, tarif), verifikasi pembayaran, kelola batch, monitoring lintas lokasi, kelola akun staff/customer              |
| **Owner**          | Oversight bisnis: laporan performa & keuangan, kelola akun Admin, approval kebijakan tarif (asumsi awal, bisa disesuaikan saat berjalan) |

---

## 3. Entitas Konseptual

- **Customer** — nama, alamat tujuan akhir (untuk pengambilan/antar di area Ende)
- **Paket** — satu barang/pesanan milik satu customer, unit tracking utama
- **Bag** — kumpulan beberapa paket yang dikelompokkan jadi satu kemasan fisik
- **Batch** — satu keberangkatan kapal, berisi banyak Bag
- **Payment** — catatan pembayaran terkait satu paket
- **Zone** — area tujuan di sekitar Ende, menentukan ada/tidaknya biaya antar tambahan

**Relasi:**

- Satu Customer → banyak Paket
- Satu Paket → satu Bag (setelah bagging)
- Satu Bag → satu Batch
- Satu Paket → satu Payment
- Satu Paket → satu Zone tujuan

---

## 4. Alur Status Paket (Lifecycle)

```
waiting_for_collection
        ↓
    collected
        ↓
  waiting_for_payment
        ↓
       paid
        ↓
  (bagging FIFO, masuk Bag → Batch)
        ↓
 berangkat_ke_pelabuhan   ─┐
        ↓                  │ status ini di-set di level Batch,
     di_kapal               │ otomatis reflect ke semua Paket
        ↓                  │ di dalam Batch tsb
   tiba_di_ende            ─┘
        ↓
    disortir   (kembali ke tracking per-paket, via scan QR individual)
        ↓
 siap_diambil / dalam_pengantaran
        ↓
     selesai
```

### Penjelasan tiap tahap

1. **waiting_for_collection** — Customer sudah input paket (nama barang, no resi toko online, estimasi berat, estimasi panjang/lebar/tinggi) dan sudah/sedang mengirim barang ke alamat collecting Surabaya. Di tahap ini customer **masih bisa membatalkan** paketnya sendiri.
2. **collected** — Staff Surabaya menandai barang fisik sudah diterima (cocokkan dengan no resi toko). Sejak status ini, **pembatalan oleh customer tidak lagi diperbolehkan**. Harga belum tentu final di titik ini.
3. **waiting_for_payment** — Staff Surabaya input berat & dimensi aktual. Sistem menghitung harga final berdasarkan berat terbesar antara aktual dan volumetrik (P×L×T/faktor). Estimasi awal customer ditampilkan berdampingan dengan data aktual sebagai referensi admin — bukan logic otomatis, kalau selisih signifikan admin akan menghubungi customer secara manual via WA (di luar sistem).
4. **paid** — Customer sudah bayar sesuai harga final. Sistem membuat kode paket internal + QR code. **Staff Surabaya mencetak** resi/QR ini dan menempelkannya ke barang fisik.
5. **Bagging (FIFO)** — Staff Surabaya scan QR untuk mengelompokkan paket ke dalam Bag, berurutan sesuai kapan paket masuk sistem (yang lebih dulu, lebih dulu di-bag). Kapasitas Bag/Batch ditentukan manual oleh staff yang mengelola, tidak ada batas otomatis di sistem.
6. **berangkat_ke_pelabuhan → di_kapal** — Status ini diset di level **Batch**. Semua Paket di dalam Batch tersebut otomatis ikut berubah status mengikuti Batch.
7. **tiba_di_ende** — Masih level Batch, otomatis ter-reflect ke semua Paket di dalamnya.
8. **disortir** — Staff Ende scan QR **satu per satu** saat bongkar, memisahkan paket berdasarkan Zone tujuan. Titik ini tracking kembali jadi per-paket, bukan lagi mengikuti Batch.
9. **siap_diambil / dalam_pengantaran** — Paket dengan Zone pusat kota ditandai siap diambil; paket Zone luar kota dijadwalkan untuk diantar (dengan biaya tambahan sesuai tarif Zone).
10. **selesai** — Customer sudah menerima barang (ambil sendiri atau lewat pengantaran), dikonfirmasi.

---

## 5. Aturan Bisnis Kunci

- **Simulasi harga**: tersedia sebagai fitur publik (tanpa login), customer masukkan estimasi berat/dimensi + pilih Zone untuk melihat estimasi biaya sebelum belanja.
- **Perhitungan fee**: `berat_final = MAX(berat_aktual, berat_volumetrik)`, dengan `berat_volumetrik = (Panjang × Lebar × Tinggi) / faktor_volumetrik`. Faktor volumetrik dan tarif per kg diatur sebagai pengaturan yang bisa diubah Admin.
- **Biaya antar**: ditentukan oleh Zone tujuan customer — Zone pusat Ende = tanpa biaya tambahan, Zone luar kota = biaya sesuai tarif Zone tersebut.
- **Pembatalan paket**: hanya diperbolehkan customer sendiri, selama status masih `waiting_for_collection`. Admin bisa memantau paket yang lama menggantung di status ini dan mengingatkan customer via WA (di luar sistem, tidak perlu logic khusus).
- **Ketidaksesuaian data (estimasi vs aktual)**: tidak ada validasi otomatis atau blokir alur. Sistem tetap lanjut ke `waiting_for_payment` dengan harga final berdasar data aktual. Penanganan selisih signifikan dilakukan manual oleh Admin via WA.
- **Barang hilang/rusak**: tidak ada status atau flag khusus di sistem — ditangani manual di luar sistem.
- **Kapasitas Bag/Batch**: tidak ada batas otomatis (berat maksimum atau jumlah paket maksimum). Sepenuhnya keputusan manual staff yang mengelola.
- **Notifikasi** (WA/email/in-app): belum termasuk dalam scope logic ini, akan didiskusikan terpisah di kemudian hari.

---

## 6. Hal yang Sengaja Belum Diputuskan (untuk didiskusikan nanti)

- Mekanisme notifikasi otomatis ke customer per perubahan status.
- Apakah owner butuh approval workflow untuk perubahan tarif, atau cukup Admin yang langsung ubah.
- Detail kapan sebuah Bag "ditutup" secara operasional (saat ini murni keputusan staff).
