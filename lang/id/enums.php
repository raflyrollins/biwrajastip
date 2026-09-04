<?php

return [

    'package_status' => [
        'registered' => 'Terdaftar',
        'collected' => 'Diterima di Pusat Collecting',
        'processed' => 'Sudah Diproses',
        'pending_payment' => 'Menunggu Pembayaran',
        'paid' => 'Lunas',
        'bagged' => 'Dalam Bag',
        'batched' => 'Dalam Batch',
        'port_arrived' => 'Tiba di Pelabuhan',
        'on_going' => 'Dalam Perjalanan / Kapal Berangkat',
        'unbatched' => 'Tiba di Ende',
        'unbagged' => 'Dikeluarkan dari Bag',
        'ready' => 'Siap Diambil / Diantar',
        'delivered' => 'Sudah Diserahkan',
        'irregular' => 'Irregular',
    ],

    'bag_status' => [
        'draft' => 'Bag Draf',
        'bagged' => 'Bag Aktif',
        'batched' => 'Dalam Batch',
        'on_ship' => 'Dalam Kapal',
        'unbagged' => 'Di Unbagging',
        'complete' => 'Selesai',
    ],

    'batch_status' => [
        'draft' => 'Batch Draf',
        'batched' => 'Batch Aktif',
        'port_arrived' => 'Tiba di Pelabuhan',
        'on_going' => 'Dalam Perjalanan',
        'unbatched' => 'Di Unbatching',
        'complete' => 'Selesai',
    ],

    'payment_status' => [
        'pending' => 'Menunggu Pembayaran',
        'settled' => 'Lunas',
        'failed' => 'Gagal',
        'expired' => 'Kedaluwarsa',
        'refunded' => 'Dikembalikan',
    ],

    'payment_method' => [
        'va_bca' => 'BCA Virtual Account',
        'va_bni' => 'BNI Virtual Account',
        'va_mandiri' => 'Mandiri Virtual Account',
        'va_bri' => 'BRI Virtual Account',
        'qris' => 'QRIS',
    ],

    'irregularity_type' => [
        'label_mismatch' => 'Salah Tempel Resi',
        'wrong_delivery' => 'Paket Salah Diantar',
        'refused' => 'Paket Tidak Mau Diterima',
        'address_not_found' => 'Alamat Tidak Ditemukan',
        'bag_count_mismatch' => 'Jumlah Bag Tidak Sesuai',
        'package_count_mismatch' => 'Jumlah Paket Tidak Sesuai',
        'other' => 'Lainnya',
    ],

];
