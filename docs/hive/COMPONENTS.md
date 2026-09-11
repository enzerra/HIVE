# Component Contracts

Komponen reusable mengambil typed props dan callbacks, bukan memanggil gateway sendiri. Feature container mengambil/menyelaraskan data. Semua komponen menerima status yang diperlukan secara eksplisit; jangan menyimpulkan winner dari warna atau `score !== null`.

## 1. Primitives

| Komponen | Props/variants minimum | Behavior wajib |
|---|---|---|
| Button | primary/secondary/quiet/destructive; pending; disabled; type | Min 44 px; label tetap ada saat pending; submit tidak ganda |
| LinkButton | href, external, variant | Anchor asli untuk navigasi; external aman; bukan button onclick location |
| Field | label, hint, error, required, inputId | Label terhubung; error `aria-describedby`; error summary dapat focus |
| TextareaCounter | maxWords/maxCodePoints, value, frozen | Tampilkan dua limit; editor argument hanya role/fase sah |
| Dialog/Sheet | title, description, open, onClose | Focus trap, Escape, return focus, scroll lock; tindakan penting tidak hilang |
| Tabs | items, selected, onChange, orientation | Keyboard arrows; URL sync di container; panel ID terhubung |
| StatusMessage | tone, message, action, livePriority | Teks + icon; success tidak dipakai untuk pending |
| Skeleton | shape, width, height | Statis/reduced; tidak diumumkan satu per blok; parent aria-busy |
| EmptyState | title, body, action | Menyatakan kosong, bukan error; illustration optional |
| ErrorState | code, safeMessage, requestId, retry | Tidak menampilkan raw exception/body server |
| Pagination | cursor, hasNext, pending | Abort stale response; keyboard focus stabil |

Native HTML diprioritaskan jika cukup. Untuk focus-trapped primitives gunakan satu library accessible yang diverifikasi saat kickoff atau implementasi native dialog yang benar-benar diuji. Jangan membuat seluruh ARIA widget dari nol tanpa pengujian.

## 2. Layout dan identitas

| Komponen | Inputs | Invariants |
|---|---|---|
| PublicShell | sessionSummary?, currentRoute, children | Public content dapat dibaca tanpa auth |
| SocialShell | viewer, navigation, unreadCount | Mobile/desktop navigation konsisten; count bukan aktivitas palsu |
| FocusShell | matchHeader, phaseSummary, children | Tidak menampilkan social distraction/reputation dalam match |
| HumanAvatar | asset, handle, size, presence? | Bundar, fallback inisial, decorative alt bila nama adjacent |
| SquadCrest | asset, name, size | Siluet perisai; label Squad bila konteks rancu |
| HiveSigil | asset, name, size | Siluet komunitas berbeda dari crest |
| IdentityRow | entity kind/id/name, subtitle, action | Link ke route jenis benar; nama panjang wrap |
| RosterList | frozenRoster, ownPlayerId, readiness, roleLabels | Presence/readiness/eligibility berbeda; locked snapshot tidak diambil dari profil terkini |

## 3. Komponen sosial

| Komponen | Data minimum | Behavior |
|---|---|---|
| ArenaSummary | id, mode, format, participants, scheduledAt, viewerAction | Satu CTA dari selector eligibility; live/historical berlabel |
| ActivityRow | type, actor public projection, target, occurredAt | Deterministic copy; tidak merender arbitrary HTML |
| HomePriority | status, reason, action | Ongoing own match lebih tinggi daripada discovery |
| HiveListItem | id/slug, sigil, culture, joinStatus | Tidak menyiratkan follow = competitive membership |
| ReputationMetric | metricId, value?,sample, window, format, provisional, definition | N/A/provisional terlihat; chart optional |
| RankingTable | entityKind, metric, season, format, rows, cursor | Sort berasal service; no demo in live ranking |
| NotificationRow | id, type, target, readAt | Mark read idempotent; invalid target punya recovery |

## 4. Komponen pertandingan

### PhaseIndicator dan ServerCountdown

Inputs `phase`, `phaseVersion`, `startsAt`, `deadlineAt`, `serverNow`, `syncStatus`. Label tujuh fase tetap; finalizing merupakan substatus Resolve. Countdown menerima clock service; tidak memicu submit, reveal, atau winner. Announce hanya perubahan fase dan threshold waktu yang dibutuhkan, bukan tiap detik.

### QuestionPanel

Inputs `questionId`, `optionA`, `optionB`, `metricLabel`, `contextEvidence`, `observationSchedule`, `rulesHash`. Menampilkan definisi relative concurrent-player growth dan membedakan context snapshot vs scoring baseline. Evidence expandable namun aturan penentu outcome tidak hanya tooltip. Link evidence aman; tidak ada live outcome leak saat memilih.

### PrivateChoice / DecisionAction

Inputs `stage`, `ownInitialChoice?`, `draftChoice?`, `receipt`, `allowedActions`, `deadline`, `onSelect`, `onSubmit`. Pilihan A/B berbentuk radio group, keyboard standar. Submit explicit; Enter pada textarea tidak mengunci call. Selected, pending, layanan menerima, submitted-chain, canonical-locked, failed, unknown adalah state terpisah. Receipt status permanen dekat tindakan, bukan toast-only.

### ArgumentEditor

Hanya representative; `draft`, `revision`, `canEdit`, `freezeAt`, `validation`. Save draft debounced idempotent dengan revision/ETag, status saving/error. Dua counter 30 words/240 Unicode code points mengikuti encoding contract. Setelah freeze, read-only; konflik antar-tab memuat versi terbaru dan tidak menimpa otomatis.

### SquadChat

`messages`, `cursor`, `canPost`, `freezeReason`, `onSend`, `onReport`, `onMute`. Teks plain; send tidak menjalankan decision. Read-only pada Think/Commit/Reveal/Revision/Resolve; post hanya Deliberate/Council. New-message indicator tidak memaksa scroll jika membaca sejarah. Tidak ada public lintas-Squad chat. Pesan muted/hidden diberi placeholder yang sesuai.

### BeliefComparison

`stage: initial|final`, `publishedAt`, `hives[]`, `validity`. Setiap belief hanya dari available projection; hidden tidak diteruskan sebagai angka di props. Solid/arsir A/B + label/percent; before/after untuk final. Tidak mengurutkan Hive berdasarkan “lebih benar” sebelum outcome. No count-up atau raw vote streaming.

### CouncilCardList

`roundId`, `orderedCards`, `viewerHiveId`; card memuat crest/nama/initial belief/text/status. Urutan deterministic dari backend tidak berubah karena likes atau rank. Card unavailable/hidden mempertahankan tempat agar layout tidak lompat. Seluruh card eligible accessible. Props tidak menerima reputation atau influence sehingga tidak mudah bocor melalui tooltip.

### RevisionAction

`initialChoice`, `draftAction: stay|switch|null`, `eligibleSourceCards`, `receipt`, `onSubmit`. Switch menampilkan attribution kind dan satu source bila dipilih card. Stay tidak menampilkan attribution. Defaulted Stay ditampilkan sebagai server fact sesudah deadline, bukan dianggap pengguna mengklik Stay.

### RoundResult / MatchResult

`outcomeState`, `rawResult`, `adjudication?`, `scores`, `beliefs`, `lift`, `validRoundCount`, `settlement`. RoundResult tidak menerima `matchWinner` kecuali untuk summary sekunder yang jelas. MatchResult memerlukan settlement sebelum menampilkan W/L/D. Result 0 karena forfeit tampil 0 + label; unavailable aggregate/lift N/A. Format tetap menampilkan skor dua desimal dalam detail.

### ReceiptDetail / ProofPanel

Receipt summary menampilkan pending vs canonical dan safe retry. ProofPanel menampilkan network/rules/source/tx reference tanpa secret. Raw status/adjudication dipisahkan. Explorer link dibangun dari allowlisted base URL, bukan payload arbitrary URL.

## 5. Replay dan sharing

ReplayTimeline mengambil `replayVersion`, ordered scenes, status. Scene renderer tidak bisa mengubah domain result. StorySummary memakai deterministic condition templates. SharePreview memakai `PublicShareDTO` yang sudah diproyeksikan server, bukan screenshot arbitrary private DOM. Native share optional; copy-link fallback dengan success/failure accessible. Cancel ditangani tenang.

MilestoneNotice mengambil event ID/title/evidence link. Hanya muncul sekali per session/event setelah eligible event sah, nonblocking dan dapat ditutup. Tidak membuat progress/XP sendiri.

## 6. Storybook/component gallery target

Gallery development menampilkan primitives light/dark + identity long names + all decision receipts + result statuses + 30/240 limits + unknown schema + empty/stale/error. Bisa memakai route dev-only sederhana; Storybook bukan dependency wajib. Tidak terpapar pada production tanpa guard.

Acceptance: tidak ada komponen dengan internal fixture random; source data memiliki ID stabil; semua callbacks dipetakan ke action nyata/mock gateway; warna/padding konsisten melalui token; focus dan keyboard teruji. Lihat [Testing](TESTING_AND_ACCEPTANCE.md).
