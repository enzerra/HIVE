# Squad Lounge — foundational asset studies v1

## Pembaruan cutout v2

`doorway-open-v2.png` dan `coffee-table-v2.png` menggantikan draft dalam preview. Keduanya diregenerasi lewat built-in image_gen, bukan diekstrak dari checkerboard lama. Sampel alpha kosong sekitar 72% untuk pintu dan 75.08% untuk meja; titik tengah lubang pintu memiliki alpha 0. Draft lama tetap disimpan sebagai riwayat, bukan aset aktif. Prompt regenerasi ada di `PROMPTS-V2.md`.

Buka `preview.html` untuk inspeksi lima objek pada latar terang, gelap, atau hijau dan ukuran kecil. Ini workbench aset lokal, bukan perubahan antarmuka HIVE. Validasi alpha tidak sama dengan validasi game-ready: pintu baru memiliki sumbu horizontal lebih miring daripada dinding, meja lebih halus daripada sofa, dan skala dunia belum dinormalisasi. Selaraskan kamera/material, trace anchor dan collision, lalu lakukan perakitan uji sebelum integrasi.

Lima objek individual dibuat menggunakan built-in image_gen. Ini paket studi produksi awal, bukan environment lengkap atau paket game-ready. Tidak ada perubahan website.

| File | Status | Pemeriksaan lanjutan |
|---|---|---|
| floor-tile.png | Kanal alpha tersedia | Sambungan tile belum seamless; perspektif trapezoid perlu diselaraskan saat merakit lantai |
| wall-module.png | Kanal alpha tersedia | Bentuk lebih dekat modul batas rendah; jangan dipakai sebagai dinding tinggi tanpa revisi |
| sofa-curved.png | Kanal alpha tersedia | Perlu penyamaan skala dengan karakter serta inspeksi halo pada latar terang/gelap |
| doorway-open-draft.png | Belum lolos | Latar checkerboard masih opaque, termasuk lubang pintu |
| coffee-table-draft.png | Belum lolos | Latar checkerboard masih opaque |

`alpha-report.json` memeriksa sampel kanal alpha setiap 16 piksel menggunakan System.Drawing, tanpa mengedit gambar. Alpha tersedia bukan bukti seluruh tepi sudah bersih. Dua draft sudah dicoba diperbaiki melalui imagegen tetapi tetap gagal menghasilkan transparansi. Jangan memasukkannya ke production atau menamainya sprite siap pakai.

Material konsisten: batu graphite, limestone krem, indigo, kayu hangat dan brass terbatas. Skala output berbeda dan belum dinormalisasi. Semua anchor/collision/occlusion harus ditetapkan setelah siluet dan perspektif final disetujui. Belum ada metadata koordinat palsu atau footprint yang diklaim tervalidasi.

Prompt lengkap dan percobaan extraction ada di `PROMPTS.md`. Papan referensi dan panduan delapan zona berada di `../squad-lounge-concept-v1/`.

Pekerjaan berikutnya: perbaiki transparansi pintu/meja, selaraskan perspektif dan skala, lalu produksi sudut dinding, jendela, signage, papan sosial, kursi, tanaman, dan cahaya terpisah. Setelah itu buat assembly preview dan uji jalur; UI produk tetap tahap selanjutnya.
