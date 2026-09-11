# Build Prompt — brief untuk tahap frontend berikutnya

Gunakan brief di bawah ketika memulai implementasi. File ini adalah panduan yang dapat disalin, bukan instruksi untuk membangun frontend pada tugas penyusunan dokumen sekarang.

---

Bangun frontend HIVE berdasarkan paket `docs/hive/` atau lokasi paket yang diberikan. Baca README, PRD, DESIGN, ARCHITECTURE, ROUTES_AND_SCREENS, COMPONENTS, MATCH_STATE_MACHINE, DATA_CONTRACTS, FIXTURES_AND_SCENARIOS, AUTH_SECURITY_WEB3, dan IMPLEMENTATION_PLAN sebelum mengubah domain behavior. Gunakan CONTENT_AND_ASSETS, ACCESSIBILITY_AND_MOTION, TESTING_AND_ACCEPTANCE, serta DECISIONS_AND_DEPENDENCIES selama pengerjaan.

Tujuan: frontend social community dengan competitive gaming yang matang, bersih, dan memiliki euforia pada momen penting. Baseline Porcelain + indigo; light/dark dengan hierarchy sama. Identitas Human memakai PFP, Squad memakai crest, Hive memakai sigil. Home mendahulukan manusia dan next action; Council mendahulukan alasan; Resolve mendahulukan hasil yang sah.

Periksa repository dan instruksi lokal terlebih dahulu. Gunakan stack existing yang kompatibel; jika kosong gunakan baseline Next App Router/React/TypeScript, Tailwind 4, TanStack Query 5, Zod dan testing yang ditetapkan. Pilih stable versions dan lock dependencies. Jangan menyalin HTML papan riset sebagai aplikasi statis akhir.

Bangun semua routes consumer serta console operator minimal sesuai scope R01–R25. Prioritaskan vertical slices yang berjalan: public discovery → identity/onboarding → Home/Squad → Lobby → tujuh fase → pending outcomes → results → Replay/share. Implementasikan empty/loading/stale/error/permission/session-expired, mobile/desktop, light/dark, keyboard, dan reduced-motion bersama screen, bukan setelah happy path saja.

Bangun typed server MockGateway lebih dulu dengan fixtures deterministic. Browser memakai projection API yang sama dengan live contract. Jangan mengimpor full fixture/hidden outcome ke public bundle. Demo login, data, participants, virtual clock dan receipt harus jelas berlabel demo. Kalau credential/backend/provider live tidak tersedia, teruskan frontend mock lengkap; laporkan dependency live tanpa mengganti aturan atau mengklaim integrasi nyata.

Pertahankan invariants berikut:

- Satu Human satu active Squad/season; Squad 3–5, seats Hive sama, frozen roster; equal Squad weight.
- Think→Deliberate→Commit→Reveal→Council→Revision→Resolve, tiga ronde; final lock bukan fase tambahan.
- Selected/submitting/service accepted/chain submitted/canonical locked berbeda; 202 bukan locked.
- Initial/final data tidak dikirim sebelum barrier; final revision choices/attribution tetap hidden sampai semua hak revisi tertutup.
- Chat post hanya Deliberate/Council di own Squad; card argument frozen, maksimal 30 kata/240 code points, tanpa reputation badge di Council.
- Defaulted Stay berbeda dari failed final reveal; forfeit, void, draw, no contest tidak digabung.
- Score/total canonical, Wisdom Lift dalam pp, score lift terpisah; winner dari total, bukan ronde terbanyak.
- Google auth bukan human uniqueness; wallet/Monad di belakang layar; advanced proof tetap bisa dibuka.
- Tidak ada betting/token/wager/ekonomi baru, fake presence/traction, atau personal choice publik tanpa izin.

Gunakan fixtures sebagai sumber acuan bersama; F-POSITIVE 91/84/+15 pp/+11,25 score lift, F-NEGATIVE 51/64/−15 pp, full match 257/216, dan round-count trap 201/267 harus benar. Uji boundary waktu, unknown receipt/retry, reconnect/multitab, projection privacy, dan schema errors.

Primary CTA harus memiliki navigation atau handler lengkap; tidak ada placeholder `href="#"`, success palsu, atau data hardcode tersebar di komponen. Asset identity baseline boleh orisinal SVG/raster dengan registry lisensi dan fallback. Sound tetap off dan opsional. Jangan memakai upload user SVG aktif.

Selesaikan tahap IMPLEMENTATION_PLAN secara bertahap. Jalankan checks yang relevan setelah setiap slice, lalu full acceptance sebelum menyebut frontend selesai. Laporkan hasil nyata, tes yang belum dijalankan, dan dependency live yang tersisa. Sertakan README setup, .env.example tanpa secret, lockfile, test evidence, screenshots, dan cara membuka demo. Deployment terpisah mengikuti instruksi pengguna pada task build.

---

## Cara menilai output builder

Output yang benar adalah aplikasi yang dapat digunakan sepanjang flow, bukan sekadar layout Landing/Home. Mock yang jujur dan domain-complete lebih berguna daripada mengaku Web3 live tanpa receipt/eligibility/outcome yang nyata. Gunakan [Traceability](TRACEABILITY.md) untuk review setiap kebutuhan dan [Testing](TESTING_AND_ACCEPTANCE.md) untuk bukti lulus.
