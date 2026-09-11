# Decisions & Dependencies

Keputusan implementasi di bawah mengisi detail yang belum ditetapkan konsep, tanpa mengubah mekanik pertandingan. Integrasi eksternal yang belum tersedia tetap dicatat jujur. Register ini membedakan **bisa membangun frontend** dari **boleh menyebutnya terintegrasi live**.

## 1. Decisions

| ID | Keputusan | Alasan / konsekuensi |
|---|---|---|
| D01 | A Porcelain + indigo menjadi baseline build; B/C arsip riset | Mengikuti rekomendasi riset yang diteruskan pengguna; tidak perlu mengirim3brand themes |
| D02 | Landing primary Jelajahi Hives; Masuk/Join tetap terlihat | Riset desain terbaru memprioritaskan pemahaman sebelum auth. PRD awal menyebut Join primary; ini perubahan CTA presentasi, bukan auth/competition rule |
| D03 | Canonical locked berbeda dari service accepted | PRD kompetisi lebih ketat daripada copy ringkas pada research board. Gunakan receipt states lengkap; success ringkas board tidak boleh disalin sebagai network authority |
| D04 | Next App Router/React/TS, Tailwind 4, Query 5, Zod, Vitest/Playwright sebagai stack baseline | Tidak ada repo frontend existing saat audit. Stable patch dan Node dipilih/divalidasi ketika kickoff, lalu locked |
| D05 | Satu typed BFF/gateway untuk mock/live | Browser/component tidak mengimpor secret fixture atau provider-specific model |
| D06 | Mock world server-only, client menerima projected snapshots | Demo tetap memodelkan privacy/barrier; hidden data bukan sekadar CSS |
| D07 | SSE invalidation + snapshot, REST mutations, polling fallback3s | Mengurangi logika event merge yang dapat mengungkap state tidak lengkap; backend live harus mendukung atau adapter memetakan |
| D08 | Mobile Home/Arena/Hives/Profile; Rankings accessible melalui Arena/Profile | Mempertahankan semua tujuan navigasi tanpa lima ikon sempit; desktop4nav canonical |
| D09 | System sans, semantic tokens, native CSS motion | Memprioritaskan readability dan output lokal tanpa asset eksternal wajib |
| D10 | Frontend reference fixed-point: scale1e6, BigInt, formula di Data Contracts | Merinci baseline floor PRD. ABI/provider/backend harus cocok sebelum live; UI bukan scorer authority |
| D11 | Text encoding NFC single-line v1, code point counter | Menyelesaikan ambiguitas words/characters/Unicode. Konfirmasi test vectors bersama provider sebelum live |
| D12 | Tidak persist plain-text call/salt/envelope di browser storage | Recovery melalui authenticated gateway/provider; draft memory dapat hilang pada reload |
| D13 | Form limits dan presence TTL60s sebagai baseline frontend contract | Detail baru untuk implementasi; disamakan server saat integrasi, bukan diasumsikan dari PRD |
| D14 | Console operator minimal termasuk scope, tidak perlu admin dashboard canggih | PRD memerlukan setup/roster/health/moderation; tanpa arbitrary winner override |
| D15 | Roster fixture memakai Aster/Orbit/Moss/Echo/Nova | Selaras papan desain; mapping alias PRD dicatat. Snapshot produksi selalu preserve nama historis |
| D16 | Google nyata hanya live; demo login diberi label tersendiri | Tidak mengklaim Google auth/uniqueness pada seed account |
| D17 | UI copy Indonesia + nama fase Inggris | Sesuai pengguna awal; dictionary terpusat supaya penerjemahan berikutnya tidak mengubah enum |
| D18 | Public/member/owner projection terpisah meskipun route sama | Mencegah private props terbawa SSR/RSC/cache publik |

Tidak ada keputusan di atas yang mengubah equal Squad weights, jumlah ronde, scoring, hidden final revision, no betting/token, atau reputasi tanpa voting power.

## 2. Dependency register

| ID | Dependency | Default untuk frontend build | Bukti agar live gate terbuka | Owner fungsi |
|---|---|---|---|---|
| DEP01 | Google project/client/callback domains | Demo session berlabel; sign-in live unavailable | OAuth success/cancel/expiry/redirect tests dengan config nyata | Backend/identity |
| DEP02 | Session/auth library dan deployment secrets | Interface BFF + mock cookie aman lokal | Secure cookie, CSRF/origin, resource auth tests | Backend/security |
| DEP03 | Embedded account/provider SDK | Mock IdentityAdapter state machine | Provision idempotent, recovery, scoped sessions, failure/retry | Web3/identity |
| DEP04 | Eligibility provider/policy | Mock tiers/expiry/revocation | One-active-roster policy, attestations, expiry/server validation | Product/identity |
| DEP05 | Monad network/contract addresses/ABI/finality | No numeric network/tx claim; opaque demo refs | Verified deployments, ABI, encoding vectors, finality/reorg policy | Contract team |
| DEP06 | Commitment/encrypted reveal custody | Mock envelope/receipt states | Domain separation, salt entropy, custody/recovery, barrier reliability | Contract/backend/security |
| DEP07 | Backend/indexer API/events | Typed MockGateway | Schema conformance, event cursor/gap, projection, idempotency | Backend |
| DEP08 | Steam question registry/resolver schedule | Synthetic snapshots labeled demo | Approved apps/source/time windows/tolerances tested; void rules | Resolver/operator |
| DEP09 | Canonical scoring precision | BigInt reference vectors | Backend/contract/indexer conformance termasuk thirds/ties | Contract/backend |
| DEP10 | Asset collection dan licenses | Orisinal placeholder/PFP/crest/sigil; text game names | Asset registry, rights, small-size/light-dark checks | Design |
| DEP11 | Sound assets | Capability unavailable/off | Licensed/original cues, opt-in/browser behavior tested | Design/frontend |
| DEP12 | Hosting/runtime/caching | Local app; no deploy assumption | SSE or mapped transport, secrets, private cache isolation | Platform |
| DEP13 | Moderation/retention/adjudication policy | Mock moderation+incident states | Role/reason/audit/retention implementation and disclosure | Product/backend |
| DEP14 | Real traction/usability outcomes | Tidak diklaim | Playtest and actual use data sesuai research plan | Product/research |

DEP01–DEP09 dan DEP12–DEP13 membatasi live readiness, bukan menghalangi build mock lengkap. DEP10 baseline orisinal dapat dibuat saat frontend build. Sound opsional dan tidak menjadi alasan menunda fitur inti.

## 3. Konflik yang sudah diselesaikan

1. **PRD Join vs riset Explore:** D02 mengutamakan research terbaru untuk CTA; flow Google tetap canonical.
2. **“Call tersimpan” di storyboard vs finality:** D03 dan Match State Machine memakai status terpisah; UI tidak menyatakan locked dari202.
3. **Board metadata11–13 px vs readability produksi:** Design menetapkan body16 px dan critical status≥14; board hanyalah studi padat.
4. **Hero Home/landing labels berbahasa campuran:** Content dictionary menetapkan bahasa Indonesia; nama domain tetap Inggris jika canonical.
5. **Fixture nama PRD vs papan:** D15 mapping eksplisit, angka tidak berubah; tidak berlaku untuk mengganti history produksi.
6. **MVP cepat vs outcome30menit:** User menyelesaikan interaksi lalu menunggu outcome; demo virtual clock jelas berlabel; tidak menghapus pending state.

## 4. Hal yang tidak boleh “diputuskan” sendiri saat build

Jangan mengganti voter aggregation, denominator, forfeit/default policy, valid round threshold, signal visibility, score formula, economic scope, atau human-verification claim untuk membuat demo lebih mudah. Jika layanan tidak mendukung aturan, catat incompatibility dan gunakan mock yang benar sementara integrasi diperbaiki.

Tidak membuat sponsor vault atau Agenda Ticket UI sebagai feature aktif. Tidak menambahkan badge membeli advantage. Tidak memberi frontend master key/resolver override. Tidak menampilkan saldo palsu atau transaksinya seolah sudah terjadi.

## 5. Format ADR perubahan berikutnya

Setiap perubahan mencatat tanggal, konteks, keputusan, alternatif yang ditolak, dampak pada PRD/design/API/tests, dan bukti validasi. Jika mengubah rule version, match lama tetap merujuk version lama. Update dokumen terkait dan Traceability dalam perubahan yang sama. Routine implementation choices yang tidak mengubah rules dapat diputuskan engineer dengan alasan singkat.

## 6. Sumber technical baseline

Dokumentasi resmi diperiksa 9 September 2026: [Next server/client](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Next auth](https://nextjs.org/docs/app/guides/authentication), [Tailwind theme](https://tailwindcss.com/docs/theme), [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [Zod](https://zod.dev/basics), [Vitest](https://vitest.dev/guide/), [Playwright assertions](https://playwright.dev/docs/test-assertions). Sumber mendukung penggunaan tool/framework; architecture spesifik HIVE adalah keputusan dalam paket ini. Versi paket belum terinstall atau dibenchmark.
