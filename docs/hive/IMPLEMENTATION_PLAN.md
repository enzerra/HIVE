# Implementation Plan

Paket ini mempersiapkan implementasi; perintah dan struktur di bawah dijalankan pada giliran build frontend, bukan dianggap sudah dijalankan sekarang. Tidak membangun/deploy frontend dalam tugas penyusunan Markdown ini.

## 1. Urutan build dan gate

| Tahap | Pekerjaan | Selesai bila |
|---|---|---|
| B01 Foundation | Inspect repo, stack lock, source folder, semantic tokens, shells, typography, primitives | Dev/build/typecheck berjalan; theme dan navigation dasar responsive |
| B02 Domain & gateway | Types/Zod, query client, error envelopes, server mock world, virtual clock, projection, fixtures | Fixture/contract vectors dan leak guard lulus sebelum match UI |
| B03 Public experience | Landing, Explore, Hive/Squad/Human public, Rankings, Watch, Replay/Proof read shells | Guest memahami hierarchy dan deep-links public bekerja |
| B04 Identity & social | Demo auth berlabel, onboarding4step/defer, invites, Home, profile/settings/notifications | J1 lengkap dengan forming/full/expired/error |
| B05 Arena & lifecycle | Arena list, Lobby, roster/eligibility/readiness, phase shell, clock/reconnect | Roster lock dan deadline guards tested |
| B06 Decision core | Think/Deliberate/Commit, private chat, argument freeze/commit, receipts, Reveal | T06–T12/T19/T23; tidak ada fake locked atau data leak |
| B07 Council & revision | Card projection/order, Stay/Switch attribution, hidden final, defaults/failures | T13–T14 dan barrier tests lulus |
| B08 Outcomes & story | Pending/live schedules, all results, totals, Replay scenes/share/proof | F-POSITIVE/F-NEGATIVE/F-DRAW/F-VOID/F-NO-CONTEST dan J2 lulus |
| B09 Support & craft | Operator minimal, moderation, full empty/error matrix, identity assets, motion/a11y | R01–R25 dan visual/accessibility checklist lengkap |
| B10 Demo release candidate | Full tests/build/perf, sanitized logging, no-dead-buttons audit | Frontend demo DoD, reviewable evidence, known limitations |
| B11 Live integration | Provider/gateway/chain/etc yang tercatat dependencies | Live gates lulus; credentials hilang fail-closed |

B02 memberi fondasi supaya B06 tidak memakai state booleans yang mustahil disinkronkan. B09 bukan alasan menunda basic accessibility sampai akhir; keyboard/error/theme diterapkan bersama komponen sejak B01. Prototype visual boleh berevolusi, tetapi rules invariants tidak menunggu polish.

## 2. Kickoff repository

Periksa AGENTS/repo instructions, working tree, existing stack dan scripts. Bila ada app yang relevan, gunakan arsitektur existing yang setara dan catat ADR; jangan membuat project duplikat. Bila kosong, buat Next App Router TypeScript project baru dalam folder project yang disepakati atau current workspace sesuai user build scope. Jangan menimpa output PRD/research.

Pilih stable Next/React kompatibel, Node supported LTS, Tailwind 4, Query 5, Zod, test tooling. Gunakan documented setup tool masing-masing; lock exact direct versions dan package-lock. Verifikasi release notes/security saat kickoff karena versi dapat berubah. Simpan `.env.example` tanpa secrets. Docs folder tetap dapat dibaca tanpa menjalankan app.

## 3. Scripts target

| Script | Isi kontrak |
|---|---|
| `dev` | Start Next development server |
| `build` | Next production build dengan type/lint gate terpisah yang dijalankan CI |
| `start` | Start output production yang berhasil dibuild |
| `lint` | ESLint source/test tanpa silent-ignore error |
| `typecheck` | TypeScript noEmit strict |
| `test` | Vitest run domain/components |
| `test:watch` | Vitest interactive untuk developer |
| `test:contract` | Isolated DTO/projection/fixture suite |
| `test:e2e` | Playwright suite dengan webServer lifecycle |
| `test:fixtures` | Generator validation deterministic vectors |

Baseline urutan pemeriksaan build:

```text
npm ci
npm run lint
npm run typecheck
npm run test
npm run test:contract
npm run test:e2e
npm run build
```

Jika scripts existing berbeda, dokumentasikan pemetaan dan jalankan padanannya; jangan mengklaim script yang belum dibuat sudah tersedia. Tidak memerlukan deploy untuk memperlihatkan frontend lokal.

## 4. Environment contract

| Variable | Scope | Makna |
|---|---|---|
| `HIVE_DATA_MODE` | Server only | mock/live, default local mock eksplisit; production wajib set |
| `HIVE_DEMO_ENABLED` | Server only | Mengizinkan demo session/scenario; mustfalse untuk ranked live |
| `HIVE_GATEWAY_BASE_URL` | Server only | Backend API live; allowlisted origin |
| `HIVE_GATEWAY_TOKEN` | Secret server | Service auth bila digunakan |
| `HIVE_SESSION_SECRET` | Secret server/provider | Session library kebutuhan aktual |
| `GOOGLE_CLIENT_ID` | Server config | OAuth provider |
| `GOOGLE_CLIENT_SECRET` | Secret server | OAuth callback/server exchange |
| `HIVE_APP_ORIGIN` | Server config | Trusted redirect origin |
| `HIVE_PROVIDER_CONFIG` | Server config/secret ref | Account provider configuration; detail ditetapkan integration |
| `HIVE_NETWORK_CONFIG` | Server config | Verified network/contracts/explorer map, bukan private key |

UI menerima sanitized capabilities `{mode, demoEnabled, canGoogleAuth, canRanked, canSound}` sebagai server props, bukan seluruh env. Tidak ada secrets dengan `NEXT_PUBLIC_`. Developer diagnostic/scenario controls route server-guarded dan no-index.

## 5. Work slices untuk coding agent

Setiap slice mencakup route/komponen, data contract, fixture, states, responsive, test yang relevan. Contoh slice Commit: receipt model dahulu → API mock behavior → controls → canonical receipt update → unknown retry → boundary/leak test → screenshot. Tidak membuat16screen statis dahulu lalu menempelkan state match di akhir.

Setelah tiap tahap: ringkas yang berubah, cara diverifikasi, dan dependency nyata. Jika kontrak backend berbeda, perbarui adapter/ADR; jangan mengganti domain rule untuk menghindari kerja. Jika belum ada backend, teruskan frontend mock lengkap dan pisahkan live gate secara eksplisit.

## 6. Performance dan release review

Public pages memiliki metadata/OG/robots yang sesuai; invite/auth/internal no-index. Private API no-store dan session response tidak shared-cache. Lazy load heavy proof/media, reserve image sizes, no autoplay hero. Build report mencatat bundle/performance pada alat/perangkat yang digunakan, tanpa mengklaim semua device terpenuhi.

Review setiap CTA: navigasi valid atau mutation handler; pending/error; permissions; analytics aman. Internal operator actions diberi role guard. Preview deployment demo dapat digunakan setelah task build mengizinkan deploy; tidak memasang domain atau mempublikasikan dari instruksi dokumentasi ini saja.

## 7. Handoff dan evidence

Deliverable build nanti: source app, lockfile, README setup, .env.example, docs yang diperbarui, test results, screenshots route/state, demo scenario instructions, dependency register, known limitations, live readiness checklist. User harus bisa membuka alur secara lokal dan menjalankan tes dengan perintah jelas.

Gates dokumentasi dan gates aplikasi berbeda. Saat ini hanya paket panduan yang dibuat. [Testing](TESTING_AND_ACCEPTANCE.md) dan [Traceability](TRACEABILITY.md) menentukan bukti untuk build berikutnya.
