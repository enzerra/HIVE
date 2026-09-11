# Routes & Screens

Semua route di sini adalah URL tujuan build, bukan endpoint yang sudah berjalan. Session dan resource authorization tetap ditegakkan server. `?tab=`, `?season=`, `?format=`, `?cursor=` boleh di URL; private choice, token, email, dan salt tidak boleh.

## 1. Peta route

| ID | URL | Akses | Tujuan utama |
|---|---|---|---|
| R01 | `/` | Public | Landing dan proposisi |
| R02 | `/explore` | Public | Cari Hive/aktivitas |
| R03 | `/hives/[hiveSlug]` | Public projection / member extras | Identitas komunitas, Squad, histori |
| R04 | `/squads/[squadId]` | Public projection / member extras | Crest, roster publik, afiliasi/reputasi |
| R05 | `/humans/[handle]` | Public projection / owner extras | Identitas dan histori yang dipublikasikan |
| R06 | `/rankings` | Public | Filter season/format/entitas |
| R07 | `/watch/[matchId]` | Public jika match public | Spectator tanpa mutation pemain |
| R08 | `/replays/[replayId]` | Public jika diterbitkan | Cerita versioned pertandingan |
| R09 | `/proof/[matchId]` | Public proof projection bila tersedia | Rules, data, receipt/references |
| R10 | `/sign-in` | Guest; returning redirect | Google primary atau demo berlabel |
| R11 | `/onboarding/[step]` | Session | identity/squad/hive/ready |
| R12 | `/home` | Session; afiliasi boleh belum lengkap | Social hub |
| R13 | `/arena` | Session | Live/upcoming/results + akses Rankings |
| R14 | `/arena/[matchId]/lobby` | Session + allowed audience | Roster, readiness, rules |
| R15 | `/arena/[matchId]/play` | Session + locked participant | Tujuh fase; `?round=1` hanya round sah |
| R16 | `/arena/[matchId]/results` | Session + allowed audience | Ringkasan match dan ronde |
| R17 | `/notifications` | Session owner | Inbox tindakan produk |
| R18 | `/settings/profile` | Session owner | Handle/PFP/profile |
| R19 | `/settings/preferences` | Session owner | Theme/motion/sound/notifikasi |
| R20 | `/settings/privacy` | Session owner | Presence/share personal/account deletion info |
| R21 | `/settings/advanced` | Session owner | Wallet/verification/recovery status |
| R22 | `/invite/[inviteToken]` | Public preview terbatas; join auth | Konteks undangan; no-index |
| R23 | `/operator/events` | Server-authorized operator | Event schedule/create |
| R24 | `/operator/events/[matchId]` | Operator/Hive admin scope yang sesuai | Roster/health/incidents |
| R25 | `/operator/moderation` | Moderator scope | Report queue/content hide reason |

Shared routes memilih PublicShell atau SocialShell dari session, tetapi data publik dan privat memakai DTO berbeda. Public private-resource request mengembalikan safe not-found; hindari redirect loop yang membocorkan resource. Resource sudah dihapus punya pesan aman dan back route.

## 2. Screen contract

Setiap screen wajib punya loading, empty, error, unauthorized/not-found yang relevan. Skeleton mengikuti dimensi final; loading tidak memakai fake metrics. Data lama hanya ditampilkan dengan timestamp/stale status bila masih aman.

### R01 — Landing

Urutan: header (Explore, Cara bermain anchor, Replay, Masuk/Join) → hero → duel/Replay → Human/Squad/Hive → ringkasan cara bermain → contoh Replay → Hive discovery terbatas → FAQ/footer. CTA utama Jelajahi Hives ke R02; Tonton Replay ke contoh publik sah atau demo berlabel. Join/Masuk menuju R10 dengan return intent.

Desktop hero dua kolom; mobile teks/CTA dahulu, visual sesudahnya. Tampilkan tidak lebih satu scene match pada hero. Jangan menaruh ranking atau contract dashboard di atas penjelasan produk. Jika belum ada Replay, tampilkan demo label “Historical demo” dan jangan membuat link palsu. Public page bisa dirender tanpa session.

### R02 — Explore

Urutan: heading/search → filter topik/status join → list Hive → pagination. Tiap item: sigil, nama, satu baris budaya, status sesi bila nyata, CTA lihat Hive. Search submit/debounce 300 ms; abort request lama; response versi lama tidak menimpa baru. Filter masuk URL, tombol clear semua, empty search berbeda dari data belum ada. Desktop daftar lapang; mobile satu kolom. Search menggunakan accessible combobox hanya jika benar-benar menyediakan suggestion; jika tidak gunakan search form biasa.

### R03 — Hive Profile

Header sigil/nama/culture/CTA contextual → overview/Aktivitas/Matches/Squads/Members/Tentang → Arena relevan → roster/team → histori. Tab konsisten `?tab=` dan direct link. Visitor “Lihat cara bergabung”; follower dapat follow/unfollow hanya bila fitur disediakan gateway; anggota “Buka Squad”; participant “Masuk Lobby” jika sah. Tindakan follow tidak mengubah competitive affiliation.

Metrik maksimal tiga, dengan periode/format/sample size. Mobile header wrap lalu CTA full-width. Hive baru menampilkan deskripsi, anggota, pedoman dan jadwal; jangan memberi score default 100. Visibility membership mengikuti privacy; tidak mengekspos daftar email.

### R04 — Squad Profile

Crest/nama/Hive → roster 3–5 atau forming → next Arena → histori → empat dimensi reputation. Representative/organizer hanya label peran, tidak voting power. CTA invite/manage hanya untuk role sah dan sebelum lock; member melihat status/roster; guest membuka invite publik bila tersedia. Changing affiliation di luar transfer window ditolak dengan alasan, bukan tombol yang diam-diam berhasil.

Provisional memuat jumlah sampel, window hingga 20 eligible round, dan metric definition. Bila tidak ada attribution, Influence Quality N/A, bukan nol persen. Mobile empat dimensi tersusun vertikal; jangan radar chart tanpa angka/teks.

### R05 — Human Profile

PFP/handle → afiliasi season → participation history → published personal highlights bila opt-in. Owner dapat edit profil dan membuka riwayat pilihannya sendiri melalui private view. Public tidak otomatis melihat Switch atau chat. Identity eligibility label menyatakan status yang sebenarnya; auth Google bukan verified human.

Nama lama di Replay tetap berdasarkan snapshot. Perubahan nama kini tidak mengubah pemetaan ID atau angka histori. Empty state mendorong memilih Squad, bukan memberi badge prestasi palsu.

### R06 — Rankings

Season + format + entitas → penjelasan ukuran → 10 rows/page → detail profil. Kolom minimal posisi, identitas, metric value, sample/status. Backend mengembalikan metric label/sort contract; UI tidak mengarang ranking dari popularitas. Separate 3-Squad/5-Squad, ranked live/practice, provisional/eligible. Format filter wajib terlihat; no-contest tidak dianggap loss. Mobile rank + nama + nilai utama, metadata expand; tabel tetap memiliki heading accessible.

### R07 — Watch

Header siapa bertanding/status → current public phase → pertanyaan → aggregate sesuai barrier → ringkasan cara bermain/CTA Explore. Tidak ada player action, chat privat, nama personal voter, atau unpublished final. Reveal jaringan publik bukan alasan menyalin seluruh choice individual ke UI. Jika match private, safe 404. No live match → Replay link bila ada. Suspended feed menampilkan sync status tanpa dugaan hasil.

### R08 — Replay

Outcome/status dahulu → match roster snapshot → pertanyaan → initial belief → perbedaan Squad → argument resmi → final belief → outcome/score/lift → attribution aggregate valid → share preview. Scene navigation Previous/Next, timeline nonautoplay, dan “Baca semua” untuk versi teks. `?round=`/`?scene=` memuat scene sah; invalid param kembali ke default, bukan error fatal.

Copy harus mengikuti data: no one switched, harmful convergence, atau minority correct hanya bila kondisinya terpenuhi. Hidden moderated argument memakai placeholder beralasan. Share modal dapat preview lalu copy URL/native share; cancel bukan error. Stable URL mengarah ke current presentation version dan status updated bila adjudication berubah. Metadata OG tidak mengambil data privat.

### R09 — View Proof

Human-readable summary → status raw vs adjudicated → rule version/hash → roster/time → source snapshots → commitment/result transaction references → export publik bila tersedia. Detail identifier monospace wrap/copy; link explorer hanya dari allowlisted network config. Missing proof tidak otomatis berarti outcome invalid; kedua status dipisahkan. Tidak menampilkan private key, unrevealed salt, email, atau auth token.

### R10 — Sign-in

Logo/konteks tujuan → satu tombol primary Google live → privacy/terms links yang tersedia → error/retry/back. Tidak ada wallet login sejajar. Loading mematikan duplicate submission. Auth cancel mempertahankan intent. `returnTo` hanya path internal allowlist dan disimpan server; tidak menerima arbitrary external URL. Demo mode jelas bertuliskan “Coba alur masuk (demo)”, bukan mengklaim Google sudah memverifikasi akun.

### R11 — Onboarding

Step identity: handle + pilih PFP/upload; inline validation. Step squad: invite/cari open Squad/create/Explore first. Step hive: konfirmasi afiliasi Squad yang diikuti; hanya organizer Squad baru memilih afiliasi. Step ready: Human → Squad → Hive, status forming/pending/eligible, satu next action.

Back mempertahankan input aman. Server step menentukan step yang boleh dilanjutkan, bukan query string. Invite expired/full memberi pilihan mencari/membuat Squad sesuai policy. Pending approval dapat Explore first, bukan membuat membership palsu. Step ready bukan verifikasi ranked; eligibility gate dipanggil saat mendaftar roster. Screen cukup satu keputusan besar; jangan memasukkan empat form sekaligus di mobile.

### R12 — Home

Prioritas server/selector: ongoing participant → ready/upcoming eligible Arena → membership/roster task → hasil/Replay → discovery. Tampilkan satu primary action dengan reason dan resource ID. Side panel Squad desktop; mobile ringkasan Squad sebelum activity. Activity tiga event awal, kemudian load more; tidak ada generic composer. Presence memiliki observedAt/expiresAt; expired hilang dari hitungan “online”.

Tanpa afiliasi: CTA cari Squad. Forming: undang teman. Tanpa Arena: jadwal nyata/Replay/pedoman. Empty tidak memutar loop welcome yang menghalangi penggunaan. Error satu modul tidak menghapus semua konteks yang masih valid.

### R13 — Arena List

Tabs live/upcoming/results + link Rankings; format, mode live/historical, start time/timezone dan eligibility. Item bukan tombol masuk tanpa konteks. Visitor diarahkan ke Watch/public Explore, tidak berhak mengubah roster. Mobile daftar ringkas; tanggal di WIB untuk default locale, UTC di proof. Jadwal hasil dibedakan dari jadwal bermain.

### R14 — Lobby

Matchup → rules/mode/format/waktu → roster kedua Hive terkelompok Squad → own Squad readiness → status eligibility/account → CTA Siap. `ready` bukan roster locked atau official start. Ineligible mendapat alasan dan jalur advanced verifikasi; spectator mendapat Watch. Locked participant yang reconnect membuka fase berjalan, bukan reset Lobby.

Kedua Hive harus seats sama; tidak menawarkan pengganti sesudah lock. Jangan memberi admin Start yang menembus service checks. Mobile own roster dahulu lalu rival expandable. Disconnect tidak otomatis berubah menjadi “tidak siap” bila readiness canonical masih sah; presence dan readiness dibedakan.

### R15 — Match Room

Shell: header match/mode → phase/time → pertanyaan/evidence → phase content → action. Detail perilaku sepenuhnya pada [Match State Machine](MATCH_STATE_MACHINE.md). Reload/deep-link selalu fetch snapshot dan owner receipt; route param tidak memilih fase.

Think: draft A/B. Deliberate: chat privat + representative editor. Commit: review choice dan submit, status layanan/chain berbeda. Reveal: aggregate awal batch. Council: seluruh card Hive sendiri, urutan stabil. Revision: Stay/Switch + attribution bila Switch, final hidden. Resolve: finalizing/awaiting outcome/result, opsi lanjut ronde berikutnya sesuai jadwal. Tidak menunggu outcome 30 menit untuk membuka ronde kedua.

Mobile action bar tidak menutupi paragraph/keyboard; timer tidak menjadi sticky panel besar. Exit menyatakan apa yang sudah tersimpan dan konsekuensi tidak melakukan aksi berikutnya, tanpa menggagalkan accepted decision. Tidak ada auto-submit draft ketika pengguna meninggalkan halaman.

### R16 — Results

Overall status → total scores canonical bila settled → ronde valid count → round cards → selected round outcome/belief/lift → Replay/Proof. Selama sebagian outcome pending, tulis subtotal dan “belum final”, bukan pemenang. Dua ronde unggul tidak menyelesaikan match. Forfeit displayed 0 dengan label; N/A tidak berubah menjadi 0 belief. Draw/no contest/void punya ilustrasi netral dan copy yang berbeda.

### R17 — Notifications

Unread/read grouping atau chronological list, event type/time/target. Invite decision, reminder, roster update, result ready. Mark read idempotent; optimistic dengan rollback boleh. Link target expired membuka status yang jelas. Tidak mengirim email/push/Discord message sebagai bagian klik preference tanpa implementasi/persetujuan relevan.

### R18–R21 — Settings

Menu profile/preferences/privacy/advanced. Profile: validasi handle/avatar sama onboarding. Preferences: system/light/dark, reduced-motion system/reduce, sound off/on, in-app reminder choices. Privacy: presence visibility, personal-share default off, deletion request dan penjelasan data publik immutable. Advanced: wallet provisioning, eligibility tier/expiry, recovery, chain network dengan bantuan singkat.

Save state idle/saving/saved/error; gagal tidak tampak tersimpan. Sign out menghapus private client cache. Wallet unavailable tidak menghalangi public browse, tetapi action ranked terkait account dependency diberi alasan. Tidak ada mnemonic/private key input buatan.

### R22 — Invite

Tampilkan nama Squad/crest/Hive, siapa boleh join, kapasitas tersisa bila publik, expiry, CTA masuk untuk melanjutkan. Token sensitif tidak masuk analytics/referrer; halaman no-index. Preview tidak mengambil email/roster privat. Setelah login server memvalidasi ulang kapasitas dan status. 409 full/expired dapat pulih tanpa logout.

### R23–R25 — Operator minimal

Events list/create: pilih approved question/rules, format, jadwal, dua Hive dan acceptance status. Event detail: roster validation, readiness, raw chain/indexer/resolver health, incident history. Moderator: report queue, konten yang dilaporkan, hide/unhide dengan reason sesuai izin. Tidak ada tombol set winner, edit call, atau perpanjang phase aktif.

Form policy-config hanya sebelum lock. Minimal console berupa tabel/form sederhana cukup; mobile readable, tidak harus menjadi dashboard canggih. Demo role switch tersedia hanya development harness server-guarded. Production role selalu server-derived.

## 3. Navigation dan resilience bersama

Setiap data mutation menampilkan pending/rejected/accepted sesuai jenisnya; toast saja tidak cukup untuk action match. Back navigation mengembalikan scroll/filter dan tidak mengirim ulang mutation. Semua primary CTA mempunyai tujuan URL atau action yang tercatat dalam Components/Data Contracts. Tidak ada `href="#"` sebagai placeholder final.

404 aman, error permission, maintenance, session expired, offline, dan unknown schema memiliki recovery path. Auth expired saat match tidak menghapus receipt; reconnect setelah login mendapatkan canonical state saat ini. Access guard di UI membantu pengalaman, tetapi bukan authorization security.
