# Traceability & Documentation Acceptance

Dokumen ini menghubungkan kebutuhan pengguna ke spesifikasi dan bukti yang diperlukan saat frontend dibangun. **Status aplikasi: belum dibangun dalam tugas ini.** Status paket dokumen diverifikasi terpisah di bagian terakhir.

## 1. Kebutuhan → dokumen → tes

| Kebutuhan | Spesifikasi utama | Route/komponen | Acceptance build |
|---|---|---|---|
| P01 konsep public jelas | PRD1–4; Routes R01–R09 | Landing/IdentityRow/PublicShell | T01/T05 |
| P02 auth/onboarding | Routes R10–R11/R22; Auth1–2 | Identity/Squad/Hive/Ready forms | T02/T03/T22 |
| P03 Home sosial/next action | Routes R12; Design5–6 | HomePriority/Activity/Roster | T04 |
| P04 identity hierarchy | Design7; Content6; Components2 | HumanAvatar/SquadCrest/HiveSigil | T05/T26 |
| P05 match lengkap | Match State Machine seluruhnya | R14–R16; FocusShell | T06–T09/T18–T19 |
| P06 information barrier | Match3/8; Data2–3/7; Auth4 | Projected snapshots/Council | T10/T11/T23 |
| P07 score/reputation/influence | PRD5–6; Data9; Fixtures2–4 | Metric/Belief/Result | T13–T17 |
| P08 result states | Match7; Routes R16; Content3 | RoundResult/MatchResult | T14–T18/T28 |
| P09 replay/share | Routes R08; Data4; Content7 | ReplayTimeline/SharePreview | T20/T21 |
| P10 theme/responsive/a11y | Design2–8; Accessibility seluruhnya | Seluruh primitives/screens | T25–T27 |
| P11 hiddenWeb3/proof | Auth3–7; Routes R09/R21 | ReceiptDetail/ProofPanel | T08/T22/T29/T30 |
| P12 mock/live/build guidance | Architecture; Implementation; Decisions | Gateway/adapters/harness | T09/T10/T29 |

## 2. Cakupan panduan yang diminta pengguna

| Artefak/kebutuhan | File authoritative dalam paket | Bukti kelengkapan dokumen |
|---|---|---|
| PRD frontend + konsep lengkap | PRD.md + references/PRD konsep | Audience, problem, scope, flow, rules, non-goals, DoD |
| design.md | DESIGN.md | Light/dark tokens, spacing, type, identity, layout, state, contrast |
| architecture.md | ARCHITECTURE.md | Stack, folder, rendering, state ownership, gateway, cache, real-time |
| Page/public/auth flow | ROUTES_AND_SCREENS.md | R01–R25, access, content, CTA, responsive, recovery |
| Component guide | COMPONENTS.md | Primitives/social/match/replay inputs, invariants, callbacks |
| Match rules frontend | MATCH_STATE_MACHINE.md | Timeline, visibility, receipt, barrier, failures, reconnect |
| Data/API contract | DATA_CONTRACTS.md | Typed payloads, projection, reads, writes, events, errors, encoding |
| Fixture consistency | FIXTURES_AND_SCENARIOS.md | Roster 40 Human, three-round vectors, 25 scenarios, precision |
| Brand/copy/assets | CONTENT_AND_ASSETS.md | Terms, copy, state messages, forms, asset inventory, formatting |
| Gamification/motion | ACCESSIBILITY_AND_MOTION.md | Event-gated storyboard, durations, reduced motion, sound |
| Privacy/auth/sybil/Web3 | AUTH_SECURITY_WEB3.md | Session/eligibility/authz, commitment custody, storage, fail-closed |
| Test/acceptance | TESTING_AND_ACCEPTANCE.md | T01–T30, layers, E2E, visual matrix, demo/live gates |
| Build order/setup | IMPLEMENTATION_PLAN.md | B01–B11, scripts, environment, release/handoff |
| Resolved choices/dependencies | DECISIONS_AND_DEPENDENCIES.md | D01–D18, DEP01–DEP14, conflict resolution |
| Brief siap build | BUILD_PROMPT.md | Copyable objective, scope, invariants, verification |
| Navigasi dokumen | README.md | Reading order, index, source precedence, demo/live definitions |
| Riset dan papan terdahulu | references/ | Salinan portable dengan link lokal utuh |

## 3. Invariant audit checklist

| Invariant | Lokasi penetapan | Perlu dicek pada build |
|---|---|---|
| Satu active Squad/season; 3–5 Human; equal seats | PRD §3; Fixtures §1 | Server roster authorization, UI forming |
| Equal Squad weight, not pooled | PRD §5; Data §9;F-EQUAL-WEIGHT | Canonical vectors |
| 3 rounds, at least 2 valid, total wins | PRD §5; F-TWO-VALID/F-ROUND-COUNT | Result selectors/settlement |
| No fake locked from 202 | Match §4; Data §6; D03 | Receipt/unknown retry |
| Argument frozen: 30 kata/240 karakter | Match §5; Data §9; Content §5 | Boundary+Unicode tests |
| Final choice hidden until barrier | Match §3/6; Auth §4 | Network/RSC/cache inspection |
| No reputation signal in Council | Components §4; Data ArgumentCard | DTO shape+DOM |
| Default Stay≠failed reveal | Match §7; F-DEFAULT/F-FINAL-FAIL | Separate states/results |
| Wisdom Lift only outcome valid | PRD §5; Content §3; Result DTO | Negative/zero/pending |
| No automatic personal sharing | PRD §6; Auth §4; Content §7 | PublicShare projection |
| No betting/token/new economy | PRD §7; Decisions register | Route/component audit |
| Hidden Web3 no fake uniqueness | Auth §2–3 | Auth/eligibility copy |

## 4. Bukti yang belum ada karena scope dokumentasi

Belum ada installed app dependencies, generated route code, browser E2E/frontend tests, OAuth session nyata, deployed contract/ABI, resolver/live source integration, final identity collection, sound assets, live performance atau usability data. Semua ini adalah output tahap build/live sesuai plan, tidak diperlukan untuk menyatakan penyusunan panduan selesai. Jangan memakai checklist dokumen sebagai bukti aplikasi siap produksi.

## 5. Pemeriksaan paket

Pemeriksaan final mencakup keberadaan seluruh file dalam indeks, link Markdown lokal, fence kode seimbang, konsistensi enum/istilah yang kritis, fixture formula/total, dan portability salinan referensi. Hasil otomatis serta review semantik dicatat dalam [Documentation Verification](DOCUMENTATION_VERIFICATION.md). Verification menilai artefak yang benar-benar ada, tidak menjalankan tes frontend yang belum dibuat.
