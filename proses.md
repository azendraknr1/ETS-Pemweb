# PROSES

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