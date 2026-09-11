# Architecture — HIVE Frontend

**Status:** keputusan build frontend; belum menggambarkan backend yang sudah ada. Tidak ditemukan repository frontend/package manifest saat paket dibuat. Semua endpoint di Data Contracts adalah contract usulan v1 untuk mock dan integrasi berikutnya.

## 1. Stack baseline

| Lapisan | Pilihan | Alasan dan batas |
|---|---|---|
| App | Next.js App Router + React + TypeScript strict | Public pages/metadata dan interactive authenticated app dalam satu project |
| Style | Tailwind CSS v4 + semantic CSS variables | Konsistensi spacing/token; komponen tetap punya API |
| Client server-state | TanStack Query v5 | Query, mutation status, invalidation, request lifecycle |
| Validation | Zod | Validasi DTO dan forms di boundary; TypeScript saja tidak memvalidasi jaringan |
| Local state | React hooks/reducer | Draft, modal, tabs; tidak perlu global store tambahan pada baseline |
| Motion | CSS transform/opacity + reduced-motion | Tidak memerlukan library animasi besar untuk momen yang ditetapkan |
| Icons | Satu paket SVG berlisensi, baseline Lucide atau set SVG internal | Verifikasi versi/lisensi saat setup; jangan campur gaya icon |
| Test | Vitest + Testing Library; Playwright untuk E2E | Domain/reducer/component dan alur browser |
| Package manager | npm + package-lock.json | Baseline sederhana; `npm ci` untuk build reproducible |

Pilih stable versions yang kompatibel saat kickoff, pin versi dependency langsung dan commit lockfile. Dokumentasi Next yang diperiksa menampilkan 16.x; paket ini tidak mengunci patch yang belum diinstall/divalidasi. Tidak memakai canary. Runtime Node mengikuti requirement stable Next yang dipilih; verifikasi dan tulis pada `.nvmrc`/`engines` saat setup. Ini pekerjaan kickoff, bukan alasan menunda screen mock.

## 2. Batas sistem

```text
Browser
  UI components → feature hooks/reducers → typed HTTP client
                     ↓
Next BFF / route handlers (session, CSRF, projection, schema)
                     ↓
             HiveGateway interface
          ┌──────────┴──────────┐
          MockGateway          LiveGateway
          deterministic        backend/indexer/provider
          virtual clock        policy/chain/outcome services
```

Mock dan live memiliki bentuk respons serta error yang sama. Browser tidak mengimpor seed yang memuat outcome tersembunyi. Server mock menyimpan world/scenario; endpoint hanya mengirim projection sesuai viewer/fase. Untuk demo lokal boleh memakai in-process state berisolasi per session, dengan reset eksplisit; tidak dipakai sebagai persistence atau multi-instance production.

BFF tidak menjadi oracle, signer master key, atau pembuat winner. LiveGateway mengakses layanan yang memang berwenang. Provider wallet/commitment SDK masuk lewat adapter; UI hanya mengenal status dan action contract.

## 3. Struktur repository tujuan

```text
src/
  app/
    (public)/page.tsx
    (public)/explore/page.tsx
    (shared)/hives/[hiveSlug]/page.tsx
    (shared)/squads/[squadId]/page.tsx
    (shared)/humans/[handle]/page.tsx
    (shared)/rankings/page.tsx
    (shared)/watch/[matchId]/page.tsx
    (shared)/replays/[replayId]/page.tsx
    (shared)/proof/[matchId]/page.tsx
    (auth)/sign-in/page.tsx
    (auth)/onboarding/[step]/page.tsx
    (app)/home/page.tsx
    (app)/arena/page.tsx
    (app)/arena/[matchId]/lobby/page.tsx
    (app)/arena/[matchId]/play/page.tsx
    (app)/arena/[matchId]/results/page.tsx
    (app)/notifications/page.tsx
    (app)/settings/...
    (internal)/operator/...
    api/v1/...
    layout.tsx
    globals.css
  components/ui/          # button, field, dialog, tabs, skeleton
  components/identity/    # PFP, crest, sigil, identity row
  components/layout/      # PublicShell, SocialShell, FocusShell
  features/
    auth/ onboarding/ community/ home/ arena/ match/ replay/
    reputation/ notifications/ settings/ operator/
  domain/                 # enums, types, safe selectors, fixed-point reference
  contracts/              # Zod schemas, API envelopes, projections
  lib/client/             # fetch client, query keys, clock sync
  lib/server/             # session, authz, gateway factory, csrf
  adapters/mock/          # server-only world, fixtures, scenario runner
  adapters/live/          # gateway mapping, provider adapters
  content/                # locale dictionaries, deterministic story templates
  styles/                 # tokens, motion, typography
tests/ unit/ component/ contract/ e2e/
public/assets/ identities/ icons/
docs/hive/                # paket ini
```

Route group tidak menambah segmen URL. Tidak membuat public dan authenticated page berbeda untuk URL `/hives/[slug]` yang sama; gunakan shared route, projection viewer, dan shell yang sesuai. Feature tidak mengimpor feature lain secara melingkar; gunakan domain/contracts untuk data bersama. Komponen UI tidak memanggil API sendiri.

## 4. Server/client rendering

Server Components merender metadata, public content, initial session projection, dan shell statis. Client Components terbatas pada forms, query subscriptions, match timer, choice actions, dialogs, preference toggles. Jangan memberi `'use client'` pada root seluruh app hanya untuk satu countdown. [Next server/client components](https://nextjs.org/docs/app/getting-started/server-and-client-components), diperiksa 9 September 2026.

Public metadata hanya dari sanitized public DTO. Private DTO tidak boleh menjadi props Server Component yang kemudian bocor dalam serialized payload. HTML/RSC/cache diperiksa selain UI terlihat. Tidak melakukan public static caching untuk session/member-specific data.

## 5. Kepemilikan state

| State | Pemilik | Persistence |
|---|---|---|
| Session, eligibility, roles | BFF/provider | Secure session cookie; server authoritative |
| Match phase/roster/receipt/result | Backend/gateway | Snapshot + versioned events; client cache sementara |
| Choice draft sebelum submit | Pemain/client | Memory; tab reload dapat memerlukan pemilihan ulang |
| Accepted commitment/recovery | Provider secure adapter + backend receipt | Bukan localStorage atau analytics |
| Argument draft | Representative | Server draft privat; optional memory buffer untuk typing |
| Filter/tab/page | URL search params | Shareable; tanpa secrets |
| Modal selection, expanded card | Component/reducer | Memory |
| Theme/motion/sound | Preferences | Non-sensitive cookie/local preferences; sync account bila login |

Public profile cache terpisah dari private owner view. Query key minimal menyertakan resource, id, viewer scope/session identity bila privat, dan format/season bila statistik. Clear seluruh private cache serta in-flight requests saat logout/switch account. Hindari memperlihatkan data akun sebelumnya selama transisi.

## 6. Query/mutation policy

Pengaturan berikut adalah baseline HIVE, bukan default library. Query publik ringan stale 60 s; home 15 s; match snapshot stale 0 dengan event stream; settled Replay versioned dapat cache 5 menit dan tetap invalidatable. Private responses HTTP `Cache-Control: private, no-store`.

TanStack Query dapat refetch pada mount/focus/reconnect dan melakukan retry; tetapkan pilihan secara eksplisit untuk match agar perilaku tidak mengejutkan. [Important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).

Read retry maksimal dua untuk network/5xx dengan backoff; tidak retry 401/403/404/409/422 secara buta. Decision mutation tidak otomatis retry dengan pilihan baru: cek receipt idempotency terlebih dahulu, lalu retry payload yang sama jika masih eligible. Optimistic update hanya aksi reversibel seperti mark notification read dengan rollback; tidak untuk locked/final score/winner.

## 7. Real-time dan waktu

Gunakan SSE same-origin untuk snapshot/event updates; fallback polling snapshot 3 s bila stream unavailable. REST untuk mutations. Client tidak membuka SSE token melalui query URL. Heartbeat membawa serverNow; snapshot mempunyai version, phaseVersion dan deadlines. Stream reconnect menggunakan cursor; gap berarti refetch snapshot, bukan menebak event yang hilang.

Clock service menghitung offset dari timestamp server dan waktu monotonic permintaan. Render countdown dari absolute deadline, bukan decrement counter yang bergantung tab aktif. Jika clock/stream stale pada aksi kritis, lakukan sync; pada deadline kontrol lama nonaktif. Hidden tab menghentikan motion/audio; foreground refetch sebelum mengaktifkan submit. Backend tetap menegakkan deadline.

## 8. Error, performance, dan observability

Route error boundary memberi retry/back tanpa menutup navigasi. Feature error tetap lokal jika data lain sah. 404 resource privat tidak membocorkan keberadaan; unauthorized membership memakai pesan aman. Unknown schema/version gagal tertutup: jangan merender hasil yang tidak dimengerti.

Budget desain engineering awal: tidak ada horizontal overflow 320–1440 px; match action tidak menunggu animation; lazy load charts/proof/detail/media; image memiliki width/height; public hero tanpa video autoplay. Target pengukuran awal LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 pada perangkat/jaringan uji yang dicatat; target ini belum terbukti dan bukan SLA. Ukur hasil build, bukan klaim dari mock.

Telemetry allowlist: page_view (route pattern), onboarding_step_completed, lobby_ready_result, decision_submit_result (stage/status/error code tanpa choice), phase_sync_failed, replay_opened, share_preview_opened, preference_changed. Jangan log email, chat, argument draft, private call, salt, encrypted payload, token, atau penuh URL invite. Error log memakai requestId dan resource ID yang diizinkan, tanpa body sensitif.

## 9. Dependency dan implementasi bertahap

Semua read/write feature lewat typed API; contract validation memakai Zod `safeParse`/equivalent untuk menolak shape invalid. [Zod basics](https://zod.dev/basics). UI dapat selesai dengan MockGateway. Live auth/account/chain/eligibility tetap gate produksi dalam [Decisions](DECISIONS_AND_DEPENDENCIES.md).

Package scripts dan setup tersedia dalam [Implementation Plan](IMPLEMENTATION_PLAN.md). Architecture ini tidak menetapkan hosting provider atau deploy otomatis; kemampuan runtime SSE dan secret storage perlu diverifikasi saat memilih hosting.
