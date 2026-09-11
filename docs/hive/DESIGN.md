# Design — HIVE

**Baseline build:** Porcelain + indigo. [Riset](references/HIVE_Design_Research_Social_Community_Gamification_ID.md) menyediakan alasan dan alternatif; [papan](references/HIVE_Design_Comparison_Board.html) menyediakan komposisi awal. Desain berikut adalah spesifikasi frontend, bukan perintah menyalin ukuran metadata kecil pada papan.

## 1. Prinsip komposisi

Home terasa seperti ruang komunitas: manusia dan next action lebih menonjol daripada angka. Match terasa fokus; Council nyaman dibaca. Euforia muncul dari identitas, perbedaan belief, dan hasil sah. Hindari kumpulan kartu kecil, glow ungu, seluruh background berwarna, ticker, dan badge yang saling berebut perhatian.

Satu area keputusan memiliki satu CTA primer. Elemen berbeda memakai heading/spacing terlebih dahulu, baru container bila perlu. Foto/PFP memberi kehidupan tanpa menambah semantic palette. Tidak ada hexagon sebagai pola wallpaper; sigil dipakai sebagai identitas.

## 2. Semantic tokens

| Token CSS | Light | Dark | Pemakaian |
|---|---|---|---|
| `--canvas` | `#F7F7FB` | `#101116` | Background aplikasi |
| `--surface` | `#FFFFFF` | `#181A21` | Card/dialog utama |
| `--surface-raised` | `#F0F0F7` | `#22252F` | Hover netral, inset, elevasi |
| `--text` | `#20212A` | `#F3F3F8` | Judul/body |
| `--text-secondary` | `#606374` | `#B0B2C1` | Penjelasan dan metadata yang masih terbaca |
| `--brand` | `#5146C7` | `#A29AFF` | CTA, selected/focus, aksen fase |
| `--on-brand` | `#FFFFFF` | `#111117` | Teks pada tombol brand |
| `--divider` | `#DCDEE7` | `#353846` | Pemisah dekoratif |
| `--control-border` | `#777B8D` | `#777B8D` | Batas kontrol penting |
| `--live` | `#A74319` | `#FFAC7D` | Live/aktif, selalu dengan label |
| `--success` | `#237247` | `#83C99C` | Sukses/result valid sesuai konteks |
| `--danger` | `#B33D46` | `#F0A0A7` | Error/destructive/negatif dengan teks |

State hover primer: pertahankan brand dan tambahkan outline/inset visual; jangan menurunkan opacity teks. Focus 3 px brand dengan offset 3 px terhadap permukaan; pada tombol brand gunakan outline text + offset yang jelas. Disabled memakai surface-raised, text-secondary, ikon/status dan atribut disabled; jangan memberi opacity global yang menghilangkan label.

Selected neutral row memakai surface-raised + garis/indikator brand. Input invalid memiliki icon/text error serta border danger; error tidak menggantung pada warna saja. Link inline diberi underline. Divider halus bukan satu-satunya penanda input boundary.

Kontras terendah foreground terhadap tiga permukaan: Light utama 14,11, sekunder 5,24, brand 6,07, status 5,04, control 3,70; Dark 13,82/7,27/6,26/7,49/3,64. Text tombol brand Light 6,88 dan Dark 7,71. Perhitungan warna solid dari riset, bukan sertifikasi halaman lengkap.

## 3. A/B dan data visual

A/B memakai teks A atau B, nama game, angka, dan pola solid/arsir netral. Warna brand bukan A, hijau bukan B atau prediksi benar, orange bukan kekalahan. Belief chart selalu dilengkapi data tekstual; ranking posisi tidak diberi gradient yang menyerupai market chart.

Tidak melakukan count-up angka score/belief dari angka sementara. Sebelum data sah, tampilkan “Belum tersedia” atau “Menunggu”; bukan 0%. N/A, nol, dan hidden merupakan tiga state berbeda.

## 4. Typography

Satu keluarga system sans untuk baseline: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Pilihan font baru memerlukan alasan readability/brand dan file berlisensi; jangan memakai tiga display fonts.

| Peran | Desktop | Mobile | Weight / line-height |
|---|---|---|---|
| Hero | 56 px | 38 px | 650–700 / 1,08 |
| Page title | 32 px | 28 px | 650 / 1,2 |
| Section | 20 px | 20 px | 600 / 1,35 |
| Body/argument | 16 px | 16 px | 400 / 1,6 |
| Label/button | 14 px | 14 px | 600 / 1,4 |
| Metadata | 13 px | 13 px | 400 / 1,5 |
| Small auxiliary | 12 px | 12 px | 400–600 / 1,5 |
| Result number | 48 px | 36 px | 650 / 1,15, tabular numerals |

Jangan memakai 12 px untuk deadline, alasan, status validitas, error, atau tindakan penting. Letter spacing negatif hanya heading; body normal. All caps terbatas pada label pendek 12 px. Nama panjang wrap maksimal dua baris pada header; full name accessible/expand, tidak merusak layout.

## 5. Spacing dan ukuran

Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px. Gunakan gap antarelemen, bukan margin acak.

| Struktur | Spesifikasi |
|---|---|
| Global desktop | max-width 1200 px; gutter 32 px, main gap 40 px |
| Landing | max-width 1200; hero 2 kolom; section spacing 64–80 |
| Social shell | main fleksibel + aside 280 px; gap 32–40 |
| Reading/match | konten inti 680–760 px; argument text max 68ch |
| Mobile | gutter 20 px; satu kolom; section spacing 28–32 |
| Navigation | header 72 desktop/64 mobile; bottom bar min 64 + safe area |
| Control | tinggi minimum 44 px; input 48 px; radius 8 px |
| Card/dialog | radius 12 px; padding 24 desktop/20 mobile |
| Identity | PFP 32/40/64; crest 40/64; sigil 56/88 px sesuai konteks |

Breakpoints baseline: <640 compact; 640–1023 medium; ≥1024 wide. Konten masih harus reflow pada 320 px. Medium social aside turun di bawah priority panel, bukan menekan kolom baca. Mobile urutan Home: next Arena → Squad ringkas → activity → jadwal/Replay.

Mobile navigation Home/Arena/Hives/Profile. Rankings dapat dibuka dari Arena dan menu Profile. Tidak boleh menggunakan bottom nav untuk navigasi fase match; Match punya shell fokus dan exit yang menjelaskan state.

## 6. Density per konteks

Landing hero satu proposisi, satu penjelasan, dua tindakan. Home satu Arena prioritas + tiga activity awal + roster 3–5 Human. Explore 6–8 item desktop/4–5 mobile awal. Ranking 10 baris per halaman. Profile maksimal tiga headline metrics. Council tidak boleh memotong jumlah card roster; tampilkan seluruh card dengan scrolling yang stabil, bukan autoplay.

Tidak ada badge “level”, streak, rarity, balance, atau reward wallet. Metadata seperti sample size boleh di disclosure dengan ringkasan terlihat. Disclaimer outcome tidak disembunyikan di tooltip.

## 7. Identitas dan asset

Human menggunakan PFP bundar. Squad memakai crest/perisai. Hive memakai sigil komunitas dengan silhouette berbeda. Selalu ada nama dan jenis entitas ketika konteks berpotensi rancu. Representative mendapat label peran tekstual di roster; card Council tidak membawa status prestige.

Default asset dapat berupa SVG/CSS orisinal, dengan placeholder yang berbeda untuk tiap entitas. Satu crest template tidak boleh dipakai sebagai identitas akhir semua Squad. Lihat [Content & Assets](CONTENT_AND_ASSETS.md) untuk inventory dan aturan upload.

## 8. Theme behavior

Pilihan theme: system/light/dark. Default system untuk akun baru, persist preferensi non-sensitif. Server merender preferensi cookie jika ada; bootstrap theme sebelum paint mencegah flash. Jangan membaca localStorage untuk mengubah tree content sebelum hydration. Kedua tema menggunakan DOM, ukuran, urutan, dan behavior sama.

No pure black wajib; dark memakai graphite. Modal surface-raised dan overlay gelap transparan diuji kontras hasil komposit. Fokus, toast, tooltip, input invalid, dan skeleton harus ikut theme. OS reduced motion terpisah dari theme.

## 9. Referensi implementasi

Tailwind dipakai melalui semantic CSS variables; mapping token dapat memakai mekanisme theme Tailwind, tidak hardcode warna di setiap feature. [Dokumentasi resmi theme variables](https://tailwindcss.com/docs/theme), diperiksa 9 September 2026.

Contoh mapping bersifat pola, implementasi disesuaikan versi lockfile:

```css
:root { --canvas: #F7F7FB; --text: #20212A; }
[data-theme="dark"] { --canvas: #101116; --text: #F3F3F8; }
/* Seluruh komponen merujuk semantic token, bukan warna per halaman. */
```

Motion, keyboard, dialog, live region, dan sound mengikuti [Accessibility & Motion](ACCESSIBILITY_AND_MOTION.md). Gate visual final berada di [Testing](TESTING_AND_ACCEPTANCE.md).
