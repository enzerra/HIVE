# HIVE Squad Lounge — Environment Concept v1

Status: konsep visual untuk review; bukan sprite siap pakai atau implementasi UI. Website, API, aturan pertandingan, dan sistem presence tidak berubah.

## Arah visual

Rumah bersama Squad: hangat, modern, dewasa, dan kompak. Kamera ortografis top-down miring memperlihatkan lantai, pintu, dan landmark. Referensi Among Us hanya digunakan untuk keterbacaan ruang; aset, karakter, dan layout dibuat original. Hasil konsep memakai ilustrasi game dengan detail tegas; ini belum pixel-grid sprite atlas.

Material: lantai batu terang, struktur graphite, kain indigo, kayu hangat, tanaman, dan lampu kuning lembut. Main Lounge menjadi pusat sosial; bukan kantor atau ruang rapat korporat. Pertahankan skala karakter kecil dibanding ruang, tetapi pintu dan interaksi tetap jelas pada layar kecil.

## Map dan sirkulasi

Denah di bagian bawah papan map menunjukkan delapan zona. Susunan final yang dimaksud oleh brief ini menjadi acuan jika detail ilustrasi berbeda:

| Zona | Letak | Landmark dan fungsi lingkungan |
|---|---|---|
| 01 Entrance | Selatan | Pintu utama, alas masuk, crest Squad, nama Squad; satu titik spawn dan jalur keluar |
| 02 Main Lounge | Tengah | Sofa melengkung, meja rendah, karpet crest; pusat berkumpul |
| 03 Discussion | Barat daya | Meja bersama, kursi terpisah, discussion board; ruang percakapan |
| 04 Activity | Timur | Station dan layar bersama; ruang fleksibel tanpa menetapkan mini-game baru |
| 05 Squad Board | Dinding sebelah timur entrance | Papan identitas, roster dan histori; bukan ruangan aktivitas kedua |
| 06 Community Wall | Dinding jalur barat | Catatan, reaksi dan kenangan; permukaan pajangan fisik |
| 07 Relax | Barat laut | Kursi santai, lampu baca, rak, tanaman; sudut tenang |
| 08 Outlook | Utara | Jendela/balkon lebar, pagar, bangku; pemandangan dunia HIVE |

Alur: entrance → lounge pusat → diskusi atau aktivitas → papan dan community wall → relax/outlook → lounge → keluar. Gunakan loop pendek di sekitar lounge, bukan koridor panjang berurutan. Semua zona harus dapat dicapai tanpa melewati furnitur. Main route minimal tiga lebar badan karakter; pintu minimal dua. Sisakan apron kosong di depan setiap pintu. Balkon dibatasi pagar dan collision; pemandangan bukan area berjalan.

Pada ilustrasi, angka 05 tampak dekat meja aktivitas. Pada produksi, pin 05 harus menunjuk papan fisik di dekat entrance; meja di timur tetap bagian zona 04. Beberapa sudut duduk tambahan pada gambar adalah variasi dekorasi, bukan zona produk baru.

## Inventaris aset reusable

| Kelompok | Modul yang disiapkan berikutnya |
|---|---|
| Struktur | floor tile, floor edge, straight wall, corner wall, foreground cutaway wall, open/closed door dengan ukuran identik, window section, corridor threshold, entrance steps, balcony railing |
| Furnitur | curved sofa segment, straight sofa, armchair, coffee table, shared table, stool, bench, counter, shelf |
| Objek sosial | Squad Board, Community Wall, discussion board, activity station, blank shared screen, crest mount, name sign |
| Dekorasi | tall/small planter, standing lamp, pendant, banner, poster frame, memorabilia, books/cups, entry mat |
| Navigasi | room marker, direction sign, floor threshold, entrance landmark |

Papan aset menampilkan representasi utama dan variasi; corridor, counter, bench, poster, entry mat, serta langkah tangga individual masih perlu digambar sebagai modul tersendiri pada produksi. Jangan menganggap objek gabungan di papan ini sudah terpisah otomatis.

## Layer dan aturan produksi

1. Floor: lantai dan jalur, tanpa bayangan furnitur permanen.
2. Structure: dinding belakang, sudut, kusen, ambang, pagar.
3. Furniture: setiap objek terpisah; titik anchor di kaki/bagian dasar.
4. Identity: crest dan nama Squad terpisah dari tekstur; gunakan identitas HIVE yang sudah ada.
5. Foreground: dinding depan rendah, tiang, dan occluder yang terpisah.
6. Lighting: emissive lamp, ambient wash, shadow dan panorama terpisah dari base art.

Gunakan satu kamera dan skala referensi; jangan mencampur perspektif tampak depan dan isometrik pada objek yang berdampingan. Sumber cahaya utama kiri atas. Buat orientasi khusus untuk furnitur asimetris; jangan mencerminkan tulisan/crest. Door open/closed harus memakai kanvas dan anchor identik.

Ekspor berikutnya: PNG RGBA sumber dan WebP alpha distribusi, tanpa latar papan. Metadata minimal: id, ukuran, anchor, footprint collision, occlusion baseline, interaction point, dan state group. Footprint mengikuti kaki objek, bukan keseluruhan siluet tinggi. Konten board dan status anggota nanti berupa data terpisah, bukan teks yang dibakar ke gambar.

## Cahaya dan atmosfer

Day: cahaya langit lembut lewat jendela, batu krem netral, indigo tetap terbaca. Evening: struktur graphite lebih dalam, panorama biru malam, lampu hangat lokal; lantai tetap cukup terang untuk navigasi. Hindari glow menyelimuti semua objek. Cahaya tidak boleh menyiratkan pengguna online jika belum ada data.

Karakter yang tampak pada papan map hanya ilustrasi skala dan suasana. Tidak ada klaim multiplayer, anggota aktif, aktivitas nyata, atau simulasi presence. Station permainan, musik, teleskop, dan materi papan hanya studi dekorasi; tidak menetapkan fitur baru.

## Batas dan pemeriksaan berikutnya

- Logo lebah, slogan, dan nama dekoratif yang dibuat generator adalah placeholder; bukan rebranding HIVE.
- Gambar konsep bukan layout collision yang tervalidasi. Trace floor dan uji lintasan sebelum merakit environment interaktif.
- Review pintu terbuka/tertutup, konsistensi ukuran dan arah cahaya saat menggambar sprite individual.
- Uji keterbacaan furnitur, karakter dan landmark pada desktop/mobile; jangan mengandalkan teks kecil di papan.
- Uji jalan entrance ke delapan zona tanpa menembus meja, sofa, dinding, balkon, atau dekorasi.
- Produksi UI percakapan, interaksi, presence, animasi karakter dan integrasi website menjadi tahap berikutnya.

## Berkas dan proses

- `hive-squad-lounge-map-concept.png`: lingkungan lengkap, mini-denah, dan legenda zona.
- `hive-squad-lounge-asset-board.png`: studi komponen, dekomposisi layer, dan mood day/evening.
- Dibuat dengan built-in image_gen, bukan CLI/API fallback. Prompt lengkap tersedia pada pemanggilan imagegen di percakapan ini.

Prompt direction map: original HIVE social clubhouse, top-down tilted orthographic camera, eight connected zones, graphite structure, pale warm floors, indigo identity, warm lamps, cutaway walls and unobstructed paths; use reference only for spatial readability; environment occupies most of board with floorplan and zone legend; no dashboard UI; clearly label as visual concept.

Prompt direction asset sheet: match the generated lounge reference; modular environment, furniture, social objects and lighting props with consistent camera and scale; separated objects with category labels; floor-to-lighting decomposition and day/evening comparison; blank activity screen; concept sheet, not transparent sprite atlas.
