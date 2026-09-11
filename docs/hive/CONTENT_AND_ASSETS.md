# Content, Copy & Assets

Tujuan content design: pengguna memahami siapa bermain, apa yang perlu dilakukan, dan mana hasil yang sudah sah. Copy ringkas tetapi tidak menghapus konteks penting. Bahasa baseline Indonesia dengan nama fase/domain canonical berbahasa Inggris.

## 1. Kamus produk

| Istilah | Makna/copy yang digunakan | Hindari |
|---|---|---|
| Human | Satu peserta dengan identitas dan pilihan sendiri | Character class, token holder |
| Squad | Tim 3–5 Human eligible; forming jika belum lengkap | Mengartikan seluruh Hive sebagai satu Squad |
| Hive | Komunitas yang diwakili Squad | Wallet pool |
| Match roster | Daftar peserta terkunci untuk match | “Active Council” di UI consumer |
| Belief | Distribusi dukungan A/B | Confidence/akurasi/probabilitas terkalibrasi tanpa bukti |
| Call | Pilihan A/B milik peserta | Bet, wager, stake, investment |
| Council | Fase membaca alasan antar-Squad dalam Hive | Public free chat |
| Belief Shift | Perubahan arah sebelum outcome | Wisdom Lift sebelum outcome |
| Wisdom Lift | Perubahan jarak ke outcome, unit pp | “+15% skor” |
| Council Score Lift | Selisih score sesudah vs sebelum Council | Disamakan dengan Wisdom Lift |
| Replay | Cerita keputusan/hasil yang diizinkan publik | Seluruh chat privat |
| Eligible | Status diizinkan bermain sesuai policy | Verified human hanya dari Google |

`pp` dibantu “poin persentase” pada tooltip/disclosure pertama dan accessible label. `N/A` diberi alasan; hidden menggunakan “Belum dibuka”, bukan “Tidak ada”.

## 2. Copy utama

Landing headline: “Punya pendapat? Bawa Squad-mu.” Penjelasan: “Di HIVE, komunitas bertanding lewat penilaian anggotanya. Pikirkan sendiri, bandingkan alasan, lalu lihat siapa paling dekat dengan kenyataan.” Primary Jelajahi Hives; secondary Tonton Replay. Join/Masuk tetap jelas. “Tanpa taruhan” boleh sebagai penjelasan singkat, bukan seluruh branding anti-crypto.

Home aktif: “Temanmu ada di sini.” Body tidak menyatakan orang online jika data TTL expired. Squad forming: “Squad-mu masih terbentuk.” Tanpa Arena: “Belum ada Arena aktif. Buka Squad untuk menyiapkan sesi berikutnya.” Jangan menjanjikan jadwal yang belum ada.

## 3. State copy matrix

| State | Heading/label | Bantuan/action |
|---|---|---|
| Own selected | Pilihan dipilih, belum terkunci | Lock A / Lock B |
| Preparing | Menyiapkan pilihan | Jangan tutup saat pengiriman belum selesai; tanpa klaim tersimpan |
| Submitting | Mengirim pilihan | Kontrol duplicate dinonaktifkan |
| Service accepted | Diterima layanan, sedang diproses | Status transaksi belum final |
| Chain submitted | Menunggu konfirmasi | Lihat status; tidak mengubah choice |
| Canonical locked | Call terkunci | Waktu penerimaan sah/receipt |
| Transport unknown | Status pengiriman belum diketahui | Periksa status sebelum mencoba lagi |
| Phase closed | Waktu fase ini sudah berakhir | Sinkronkan fase saat ini |
| Initial Reveal | Pilihan awal sudah dibuka | Ini belief awal, belum hasil pertandingan |
| Revision | Tetap atau ubah pilihanmu | Keputusan final dibuka setelah Revision ditutup |
| Defaulted Stay | Tidak ada keputusan final baru | Pilihan awal tetap berlaku sesuai aturan |
| Finalizing | Menyelesaikan pembukaan pilihan final | Tidak ada angka final sementara |
| Awaiting outcome | Final belief terkunci. Hasil masih ditunggu | Jadwal observasi/hasil yang benar |
| Round won | Purple unggul di ronde ini | Pemenang match menunggu seluruh ronde selesai |
| Match won | Purple memenangkan match | Total score dan valid round count |
| Match loss | Kali ini Chog unggul | Review bersama / Lihat Replay |
| Draw | Match berakhir imbang | Total canonical sama |
| Void | Ronde tidak diberi skor | Alasan source invalid/TIE/timeout |
| No contest | Match tidak menghasilkan hasil ranked | Alasan valid round count/incident |
| Negative lift | Belief menjauh dari outcome | Nilai minus, tinjau perubahan |
| Missing card | Argumen tidak tersedia | Alasan verifikasi/moderasi; tidak diganti teks buatan |

Error code→copy berada dalam locale dictionary, bukan string berbeda per screen. Jangan menggunakan emoji/confetti sebagai satu-satunya konfirmasi. Hindari ejekan kepada Human yang berubah pikiran atau kalah.

## 4. Angka, tanggal, dan locale

Gunakan `id-ID`: score `91,00`, belief `70,0% A`, lift `+15 pp` atau satu desimal bila perlu. Table compact boleh menghapus trailing zero asal detail/proof tetap jelas. Nilai negative zero tampil0. Skor micro-point dijumlah dahulu baru dibulatkan; jangan parse kembali string tampilan.

Tanggal ditampilkan dalam timezone pengguna, default Asia/Jakarta/WIB; ISO UTC di proof/export. Jadwal seperti “9 Sep, 19.00 WIB”. Relative time dilengkapi timestamp accessible; expired presence tidak lagi online. Countdown `mm:ss` untuk durasi pendek; label “sisa waktu Commit”, bukan jam tanpa konteks.

Tiga ronde total dapat melebihi100. Jangan menulis “257/100”; tampilkan total 257,00 dan “3 ronde valid · maks300” bila semua3 valid. Maks total mengikuti jumlah ronde valid; forfeit tetap0 pada outcome-valid round.

## 5. Form validation baseline

Selain batas argument yang berasal PRD, aturan berikut adalah keputusan UI/backend contract awal; verifikasi bersama backend sebelum live.

| Field | Validasi | Copy gagal |
|---|---|---|
| Handle | 3–24 ASCII a-z/0-9/underscore; case-insensitive uniqueness; reserved words server | “Gunakan 3–24 karakter: huruf, angka, atau underscore.” |
| Squad/Hive display name | 2–48 Unicode code points; trim; moderation/reserved names server | “Nama harus berisi 2–48 karakter.” |
| Culture tagline | ≤100 code points | “Ringkas menjadi 100 karakter atau kurang.” |
| Description | ≤600 code points plain text | Counter dan inline error |
| Argument | ≤30 words AND≤240 code points setelah canonicalization | Tampilkan kedua counter; submit disabled bila invalid |
| Chat message | 1–1000 code points plain text | Empty/too long; rate limit response respected |
| Avatar upload | JPEG/PNG/WebP; ≤2 MB; server re-encode; minimum128×128, maximum4096×4096 | “Pilih gambar JPG, PNG, atau WebP hingga 2 MB.” |
| Report reason | enum + optional text≤500 | Wajib pilih alasan; no duplicate spam |

Client validasi untuk UX; server tetap authority. Username availability debounce300 ms; status available bukan reservation. Save request dapat409 dan form harus mempertahankan input. Chat rate limit memakai retry-after server, bukan client timer saja.

## 6. Asset inventory

| Asset | Jumlah baseline | Spesifikasi/role |
|---|---:|---|
| HIVE wordmark + app mark | 2 | Orisinal SVG, light/dark via currentColor; favicon turunan |
| Default PFP collection | 8 | Karakter/pixel portrait matang, berbeda siluet/fitur; bukan rarity tiers |
| Squad crests | 10 fixture identities | Perisai dengan glyph berbeda; mudah dibaca40 px |
| Hive sigils | Purple dan Chog + generic fallback | Siluet komunitas; tidak tertukar crest |
| UI icon set | Satu set konsisten | 20/24 px SVG, stroke konsisten, lisensi tercatat |
| Empty state mark | 3–4 reusable | Netral, boleh CSS/SVG sederhana; bukan dekorasi besar |
| Share template | 1 dynamic | 1200×630 kandidat; teks tetap readable pada thumbnail; public DTO |
| Sound cue | Opsional2–3 | Ready/locked/result; default off, lisensi/orisinal jelas |

Asset path tujuan `public/assets/identities/{humans, squads, hives}/` dan `public/assets/brand/`. Registry mencatat assetId, jenis, source/license, alt policy, dimensions. Jangan memakai remote avatar produk referensi atau brand game image tanpa hak/aturan penggunaan yang sesuai. Nama game berbentuk teks cukup untuk MVP; imagery bukan blocker.

Fallback PFP memakai inisial/monogram dan warna netral; broken upload tidak membuat layout collapse. Alt dekoratif kosong jika nama bersebelahan; asset yang menyampaikan identitas tanpa teks memakai nama entitas. Crest/sigil contoh papan bukan final collection; desain orisinal baseline boleh dibuat saat build.

## 7. Feed dan story templates

Activity allowlist: member_joined, roster_ready, membership_decision, arena_scheduled, arena_started, match_settled, replay_published, season_milestone. Template mengikat actor dan resource; sanitize text, tidak `eval` template payload.

Public personal switch hanya sesudah final lock dan opt-in. Untuk core Home default gunakan aggregate/team story. Influence story mensyaratkan attributed switches valid, source cards valid, dan outcome jika ingin helpful/harmful. Contoh tepat: “Dua anggota dari dua Squad menyebut argumen Aster saat mengubah pilihan.” Tanpa attribution, gunakan “Belief Purple berubah dari55% menjadi70%A”, bukan claim influence.

Replay title harus mencantumkan round/match distinction. Preview demo tetap memuat label demo; public metadata tidak mengubah demo menjadi sesi live. Tidak mengirim ke akun sosial otomatis.
