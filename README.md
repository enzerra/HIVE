# HIVE

**Good people. Different perspectives.**

Frontend HIVE dengan Next.js App Router, React, TypeScript, shadcn/ui, dan Tailwind CSS. Pengalaman sosial dibuat tenang dan lapang; penekanan visual muncul pada pilihan yang terkunci, Reveal, dan Resolve.

Arena memakai **Living Belief Field** sebagai visualisasi pertandingan. Purple dan Chog memengaruhi inti perspektif di tengah; belief tetap tersembunyi sebelum Reveal, argumen Squad menjadi node saat Council, dan snapshot final tiga ronde bergabung saat pertandingan selesai.

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
| Sosial | Home kontekstual, identitas PFP–crest–sigil, follow Hive, aktivitas ilustratif, notifikasi yang bisa ditandai dibaca |
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

39 pengujian domain/gateway/visual-state meliputi presisi integer, skor tiga ronde, batas disclosure pada Living Belief Field dan Quick Pulse, lifecycle receipt/Open Call, call terlambat, idempotency, attribution, forfeit/defaulted Stay, void aman, role/phase checks, urutan onboarding, origin/session, roster lock, serta public replay/result projection.

Alur browser yang diperiksa: onboarding hingga Home; Quick Pulse dari prediksi awal sampai outcome, hasil publik tanpa data personal, dan filter kosong; tiga ronde lengkap termasuk chat, Commit dan Revision; hasil **257,00 vs 216,00**; Wisdom Lift ronde pertama **+15 pp**; public replay tanpa cookie; pencarian kosong; komunitas baru tanpa Arena; dark mode; layout mobile 390 px dan 320 px. Refresh Landing dan Home dengan sesi aktif diperiksa ulang tanpa hydration error.

## Keputusan implementasi

Next.js dipakai sesuai pilihan stack pengguna. shadcn/ui dihasilkan melalui CLI resmi dengan gaya `radix-nova`; komponen dapat diedit langsung di repository. TanStack Query menangani data dan mutasi, next-themes menangani tema, dan Sonner memberi feedback singkat. Semua identitas visual dibuat sebagai SVG lokal agar konsisten dan tidak bergantung pada layanan gambar eksternal.

Dokumen produk di `docs/hive/` tetap menjadi acuan untuk integrasi lanjutan. README ini menjelaskan cakupan yang benar-benar berjalan pada frontend demo, termasuk batasnya.
