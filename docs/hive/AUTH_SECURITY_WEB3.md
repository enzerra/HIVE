# Authentication, Security & Hidden Web3

Dokumen ini menetapkan boundary frontend. Server/provider implementasi nyata tetap dependency yang harus diuji sebelum live. UI guard bukan security control yang cukup.

## 1. Google authentication

Google adalah primary sign-in live. OAuth start/callback ditangani server/provider library yang sesuai. State, nonce dan PKCE bila flow/provider menggunakannya divalidasi server; callback tidak menerima playerId/roles dari client sebagai kebenaran. Session memakai secure HttpOnly cookie, Secure pada HTTPS dan SameSite sesuai flow yang diuji. Auth secret tidak memakai prefix public.

Session restore melalui endpoint owner; redirect ke saved internal intent setelah onboarding gate. `returnTo` harus relative path allowlist, reject protocol-relative/external/javascript URL. Invite token disimpan sebagai intent aman, tidak dikirim sebagai analytics metadata. Logout server invalidates session; client clear cache, abort mutations/streams yang belum dikirim, serta menghapus own draft memory. Accepted canonical commitments tetap tercatat.

Panduan Next membedakan authentication, session management dan authorization; pemeriksaan akses ditempatkan dekat sumber data, bukan hanya layout. [Next authentication guide](https://nextjs.org/docs/app/guides/authentication), diperiksa 9 September 2026.

## 2. Auth bukan eligibility

Tiga pertanyaan berbeda: siapa menguasai akun, apakah peserta eligible, dan aksi apa yang diperbolehkan pada resource/fase. Google/email/wallet tidak membuktikan satu manusia. Eligibility DTO memuat state/tier/expiry tanpa raw identity document. Verifikasi dilakukan ketika ingin ranked roster; visitor Replay tidak dipaksa.

Role matrix:

| Role | Data/aksi sah | Dilarang |
|---|---|---|
| Guest | Public Hive/Replay/Watch | Private chat, call, readiness |
| Member non-roster | Public/member community context | Submit official decision |
| Locked participant | Own call/receipt, own Squad chat sesuai fase | Call orang lain, final aggregate terlalu awal |
| Representative | Own Squad argument draft/commit | Vote atas nama anggota |
| Organizer/admin | Invite, prelock roster/jadwal scoped | Edit active roster/rules atau winner |
| Moderator | Report/hide dengan reason | Mengubah raw result karena konten |
| Operator | Health/incidents sesuai policy | Arbitrary outcome override |

Backend memeriksa session+resource+role+phase+rosterVersion untuk mutation. Actor IDs dari body tidak menambah wewenang.

## 3. Embedded account dan Monad

Alur utama tetap Google → Squad → call → Stay/Switch → Replay. Wallet provision setelah auth lewat adapter. State not_started/pending/ready/failed; retry idempotent terikat account yang sama. Tidak ada dialog private key/seed phrase custom atau tombol deposit untuk bermain.

`IdentityAdapter`: restoreAccount, ensureAccount, getProvisioningStatus, beginEligibility, getRecoveryInfo. `CommitmentAdapter`: prepareInitial, prepareFinal, prepareArgument, submitPrepared, getReceipt, recoverOwnState. Nama method merupakan interface usulan; provider SDK dipetakan di integration layer.

Commitment encoding/version harus sama dengan backend/contract: domain chain+contract+match+round+actor+stage+nonce+salt. Salt acak kriptografis ≥128 bit. Encrypted reveal payload disimpan melalui approved custody/recovery service. Jika provider/relayer dapat decrypt sebelum fase reveal, ia adalah pihak tepercaya yang harus dijelaskan; “encrypted at rest” tidak berarti tanpa trust.

UI memisahkan accepted layanan, transaksi dikirim, canonical locked. Finality/reorg policy milik layanan chain; tidak menetapkan finality hanya karena mendapat tx hash. Tidak ada saldo/token/reward transaksi di core UI. View Proof dapat menampilkan network dan transaction reference setelah relevan; real explorer URL hanya dari konfigurasi yang diverifikasi.

## 4. Client persistence dan confidentiality

| Data | Penyimpanan frontend |
|---|---|
| Theme/motion/sound/filter | Non-sensitive preference storage boleh |
| Own unsubmitted choice | Memory; tidak log/persist plain text otomatis |
| Own accepted receipt ID | Query memory; recovery melalui authenticated gateway |
| Choice/salt/nonce/envelope/token | Tidak localStorage/sessionStorage, URL, analytics, crash report |
| Argument draft/chat | Authorized service + memory; no shared public cache |
| Public Replay/version | Cache publik jika memang published/sanitized |

Satu browser dapat dipakai akun berbeda. Cache namespace/clear logout wajib; service worker tidak menyimpan private API responses. Clipboard hanya ketika user meminta, dan tidak berisi secret. Screenshot share dihasilkan dari PublicShareDTO, bukan DOM halaman owner.

## 5. Input dan transport

Mutation cookie-authenticated memerlukan CSRF/origin validation. Same-origin BFF; tidak wildcard credentialed CORS. Rate limits diterapkan server. Chat/argument plain text dirender sebagai text node; tidak `dangerouslySetInnerHTML`. Link user-supplied menggunakan allowed protocols, tidak `javascript:`/data script.

Upload avatar memeriksa bytes/MIME/dimensi di server, re-encode raster, buang metadata, tolak SVG user yang dapat membawa active content. SVG internal orisinal diperbolehkan. Constraints di Content & Assets merupakan baseline UI/server contract, bukan trust terhadap atribut input accept.

CSP disusun dari origin asset/provider yang benar-benar digunakan; jangan menambahkan unsafe wildcard untuk membuat integrasi cepat. Secrets hanya server env, sanitized logging. External links memakai proteksi opener yang sesuai. Error tidak mengembalikan stacktrace atau full provider response.

## 6. Sybil, cheating, dan privacy copy

HIVE tidak mengklaim meniadakan komunikasi di Discord, penggunaan AI, multi-account, atau kolusi dengan sekadar UI blind commit. Rank disembunyikan dalam match untuk mengurangi signal status di aplikasi; peserta tetap bisa mengenali teman atau membuka profil eksternal. Belief/reputation bukan ukuran IQ manusia.

Public-chain reveal dapat diperiksa sesudah waktunya. Copy yang benar: “Pilihan belum dibuka kepada peserta lain sebelum fase Reveal; catatan publik sesudah reveal dapat diperiksa.” Jangan menulis “pilihanmu selamanya rahasia”.

Raw personal verification data, NIK, biometrik dan email tidak masuk chain maupun public DTO. Private chat retention baseline PRD sampai30 hari sesudah match kecuali report aktif; UI privacy notice mengikuti kebijakan yang benar-benar diterapkan layanan. Account deletion tidak menjanjikan penghapusan immutable chain history.

## 7. Fail-closed integration

Mode live dengan credential/provider belum siap mengembalikan configuration unavailable, tidak fallback demo secara diam-diam. UI dapat tetap membaca public data yang tersedia. Mode demo login diberi label jelas dan menggunakan actor seed, tidak redirect Google palsu. Live disabled actions memiliki alasan dan jalur recovery.

Sebelum live: uji cross-account access, participant/rival/spectator projection, CSRF, session expiry, duplicate identities/roster, mismatch signature, missing reveal, secret bundle scan, private caching, origin allowlist, dan finality regression. Semua acceptance terkait tercatat di [Testing](TESTING_AND_ACCEPTANCE.md).
