# Testing & Acceptance

Dokumen ini menentukan tes yang **harus dijalankan saat build frontend**. Paket Markdown ini tidak mengklaim tes aplikasi tersebut sudah dijalankan. Bukti verifikasi dokumen ada di Traceability.

## 1. Lapisan pengujian

| Lapisan | Scope | Alat baseline |
|---|---|---|
| Domain/unit | fixed-point vectors, phase selector, time boundary, outcome semantics, safe story | Vitest |
| Contract | Zod request/response, projection, hidden fields, errors/idempotency | Vitest + mock gateway server |
| Component | inputs, keyboard, callbacks, pending, unavailable, long content | Testing Library |
| E2E | route/session flow, tujuh fase, reload/reconnect, share, operator | Playwright |
| Visual/manual | palette/layout/identity/motion/readability | Browser + screenshots + checklist |
| Live integration | OAuth/provider/chain/eligibility/outcome gateway | Sandbox services + contract conformance suite |

Vitest digunakan untuk test cepat yang terisolasi; [panduan resmi](https://vitest.dev/guide/). Playwright assertions yang retry terhadap kondisi UI digunakan untuk menunggu state, bukan fixed sleep agar tes kebetulan lolos; [assertions resmi](https://playwright.dev/docs/test-assertions). Sumber diperiksa 9 September 2026.

## 2. Acceptance utama

| ID | Given / When | Then / bukti |
|---|---|---|
| T01 | Guest membuka R01–R09 | Public resources sah terbaca tanpa auth; private resources safe 404; primary CTA jelas |
| T02 | Valid invite lalu auth/onboarding | Intent dan afiliasi benar; Ready bukan fake eligible; returning/deferred paths bekerja |
| T03 | Invite full/expired atau username race | Error spesifik, input identity tidak hilang, ada alternatif |
| T04 | Home active/forming/empty/stale | Satu next action sah; expired presence tidak online; empty≠error |
| T05 | Human/Squad/Hive tampil berdampingan | PFP/crest/sigil serta link route benar, label mudah dikenali |
| T06 | Phase transition baseline seluruh tujuh fase | Chat/editor/actions hanya fase sah; no extra decision phase |
| T07 | Tepat t=deadline | Old action disabled/rejected; t<deadline tidak otomatis menjamin chain accepted |
| T08 | POST202 lalu chain pending | “Diterima layanan” muncul; tidak locked sampai canonical receipt |
| T09 | Network putus setelah acceptance + retry | Query receipt key; tepat satu decision canonical; payload baru ditolak |
| T10 | Initial/final reveal belum boleh | Angka/choice/salt tidak ada di API/HTML/RSC/query cache/public bundle/DOM |
| T11 | Initial reveal/Council | Batch aggregate; card Hive sendiri, urutan stabil, tanpa rank/influence/accuracy badge |
| T12 | Argument31 kata atau241 code points | Ditolak client/server;30/240 yang valid diterima; frozen immutable |
| T13 | Stay atau Switch | Stay tanpa attribution; Switch satu source valid; own/rival/unavailable card ditolak |
| T14 | Missing final vs failed final reveal | F-DEFAULT87,75/+10 pp vs F-FINAL-FAIL0/N/A; tidak tertukar |
| T15 | Semua score fixtures | F-POSITIVE91/84/+15/+11,25; F-NEGATIVE51/64/−15; equal-weight/thirds tepat |
| T16 | Satu pihak unggul2 ronde tetapi total kalah | F-ROUND-COUNT Chog267 vs Purple201; winner total benar |
| T17 | Void/no-contest/draw/forfeit | Label dan unit tepat; no-contest tidak W/L/D; N/A bukan 0 belief |
| T18 | Ronde1 menunggu outcome, ronde2 berjalan | Current phase tetap ronde2; result event tidak mengambil alih keputusan |
| T19 | Reconnect/stale events/multi-tab | Phase tidak mundur; receipt dipulihkan; hanya satu canonical commit |
| T20 | Replay published/moderated/unpublished | Public projection; unavailable card placeholder; score tetap; safe 404 untuk unpublished |
| T21 | Share preview/cancel/copy | Tidak ada personal/chat/email; demo label; tidak auto-post; cancel bukan error |
| T22 | Logout/ganti akun/session expiry | Private cache/stream dibersihkan; no cross-account data; safe return |
| T23 | Unauthorized/direct API request | Server menolak meski UI button dimanipulasi; resource authorization |
| T24 | Operator sebelum/sesudahlock | Prelock changes sah; frozen roster/rules tidak diedit; no arbitrary winner |
| T25 | Keyboard/dialog/choice/errors | Focus/labels/semantics benar; tidak ada keyboard trap di luar dialog |
| T26 | Light/dark/mobile320/390/desktop1440 | Hierarchy konsisten, no horizontal overflow, tap targets, long text readable |
| T27 | Reduced motion/sound off | Data dan actions tetap tersedia; animation nonesensial off; tidak ada auto-sound |
| T28 | schema unknown/correction/disputed | Safe error/refetch; raw vs adjudicated terpisah; no fake result |
| T29 | Provider tidak dikonfigurasi live | Configuration unavailable; tidak fallback mock/Google palsu |
| T30 | Source snapshots/timing invalid | Gateway void sesuai rules; UI tidak memilih A/B sendiri |

## 3. Test vectors dan negative coverage

Fixture generator harus menolak member duplicate, seats berbeda, roster size di luar format, vote count>roster, final totals bocor, source card salah Hive/Squad/round/version, expired eligibility, metric provisional tanpa sample count, and score float rounding mismatch. Test Brier p0,0.5,1 untuk A dan B; range score 0..100; lift−100..100 pp; floor division1/3; total canonical before formatting.

Argument tests: Unicode NFC setara, surrogate-pair emoji dihitung code point, whitespace normalization, boundary 30 words/240 characters. Jangan hanya menguji counter UI lalu mengabaikan payload yang dihash. Backend/provider encoding mismatch adalah gate live gagal.

Leak testing melakukan inspection network/HTML/RSC/preload/local storage/cache, bukan hanya assertion teks tidak terlihat. Buat canary private value pada server fixture dan pastikan tidak masuk response/bundle terlarang. Secret scan tidak mencetak secret ke log.

## 4. E2E journeys minimum

J1 Guest → Explore → Hive → valid invite → demo auth → onboarding → Home → Lobby. J2 Full3 round match → pending outcomes → resolved totals → Replay/share. J3 Unknown receipt → reload → Council → Switch → default/failed-final variants. J4 Public spectator/owner/member mengakses resource sama dan menerima projection berbeda. J5 Operator prelock validation/moderation + forbidden attempts. J6 Keyboard/mobile/reduced motion sepanjang primary flow.

Gunakan virtual server clock untuk phase advance; jangan menunggu30menit nyata dalam E2E. Test real timing smoke terpisah memastikan offset/resync dengan latency. Manipulasi clock harness hanya test, tidak tersedia pada live.

## 5. Visual matrix

Core screens: Landing, Home aktif/sepi, Hive, Squad, Onboarding, Lobby, Think, Commit pending/locked, Reveal, Council long card, Revision, Awaiting outcome, Resolve positive/negative/void, Replay, Settings. Screenshot Light/Dark desktop1440 dan mobile390. Reflow smoke320 dan text200%. Existing comparison board reference bukan pixel-perfect target; ukur konsistensi tokens, hierarchy, identities, density dan state.

Manual review: orang terlihat sebelum stats, area fokus tidak ramai, crest/sigil berbeda, error dapat dibaca, status hasil tidak salah, no false live activity. Jangan menutup kekurangan state dengan screenshot hero yang cantik.

## 6. Command contract saat project ada

Target scripts: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:contract`, `npm run test:e2e`, `npm run build`. Lint/TypeScript tidak boleh diabaikan melalui flag build. E2E menjalankan app melalui webServer config dan teardown yang benar. CI memakai `npm ci`.

Semua test deterministik, fixture reset antarcase, tidak bergantung urutan, tidak memanggil Google/Steam real untuk unit tests. Integration smoke menggunakan sandbox khusus dengan credentials server yang sah. Screenshots/traces yang disimpan tidak berisi data pengguna nyata atau private commitments.

## 7. Definition of done frontend demo

Semua R01–R25 memiliki behavior scope yang dijanjikan, dengan console internal minimal. Semua T01–T29 yang dapat diuji mock lulus; T30 diuji melalui resolver response scenarios, bukan mengklaim API Steam nyata diuji. Full3 round narrative berjalan dari gateway; demo auth jelas; tidak ada dead primary button, leak, fake success, atau runtime error. Routes deep-link bekerja, assets lokal valid, metadata public tepat, basic accessibility teruji.

Bukti release mencatat commit/version, command hasil, scenario, screenshots, known limitations. Tes belum berjalan diberi label belum dijalankan, bukan checkbox centang. Performa target Architecture diukur dan hasil dicatat.

## 8. Gate live tambahan

Session/auth-provider integration, CSRF/security, account provisioning/recovery, eligibility service, signed commitments/domain encoding, encrypted envelope custody, canonical receipts/finality, reveal deadline reliability, resolver/time policy, indexer correction/reorg, public proof availability, backend contract conformance, privacy/retention configuration, secret-free production bundle, dan observability. Live release gagal bila salah satu action kritis hanya mock.

Perubahan pasca-tes diuji ulang sesuai area yang terdampak. Jangan mengulang seluruh suite tanpa alasan; jangan menganggap perubahan dokumentasi sebagai bukti aplikasi live benar.
