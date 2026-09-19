# Assembly Lab 01 — Entrance + Main Lounge

Buka `http://127.0.0.1:4177/artifacts/squad-lounge-assets-v1/assembly.html` saat server lokal berjalan. Jika perlu, jalankan `python -m http.server 4177 --bind 127.0.0.1` dari root repository. ES modules membutuhkan HTTP; jangan membuka HTML langsung melalui file://.

## Yang dirakit

- Lantai, dua modul batas belakang, sofa pusat, sofa sudut, meja, dan pintu transparan v2 memakai file terpisah.
- Pemain inspeksi menggunakan wolf idle yang sudah ada; bukan pengguna aktif atau presence multiplayer.
- Skala disusun dalam kanvas 1200 × 800 dengan karakter setinggi 68 unit, kecepatan 150 unit/detik, radius tabrakan kaki 12 unit.
- Pintu v2 mendapat koreksi tampilan `skewY(-16)` untuk meratakan lintel. File sumber tidak diubah. Ini kompromi prototipe, bukan penyelarasan ulang kamera sumber yang sudah final.
- Latar terang/gelap, overlay footprint, reset ke entrance, kontrol WASD/panah, dan uji jalur otomatis tersedia.
- Karpet sederhana dan overlay adalah geometri preview, bukan pengganti aset final.

## Hasil pemeriksaan

Tes Node menelusuri seluruh loop entrance → kanan lounge → belakang sofa → sisi kiri → depan lounge → entrance. Setiap langkah berada di lantai valid. Spawn valid, pusat lima footprint solid diblokir, dan titik di luar lantai diblokir. Loop memakai fungsi collision yang sama dengan preview.

Pemeriksaan visual interaktif melalui browser otomatis belum selesai: alat browser gagal membuka sesi dengan error penulisan kernel assets. Karena itu keselarasan footprint dengan ilustrasi, clipping, urutan visual di teras pintu, dan kenyamanan mobile belum dinyatakan lolos. Geometri yang lolos tes tetap merupakan footprint prototipe yang perlu review visual.

## Batas tahap ini

Ini studi entrance dan main lounge, bukan seluruh delapan zona. Lantai belum seamless, perspektif meja lebih halus daripada sofa, pintu memakai koreksi affine, dan pertemuan dinding masih perlu art pass. Tidak ada animasi walk cycle baru, UI chat, backend, atau perubahan website HIVE.

Pembuatan pintu v3 dengan sumbu horizontal telah dicoba melalui built-in imagegen tetapi kembali menghasilkan latar checkerboard opaque (corner dan center alpha 255). Versi itu ditolak dari perakitan; v2 tetap dipakai karena lubang dan latarnya transparan.

## Kontrol dan verifikasi lanjutan
- Tombol arah sentuh dan keyboard, serta jeda/lanjut tersedia.
- Gerakan dijeda saat tab disembunyikan atau jendela kehilangan fokus.
- Tiga tes otomatis lulus: jalur inspeksi, batas lantai/furnitur, dan batas kecepatan diagonal/frame terlambat.
- Preview HTTP merespons 200. Pemeriksaan visual browser belum selesai karena alat browser gagal menginisialisasi kernel; footprint masih prototipe.

