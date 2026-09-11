# Accessibility & Motion

Target build adalah WCAG 2.2 AA yang relevan dengan scope, ditambah reduced motion sebagai pilihan desain. Target ini memerlukan verifikasi implementasi; dokumen tidak menyatakan aplikasi yang belum dibangun sudah conformant. Rationale/kontras awal tersedia di Design dan riset referensi.

## 1. Struktur dan keyboard

Satu H1 per route utama; heading berurutan, landmark header/nav/main/footer, skip link ke main. Navigasi asli memakai anchor; actions memakai button. Semua controls dapat dicapai keyboard dengan urutan mengikuti layout. Focus visible tidak dihapus; perubahan theme tidak mereset focus.

Radio A/B memakai arrow keys/Space standar, label mencakup nama game. Tidak ada global hotkey yang langsung Lock/Stay/Switch tanpa konteks dan konfirmasi state. Tab pada form argument tidak mengirim call. Disabled action menjelaskan alasan di dekatnya, bukan tooltip hover-only.

Dialog/sheet: judul accessible, focus masuk ke elemen tepat, trap, Escape bila aman, return focus ke pemicu, background inert. Menutup share modal tidak kehilangan hasil; menutup exit confirmation tidak mengirim apa pun. Fokus tidak tertutup sticky footer atau keyboard mobile.

## 2. Form dan error

Label selalu terlihat; placeholder bukan label. Required dan format dijelaskan sebelum input bila perlu. Inline errors terhubung melalui `aria-describedby`; submit invalid memfokuskan error summary yang memiliki link ke field. Success saving dapat memakai polite live region; error kritis assertive sekali. Counter argument mengumumkan mendekati/melebihi batas secara ringkas, bukan setiap ketikan.

Password field custom tidak diperlukan karena Google flow. Auth cancel bukan error yang menuduh pengguna. Eligibility unavailable memiliki penjelasan dan safe next action. Control target baseline44 px; spacing cukup untuk tidak salah menekan dua choice.

## 3. Waktu dan match yang berjalan

Countdown visual dapat update setiap detik, tetapi screen reader tidak membaca setiap detik. Announce phase change, sisa10 s dan5 s kandidat, serta waktu selesai sekali. Threshold tidak menimpa argument yang sedang dibaca dengan alert panjang.

Kompetisi memakai deadline bersama yang esensial terhadap aktivitas; jangan memperpanjang satu participant diam-diam. Uji dan dokumentasikan penerapan pengecualian timing yang relevan; jangan mengklaim semua time limits otomatis exempt. Beri rules/durasi sebelum match, practice/demo tanpa tekanan untuk belajar, dan jadwal outcome agar pengguna dapat keluar saat menunggu. Session timeout biasa di luar match perlu warning/recovery yang wajar.

Live region fase memberi konteks tetapi tidak memindahkan focus ke awal halaman setiap event. Saat action ditutup karena deadline, arahkan informasi melalui status region; focus tetap pada tempat yang aman. Jika panel lama benar-benar dihapus saat focus berada di dalamnya, pindahkan ke heading phase baru, bukan body document.

## 4. Visual access

Text normal≥4,5:1; text besar≥3:1; nontext controls/grafik penting≥3:1 sesuai kriteria terkait. Token awal sudah dihitung. Ukuran besar/weight harus benar-benar memenuhi definisi; jangan menganggap12 px uppercase sebagai large text. Warna bukan satu-satunya kode A/B/live/win/error.

Uji zoom200%, reflow320 px, long names, text spacing override, dark/light, OS high contrast bila tersedia. Tabel memiliki caption/header; mobile replacement mempertahankan label metric. Chart memiliki data text alternatif. Tidak ada content penting hanya pada hover.

## 5. Motion specification

| Trigger sah | Motion normal | Durasi | Reduced motion |
|---|---|---:|---|
| Ready terakhir diterima | Check dan crest accent masuk | 250–400 ms | Check/label langsung |
| Canonical locked | Ikon/label tersimpan berubah | 120–180 ms | Teks langsung |
| Initial batch revealed | Aggregate masuk bersama, tanpa count-up | 300–450 ms | Angka langsung |
| Final reveal valid | Before/after muncul | 250–400 ms | Before/after statis |
| Match settled winner | Sigil/roster mendapat satu emphasis | 400–700 ms | Status W dan identitas statis |
| Loss/draw/negative lift | Transisi hasil sederhana | 180–250 ms | Hasil langsung |
| Milestone valid | Card kecil masuk nonblocking | 350–500 ms | Card statis |
| Share preview ready | Preview tampil | 150–250 ms | Preview langsung |

Gunakan opacity dan transform kecil (maks8 px translation, tidak zoom fullscreen). Tidak memakai strobe, screen shake, auto scrolling carousel, confetti terus-menerus, atau motion yang menunggu sebelum CTA aktif. Angka hasil sudah benar sejak frame pertama yang bisa dibaca; hindari intermediate fake number.

Preference `motion=system|reduce`. System mengikuti `prefers-reduced-motion`; reduce selalu off untuk gerak nonesensial. Tidak menyediakan override “full” yang mengabaikan OS reduce pada baseline. Ubah preference saat runtime tanpa reload. Animation state dedupe by eventId; reload/reconnect/background catch-up menampilkan status terbaru langsung.

## 6. Sound

Sound default off. Aktivasi pengguna eksplisit; browser permission/autoplay restrictions dipatuhi. Cue hanya sesudah event sah, tidak untuk status pending. Volume tidak mendadak besar; preview cue via tombol dalam Settings bila assets tersedia. Stop bila tab hidden/keluar match, dan hindari multi-tab memainkan suara ganda.

Sound tidak membawa informasi unik: locked, phase, win/loss semuanya terbaca. Bila sound asset belum dibuat/berlisensi, toggle tetap disabled dengan penjelasan atau disembunyikan sebagai capability unavailable, bukan pura-pura menyala. Pengguna dengan sound off tetap mendapat euforia melalui identitas/copy/hasil.

## 7. Replay dan share

Timeline tidak autoplay; Previous/Next dan “Baca semua” keyboard-accessible. Focus berubah ke scene heading ketika user memilih scene, bukan setiap data refresh. Scene hasil mempunyai teks yang menjelaskan chart. Share sheet bisa ditutup dengan Escape; copy-link feedback polite dan native share cancel normal.

## 8. Bukti verifikasi yang diperlukan

Periksa manual keyboard dari Landing sampai Replay; screen reader smoke pada choice group, deadline change, error form dan result; audit otomatis axe pada screen utama; screenshot matrix light/dark/390/1440/320; reduced-motion dan sound-off; zoom/textspacing; long content. Automated audit tidak menggantikan manual match interaction.

Rujukan standar: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), diperiksa dalam riset 9 September 2026. Minimum target size AA24 px memiliki pengecualian;44 px adalah baseline desain HIVE. Animation from interactions2.3.3 berada tingkatAAA dan diadopsi sebagai peningkatan kenyamanan, bukan disalahlabel sebagai persyaratan AA.
