# PROSES

# Checkpoint 1
## Persona dan masalahnya
Pedagang kecil memiliki uang pribadi dan uang usaha yang tercampur, sehingga keuntungan tidak jelas. Karena itu, aplikasi PisahUang dibuat untuk mencatat transaksi ke dompet "Pribadi" atau "Usaha" agar keuangan lebih mudah dipantau.

## Rancangan struktur data
Semua transaksi disimpan dalam satu array bernama data, lalu disimpan ke localStorage dengan JSON.stringify() dan dibaca dengan JSON.parse() saat halaman dibuka.

Contoh satu transaksi:

    {
      id: 1739251200000,
      tanggal: "2026-10-19",
      jenis: "pengeluaran",
      dompet: "Usaha",
      kategori: "Belanja Stok",
      nominal: 50000,
      catatan: "Beras"
    }

- id: dari Date.now() supaya unik
- nominal: angka, bukan teks berformat Rupiah
- dompet: khusus persona pedagang kecil ("Pribadi" atau "Usaha")

## Keputusan desain
Saya menaruh dompet sebagai field di dalam objek transaksi yang sama, bukan membuat array terpisah untuk tiap dompet. Alasannya, daftar, hapus, dan ringkasan semuanya memakai satu sumber data. Jadi ketika sebuah transaksi dihapus, semua tampilan ikut berubah tanpa perlu menyinkronkan dua data.

## Bug
1. Nominal tersimpan sebagai teks. Gejalanya format Rupiah tidak muncul. Saya cek dengan console.log(typeof f.nominal.value), lalu memperbaikinya dengan Number().
2. Error saat pertama kali dibuka karena localStorage masih kosong (null). Saya perbaiki dengan `|| []` dan try/catch di muatData().

# Checkpoint 2 
## Persona dan masalahnya
Masalah pedagang kecil belum selesai kalau hanya bisa mencatat. Dia perlu tahu berapa saldo usahanya dan saldo pribadinya, serta bisa mencatat saat uang dipindah antar dompet, misalnya mengambil uang usaha untuk kebutuhan pribadi. Karena itu di checkpoint ini ditambahkan ringkasan saldo, validasi form, saldo per dompet, dan fitur pindah dana.

## Rancangan struktur data
Array data tetap sama, hanya ditambah satu jenis transaksi baru, yaitu "pindah". Field dompet dipakai sebagai dompet asal, dan ada field baru tujuan sebagai dompet tempat uang masuk.

Contoh transaksi pindah dana:

    {
      id: 1739251300000,
      tanggal: "2026-10-19",
      jenis: "pindah",
      dompet: "Usaha",
      tujuan: "Pribadi",
      nominal: 20000,
      catatan: "Ambil gaji"
    }

- jenis: sekarang ada tiga nilai, "pemasukan", "pengeluaran", dan "pindah"
- dompet: untuk jenis "pindah" berarti dompet asal
- tujuan: hanya ada pada jenis "pindah"
- kategori: tidak dipakai pada jenis "pindah"

Karena field dompet sudah ada sejak Checkpoint 1, struktur lama tidak perlu diubah dan data lama tetap bisa dibaca.

## Keputusan desain
Pindah dana saya simpan sebagai transaksi dengan jenis "pindah" di array yang sama, bukan dicatat sebagai pengeluaran di satu dompet dan pemasukan di dompet lain. Alasannya, uang yang dipindah hanya berpindah tempat, bukan bertambah atau berkurang. Kalau dicatat sebagai pemasukan dan pengeluaran, total pemasukan dan pengeluaran jadi membengkak dan keuntungan usaha kembali tidak jelas, padahal itu masalah utama persona saya. Karena itu hitungRingkasan() hanya menjumlah pemasukan dan pengeluaran, sedangkan hitungSaldoDompet() mengurangi dompet asal dan menambah dompet tujuan. Cek kebenarannya: saldo Pribadi ditambah saldo Usaha harus selalu sama dengan total saldo.

