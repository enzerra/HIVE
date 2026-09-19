# HIVE

**Good people. Different perspectives.**

Frontend HIVE dengan Next.js App Router, React, TypeScript, shadcn/ui, dan Tailwind CSS. Pengalaman sosial dibuat tenang dan lapang; penekanan visual muncul pada pilihan yang terkunci, Reveal, dan Resolve.

Authenticated Home memakai **HIVE World**, sebuah pulau isometrik berlapis yang menjadi pusat navigasi. Arena, Squad Quarter, Hive Tower, Pulse Beacon, Replay Theater, dan Hall of Wisdom merespons state produk yang nyata. Hotspot desktop dilengkapi World Dock untuk keyboard, mobile, reduced-motion, serta fallback ketika ilustrasi tidak tersedia.

Arena memakai **Living Belief Field** sebagai visualisasi pertandingan. Purple dan Chog memengaruhi inti perspektif di tengah; belief tetap tersembunyi sebelum Reveal, argumen Squad menjadi node saat Council, dan snapshot final tiga ronde bergabung saat pertandingan selesai.

**Quick Pulse** tidak mengambil tempat di navigasi utama. Ia hadir sebagai Pulse Beacon di HIVE World dan melalui **Pulse Companion** pada halaman lain: Call baru, countdown penutupan prediksi, diskusi setelah lock, status resolver, dan outcome memakai satu lifecycle yang sama. Detail prediksi tetap berada di halaman terpisah agar panel tidak berubah menjadi mini-game atau chatbot bebas.

## Jalankan

Memerlukan Node.js 22.15 atau lebih baru.

```sh
npm ci
npm run dev
```

Buka **http://127.0.0.1:3000**. Development otomatis memakai mode demo lokal. Versi dependency dikunci dalam `package-lock.json`.

Untuk menjalankan hasil build:

1. Salin `.env.example` menjadi `.env.local`.
2. Jalankan `npm run build`, lalu `npm start`.

`HIVE_DEMO_ENABLED=true` diperlukan untuk membuat sesi demo pada mode produksi. `HIVE_APP_ORIGIN` harus sama persis dengan origin browser, termasuk port. Jangan memasukkan credential ke environment dengan awalan `NEXT_PUBLIC_`.

## Coba alurnya

1. Jelajahi Landing dan Hive tanpa akun.
2. Pilih **Gabung HIVE → Coba alur masuk (demo)**.
3. Pilih PFP, isi nama, bergabung ke **Aster**, dan konfirmasi **Purple**.
4. Dari Home, buka **Steam Momentum · Quick Pulse**. Buat prediksi, baca belief komunitas, diskusikan bersama Squad, revisi keputusan, lalu Resolve dan bagikan hasil publik.
5. Di Arena Lobby, pilih **Tandai siap**, lalu **Masuk Arena**.
6. Pilih A/B, diskusikan saat Deliberate, dan kunci call saat Commit.
7. Baca Reveal dan Council, lalu pilih Stay atau Switch saat Revision.
8. Selesaikan tiga ronde. Gunakan kontrol demo untuk mempercepat eksplorasi, lalu buka hasil dan replay publik.

Waktu fase tetap berjalan saat berpindah halaman. Call yang terlambat dapat gagal atau menyebabkan forfeit. Receipt yang baru diterima belum dianggap terkunci.

**Pengaturan → Advanced** menyediakan peran representative/operator serta skenario normal, Wisdom Lift negatif, draw, void, no contest, dan forfeit. Reset menghapus progres pertandingan pada sesi demo tersebut.

## Yang tersedia

| Area | Pengalaman |
|---|---|
| Public | Landing, Explore dengan pencarian/filter, profil Hive/Squad/Human, rankings contoh, replay, Watch berupa historical replay, View Proof |
| Bergabung | Sesi demo, empat langkah onboarding, join/create/defer Squad, undangan valid/full/expired |
| Sosial | HIVE World isometrik, enam lokasi interaktif, identitas PFP–crest–sigil, follow Hive, aktivitas ilustratif, notifikasi yang bisa ditandai dibaca |
| Open Calls | Steam Quick Pulse anytime, choice-before-crowd disclosure, diskusi Squad, Stay/Switch, resolver demo, void aman, skor, Wisdom Lift, dan hasil publik |
| Arena | Lobby, readiness, roster lock, tujuh fase, Living Belief Field, pilihan privat, receipt, chat Squad, argumen representative, Council, Stay/Switch, hasil tiga ronde |
| Hasil | Skor canonical, Wisdom Lift terpisah dari perubahan skor, pending/void/forfeit/no-contest, replay dan share preview |
| Kontrol | Light/dark/system, reduced motion, profil, preferensi presence/reminder, detail integrasi, operator draft event dan moderasi demo |

## Batas demo

- **Google Auth, embedded wallet, Monad, Steam data, proof of humanity, dan layanan ranked belum dihubungkan.** UI menyatakan status tersebut secara eksplisit.
- Data anggota dan aktivitas adalah ilustrasi. Demo bukan pertandingan multiuser real-time. Human lain dan outcome disimulasikan oleh gateway server.
- Aster memakai kursi pemain demo dalam roster berisi empat Human. Squad lain atau Squad baru dapat dijelajahi tetapi tidak langsung eligible untuk Founding match.
- Reputasi live tetap `N/A`. Replay demo tidak menghasilkan ranked reputation, Influence Quality, hadiah, token, atau ekonomi baru.
- Sound nonaktif dan belum diimplementasikan. Preferensi presence/reminder disimpan, tetapi tidak mengirim notifikasi eksternal atau membuat presence palsu.
- Sesi dan replay hasil permainan disimpan di memori satu proses server. Restart menghapusnya. Replay `founding-001` selalu tersedia sebagai contoh historis. Tautan localhost hanya dapat diakses pada komputer yang menjalankan server.
- Live mode belum memiliki adapter layanan. `HIVE_DATA_MODE=live` mengembalikan unavailable; tidak otomatis beralih ke data demo.
- Upload PFP, matchmaking, orkestrasi multiuser, persistence database, SSE, transfer season, social composer, dan deployment belum termasuk implementasi ini.

## Struktur

```text
src/app/                  Next.js pages, metadata, route handlers
src/components/ui/        Komponen shadcn/ui berbasis Radix
src/components/           Shell, identity SVG, shared states, providers
src/features/             Community, onboarding, Arena, settings
src/domain/               Types, public directory, arithmetic rules
src/lib/client/           Gateway client dan session query
src/lib/server/           Mesin demo dan public replay projection
tests/                    Domain dan gateway boundary tests
docs/hive/                PRD, desain, aturan, dan dokumen acuan
```

Gateway menggunakan HTTP-only session cookie, validasi origin, Zod input validation, role checks, idempotency keys, dan response `no-store`. Initial/final belief serta outcome dikirim sesuai batas fase. Public replay tidak menyertakan pilihan individu atau chat Squad.

Polling satu detik digunakan untuk snapshot demo. Gateway server menentukan fase dan menghitung hasil; countdown di browser hanya presentasi. Layanan live kelak harus menyediakan durable storage, otorisasi, clock/phase authority, commitment lifecycle, sumber outcome, dan verifikasi anti-sybil sendiri.

## Verifikasi

```sh
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

52 pengujian domain/gateway/visual-state meliputi presisi integer, skor tiga ronde, batas disclosure pada Living Belief Field dan Quick Pulse, proyeksi state HIVE World, lifecycle receipt/Open Call, call terlambat, idempotency, attribution, forfeit/defaulted Stay, void aman, role/phase checks, urutan onboarding, origin/session, roster lock, public replay/result projection, batas gerak karakter, kecepatan diagonal, serta jangkauan pintu.

### Home World berlapis

Home sekarang berupa panggung game satu layar dengan navbar sambutan dan kontrol di atas dunia. Arena diperkecil agar jalur depan pintu tetap terbuka; Squad Lounge dicerminkan agar tangganya menghadap jalur plaza. Pulse, Replay, dan Wisdom ditempatkan di pilar plaza. Rute berjalan mengikuti tikungan jembatan dan tangga; posisi tersimpan dari geometri lama tidak digunakan lagi. Tes regresi menolak titik tebing lama dan menelusuri semua rute pintu secara kontinu (total 53 tes).

Mode berjalan aktif secara default: fokuskan peta lalu gunakan WASD/panah. Mendekati pintu menampilkan prompt; E atau tombol masuk menjalankan transisi, tanpa perpindahan otomatis. Mobile menyediakan joystick sentuh. Mode navigasi langsung dan navigasi cepat tetap tersedia. Posisi terakhir disimpan per handle di sessionStorage tab; kembali dari Arena menempatkan karakter di posisi terakhir.

Jalur dan jangkauan pintu didefinisikan di `src/domain/world-walking.ts`. Gerakan berhenti ketika fokus keluar, tab tersembunyi, atau transisi dimulai. Input formulir dan shortcut browser tidak ditangkap. Sprite memakai dua pose idle/langkah dari paket aset, dengan pembalikan kiri/kanan; belum merupakan walk cycle empat arah. Karakter adalah pemain lokal, bukan presence multiplayer.

Home memakai terrain dan aset WebP terpisah dari `public/world-assets/v1`. Enam tujuan mempunyai batas interaksi mengikuti siluet, fokus keyboard, dan navigasi cepat tanpa animasi. Konfigurasi visual berada di `src/components/world-scene-config.ts`, terpisah dari proyeksi status produk di `src/domain/world.ts`.

Perjalanan berlangsung 650 ms dengan satu pengelola transisi; reduced-motion membuka tujuan langsung. Arena membuka pintu hanya setelah kedua aset siap. Efek pintu tidak menyatakan bahwa pertandingan sedang live. Mobile menampilkan seluruh peta dengan kontrol fokus lokasi dan tombol masuk. Terrain yang gagal dimuat membuka navigasi alternatif; kegagalan satu objek tidak mematikan tujuan lainnya.

Arena District menggunakan aset Arena terpisah dan identitas Hive dari direktori pertandingan demo. Gerbang mengikuti onboarding, lobby, pertandingan berjalan, atau hasil settled. Jumlah anggota Squad dan peserta Call hanya ditampilkan jika tersedia; tidak digunakan sebagai jumlah online.

Alur browser yang diperiksa: HIVE World desktop dan mobile 390 px; scene Arena dan Hive; light/dark; keyboard-readable World Dock; onboarding hingga Home; Quick Pulse dari prediksi awal sampai outcome; tiga ronde lengkap termasuk chat, Commit dan Revision; hasil **257,00 vs 216,00**; Wisdom Lift ronde pertama **+15 pp**; public replay tanpa cookie; pencarian kosong; dan komunitas baru tanpa Arena.

## Keputusan implementasi

Next.js dipakai sesuai pilihan stack pengguna. shadcn/ui dihasilkan melalui CLI resmi dengan gaya `radix-nova`; komponen dapat diedit langsung di repository. TanStack Query menangani data dan mutasi, next-themes menangani tema, dan Sonner memberi feedback singkat. Identitas PFP–crest–sigil tetap berupa asset lokal; lingkungan HIVE World memakai ilustrasi raster lokal dengan hotspot dan state yang dirender sebagai UI native.

Dokumen produk di `docs/hive/` tetap menjadi acuan untuk integrasi lanjutan. README ini menjelaskan cakupan yang benar-benar berjalan pada frontend demo, termasuk batasnya.
