# Data Contracts — usulan API v1

**Penting:** belum ada backend/ABI yang diverifikasi tersedia. Kontrak ini adalah target mock dan integration adapter, bukan dokumentasi endpoint produksi yang sudah hidup. Perubahan backend dipetakan dalam LiveGateway; komponen memakai domain DTO yang stabil.

## 1. Konvensi

- Base same-origin `/api/v1`. JSON UTF-8, timestamps ISO 8601 UTC, IDs opaque strings.
- Success `{data, meta:{schemaVersion:"hive-ui-v1",requestId, serverNow, version}}`; list `data:{items, nextCursor}`.
- Error `{error:{code, message, fieldErrors?,retryable, requestId},meta:{serverNow}}`. Message aman dan terlokalisasi di frontend dengan code.
- Angka probability/belief memakai integer scale 1.000.000; skor micro-point dan nilai signed micro-pp dikirim sebagai decimal string agar aman untuk BigInt. Tidak mengirim NaN/Infinity.
- `null` berarti tidak applicable hanya pada field yang mengizinkannya. Hidden/unavailable memakai discriminated state, bukan angka null yang ambigu.
- Validasi request dan response dengan schema runtime. Unknown critical enum/schemaVersion ditolak ke safe error dan refetch; tidak diasumsikan resolved.

## 2. Core domain types

```ts
type ID = string;
type ISODate = string;
type Choice = "A" | "B";
type Phase = "think" | "deliberate" | "commit" | "reveal" |
  "council" | "revision" | "resolve";
type Mode = "ranked_live" | "historical_practice" | "demo";
type Format = "community_5_squads" | "community_3_squads";
type Visibility<T> =
  | { state: "hidden"; reason: "phase_barrier" | "private" }
  | { state: "unavailable"; reason: string }
  | { state: "available"; value: T; publishedAt: ISODate };
type Metric = {
  value: string | null; unit: "score" | "pp" | "percent" | "count";
  sampleSize: number; period: string; format: Format;
  provisional: boolean; unavailableReason: string | null;
};
type SessionDTO = {
  accountId: ID; playerId: ID; handle: string; avatarUrl: string;
  onboarding: { step: "identity"|"squad"|"hive"|"ready"; deferred: boolean };
  activeSquadId: ID | null; competitiveHiveId: ID | null;
  roles: string[]; // UI hints, server checks resource authorization again
  accountProvisioning: "not_started"|"pending"|"ready"|"failed";
  eligibility: { status: "unverified"|"pending"|"eligible"|"expired"|"revoked";
    tierLabel: string; expiresAt: ISODate | null };
};
type RosterDTO = {
  rosterVersion: string; lockedAt: ISODate | null;
  hives: { hiveId: ID; nameSnapshot: string; sigilAssetId: ID;
    squads: { squadId: ID; nameSnapshot: string; crestAssetId: ID;
      representativeId: ID;
      members: { playerId: ID; handleSnapshot: string; avatarAssetId: ID }[];
    }[];
  }[];
};
type BeliefDTO = {
  hiveId: ID; beliefMicros: number;
  squads: { squadId: ID; rosterSize: number; aCount: number;
    beliefMicros: number }[];
};
type ReceiptState = "service_accepted"|"chain_submitted"|
  "canonical_locked"|"failed"|"transport_unknown";
type ReceiptDTO = {
  receiptId: ID; idempotencyKey: string; playerId: ID; roundId: ID;
  stage: "initial"|"final"|"argument"; state: ReceiptState;
  receivedAt: ISODate; canonicalAt: ISODate | null;
  transactionRef: string | null; failureCode: string | null;
};
type ArgumentCardDTO = {
  cardId: ID; roundId: ID; squadId: ID; hiveId: ID;
  squadName: string; crestAssetId: ID; initialBeliefMicros: number | null;
  order: number; version: string;
  body: { state: "visible"; text: string } |
        { state: "unavailable"|"moderated"; reason: string };
};
// Tidak ada rank, reputation, likes, influence pada ArgumentCardDTO.
type Attribution =
  | { kind: "other_squad_argument"; cardId: ID; cardVersion: string }
  | { kind: "internal_discussion"|"new_evidence"|"own_reconsideration"|
      "undisclosed"; cardId: null };
```

## 3. Match snapshot dan hasil

```ts
type RoundResultDTO = {
  roundId: ID;
  outcome: { state: "pending" } |
    { state: "void"; reason: string } |
    { state: "valid"; choice: Choice; resolvedAt: ISODate };
  hives: { hiveId: ID; validity: "complete"|"forfeit";
    reason: string | null; incompleteCouncil: boolean;
    initial: Visibility<BeliefDTO>; final: Visibility<BeliefDTO>;
    scoreMicro: string | null; wisdomLiftMicroPp: string | null;
    councilScoreLiftMicro: string | null }[];
};
type MatchSnapshotDTO = {
  matchId: ID; mode: Mode; format: Format; version: number;
  phaseVersion: number; serverNow: ISODate;
  ruleVersion: string; rulesHash: string; roster: RosterDTO;
  lifecycle: "draft"|"scheduled"|"registering"|"lobby"|"locked"|
    "running"|"awaiting_outcomes"|"settled"|"cancelled"|"disputed"|"no_contest";
  currentRoundId: ID | null; currentPhase: Phase | null;
  startsAt: ISODate | null; deadlineAt: ISODate | null;
  resolveStatus: "finalizing"|"awaiting_outcome"|"resolved"|"void"|null;
  question: QuestionDTO | null;
  initialBeliefs: Visibility<BeliefDTO[]>;
  finalBeliefs: Visibility<BeliefDTO[]>;
  councilCards: Visibility<ArgumentCardDTO[]>;
  allowedActions: string[]; // projected to current actor, not security authority
  roundResults: RoundResultDTO[];
  settlement: { state: "pending" } |
    { state: "settled"; outcomeValidRounds: number;
      totals: {hiveId: ID; scoreMicro: string}[];
      result: "win"|"draw"; winnerHiveId: ID|null } |
    { state: "no_contest"|"disputed"; reason: string };
};
type QuestionDTO = {
  id: ID; title: string; metric: "relative_concurrent_player_growth";
  optionA: {appId: string; title: string};
  optionB: {appId: string; title: string};
  contextEvidence: {observedAt: ISODate; sourceLabel: string; publicRef: string}[];
  observation: {startsAt: ISODate|null; endsAt: ISODate|null;
    durationSeconds: number; tolerancePolicyLabel: string};
};
```

`OwnDecisionDTO` dipisahkan dari public snapshot: `playerId, roundId, initialChoice: Choice|null, finalChoice: Choice|null, initialReceipt: ReceiptDTO|null, finalReceipt: ReceiptDTO|null, finalMode: explicit_stay|explicit_switch|defaulted_stay|null`. Hanya owner atau delegated secure provider yang boleh membacanya. Public/Watch tidak pernah memakai endpoint owner.

Snapshot phase dapat berubah ketika hasil ronde sebelumnya masuk; jangan membaca `roundResults[0]` sebagai current round. Match mempunyai ID ronde stabil dan currentRoundId eksplisit.

## 4. Social dan page DTO

| DTO | Field minimum dan aturan |
|---|---|
| HivePublic | id, slug, name, sigilAsset, culture, description, publicSquads, joinPolicy, publicEvents, publicStats; tanpa email/private roster |
| SquadPublic | id, name, crestAsset, hiveRef, status forming/active, publicMembers, representative public label, metrics, season |
| HumanPublic | id, handle, avatarAsset, affiliation, publicHistory; pilihan privat tidak disertakan |
| Home | viewer summary, priorityAction `{kind, targetId, label, reason}`, activity page, own Squad, schedule; tidak ada fabricated fallback |
| Presence | playerId, displayState, observedAt, expiresAt; TTL baseline 60 s; expired bukan online |
| Activity | id, type, actor public projection, targetRef, occurredAt, visibility; type allowlist |
| Notification | id, type, targetRef, createdAt, readAt; server menegakkan recipient |
| RankingPage | season, format, mode, entityKind, metricId, metricDefinition, rows, nextCursor; deterministic sort/ties backend |
| Replay | id, version, publishedAt, matchSnapshotRef, rosterSnapshot, scenes, resultProjection, publicAttributions, moderationStatus |
| PublicShare | stableUrl, title, description, previewAssetUrl, statusLabel, version; hanya public projection |
| Proof | networkLabel, allowlistedExplorerBase, ruleVersion, rulesHash, sourceSnapshots, transactionRefs, rawResult, adjudication, evidenceAvailability |
| Preferences | theme system/light/dark, motion system/reduce, sound off/on, presenceVisibility, reminders, personalShareDefault false |
| InvitePreview | token reference opaque, squad public ref, hive ref, joinPolicy, expiresAt, status valid/full/expired/revoked; token jangan masuk log |

`Metric` untuk reputation memuat sampleSize per metrik, bukan satu sampleCount dipakai semua. Semua enum activity/copy templates didefinisikan dalam Content & Assets. HTML dari payload tidak dirender tanpa sanitization; baseline argument/chat plain text.

## 5. Read endpoints

Semua path tabel relatif ke `/api/v1`. `me`/private/member requests menggunakan session dan authorization server. Public endpoints memproyeksikan berdasarkan izin, bukan memasukkan semua field lalu menyembunyikan di UI.

| Method/path | Response | Akses/cache |
|---|---|---|
| GET `/session` | SessionDTO atau data null | Owner; no-store |
| GET `/public/landing` | featured Replay/Hives public | Public; boleh cache tanpa session |
| GET `/hives?q=&cursor=` | HivePublic page | Public projection |
| GET `/hives/:slug` | HivePublic + allowed member view terpisah | Scoped; no-store jika member |
| GET `/squads/:id` | SquadPublic | Public projection |
| GET `/humans/:handle` | HumanPublic | Public projection |
| GET `/home` | Home | Owner; no-store |
| GET `/arena?status=&format=&cursor=` | Event summary page | Session projection |
| GET `/rankings?season=&format=&entity=&cursor=` | RankingPage | Public; mode filter eksplisit |
| GET `/matches/:id/snapshot` | MatchSnapshotDTO | Participant/member projection |
| GET `/matches/:id/watch` | Public projected snapshot | Public jika match publik |
| GET `/matches/:id/rounds/:roundId/me` | OwnDecisionDTO | Owner; no-store |
| GET `/receipts/by-key/:key` | ReceiptDTO atau 404 safe | Actor owner; no-store |
| GET `/matches/:id/chat?cursor=` | Own Squad chat page | Roster member; no-store |
| GET `/matches/:id/rounds/:roundId/argument-draft` | Own Squad frozen/draft state+revision | Own Squad; editor only representative |
| GET `/replays/:id` | Replay | Public jika published |
| GET `/replays/:id/share` | PublicShare | Public sanitized |
| GET `/proof/:matchId` | Proof | Public sanitized subset |
| GET `/notifications?cursor=` | Notification page | Owner |
| GET `/preferences` | Preferences | Owner |
| GET `/invites/:token` | InvitePreview | Minimal safe preview |
| GET `/operator/events` | Scoped event page | Operator |
| GET `/operator/events/:id` | Roster/health/adjudication detail | Scoped operator/admin |
| GET `/operator/reports` | Report queue | Moderator |

## 6. Mutations dan auth endpoints

Mutation POST/PATCH/DELETE memerlukan session, CSRF/origin protection, schema, resource authorization, serta idempotency/revision jika dinyatakan. UI allowedActions hanya hint.

| Path | Request minimum | Success / behavior |
|---|---|---|
| GET `/auth/google/start` | Intent reference internal | Redirect provider; state/nonce server |
| GET `/auth/google/callback` | Provider params | Validasi callback; session; safe redirect |
| POST `/auth/logout` | CSRF | Invalidate session; clear client cache |
| PATCH `/onboarding/identity` | handle, avatarAssetId, expectedRevision | Account step state |
| POST `/onboarding/squad` | join/create/defer intent + invite/squad fields | Membership decision; forming/pending valid |
| PATCH `/onboarding/hive` | hiveId/confirm, expectedRevision | Check Squad authority/affiliation |
| POST `/onboarding/complete` | expectedRevision | Completed atau deferred social state |
| POST `/uploads/avatar` | Allowed multipart + byte limit | Validated asset ID; tidak arbitrary URL |
| PATCH `/me/profile` | handle, avatarAssetId, expectedRevision | Updated public profile |
| POST `/squads/:id/invites` | policy, expiry | Invite reference; authorized organizer |
| POST `/invites/:token/join` | idempotency key | joined/pending/full/expired; revalidate capacity |
| PATCH `/squads/:id/membership` | action, target, expectedRevision | Transfer/role policy; frozen roster tetap |
| POST `/hives/:id/follow` | follow boolean | Social only; reversible |
| POST `/matches/:id/readiness` | ready, rosterVersion | Updated readiness; bukan Start override |
| PUT `/matches/:id/rounds/:roundId/argument-draft` | canonicalText, encodingVersion, expectedRevision | Draft save sebelum freeze |
| POST `/matches/:id/commitments` | CommitmentIntent (di bawah) | 202 ReceiptDTO; bukan canonical locked |
| POST `/matches/:id/chat` | clientMessageId, text | Accepted message sesuai fase/rate limits |
| POST `/reports` | targetType, targetId, reason | Report reference; score tidak berubah otomatis |
| POST `/me/mutes` | playerId, muted | Private display preference |
| PATCH `/notifications/:id` | read boolean | Idempotent read state |
| PATCH `/preferences` | changed fields, expectedRevision | Saved preferences |
| POST `/account/provision/retry` | idempotency key | Existing account provisioning retry |
| POST `/eligibility/start` | desiredTier/context | Provider flow reference; bukan auto-eligible |
| POST `/account/deletion-request` | explicit request confirmation | Request status; menjelaskan chain tidak terhapus |
| POST `/operator/events` | approved rule/question IDs, format, schedule, Hives | Draft event; no arbitrary outcome |
| PATCH `/operator/events/:id` | pre-lock change+revision | Reject if locked |
| POST `/operator/events/:id/acceptance` | Hive scoped accept/reject | Accepted schedule |
| PUT `/operator/events/:id/roster` | roster IDs, expectedVersion | Validated before lock |
| POST `/operator/events/:id/incidents` | type, reason, evidence refs | Audit record; adjudication by policy |
| PATCH `/operator/reports/:id` | moderation action, reason | Hide/unhide content only per permission |

`CommitmentIntent`: `idempotencyKey, matchId, roundId, actorId, stage(initial|final|argument),phaseVersion, rosterVersion, rulesHash, encodingVersion, commitmentHash, encryptedRevealEnvelope, providerAuthorizationRef`. Actor server-derived harus cocok session. Envelope opaque, tidak dilog. Final envelope memuat choice/attribution; argument envelope teks/salt. Public plaintext final **tidak** dikirim sebelum barrier. Owner-private custody flow dapat memproses plaintext hanya dalam trust boundary provider yang dijelaskan; jangan mengklaim end-to-end secrecy bila operator dapat decrypt.

`service_accepted` hanya 202, lalu receipt polling/events menentukan chain_submitted/canonical_locked/failed. Submit stage argument terpisah dari tiap Human decision; uniqueness key actor untuk argument adalah Squad representative authority yang mengikat Squad, bukan member vote tambahan.

## 7. Realtime contract

GET `/matches/:id/events` untuk participant stream; `/matches/:id/watch/events` untuk public stream; `/notifications/events` owner. SSE `id` adalah cursor opaque. Data event:

```json
{"schemaVersion":"hive-ui-v1","eventId":"evt-0102","resourceId":"match-001",
 "version":102,"phaseVersion":5,"type":"snapshot_invalidated",
 "serverNow":"2026-09-09T12:01:45Z"}
```

Types baseline: `snapshot_invalidated`, `receipt_changed`, `argument_draft_changed`, `chat_message_available`, `notification_available`, `heartbeat`, `correction_required`. Event payload membawa IDs/status safe; content privat di-fetch melalui projection endpoint. Tidak mengirim raw onchain event yang membuka personal choices ke semua subscriber. Sequence gap/correction → refetch full snapshot; duplicate event ignored. Expired session menutup stream dan memicu auth recovery.

## 8. Error dictionary

| Code / HTTP | UI response |
|---|---|
| SESSION_REQUIRED / 401 | Auth recovery dengan intent aman |
| ACTION_FORBIDDEN / 403 | Jelaskan aksi tidak tersedia; tidak retry otomatis |
| RESOURCE_NOT_FOUND / 404 | Safe not-found/back |
| PHASE_CLOSED / 409 | Disable action, refresh current snapshot |
| VERSION_CONFLICT / 409 | Refetch; jangan overwrite data orang lain |
| ALREADY_COMMITTED / 409 | Ambil existing receipt; tidak dianggap sukses pilihan baru |
| IDEMPOTENCY_CONFLICT / 409 | Stop, reconcile; key tidak boleh dipakai payload beda |
| SQUAD_FULL / INVITE_EXPIRED / 409 | Pilih jalur Squad lain, simpan identity |
| ROSTER_LOCKED / 409 | Read-only; perubahan hanya match berikut sesuai policy |
| VALIDATION_FAILED / 422 | Inline field errors + summary |
| ELIGIBILITY_REQUIRED / 403 | Advanced verification context; browse tetap tersedia |
| RATE_LIMITED / 429 | Retry-After; countdown cooldown tidak mengubah phase deadline |
| SERVICE_UNAVAILABLE / 503 | Retry aman; decision status unknown perlu receipt lookup |
| SCHEMA_UNSUPPORTED / local | Safe error; no fallback result |

## 9. Encoding dan presisi reference

Usulan `text-nfc-single-line-v1`: Unicode NFC, CRLF/LF dan rangkaian Unicode whitespace menjadi satu spasi, trim. Words dihitung split spasi nonempty; karakter dihitung Unicode code points setelah canonicalization, bukan UTF-16 code units. Batas 30/240. Server/provider wajib berbagi test vectors sebelum live. Metadata visible memakai teks yang sama yang dihash; moderasi tidak mengubah hash historis.

Provider adapter mengikat chain ID, contract, match/round, player atau Squad, stage, nonce, salt ≥128 bit entropy dan encoding version. Tidak menggunakan hash A/B tanpa salt atau implementasi crypto ad hoc pada komponen.

Untuk fixtures, `S=1_000_000`, `Q=1_000_000` micro-point per score point. Semua operasi perkalian memakai BigInt:

```text
squadP = floor(aCount*S / rosterSize)
hiveP = floor(sum(squadP) / squadCount)
d = abs(hiveP - y*S)
scoreMicro = floor(100*Q*(S*S - d*d)/(S*S))
wisdomLiftMicroPp = 100*(abs(initialP-y*S)-abs(finalP-y*S))
scoreLiftMicro = finalScoreMicro-initialScoreMicro
```

Ini memperinci baseline floor/micro-point PRD sebagai reference usulan. Backend/contract harus menyepakati vector dan encoding version sebelum live; frontend **menampilkan result canonical**, bukan memakai perhitungan client sebagai authority. UI score dua desimal; belief satu desimal; totals dijumlah canonical dahulu baru format. Negative zero dinormalisasi menjadi 0 pada tampilan.
