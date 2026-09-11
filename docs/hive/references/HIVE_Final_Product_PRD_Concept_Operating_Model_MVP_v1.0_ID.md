# HIVE — Product Requirements Document

**Konsep produk, operating model, dan MVP**  
**Versi:** 1.0 — Final Concept Baseline  
**Tanggal:** 9 September 2026  
**Bahasa:** Indonesia; istilah produk dipertahankan dalam bahasa Inggris  
**Audiens:** founder, product, design, engineering, community operations, dan reviewer hackathon  
**Arena pertama:** HIVE Gaming — Steam Pulse  
**Positioning:** Social × Competitive Gaming Culture  
**Track tujuan:** Monad Metropolis — Track 03, Social, Attention & Culture

> **Think together. Compete as one.**
>
> Small teams think independently. Communities decide together. Reality keeps score.

## Ringkasan produk

HIVE adalah platform sosial kompetitif yang mengubah komunitas menjadi peserta pertandingan. Manusia bergabung dalam **Squad berisi 3–5 orang**. Setiap Squad membela satu **Hive**, yaitu komunitas yang lebih besar. Beberapa Squad mewakili Hive dalam pertandingan melawan Hive lain.

Dalam setiap ronde, peserta membaca pertanyaan, berpikir sendiri, berdiskusi di Squad, lalu mengunci pilihan A atau B sebelum melihat hasil kelompok lain. Pilihan anggota membentuk **Squad Belief**. Rata-rata Squad Belief membentuk **Hive Belief**. Setelah Reveal, tiap Squad membagikan alasan yang sudah disiapkan. Peserta membandingkan argumen melalui Council, lalu boleh mempertahankan atau mengubah pilihan sekali. Data hasil yang ditentukan sejak awal menyelesaikan ronde.

Pengalaman HIVE berpusat pada tiga pertanyaan: **Apakah kami benar? Apakah diskusi memperbaiki keputusan kami? Siapa yang membantu mengubah pikiran kami?** Jawabannya membentuk hasil pertandingan, reputasi, rivalry, dan Replay yang dapat dibagikan.

Arena pertama, **Steam Pulse**, menggunakan perubahan jumlah pemain aktif game Steam sebagai objek pertandingan. Tema ini memberi komunitas gaming sesuatu yang mereka pahami dan pedulikan, sementara hasilnya dapat dihitung dari metrik yang spesifik. Steam Pulse adalah pintu masuk pasar; mekanik HIVE tetap merupakan sistem kompetisi penilaian kolektif yang dapat berkembang ke arena budaya lain.

Pengguna masuk melalui **Public Landing → Google Auth → Onboarding → Authenticated Home**. Wallet dan transaksi Monad berada di belakang interaksi produk. Monad mengunci aturan, komitmen, afiliasi kompetitif, dan hasil yang dapat diperiksa. Chat, profil, presence, dan penyajian Replay tetap ditangani aplikasi.

**MVP tidak memiliki betting, token HIVE, wager, deposit pemain, kredit taruhan virtual, atau hadiah yang harus dipertaruhkan.** Motivasi awal berasal dari kebersamaan, kemampuan, reputasi, dan identitas komunitas. Arah jangka lanjut berupa Sponsored Arenas dan community ownership tetap dijelaskan, tetapi tidak boleh dipresentasikan sebagai ekonomi aktif sebelum benar-benar dibangun dan digunakan.

## Panduan membaca

| Kebutuhan pembaca | Bagian utama |
|---|---|
| Memahami ide, pasar, dan pembeda | [1–5](#1-status-dokumen-dan-otoritas-keputusan) |
| Memahami pertandingan dan aturan | [6–13](#6-competition-model) |
| Menentukan pengalaman web app | [14–17](#14-web-app-flow) |
| Membangun integrasi dan integritas sistem | [18–21](#18-hidden-web3-dan-why-monad) |
| Menentukan scope, validasi, dan rencana peluncuran | [22–27](#22-growth-dan-retention-loops) |
| Menyiapkan pitch dan mengecek dasar riset | [28–30](#28-track-03-dan-judging-alignment) |

## 1. Status dokumen dan otoritas keputusan

Dokumen ini mengonsolidasikan percakapan **Brainstorming Hackathon Monad**, termasuk revisi terbaru mengenai social Home, Google login, identitas Human–Squad–Hive, pembatasan reputation selama pertandingan, dan penyederhanaan desain. Dokumen ini menjelaskan produk dan cara kerjanya; spesifikasi visual detail, kontrak yang sudah diaudit, serta bukti product–market fit berada di luar fungsi dokumen.

“Final” berarti arah produk telah cukup jelas untuk menjadi baseline pembangunan. Angka operasional yang belum diuji tetap dapat berubah melalui versi aturan baru.

| Label | Makna |
|---|---|
| **Keputusan inti** | Konsep yang sudah konsisten dalam percakapan matang dan menjadi batas produk |
| **Baseline MVP** | Pilihan implementasi dalam PRD ini untuk menutup ambiguitas; berlaku pada build pertama, belum dibuktikan optimal |
| **Hipotesis** | Dugaan yang memerlukan playtest, wawancara, atau pengukuran |
| **Pengembangan lanjut** | Arah produk yang dipertahankan tetapi bukan syarat core MVP |
| **Dependensi terbuka** | Hal eksternal atau teknis yang perlu dibuktikan sebelum fitur terkait diluncurkan |

### 1.1 Rekonsiliasi yang berlaku

| Topik | Keputusan dokumen ini |
|---|---|
| Trading dan portofolio virtual | Tidak dibawa ke MVP; arena pertama adalah gaming culture melalui Steam Pulse |
| Human vs captain | Setiap manusia mengunci pilihannya sendiri; representative menulis argumen, tidak mengganti suara anggota |
| “Belief” | Persentase dukungan A/B hasil agregasi, bukan confidence yang dilaporkan langsung oleh individu |
| Waktu pertandingan | Sekitar 10 menit interaksi untuk tiga ronde; penyelesaian data live dapat lebih lama |
| Pemenang match | Total skor kualitas belief, bukan sekadar jumlah ronde dengan mayoritas benar |
| Wisdom Lift | Perbaikan jarak belief terhadap hasil dalam poin persentase; perubahan Brier-derived score diberi nama terpisah |
| Reputation di Reveal/Council | Tidak ditampilkan; riwayat reputasi tetap tersedia setelah final lock dan di profil |
| Revision | Nilai final disembunyikan sampai tenggat bersama; tidak ada live aggregate baru selama keputusan masih terbuka |
| Privasi | UI publik berfokus pada agregat; reveal per individu di public chain tetap dapat diperiksa dan harus dijelaskan secara jujur |
| Economic ownership | Model lanjut yang didefinisikan; tidak disamakan dengan MVP tanpa uang atau token |
| Desain | Premium social, mature gaming culture, minimal, lega; dekorasi mascot dan dashboard padat dari versi lama tidak dibawa |

Aturan failure, metode pembulatan, admission closed alpha, dan definisi statistik yang diperjelas di bawah adalah **baseline MVP hasil konsolidasi**, bukan klaim bahwa semua detail tersebut pernah dikunci secara eksplisit dalam percakapan.

## 2. Visi, ide inti, dan nilai produk

### 2.1 Visi

Menjadi competitive layer bagi komunitas online: tempat komunitas membangun sejarah tentang cara mereka berpikir, berkompetisi, dan menghasilkan nilai bersama.

### 2.2 Ide inti

**Komunitas menjadi pemain melalui penilaian anggota yang terstruktur.** Squad memberi komunitas wajah yang dapat dikenali. Blind Commit menjaga pemisahan keputusan awal antarkelompok. Council memberi ruang bagi argumen. Revision mempertahankan agency individu. Resolve memberi hasil objektif. Replay menjadikan prosesnya cerita sosial.

HIVE memiliki dua produk yang saling menguatkan:

1. **Live experience:** anggota berpartisipasi dalam ritual pertandingan bersama.
2. **Persistent social experience:** afiliasi, histori, rival, reputasi, dan Replay tetap bermakna setelah match selesai.

### 2.3 Janji kepada pengguna

| Pengguna | Nilai yang dijanjikan |
|---|---|
| Human | Punya kelompok, suara pribadi, dan sejarah kontribusi yang dapat ditelusuri |
| Squad | Dikenali karena kualitas keputusan dan argumen, termasuk ketika berbeda dari mayoritas |
| Hive | Memiliki ritual kompetitif dan identitas bersama yang berkembang sepanjang musim |
| Spectator | Bisa memahami pertentangan ide dan hasil melalui cerita singkat yang mudah ditonton |
| Community organizer | Mendapat aktivitas bersama yang melengkapi tempat komunitas sudah berkumpul |

### 2.4 Prinsip produk

1. **Blind before social comparison.** Tidak menampilkan pilihan kelompok lain sebelum semua initial commitment ditutup.
2. **Equal Squad weight.** Besar komunitas, saldo, dan popularitas tidak menambah bobot belief.
3. **Individual agency.** Anggota boleh berbeda dengan representative atau teman satu Squad.
4. **Reasons before status.** Argumen tampil tanpa ranking selama fase keputusan.
5. **Changing your mind is allowed.** Switch dinilai dari hasil dan konteks; Stay juga keputusan yang sah.
6. **Reality can disagree.** Hasil negatif dan Wisdom Lift negatif tetap tampil.
7. **Persistent consequences.** Pertandingan meninggalkan histori, rivalitas, dan konten yang dapat dibagikan.
8. **Web3 invisible until useful.** Detail verifikasi dapat dibuka ketika pengguna membutuhkannya.

## 3. Problem dan peluang

### 3.1 Problem yang dituju

Komunitas online sudah memiliki percakapan, perhatian, dan identitas. Namun, aktivitas itu sering belum membentuk pertandingan bersama dengan aturan, hasil, serta histori kontribusi yang jelas. Pendapat yang terdengar paling kuat juga belum tentu paling tepat.

| Problem | Dampak pada pengguna | Respons HIVE |
|---|---|---|
| Percakapan cepat hilang dalam arus pesan | Kontribusi sulit diingat | Match dan Replay membentuk objek sosial yang persisten |
| Popularitas bercampur dengan kualitas penilaian | Anggota baru sulit memperoleh pengakuan | Blind baseline, argumen setara, dan histori hasil |
| Voting terbuka memicu peniruan | Sulit membedakan penilaian awal dan pengaruh sosial | Commit sebelum Reveal, lalu Revision yang tercatat |
| Rivalitas tidak punya ritual yang terstruktur | Komunitas kekurangan alasan untuk bermain bersama secara rutin | Arena, jadwal, season, dan challenge |
| Platform memegang seluruh histori dan distribusi | Komunitas bergantung pada satu antarmuka | Arah afiliasi dan hasil yang dapat diindeks dari Monad |

Ini merupakan **hipotesis problem untuk beachhead market**, bukan hasil survei yang sudah dilakukan HIVE. Tim harus memvalidasi frekuensi masalah, solusi yang sudah dipakai, dan kemauan admin mengajak anggota bermain.

### 3.2 Pembeda mekanik

Polling biasa menghasilkan distribusi jawaban. Kompetisi prediksi individual menghasilkan skor pribadi. HIVE menghubungkan **penilaian awal → argumen → revisi → kualitas hasil → hubungan sosial** dalam satu pertandingan.

Pembeda yang harus terlihat dalam demo adalah perubahan keputusan yang punya konteks: sebuah Squad bisa benar sejak awal, dapat mengubah pikiran pihak lain, atau tetap berbeda ketika mayoritas salah. Menghasilkan leaderboard saja belum cukup membuktikan pembeda HIVE.

## 4. Target pengguna dan positioning

### 4.1 Beachhead market

**Komunitas PC gaming multi-game dan komunitas esports/kampus Indonesia yang sudah aktif di Discord**, terutama kelompok kecil hingga menengah dengan organizer yang dapat dijangkau langsung.

Pemilihan ini adalah hipotesis distribusi: anggota sudah memahami Squad, rival, match, season, dan PFP; organizer dapat merekrut kelompok untuk sesi terjadwal. HIVE tidak mengharuskan komunitas memindahkan seluruh chat atau hubungan sosialnya.

### 4.2 Persona dan jobs to be done

| Persona | Situasi dan pekerjaan utama | Tanda nilai tercapai |
|---|---|---|
| Pemain sosial | Ingin melakukan sesuatu bersama teman di luar game utama | Menyelesaikan match dan mengajak Squad kembali |
| Anggota yang suka menganalisis game | Punya pendapat tentang patch, tren, dan aktivitas pemain | Argumennya dibaca dan histori penilaiannya terlihat |
| Squad organizer | Ingin identitas kelompok dan lawan yang sepadan | Roster siap, jadwal jelas, hasil mudah dibagikan |
| Hive admin | Ingin event yang mengaktifkan komunitas | Anggota hadir dan komunitas menjadwalkan pertandingan lagi |
| Spectator/rookie | Belum siap bertanding, ingin melihat apakah HIVE menarik | Menonton Replay lalu bergabung atau mengikuti Arena |

### 4.3 Positioning yang dipakai

**HIVE is the competitive layer for online communities.**

Untuk komunikasi consumer: **Think together. Compete as one.**

Untuk menjelaskan mekanik: **Small teams think independently. Communities decide together. Reality keeps score.**

Branding social + gaming berasal dari PFP, Squad, Hive, Arena, rivalry, season, rank, dan Replay. Produk tidak perlu menjadi game 3D atau mengganti konsep collective intelligence untuk memiliki karakter gaming.

## 5. Hierarki Human → Squad → Hive

```text
Human — identitas dan pilihan pribadi
   ↓ menjadi anggota
Squad — 3–5 manusia; ruang diskusi dan unit belief
   ↓ membela satu komunitas
Hive — banyak Squad; identitas sosial dan peserta kompetisi tertinggi
   ↓ diwakili roster pertandingan
Active Council — kumpulan Squad yang bermain pada match tertentu
   ↓ berkompetisi dalam
League / Season — jadwal, standings, rivalitas, dan histori
```

**Active Council adalah roster**, sedangkan **Council adalah fase pertandingan**. Keduanya harus dibedakan dalam dokumentasi dan kode. Di UI, gunakan “Match roster” untuk konteks pendaftaran dan “Council” untuk fase membaca argumen.

### 5.1 Human

- Satu identitas kompetitif aktif per manusia adalah arah sistem.
- Satu Human hanya dapat berada pada **satu active Squad per season**.
- Hak bermain ditentukan eligibility, bukan kepemilikan aset atau NFT.
- Pemilik akun boleh menonton banyak Hive tanpa memperoleh suara tambahan.
- PFP adalah ekspresi identitas; tidak mempunyai kelas karakter, rarity, atau bonus statistik.

### 5.2 Squad

- Berisi 3–5 anggota yang eligible untuk ranked match.
- Membela satu Hive selama season; perpindahan kompetitif terjadi di transfer window.
- Anggota tidak harus sepakat. Komposisi pilihan tetap dihitung sebagai distribusi.
- Memiliki nama, crest, roster, representative, histori, dan reputasi.
- Squad yang baru dibuat dan belum memiliki tiga anggota berstatus **forming**; dapat mengundang teman, tetapi belum eligible untuk official match.

### 5.3 Hive

- Merupakan komunitas sosial yang dapat menampung banyak Squad dan follower.
- Jumlah follower/member tidak menjadi bobot pertandingan.
- Memiliki sigil, deskripsi, daftar Squad, aktivitas, jadwal Arena, hasil, dan rivalitas.
- Keanggotaan kompetitif Human mengikuti afiliasi Squad; follow Hive lain bersifat sosial.
- Admin mengatur komunitas dan pendaftaran roster, tetapi tidak dapat mengubah call anggota atau hasil.

### 5.4 Representasi pertandingan

**Target format:** dua Hive, masing-masing lima Squad; setiap Squad 3–5 manusia. Total 30–50 peserta aktif.

**Closed-alpha minimum:** dua Hive, masing-masing tiga Squad. Total 18–30 peserta. Jumlah Squad pada kedua sisi harus sama dan dikunci sebelum mulai. Match tiga Squad diberi label format tersendiri dan tidak digabung tanpa penanda dengan statistik format lima Squad.

Pada tahap awal, admin mendaftarkan roster eligible secara transparan. Model **empat kursi berdasarkan rating + satu Challenger seat dari qualifier** dipertahankan sebagai pengembangan lanjut. Seleksi otomatis belum diperlukan untuk core MVP.

### 5.5 Role dan kewenangan

| Role | Boleh | Tidak boleh |
|---|---|---|
| Human | Commit, Stay/Switch, diskusi Squad, memberi attribution | Mengunci suara orang lain |
| Squad representative | Menyusun satu argument card resmi per ronde | Memaksa konsensus atau override pilihan |
| Squad organizer | Invite dan pengaturan roster sebelum lock | Mengganti anggota di tengah match |
| Hive admin | Mengelola komunitas dan mengajukan match | Mengubah scoring atau mengedit outcome |
| Spectator | Menonton data publik dan membagikan Replay | Memengaruhi official aggregate melalui reaction |
| Curator/operator | Menyiapkan pertanyaan eligible dan menjalankan layanan | Memilih winner setelah melihat hasil |
| Resolver | Mengirim snapshot sesuai aturan yang sudah dikunci | Mengganti metrik atau memilih waktu menguntungkan |

## 6. Competition model

### 6.1 Community Match — prioritas MVP

Satu match terdiri dari **tiga ronde**. Kedua Hive menerima pertanyaan dan paket informasi yang sama pada setiap ronde. Tiap Hive membentuk belief final melalui Squad-nya. Hasil yang sama digunakan untuk menilai kedua pihak.

Winner ditentukan oleh **jumlah HiveScore pada ronde yang memiliki outcome valid**, dengan aturan forfeit pada bagian 12. Jumlah ronde dengan skor lebih tinggi dapat menjadi informasi tambahan, tetapi tidak menggantikan total skor.

Contoh: Hive pertama unggul tipis pada dua ronde tetapi kalah jauh pada satu ronde dapat kalah total. Karena itu, UI “2–0” tidak boleh berdiri sendiri sebagai penentu kemenangan. Tampilan hasil utama menggunakan total seperti **Purple 248.00 — Chog 234.00**.

### 6.2 Squad Duel

Konsep mendukung Squad vs Squad sebagai jalur latihan dan progresi: Think → diskusi internal → Commit → Reveal → Resolve, tanpa inter-Squad Council dan tanpa metrik Council Wisdom Lift. Tiga ronde memakai fungsi scoring yang sama terhadap Squad Belief.

**Scope:** pengembangan lanjut setelah Community Match stabil. Practice untuk onboarding dapat disediakan tanpa membangun ladder Duel terpisah.

### 6.3 League dan season

Season memberi rentang histori, roster yang konsisten, serta alasan kembali. Baseline perencanaan adalah season empat minggu; kalender final bergantung jumlah komunitas aktif. MVP cukup memiliki satu Founding Season, jadwal manual, hasil, dan standings sederhana.

Promotion/relegation, playoff otomatis, ranking Elo produksi, dan matchmaking real-time tidak menjadi blocker. Waktu transfer hanya berlaku untuk match berikutnya; hasil lama selalu memakai snapshot afiliasi saat match tersebut berlangsung.

### 6.4 Tie dan kelengkapan

- Total skor dihitung dengan presisi canonical, bukan angka UI yang dibulatkan.
- Total sama pada liga menghasilkan **draw**.
- Tournament dengan sudden-death merupakan format lanjutan; aturannya harus diumumkan sebelum turnamen.
- Match MVP memerlukan sedikitnya **dua dari tiga ronde dengan outcome valid** untuk hasil ranked. Jika kurang, status match **no contest**.
- Match tidak boleh berhenti pada “dua ronde menang” karena agregasi skor masih dapat berubah pada ronde ketiga.

### 6.5 Lifecycle penyelenggaraan

```text
Draft event → kedua Hive menerima jadwal/format → roster registration
→ eligibility check → readiness check → rules dan roster locked
→ tiga ronde → menunggu seluruh outcome → settlement → Replay dan standings
```

Operator MVP membuat event melalui console sederhana. Kedua admin menyetujui lawan, waktu, format, dan status live/practice sebelum anggota diminta hadir. Jika roster belum lengkap, event tetap di lobby atau dijadwal ulang; tidak memulai match ranked dengan peserta pengganti tersembunyi.

Pembatalan sebelum rules lock tidak memengaruhi score. Setelah lock, operator mengikuti aturan incident/no contest; tidak boleh membatalkan hanya karena satu Hive sedang tertinggal. Self-serve challenge composer dapat ditunda, tetapi event yang tampil di Home harus merujuk jadwal dan pihak yang benar-benar menerima challenge.

## 7. Arena pertama — Steam Pulse

### 7.1 Pertanyaan inti

**“Game mana yang mengalami pertumbuhan relatif jumlah pemain aktif lebih tinggi selama jendela pengamatan berikut?”**

Copy consumer dapat menggunakan “player momentum”, tetapi setiap question card wajib menjelaskan bahwa ukuran operasionalnya adalah **perubahan relatif concurrent players**, bukan popularitas umum, total pemain unik, retention, revenue, atau kualitas game.

Steam mendokumentasikan `GetNumberOfCurrentPlayers` untuk jumlah pemain yang sedang aktif pada app terkait. Endpoint ini menyediakan pengamatan saat ini; histori untuk pertandingan harus direkam oleh HIVE atau diperoleh dari sumber historis yang jelas. [Steamworks — ISteamUserStats](https://partner.steamgames.com/doc/webapi/ISteamUserStats)

### 7.2 Definisi hasil

Untuk game `g`:

```text
growth(g) = (players_end(g) - players_start(g)) / players_start(g)

A menang jika growth(A) > growth(B).
B menang jika growth(B) > growth(A).
Jika sama persis: outcome TIE; ronde tidak diberi skor biner.
```

Perbandingan canonical menggunakan perkalian silang integer agar hasil tidak berubah karena floating point. Baseline nol selalu invalid. Pertumbuhan dapat negatif; game dengan penurunan relatif lebih kecil tetap dapat menang.

### 7.3 Eligibility pertanyaan — baseline MVP

| Parameter | Baseline |
|---|---|
| Sumber | Endpoint resmi Steam yang dipilih dan dikunci |
| Game | Approved registry dengan Steam app ID yang nyata |
| Baseline pemain | Sedikitnya 2.000 concurrent players per game |
| Perbandingan skala | Baseline terbesar paling banyak 20× baseline terkecil |
| Jendela live | 30 menit setelah final decision barrier selesai |
| Known outage | Tidak eligible |
| Konflik kepentingan | Game yang dikendalikan peserta/organizer terkait tidak eligible |
| Evidence | Snapshot bertimestamp dan rule bundle yang dapat diaudit |

Batas 2.000, rasio 20×, dan jendela 30 menit adalah asumsi operasional dari arah sebelumnya, bukan bukti bahwa manipulasi menjadi mustahil atau gameplay menjadi menarik.

### 7.4 Hindari kebocoran hasil selama Revision

Perbandingan Before/After Council harus menggunakan outcome yang belum selesai ketika peserta masih boleh berubah. Karena itu, **jendela scoring live dimulai setelah final decision barrier**, bukan saat Think dimulai. Paket informasi di Think dapat menunjukkan context snapshot yang lebih awal, dengan label yang membedakannya dari baseline penilaian.

Konsekuensinya, HIVE tidak menjanjikan “seluruh pertandingan selesai dalam 10 menit” untuk data live 30 menit. Pemain menyelesaikan sekitar 9 menit 30 detik interaksi ditambah overhead, lalu boleh meninggalkan halaman. Hasil ronde pertama tersedia sekitar 33 menit setelah match mulai; hasil terakhir sekitar 40 menit, sebelum toleransi resolver. Angka ini ilustrasi jadwal normal, bukan SLA.

### 7.5 Live dan historical mode

| Mode | Kegunaan | Cara pelabelan |
|---|---|---|
| Live | Arena terjadwal dengan snapshot baru | Waktu finalisasi keputusan dan jadwal outcome terlihat |
| Historical practice | Belajar dan playtest dengan hasil yang sudah diketahui organizer | “Historical practice”; ground truth disembunyikan dari peserta sampai final lock |
| Demo terkurasi | Menunjukkan seluruh flow secara singkat | “Historical/demo”; akun scripted dan data simulasi diungkap |

Mode historical tidak boleh masuk ranked live standings. Nama contoh seperti Chrono Echoes dan Starfall Vanguard dari desain sebelumnya adalah fixture ilustrasi, bukan klaim bahwa game tersebut memiliki data Steam valid.

### 7.6 Resolver policy

Sebelum match, rules mengunci app ID, formula, target waktu, toleransi timestamp, identitas resolver, timeout, dan aturan void. Baseline kandidat: satu pengambilan pasangan snapshot terjadwal, selisih waktu antargame maksimum 10 detik, tiap snapshot maksimum 30 detik dari target, dan batas menunggu pengiriman data 120 detik. Parameter ini harus diuji terhadap ketersediaan API sebelum ranked live dibuka.

Resolver menggunakan pengamatan valid pertama sesuai jadwal yang dicatat, menyimpan bukti request/response, dan tidak memilih di antara beberapa snapshot berdasarkan outcome. Retry hanya untuk kegagalan transport/response invalid dan tetap berada dalam toleransi. Jika syarat gagal, outcome **VOID**. Operator tidak diberi tombol memilih A/B sebagai pengganti data.

## 8. Match flow — tujuh fase

```text
THINK → DELIBERATE → COMMIT → REVEAL → COUNCIL → REVISION → RESOLVE
```

Final Lock adalah barrier penutupan Revision, bukan fase keputusan kedelapan. Resolve dapat berstatus **Awaiting outcome**, **Resolved**, **Void**, atau **No contest** sesuai levelnya.

### 8.1 Baseline waktu

| Fase | Durasi awal | Tugas utama |
|---|---:|---|
| Think | 20 detik | Memahami pertanyaan secara pribadi |
| Deliberate | 60 detik | Diskusi internal dan menyiapkan argument card |
| Commit | 15 detik | Setiap anggota mengunci initial call |
| Reveal | 10 detik | Membuka komitmen dan menampilkan Squad Beliefs |
| Council | 60 detik | Membandingkan alasan dan berdiskusi kembali di Squad |
| Revision | 20 detik | Stay/Switch, attribution jika berubah, final lock |
| Finalization buffer | 5 detik kandidat | Membuka final commitments setelah Revision ditutup |
| **Interaksi per ronde** | **190 detik** | Di luar waktu menunggu hasil live |

Baseline ini **research-informed dan belum tervalidasi pada HIVE**. Finalization buffer perlu diperpanjang sebelum match jika pengujian jaringan membuktikan lima detik tidak cukup. Seluruh durasi berada dalam match config yang dikunci sebelum mulai; peserta tidak dapat memperpanjang fase secara individual.

### 8.2 Think

Pengguna melihat pertanyaan, opsi A/B, definisi momentum, dan evidence pack yang sama. Squad chat belum aktif. Tidak ada belief, vote count, reputasi, argumen lain, atau progress yang menyiratkan pilihan.

Pilihan awal dapat menjadi draft pribadi. Think draft bukan committed vote dan tidak menjadi baseline publik. Untuk eksperimen, baseline benar-benar individual dapat direkam dengan persetujuan peserta; ini berbeda dari baseline sebelum Council yang sudah melewati diskusi internal Squad.

### 8.3 Deliberate

Squad chat dibuka hanya untuk anggota roster tersebut. Peserta dapat membahas evidence dan alasan. Representative menyusun satu argument card resmi maksimal **30 kata dan 240 karakter**; kedua batas diberlakukan. Card boleh menyatakan adanya ketidaksetujuan internal.

Pilihan pribadi masih dapat diganti sebagai draft. UI menampilkan status partisipasi, tanpa A/B per anggota dan tanpa aggregate. Pesan chat dapat secara sukarela mengungkap pendapat; HIVE tidak mengklaim bahwa diskusi internal bebas pengaruh sosial.

Pada akhir Deliberate, isi argument card dibekukan. Komitmen hash teks beserta salt dikirim paling lambat akhir Commit. Tidak ada penulisan ulang argumen setelah melihat hasil kelompok lain.

### 8.4 Commit

Chat menjadi read-only. Setiap anggota memilih **Lock Option A** atau **Lock Option B**. Satu initial commitment yang sah diterima per peserta per ronde.

State harus jelas: **selected, not locked → submitting → locked**. Klik tombol atau penerimaan backend belum sama dengan finalitas chain. Jika transaksi gagal sebelum deadline, pengguna dapat retry idempotent dengan pilihan yang sama. Setelah commitment canonical diterima, pilihan tidak dapat ditimpa.

Representative tidak dapat mengirim pilihan atas nama orang lain. Completion indicator hanya menunjukkan kesiapan, tanpa distribusi A/B.

### 8.5 Reveal

Reveal dibuka setelah tenggat Commit seluruh roster. Sistem membuka choice dan salt, memeriksa kecocokan hash, lalu menghitung initial Squad Beliefs dan initial Hive Belief.

UI menampilkan aggregate setelah batch reveal tervalidasi; tidak menyajikan hitungan bertambah satu per satu sebagai sinyal yang bisa ditindaklanjuti. Tidak ada initial call yang dapat berubah pada fase ini.

Argument card yang cocok dengan komitmennya tersedia saat masuk Council. Match room boleh menunda penampilannya sampai Council untuk menjaga fokus. Data yang sudah diungkap melalui jaringan publik tidak dianggap rahasia hanya karena UI belum menampilkannya.

### 8.6 Council

Council menjawab **“Mengapa tiap Squad memilih demikian?”** Tiap Squad memiliki satu card dengan nama, crest, belief awal, dan alasan. Tidak ada rank, badge akurasi, atau ukuran influence pada card.

Semua anggota membaca card dari roster Hive sendiri dan boleh berdiskusi kembali di ruang privat Squad. MVP tidak memiliki public free-chat lintas Squad. Representative tidak mengubah card yang telah dikomitkan. Urutan card stabil selama fase dan tidak ditentukan reputasi; rotasi urutan antarronde boleh dipakai sebagai baseline untuk mengurangi keuntungan posisi.

Initial Hive Belief tetap frozen sebagai pembanding. Rival Hive juga memiliki Council sendiri. Informasi initial yang sudah dibuka onchain tidak dapat dijamin tersembunyi dari lawan; aturan dan evaluasi riset harus mengakui ini.

### 8.7 Revision

Setiap anggota melihat initial call dan memilih **Stay** atau **Switch**. Perubahan hanya satu kali dalam arti satu final decision yang diterima, setelah itu terkunci.

Jika Switch, pengguna memilih satu sumber pengaruh: argument Squad lain dalam Council, diskusi internal, evidence baru, pertimbangan sendiri, atau tidak ingin menyebutkan. Attribution ke Squad harus merujuk card yang benar-benar tersedia pada ronde tersebut. Jika Stay, form influence tidak muncul.

Final call disimpan sebagai commitment baru. Nilai A/B final dan attribution baru dibuka setelah semua hak revisi ditutup. Selama Revision, UI hanya menampilkan initial aggregate dan completion status. **Tidak boleh mengirim final choice plaintext onchain selama peserta lain masih dapat merevisi.**

Jika peserta tidak mengirim final commitment sama sekali, initial call otomatis berlaku sebagai **defaulted Stay**, bukan explicit participation. Jika peserta sudah mengirim final commitment tetapi tidak membukanya setelah deadline, berlaku failure rule; sistem tidak boleh membiarkannya memilih sesudah melihat final call orang lain.

### 8.8 Resolve

Setelah finalization, final Squad/Hive Beliefs dibekukan. Ronde masuk Awaiting outcome sampai resolver menghasilkan data valid atau timeout. Pengguna dapat lanjut ronde berikutnya, kembali ke Home, atau keluar aplikasi.

Saat hasil tersedia, Resolve menunjukkan:

1. Outcome pertanyaan dan apakah majority call Hive benar.
2. Skor ronde dan status match.
3. Wisdom Lift, termasuk nilai nol atau negatif.
4. Belief sebelum dan sesudah Council.
5. Cerita influence hanya jika ada attribution tercatat.
6. Watch Replay, next action yang masih relevan, dan View Proof sekunder.

“Hive was right” tidak otomatis berarti “Hive won the match”. Kedua Hive dapat sama-sama memilih mayoritas yang benar dengan skor berbeda.

## 9. Information visibility dan batas privasi

| Data | Think–Commit | Reveal/Council | Revision terbuka | Sesudah final lock |
|---|---|---|---|---|
| Pilihan sendiri | Draft/locked milik sendiri | Tersedia untuk diri sendiri | Initial dan draft final milik sendiri | Riwayat pribadi |
| Pilihan anggota lain di UI | Tidak ditampilkan | Agregat Squad | Agregat awal saja | Agregat; histori personal tidak disebarkan otomatis |
| Chat Squad | Deliberate saja | Council: anggota Squad | Read-only | Arsip privat sesuai retensi |
| Argument card resmi | Privat untuk Squad | Dibuka setelah hash cocok | Read-only | Publik pada Replay yang dipublikasikan |
| Initial Hive Belief | Tersembunyi | Terlihat | Frozen | Terlihat |
| Final Hive Belief | Belum ada | Belum ada | Tersembunyi | Terlihat |
| Reputation di match room | Tidak ditampilkan | Tidak ditampilkan | Tidak ditampilkan | Dapat ditampilkan secara sekunder |
| Public chain | Hash komitmen dan metadata | Reveal individu dapat diperiksa | Final commitments saja | Final reveals dan hasil dapat diperiksa |

### 9.1 Tiga batas yang tidak boleh disamarkan

**Privasi aplikasi berbeda dari privasi blockchain.** MVP public-chain commit/reveal menyembunyikan pilihan sebelum reveal, tetapi tidak memberi anonimitas permanen. Pseudonym/wallet dapat terhubung ke afiliasi publik. Jangan menulis “pilihanmu tidak pernah dapat dilihat siapa pun”.

**Blindness antarkelompok tidak berarti independence mutlak.** Peserta bisa berkomunikasi di Discord, membuka profil Squad terkenal, atau menggunakan alat di luar HIVE. UI mengurangi bias; tidak menghapus semua saluran eksternal.

**Simultaneous reveal adalah pengalaman aplikasi.** Transaksi blockchain tetap berurutan. Keamanan utamanya berasal dari penutupan semua commitment sebelum reveal, dan penutupan semua revision commitment sebelum final reveal, bukan klaim bahwa setiap byte muncul serentak.

## 10. Aggregation dan scoring

### 10.1 Unit dan bobot

Setiap manusia memilih `A = 1` atau `B = 0`. Untuk Squad `s` dengan roster sah `n_s`:

```text
p_s = jumlah anggota yang memilih A / n_s

p_h = (p_1 + p_2 + ... + p_k) / k
```

`k` adalah jumlah Squad dalam roster Hive untuk match tersebut. Denominator dikunci sebelum match; sistem tidak diam-diam menghapus missing participant atau Squad untuk memperbaiki skor.

Squad tiga orang dan Squad lima orang sama-sama menyumbang satu bagian pada Hive. Akibatnya, pengaruh seorang anggota terhadap Hive bergantung pada ukuran Squad. Ini konsekuensi yang disengaja dari **equal Squad representation**, bukan one-person-one-vote pada seluruh Hive.

### 10.2 Makna belief

75% A berarti 75% suara dalam Squad atau hasil rata-rata antarkelompok mendukung A. Angka ini tidak otomatis merupakan probabilitas terkalibrasi bahwa A akan terjadi. Label “community confidence” sebaiknya dihindari pada MVP agar pengguna tidak salah membaca maknanya.

### 10.3 HiveScore

Untuk outcome A, `y = 1`; untuk B, `y = 0`:

```text
HiveScore(p, y) = 100 × (1 - (p - y)²)
MatchScore = jumlah HiveScore final pada ronde dengan outcome valid
```

Fungsi ini menilai seberapa dekat aggregate belief dengan outcome, dengan penalti lebih besar untuk posisi yang lebih jauh dari hasil. Nilai belief 50/50 menghasilkan 75 pada skala ini; **75 bukan bukti akurasi 75%**.

Brier-derived scoring di sini adalah alat evaluasi aggregate. Karena individu hanya memilih A/B, PRD tidak mengklaim bahwa proper scoring rule membuat setiap individu jujur melaporkan probabilitas. Distribusi dukungan juga belum membuktikan kalibrasi; kalibrasi memerlukan banyak observasi.

### 10.4 Wisdom Lift — definisi canonical

Untuk `p_initial` sebelum Council dan `p_final` setelah Revision:

```text
WisdomLift_pp = 100 × (|p_initial - y| - |p_final - y|)

CouncilScoreLift = HiveScore(p_final, y) - HiveScore(p_initial, y)
```

**Wisdom Lift** mengukur berapa poin persentase aggregate bergerak lebih dekat ke outcome. Rentang −100 sampai +100. **Council Score Lift** mengukur perubahan skor kuadratik; nilainya tidak sama.

Baseline ini mempertahankan maksud consumer dari desain terbaru: 57% A → 68% A, jika A benar, berarti **Wisdom Lift +11 poin**, sedangkan skor naik dari 81,51 menjadi 89,76, yaitu **Council Score Lift +8,25**. Jangan menulis “+11% peningkatan skor”.

Sebelum outcome diketahui, gunakan **Belief Shift**, misalnya “+11 pp toward A”. Istilah Wisdom Lift baru boleh muncul setelah outcome valid. Angka 57/68 adalah ilustrasi belief; fixture implementasi harus mengikuti hitungan roster yang benar.

Wisdom Lift membandingkan pre-Council dan post-Council pada roster yang sama. Nilai ini mendeskripsikan perubahan yang terjadi; satu match tidak membuktikan Council menyebabkan peningkatan, karena informasi eksternal, timing, dan faktor lain mungkin ikut berperan.

### 10.5 Contoh lengkap yang dapat dihitung ulang

Lima Squad, masing-masing empat anggota:

| Squad Purple | Initial A/B | Initial belief A | Final A/B | Final belief A |
|---|---|---:|---|---:|
| Alpha Wolves | 3 A, 1 B | 75% | 4 A, 0 B | 100% |
| Chaos Labs | 1 A, 3 B | 25% | 2 A, 2 B | 50% |
| Quant Boys | 4 A, 0 B | 100% | 4 A, 0 B | 100% |
| Apex | 1 A, 3 B | 25% | 2 A, 2 B | 50% |
| Signal House | 2 A, 2 B | 50% | 2 A, 2 B | 50% |
| **Hive** | | **55%** | | **70%** |

Outcome: **A**.

- Initial HiveScore: `100 × (1 − 0,45²) = 79,75`.
- Final HiveScore: `100 × (1 − 0,30²) = 91,00`.
- Wisdom Lift: **+15 pp**.
- Council Score Lift: **+11,25 poin skor**.
- Jika Chog final 60% A, Chog mendapat **84,00**; Purple unggul ronde dengan 91,00.

Jika anggota Chaos dan Apex yang Switch mencantumkan card Alpha, Replay dapat menyatakan **“Anggota dari dua Squad menyebut argumen Alpha saat mengubah pilihan.”** Data tersebut tidak berarti seluruh anggota kedua Squad setuju dengan Alpha.

Jika outcome justru B, Purple mendapat 51,00 dan Wisdom Lift −15 pp. Narasi tidak boleh tetap mengatakan Council memperbaiki judgment.

### 10.6 Presisi dan pembulatan

Baseline engineering: belief disimpan pada skala integer `1.000.000`; setiap division menggunakan floor yang konsisten. Skor memakai skala micro-point dan aturan deterministik yang sama pada contract serta indexer. Hasil seri menggunakan nilai canonical tersebut.

UI boleh menampilkan belief satu desimal dan skor dua desimal. Total dihitung dari nilai canonical lalu dibulatkan untuk tampilan; jangan menjumlah angka yang sudah dibulatkan. Replay menyimpan rule version sehingga hasil historis tidak berubah ketika versi scoring diperbarui.

## 11. Reputation, influence, dan progresi

### 11.1 Reputation bukan voting power

Reputasi membangun pengakuan dan membantu navigasi histori. Reputasi tidak menambah jumlah suara, tidak mengubah bobot Squad, dan tidak memberikan override. Pengguna tidak dapat membeli reputasi.

### 11.2 Empat dimensi Squad

| Dimensi | Definisi MVP | Batas interpretasi |
|---|---|---|
| Independent Performance / Independent Alpha | Rata-rata SquadScore initial sebelum melihat hasil Squad lain | Sudah mencakup diskusi internal; bukan kemampuan individu murni |
| Influence Quality | Proporsi attributed switches yang berakhir salah→benar dibanding seluruh attributed switches valid | Attribution adalah laporan pengguna, bukan bukti kausal |
| Contrarian Edge | Hasil Squad pada ronde ketika majority call-nya berlawanan dengan mean initial Squad lain dalam Hive | Berbeda pendapat sendiri tidak memberi bonus |
| Reliability | Completion initial commit/reveal dan explicit final decision; tampilkan defaulted Stay terpisah | Gangguan platform harus dipisahkan dari absen individual |

Baseline statistik memakai histori season berjalan, dengan window hingga 20 ronde eligible terbaru untuk ringkasan performa. Sampel di bawah 10 ronde atau 10 attribution events diberi label **provisional**, bukan peringkat presisi tinggi. Jumlah sampel, format match, dan periode harus dapat dibuka.

Pada Contrarian Edge, belief 50/50 tidak mempunyai majority call. Mean kelompok lain 50/50 juga tidak membentuk arah mayoritas. Kasus ini tidak diklasifikasikan contrarian.

### 11.3 Influence event

Event valid membutuhkan:

1. Initial call dan final call berbeda.
2. Keduanya dibuka dan tervalidasi sesuai deadline.
3. Attribution memilih satu card Squad lain yang tersedia dalam Council Hive sendiri.
4. Identitas target, sumber, ronde, dan card version dapat ditelusuri.
5. Outcome valid untuk menentukan helpful atau harmful.

Wrong→right adalah **helpful attributed switch**. Right→wrong adalah **harmful attributed switch**. Sebelum outcome, statusnya **unresolved**. Tidak ada switch berarti tidak ada edge baru, walaupun pengguna menyukai argumen.

Satu anggota hanya dapat menghasilkan satu attribution event per ronde. Beberapa event dari satu target Squad boleh digabung menjadi satu edge dengan count yang jelas. Circle attribution, kolusi, dan spam dipantau; MVP tidak membayar event tersebut sehingga insentif farming berkurang.

### 11.4 Jangan membuat graph yang menyesatkan

Jika Chaos dan Apex sama-sama memilih Alpha, graph yang benar adalah **Alpha → Chaos** dan **Alpha → Apex**. Rantai **Alpha → Chaos → Apex** hanya boleh ditampilkan jika attribution kedua benar-benar merujuk Chaos.

Perubahan aggregate tidak cukup untuk membuktikan influence. Pernyataan “Alpha mengubah seluruh Hive” hanya boleh menjadi judul editorial dengan penjelasan jumlah attribution yang mendukung; default copy lebih presisi seperti “Argumen Alpha disebut oleh tiga anggota dari dua Squad”.

### 11.5 Reputasi Hive dan Human

Hive memiliki hasil W/D/L, skor rata-rata, rata-rata Wisdom Lift beserta sample size, dan histori lawan. Label “Community IQ” dari konsep lama dapat menjadi nama informal, tetapi UI dan pitch harus menjelaskan bahwa ini skor permainan, bukan tes IQ atau ukuran kecerdasan umum.

Human memiliki riwayat partisipasi, afiliasi, dan pilihan pribadi. Public Home tidak otomatis menyiarkan “Kevin switched A→B”; event personal hanya dapat diterbitkan setelah final lock, dengan opt-in pemiliknya, tanpa isi chat privat.

Elo, calibration chart, Herding Index, serta pemisahan Reasoning Power dan Status Power merupakan analitik lanjutan. Convergence saja tidak membuktikan perilaku buruk; convergence dapat membantu atau merusak judgment.

## 12. Aturan sistem, deadline, dan exception

### 12.1 Invariants

1. Satu Human hanya ada di satu posisi roster dalam season dan match terkait.
2. Setiap Squad membela tepat satu Hive dalam snapshot match.
3. Kedua Hive mendapat jumlah kursi Squad yang sama.
4. Question, roster, scoring, resolver, dan deadline dikunci sebelum Think.
5. Satu initial commitment sah per Human per ronde.
6. Initial reveal baru sah setelah Commit ditutup.
7. Satu final decision commitment sah per Human per ronde.
8. Final reveal baru sah setelah Revision ditutup untuk semua pemain.
9. Skor berasal dari data canonical; client dan cache tidak dapat memilih winner.
10. Reputation, saldo, avatar, dan sponsor tidak menambah bobot keputusan.
11. Histori match menggunakan afiliasi saat bertanding, bukan afiliasi terbaru.
12. Tidak ada perubahan aturan retroaktif untuk menyelamatkan narasi hasil.

### 12.2 Time authority

Countdown menggunakan estimasi waktu jaringan yang disinkronkan. Contract menerapkan batas `start ≤ time < deadline`; pada `time ≥ deadline`, submit fase lama ditolak. Jika layar mencapai nol, kontrol lama langsung nonaktif dan UI menampilkan status sinkronisasi bila perlu.

Pergantian fase tidak menunggu semua orang menekan Continue. Backend scheduler memicu fungsi yang diperlukan; keeper/finalizer yang diizinkan aturan dapat menyelesaikan fase jika scheduler utama gagal. Tidak ada admin yang membuka kembali phase sesudah melihat hasil.

### 12.3 Missing actions — baseline konservatif

Initial call lengkap diperlukan untuk membandingkan roster secara adil. MVP tidak mengisi missing initial vote dengan A, B, atau 50/50 dan tidak mengecilkan denominator.

| Kasus | Penanganan |
|---|---|
| Draft A/B belum dikunci saat Commit berakhir | Missing initial commitment |
| Initial commitment tidak di-reveal atau hash salah | Missing/invalid initial reveal |
| Salah satu initial vote roster hilang | Hive terkait forfeit ronde: skor kompetitif 0; aggregate lengkap dan Wisdom Lift N/A |
| Tidak mengirim final commitment | Initial call tetap berlaku; label defaulted Stay |
| Final commitment ada tetapi gagal dibuka | Hive terkait forfeit ronde; tidak boleh kembali memilih initial secara oportunistik |
| Argument card hilang/tidak cocok | Card unavailable; skor pilihan tetap sah, quality metric ronde ditandai incomplete Council |
| Outcome data invalid/TIE | Ronde void untuk kedua Hive; tidak dihitung pada score atau Wisdom Lift |
| Kedua Hive kehilangan initial/final required reveal | Keduanya forfeit ronde, skor 0; event tersedia untuk review reliability |

Aturan forfeit ini keras dan merupakan baseline untuk mencegah selective non-reveal. Playtest teknis harus memastikan auto-reveal andal sebelum ranked launch. Kebijakan yang lebih lunak hanya boleh diperkenalkan setelah dianalisis agar withholding tidak menjadi cara memperbaiki hasil.

### 12.4 Disconnect, absen, dan gangguan luas

Reconnection memulihkan phase dan receipt canonical. Initial commitments yang sudah diterima tetap sah; pemain tidak memulai ulang ronde. Late join setelah roster lock menjadi spectator.

Gangguan personal mengikuti missing-action policy. Gangguan bersama pada chain, auth, relayer, atau resolver yang memenuhi incident policy menandai match **disputed/no contest** untuk standings, dengan alasan dan bukti publik. Nilai contract yang sudah tercatat tidak dihapus. Penandaan administratif ini merupakan lapisan adjudication yang masih dipercaya, dan harus dibedakan dari raw outcome onchain.

### 12.5 Moderasi

MVP memiliki report, mute, rate limit pesan, dan kemampuan moderator menyembunyikan konten berbahaya. Moderator dapat menyembunyikan argument text dalam UI dengan alasan tercatat, tetapi hash historis tetap ada. Moderasi konten tidak otomatis mengubah score.

Jika kecurangan atau impersonation terbukti, eligibility berikutnya dapat dicabut. Perubahan standings akibat adjudication dibuat sebagai record tambahan dengan reason dan timestamp; tidak mengedit diam-diam sejarah.

## 13. Rewards dan community ownership

### 13.1 Rewards core MVP

Reward berupa rank season, histori hasil, title sederhana, rivalry, Featured Replay, dan pengakuan kontribusi. Achievement tidak dapat diperdagangkan, dibeli untuk memperoleh advantage, atau ditukar dengan uang dalam MVP.

**Agenda Ticket** dipertahankan sebagai mekanik lanjutan: kemenangan memberi hak terbatas memilih satu pertanyaan dari pool eligible untuk event berikutnya. Ticket tidak transferable, tidak meningkatkan voting power, tidak dapat menentukan outcome, dan memiliki expiry. Ini menghubungkan hasil hari ini dengan agenda komunitas berikutnya.

### 13.2 Economic ownership — arah yang sudah dirumuskan

Percakapan mengembangkan **Sponsored Arenas / Attention Dividend**: pihak sponsor membiayai event karena nilai partisipasi dan perhatian komunitas. Peserta tidak mempertaruhkan uang.

Proposal alokasi yang dipertahankan untuk diuji:

| Penerima | Proporsi proposal | Prinsip |
|---|---:|---|
| Verified participants | 50% | Satu qualifying human, satu participation unit |
| Winning Community Vault | 30% | Nilai kembali ke komunitas, bukan dompet admin |
| Curator pertanyaan | 10% | Menghargai penyedia topik yang memenuhi quality rules |
| Operasional HIVE | 10% | Mendukung penyelenggaraan dan layanan |

Angka ini proposal produk, belum unit economics yang terbukti. Eligibility dividend memerlukan explicit commit, reveal, final decision, serta lolos aturan integritas; defaulted Stay tidak otomatis mendapat participation share. Total pembagian harus dibatasi dana sponsor aktual dan tidak menjanjikan yield.

Community Vault dirancang memakai persetujuan **3 dari 5 representative Squad yang berwenang** untuk proposal pengeluaran. Snapshot signer, masa jabatan, penggantian, quorum ketika signer hilang, dan pemisahan otoritas gameplay/treasury harus didefinisikan sebelum contract bernilai nyata digunakan. Ini bukan kewenangan captain untuk mengubah keputusan pertandingan.

### 13.3 Boundary MVP

Core MVP tidak meluncurkan vault uang nyata, payout token, stablecoin reward, atau virtual wagering. Sponsorship testnet dapat menjadi **milestone ownership tambahan yang terpisah**, setelah core berfungsi dan tanpa memperkenalkan taruhan pemain. Jika belum dibangun, pitch hanya menyebutnya sebagai roadmap.

Portabilitas histori dan afiliasi adalah nilai ownership yang dapat dibuktikan core MVP. **Economic stake nyata tetap merupakan gap terhadap ambisi penuh Track 03** sampai mekanisme dan distribusi nilai benar-benar terjadi. Token-free MVP tidak boleh dipresentasikan seolah sudah menyelesaikan seluruh economic ownership thesis.

## 14. Web app flow

```text
PUBLIC LANDING
   ├─ Explore Hives / Rankings / Public Replay / Watch
   └─ Join HIVE / Sign in
          ↓
     CONTINUE WITH GOOGLE
          ↓
     First-time user?
       ├─ Ya → PFP + username → Squad → Hive → Ready
       └─ Tidak → Restore session
          ↓
     AUTHENTICATED HOME
          ↓
     Arena / Squad / Hive / Replay / Profile
```

### 14.1 Public Landing

Landing menjelaskan ide dalam satu layar pertama: kelompok kecil berpikir, komunitas bertanding, hasil membentuk histori. Primary CTA **Join HIVE**; secondary **Explore** atau **Watch Replay**. Orang dapat menilai produknya sebelum mendaftar.

Public content hanya mengambil match/Hive yang memang publik. Tidak ada live participant count palsu, placeholder traction yang tampak nyata, atau kata “verified” untuk pengguna yang hanya login Google.

### 14.2 Authentication

**Google adalah satu-satunya primary sign-in MVP.** Sign in dan Join memakai identity flow yang sama; sistem menentukan apakah onboarding sudah lengkap. OAuth yang dibatalkan mengembalikan pengguna ke halaman sebelumnya tanpa kehilangan invite intent.

Connect Wallet tidak berada sejajar dengan Google pada landing/auth. Setelah login, aplikasi menyiapkan account dan embedded wallet menggunakan provider yang lolos spike teknis. Status penyediaan wallet yang gagal harus dapat di-retry tanpa menghasilkan akun duplikat.

### 14.3 Onboarding pertama

| Langkah | Isi | Aturan |
|---|---|---|
| Your identity | Username, pilih PFP HIVE atau upload | Username tersedia; moderasi nama dan upload dasar |
| Your Squad | Join via invite, cari Squad terbuka, atau create | Belum tiga anggota tetap forming |
| Your Hive | Pilih afiliasi untuk Squad baru, atau konfirmasi afiliasi Squad yang diikuti | Member tidak memilih Hive kompetitif yang bertentangan dengan Squad |
| You're ready | Ringkasan Human → Squad → Hive dan next action | Status forming, pending approval, atau eligible dijelaskan |

Jalur utama tetap menyelesaikan identitas, Squad, dan Hive. **Explore first** adalah escape path bagi pengguna yang belum punya teman atau belum disetujui: onboarding sosial dapat ditunda, Home menampilkan ajakan bergabung, dan ranked play tetap terkunci. Ini menghindari kebuntuan tanpa membuat pengguna palsu seolah sudah memiliki Squad.

Human verification dilakukan ketika pengguna ingin mendaftar ranked roster, bukan dipaksakan kepada visitor yang hanya membaca Replay. Profile → Settings → Advanced → Wallet & Verification menjadi lokasi detail wallet, status verifikasi, recovery, dan proof.

### 14.4 Returning user

Google/session login membawa pengguna ke Home atau deep link yang dituju. Jika onboarding belum lengkap, lanjutkan dari langkah terakhir. Jika match sudah dimulai, arahkan sesuai roster: pemain melanjutkan phase saat ini; non-roster menonton.

## 15. Authenticated Home dan navigation

Home menjawab **“Apa yang sedang terjadi pada orang-orang dan komunitasku?”**

Prioritas konten:

1. Live/upcoming Arena yang relevan, termasuk waktu dan orang yang sudah hadir.
2. Aktivitas Squad dan Hive yang memerlukan tindakan.
3. Replay atau cerita hasil terbaru.
4. Challenge dan jadwal berikutnya.
5. Konteks ringan: Your Squad, Your Hive, presence.

Navigasi utama: **Home, Arena, Hives, Rankings**, dengan search, notifications, dan PFP account menu. Squad dapat dibuka dari Home, profil, dan Hive. Home bukan marketing page kedua dan tidak menjadi dinding analytics.

### 15.1 Social feed sebagai aktivitas produk

Event utama: anggota bergabung, roster terbentuk, challenge masuk, Arena dimulai, match selesai, Replay tersedia, dan milestone season. Perubahan call pribadi hanya muncul setelah lock dan opt-in. Tidak ada generic posting/reposting network sebagai scope core.

Baseline ranking feed: event Hive/Squad sendiri yang memerlukan tindakan → live/upcoming → hasil/replay terbaru → discovery terbatas. Tidak memakai jumlah likes sebagai proxy kualitas argumen. Semua presence harus memiliki TTL; “online” yang kedaluwarsa tidak dipertahankan untuk membuat aplikasi tampak ramai.

### 15.2 Notifications

MVP memakai notifikasi dalam aplikasi untuk invite, membership decision, match reminder, roster change sebelum lock, hasil yang siap, dan challenge. Pengguna dapat mengatur reminder. Email/push/Discord bot bukan syarat core; pengirimannya memerlukan preferensi pengguna dan implementasi terpisah.

## 16. Key screens dan acceptance criteria

| Screen | Tujuan dan isi utama | Kriteria penerimaan |
|---|---|---|
| Landing | Proposition, Human→Squad→Hive, satu preview, CTA | Pengguna baru dapat menjelaskan siapa yang bertanding setelah melihat halaman |
| Sign In | Google, copy singkat, error/retry | Tidak ada kewajiban connect wallet manual |
| Onboarding | Identity, Squad, Hive, Ready | Invite intent tersimpan; afiliasi tidak bertentangan |
| Home | Presence, next Arena, activity, Replay | Next action jelas; tidak menampilkan aktivitas privat |
| Explore Hives | Komunitas, deskripsi, jadwal, cara bergabung | Public browse bekerja sebelum login |
| Hive Profile | Overview, Activity, Matches, Squads, Members | Overview menonjolkan komunitas; statistik mendalam sekunder |
| Squad Profile | Roster, crest, Hive, hasil, empat dimensi reputasi | Data provisional dan jumlah sampel terlihat |
| Arena/Lobby | Matchup, roster, readiness, rules, schedule | Tidak bisa memulai ranked dengan roster ineligible |
| Match Room | Question, phase, timer, tindakan, Squad context | Seluruh tujuh phase bekerja dalam shell konsisten |
| Resolve | Outcome, score, lift, cerita, next action | Membedakan correct call, round score, dan match winner |
| Replay | Timeline dan cerita perubahan judgment | Dapat dibagikan tanpa login; angka sesuai hasil canonical |
| Rankings | Standings dengan filter season/format | Demo, provisional, forfeits, dan no contest dibedakan |
| Human Profile/Settings | Identitas, afiliasi, riwayat, notification, advanced | Wallet/verification tidak mendominasi pengalaman utama |
| View Proof | Rules, commitments, result, source snapshots | Pengguna dapat melacak klaim hasil ke evidence |
| Operator console | Eligibility, roster, schedule, resolver health, moderation | Tidak menyediakan arbitrary winner override |

Operator console dapat berupa alat internal sederhana. Banyaknya screen bukan ukuran keberhasilan MVP; semua screen pendukung harus melayani satu alur pertandingan end-to-end yang berjalan.

## 17. Replay dan shareability

### 17.1 Replay sebagai content object

Replay menceritakan **bagaimana Hive berpikir**, dengan urutan:

```text
Initial belief → perbedaan antar-Squad → argument utama
→ revisi tercatat → final belief → outcome → dampak
```

Replay tidak perlu memuat seluruh chat atau semua statistik. Objek minimalnya berisi match/round ID, nama Hive, roster snapshot, initial/final aggregate, argument card resmi yang boleh dipublikasikan, attribution aggregate, outcome evidence, score, Wisdom Lift, dan rule version.

### 17.2 Story generation

Story dipilih dari event nyata: minority correct, harmful convergence, comeback, no one switched, atau beberapa anggota mengubah pilihan setelah membaca satu card. Jika tidak ada influence, Replay tetap dapat menampilkan disagreement dan hasil. Tidak perlu memaksa setiap match menjadi cerita heroik.

Pembuatan narasi MVP memakai template deterministik yang mengikuti syarat data. AI summarization bukan dependensi. Konten yang disembunyikan moderator menjadi placeholder beralasan; skor tetap dapat diperiksa.

### 17.3 Public share

Share menghasilkan stable URL dengan judul, social preview, dan thumbnail sederhana. Pengguna luar dapat membaca tanpa login. CTA akhir mengarah ke **Explore Hive**, **Watch next Arena**, atau **Join this Squad** bila invite publik tersedia.

Tidak ada auto-post ke akun sosial. Private Squad chat, Google email, verification identifier, dan personal call yang belum mendapat opt-in tidak dimasukkan dalam share card. Public chain remains public sebagaimana dijelaskan pada bagian 9.

## 18. Hidden Web3 dan why Monad

### 18.1 Pengalaman pengguna

```text
Continue with Google → Join Squad → Lock Your Call → Stay/Switch → Replay
```

Di belakang layar:

```text
Account → Embedded wallet / scoped session
→ Sponsored transaction delivery → Monad contracts
→ Indexer → Social UI dan Replay
```

Monad menyediakan ekosistem tooling EVM dan jalur wallet infrastructure. Provider, metode session signing, dukungan sponsorship, dan deployment network harus diuji pada integrasi aktual; katalog wallet saja tidak membuktikan seluruh alur tanpa popup sudah siap. [Monad — Wallets](https://docs.monad.xyz/tooling-and-infra/wallets)

Turnkey merupakan kandidat awal dari percakapan, bukan vendor final yang telah lolos uji. Pilihan provider tidak mengubah kebutuhan Google login, scoped permissions, recovery, dan isolasi akun.

### 18.2 Fungsi blockchain yang konkret

- Mengunci rule version dan roster sehingga operator tidak dapat mengubah syarat kompetisi diam-diam.
- Membuktikan initial choice telah dikomitkan sebelum reveal.
- Menegakkan deadline dan final decision barrier.
- Menghitung aggregate/score deterministik dari reveal sah dan outcome yang diterima.
- Menghasilkan event afiliasi dan hasil yang dapat diindeks pihak lain.

Chat dan animasi tidak memerlukan transaksi. Onchain result juga tidak membuat input Steam otomatis benar: integritas record dan kebenaran sumber adalah dua masalah berbeda.

### 18.3 Why Monad, secara proporsional

HIVE memerlukan pengiriman banyak aksi kecil dari manusia yang bertindak dalam jendela waktu yang sama. EVM compatibility, biaya, dan latensi jaringan menjadi faktor pemilihan Monad. Buktinya harus berupa pengalaman lock/reveal yang benar-benar berjalan pada deployment HIVE, bukan hanya mengutip TPS network.

PRD ini sengaja tidak mengunci angka block time/finality dari versi percakapan yang berbeda. Pitch teknis harus merujuk dokumentasi terkini saat submission dan menyertakan **pengukuran aplikasi sendiri**. “Dirancang untuk concurrency” berbeda dari “telah diuji dengan ribuan pengguna”.

### 18.4 Session dan gas

Session hanya dapat menjalankan fungsi gameplay yang diizinkan pada contract dan network tertentu, dengan expiry, nonce, dan batas pemakaian. Tidak ada arbitrary contract call, token approval, atau transfer aset pengguna. User dapat revoke session; key material tidak muncul dalam log atau analytics.

Sponsorship gas harus memiliki kuota per akun/match dan penolakan abuse. Jika gas disubsidi lewat relayer, signature pemain diverifikasi; backend tidak boleh mengganti choice. Jika menggunakan pendanaan wallet terbatas sebagai fallback testnet, biaya dan rate limit tetap dibatasi serta tidak ditawarkan sebagai reward pengguna.

“Hidden” berarti sederhana dalam interaksi, bukan menyembunyikan model custody. Settings menjelaskan recovery dan siapa yang mengontrol key sesuai provider yang benar-benar dipilih.

## 19. Data dan contract boundaries

### 19.1 Sumber kebenaran

| Domain | Canonical authority | Penyajian/cache |
|---|---|---|
| Google login dan session aplikasi | Auth provider + account service | Account DB |
| Eligibility ranked | Admission/verification attestation yang diterima registry | Profile status |
| Afiliasi kompetitif dan roster | Registry contract + snapshot match | Social graph cache |
| Rules, commitments, deadlines | Match contract | Match service |
| Aggregate dan skor | Deterministic contract execution | Indexer/read model |
| Kebenaran pengamatan Steam | Steam + resolver yang dipercaya | Evidence store |
| Outcome yang diterima pertandingan | Oracle adapter sesuai rules | Result screen |
| Chat, presence, profil, moderation | Application services | Database |
| Argument text | Offchain blob yang cocok dengan hash yang dikomitkan | Council/Replay |
| Reputation analytics | Formula version + event set canonical | Indexer output |
| Adjudication administrasi | Record terpisah dan terbuka | Standings overlay |

### 19.2 Logical contracts

Nama berikut adalah batas tanggung jawab, bukan kewajiban membuat banyak deployment.

| Modul | State dan aturan utama |
|---|---|
| `HiveRegistry` | Player ID, eligibility expiry, Squad membership, Hive affiliation, season roster locks |
| `HiveMatch` | Match/round ID, rules hash, deadlines, initial/final commitments, reveals, aggregates, scores, result states |
| `HiveOracleAdapter` | Resolver authorization, scheduled snapshots, app ID, numeric values, timestamp validation, outcome/void |
| `ArenaVault` | Pengembangan lanjut; tidak masuk core MVP tanpa uang |

Contract version untuk match aktif tidak diganti di tengah pertandingan. Upgrade berlaku untuk match berikutnya dengan version yang dapat diidentifikasi. Fungsi darurat dibatasi pada menghentikan pendaftaran/new match dan mencatat incident; tidak memberi kemampuan memilih winner.

### 19.3 Commitment payload

Payload mencakup chain ID, contract address, match ID, round ID, player ID, tahap initial/final, choice, nonce, dan salt acak kriptografis. Domain separation mencegah penggunaan komitmen lintas match atau tahap. Salt minimal 128 bit entropy; hash dari A/B tanpa salt tidak memberi kerahasiaan.

Argument card memakai commitment terpisah yang mengikat Squad, round, versi payload, teks canonical, serta salt. Simpan encoding version sehingga client dan backend tidak berbeda dalam whitespace/Unicode normalization.

Automated reveal memerlukan ketersediaan payload. MVP dapat memakai penyimpanan terenkripsi dan relayer untuk membuka payload sesuai deadline. Jika relayer dapat mendekripsi lebih awal, operator tersebut merupakan pihak yang dipercaya menjaga kerahasiaan; encryption at rest tidak menghapus trust assumption itu. Client recovery/fallback dan monitoring reveal harus diuji.

### 19.4 Data entities minimum

| Entitas | Field penting |
|---|---|
| Account | Internal ID, auth subject, public handle, PFP, onboarding state |
| PlayerIdentity | Player ID, wallet binding, eligibility tier, attestation reference, expiry |
| Squad | ID, Hive ID, representative, season, roster references |
| Hive | ID, metadata, admin roles, public visibility |
| Season/Match | Format, registered rosters, rule version/hash, deadlines, status |
| Question | App IDs, metric definition, context evidence, resolution schedule, resolver policy |
| Initial/FinalDecision | Player/round IDs, commitment, receipt, reveal status, canonical choice after reveal |
| Argument | Squad/round IDs, salted commitment, text reference, moderation status |
| InfluenceAttribution | Source card, target player/Squad, reason category, final reveal reference |
| Snapshot | Source, app ID, observedAt, fetchedAt, player count, evidence digest |
| Result | Outcome, scores, lift values, validity flags, result transaction |
| Replay | Versioned presentation references, privacy flags, public URL |
| Notification/Incident | Recipient or affected match, event type, status, reason |

### 19.5 Event dan indexer

Minimal event set: `EligibilityGranted/Revoked`, `MembershipChanged`, `RosterLocked`, `MatchCreated`, `InitialCommitted`, `InitialRevealed`, `ArgumentCommitted/Revealed`, `FinalCommitted`, `FinalRevealed`, `Finalized`, `SnapshotAccepted`, `RoundResolved/Voided`, dan `MatchSettled`.

Indexer menggunakan transaction hash + log index sebagai idempotency key, memperhatikan confirmation/finality policy, dan dapat melakukan rebuild. Reorg atau replay event tidak boleh menambah skor dua kali. App acceptance timestamp boleh disimpan untuk UX, tetapi tidak menggantikan canonical inclusion.

Public export menyediakan event schema dan data yang diperlukan untuk menghitung ulang hasil. Third party tidak memerlukan private chat atau email untuk membaca competitive graph. Hash saja belum menjamin data argument/snapshot tersedia; evidence store memerlukan backup dan akses publik untuk objek yang dijanjikan dapat diperiksa.

### 19.6 Data minimization

Google email/auth subject, raw personal document, biometrik, private key, salt yang belum waktunya dibuka, serta private chat tidak ditulis ke public chain. HIVE tidak menyimpan NIK atau salinan identitas untuk membangun verifikasi sendiri.

Baseline retensi privat: chat Squad sampai 30 hari setelah match untuk moderasi, lalu dihapus kecuali ada report aktif dengan kebijakan yang dijelaskan; pesan dan draft yang lebih panjang retensinya memerlukan alasan produk. Data publik onchain tidak dapat dijanjikan ikut terhapus saat account dihapus. Privacy notice harus menjelaskan batas tersebut sebelum ranked participation.

## 20. Identity dan anti-Sybil

### 20.1 Pisahkan tiga hal

- **Authentication:** siapa yang dapat membuka account Google tersebut.
- **Uniqueness/eligibility:** apakah identitas diterima sebagai satu peserta kompetitif.
- **Authorization:** aksi apa yang dapat dilakukan account/session pada match.

Google login dan satu wallet bukan bukti satu manusia. Device fingerprint atau IP juga bukan bukti identitas: teman satu kampus/rumah dapat berbagi jaringan.

### 20.2 Arah verifikasi

Human Passport Individual Verifications dan Action IDs tetap merupakan kandidat. Dokumentasi Action IDs membahas uniqueness per action; custom Action ID memerlukan koordinasi dengan provider. Karena itu, namespace HIVE tidak boleh dianggap otomatis tersedia. [Human Passport — Action IDs](https://docs.passport.human.tech/building-with-passport/individual-verifications/major-concepts/action-ids)

Validasi perlu memeriksa issuer, circuit/type, action ID, recipient binding, expiry, dan revocation. Attestation yang tersedia pada network lain tidak otomatis menjadi proof native Monad; bridge/verifier atau operator attestation yang digunakan HIVE harus disebut jelas. [Human Passport — Attestation Protocols](https://docs.passport.human.tech/building-with-passport/individual-verifications/major-concepts/attestation-protocols)

### 20.3 Admission tiers

| Tier | Akses | Klaim yang boleh dipakai |
|---|---|---|
| Visitor | Public browse/watch/replay | Visitor |
| Google account | Onboarding, social membership, practice | Signed-in user |
| Community-admitted alpha | Closed-alpha roster melalui invite dan review organizer | Community-admitted; bukan proven unique human |
| Provider-verified | Ranked production jika proof sesuai kebijakan | Verified menurut metode/provider tertentu |

Closed alpha boleh memakai manual admission jika integrasi provider belum selesai, dengan roster allowlist yang ditandatangani operator dan audit duplikasi. Label match **limited-assurance alpha**; jangan mengiklankan “Sybil-proof”. Open ranked dan ekonomi bernilai nyata ditunda sampai eligibility stronger terbukti.

### 20.4 Recovery dan transfer

Pergantian Google session tidak menciptakan Player ID baru. Pergantian wallet mengikuti recovery flow yang memindahkan binding, menonaktifkan binding lama, dan mempertahankan histori. Tidak boleh dua key aktif menghasilkan dua slot roster bagi identitas yang sama.

Binding kompetitif tidak diganti di tengah match normal. Kasus compromise menggunakan incident process. Expiry verifikasi diperiksa untuk menjamin validitas sampai akhir match; jika tidak, pengguna diminta memperbarui sebelum masuk roster.

## 21. Anti-cheat dan trust assumptions

| Risiko | Mitigasi MVP | Residual risk |
|---|---|---|
| Banyak akun oleh satu orang | Admission/verification, uniqueness binding, satu roster aktif | Borrowed identity dan kegagalan provider masih mungkin |
| Cross-Squad collusion | Roster lock, blind commitments, review pola | Percakapan di luar aplikasi tidak dapat dicegah penuh |
| Copy setelah commit | Commit sebelum reveal, salted payload | Pengungkapan sukarela tetap mungkin |
| Meniru final decision yang masuk lebih awal | Final commit/reveal dengan deadline bersama | Relayer dapat menjadi titik kebocoran jika dipercaya memegang plaintext |
| Selective non-reveal | Forfeit, auto-reveal, reliability flags | Sabotase terhadap Hive sendiri masih mungkin |
| Manipulasi concurrent players | Eligible game threshold, conflict rules, review anomaly | Concurrent players bukan unique-human oracle |
| Resolver memalsukan snapshot | Open-source worker, raw evidence, locked source/timing | Satu resolver tetap dipercaya; hash tidak membuktikan asal data |
| Penggunaan bot/AI menggantikan pemain | Larangan automated play pada human-ranked, review admission | Pemakaian alat eksternal sulit dibuktikan |
| Attribution farming | Satu source per switch, event dedupe, no economic reward | Pengguna dapat salah atau tidak jujur menyebut alasan |
| Status bias | Rank hidden pada decision phases | Pemain mungkin sudah mengenal Squad terkenal |
| Gas/session abuse | Scope, expiry, quotas, nonce, revocation | Dependency provider dan relayer masih ada |
| Toxicity/brigading | Structured cards, private chat, report/mute | Moderation tetap membutuhkan operasi manusia |

Baseline event human-ranked melarang bot yang mengirim keputusan otomatis atau akun AI yang disamarkan sebagai manusia. Analisis evidence oleh alat eksternal tidak dapat dihapus secara teknis; jika organizer memilih assisted practice, label mode harus jelas dan tidak digabung dengan human-ranked.

Trust model MVP mencakup Steam sebagai sumber, resolver untuk pengambilan data, auth/wallet provider, admission authority pada closed alpha, serta layanan penyimpanan untuk ketersediaan argument/replay. Contract memperkecil kemampuan mengubah aturan dan hasil secara diam-diam; contract tidak menghapus semua kepercayaan tersebut.

Threshold multi-resolver atau zkTLS adalah upgrade yang mungkin dipelajari. Beberapa resolver yang membaca sumber sama tidak otomatis menghasilkan beberapa sumber kebenaran independen.

## 22. Growth dan retention loops

### 22.1 Acquisition — Replay ke komunitas

```text
Match nyata → Replay menarik → dibagikan anggota
→ teman menonton tanpa login → Explore Hive
→ Google login → join/form Squad → hadir di Arena berikutnya
```

Kualitas share ditentukan cerita yang dapat dipahami, bukan angka vanity. Public Replay adalah jalur masuk utama yang tetap berguna ketika tidak ada match live.

### 22.2 Social return loop

```text
Squad terbentuk → jadwal bersama → hadir karena teman
→ hasil menjadi memori kelompok → rematch → histori/rivalry bertambah
```

Presence hanya membantu bila benar-benar ada manusia. Cold-start diselesaikan melalui sesi terjadwal bersama founding communities, bukan feed kosong yang diisi aktivitas palsu.

### 22.3 Learning dan reputation loop

```text
Initial call → hasil → melihat perbedaan initial/final
→ mengenali pola kesalahan atau kontribusi → ingin mencoba lagi
```

Jangan memberi penalti status karena berani Switch atau karena mempertahankan minority call. Pengguna harus merasa dapat belajar tanpa dipermalukan.

### 22.4 Community progression loop

Squad menunjukkan performa → mendapat kesempatan mewakili Hive → rivalry memberi konteks → kemenangan/hasil membentuk season story → qualifier berikutnya memberi jalan bagi rookie. Council seats berbasis performa baru diotomatisasi setelah populasi cukup.

### 22.5 Distribution dan bisnis lanjut

Discord tetap menjadi tempat komunikasi komunitas. HIVE memulai dari web link, invite, dan jadwal; bot/Activity wrapper dikembangkan hanya setelah core berhasil. Hipotesis bisnis adalah sponsor membayar event yang menghasilkan keterlibatan nyata, atau organizer membayar tooling event lanjutan. Kemauan membayar, biaya akuisisi, dan margin belum diketahui.

## 23. Scope MVP, prioritas, dan non-goals

### 23.1 P0 — wajib untuk core MVP

| Area | Deliverable minimum |
|---|---|
| Entry | Landing, Google Auth, onboarding yang dapat dilanjutkan |
| Social structure | Human, Squad 3–5, Hive, invite, forming state, roster lock |
| Competition | Dua Hive, format simetris 3 atau 5 Squad, tiga ronde |
| Gameplay | Tujuh fase, private discussion, one argument card, blind commitments, hidden final revision |
| Scoring | Aggregate canonical, HiveScore, Wisdom Lift, forfeit/void/tie/no-contest |
| Data | Satu Steam metric, live resolver yang diuji, historical practice terpisah |
| Monad | Contract deployment, nyata commit/reveal/finalize/result, View Proof |
| Identity | Admission yang jujur tentang tingkat assurance; uniqueness tidak diklaim dari Google |
| Social payoff | Home sederhana, Hive/Squad profiles, Resolve, public Replay/share link |
| Operations | Manual schedule, monitoring resolver/reveal, moderation dasar, incident record |
| Submission | Produk live, README, source, demonstrasi yang dapat diulang |

### 23.2 P1 — setelah P0 stabil

Squad Duel, provider verification penuh bila alpha masih manual, qualifier, Agenda Ticket, notifikasi di luar aplikasi, self-serve challenge management, dan demonstrator Sponsored Arena testnet sebagai milestone terpisah. Urutan ditentukan problem terukur; daftar ini bukan komitmen membangun semuanya saat hackathon.

### 23.3 Non-goals MVP

- Real-money betting, virtual betting credits, wager, user deposit, token HIVE, mint-to-play, NFT marketplace.
- Trading, PnL, leverage, liquidity prediction, atau portofolio virtual.
- Banyak arena sekaligus: esports match outcome, Twitch, YouTube, music, sport, dan entertainment ditunda.
- Full Discord replacement, public chat besar, generic social publishing network, atau feed marketplace.
- Full 3D world, neural-brain renderer sebagai dependency, karakter RPG, loot, rarity, dan inventory.
- DAO/governance umum, uang treasury nyata, otomatisasi sponsor payout dalam core.
- Fully trustless oracle, zero-knowledge voting lengkap, atau klaim privacy permanen pada reveal publik.
- AI auto-player dan AI scoring argumen sebagai judge.
- Pro matchmaking, Elo produksi, transfer market, monetisasi rank, dan infinite leaderboard analytics.

### 23.4 Scope cut yang dapat diterima

Jika waktu terbatas, kurangi discovery, ranking detail, animation, notifikasi, dan self-serve organizer tooling. Jangan menghapus individual commit, Council, Revision tersembunyi, outcome handling, atau Replay minimal; elemen tersebut membuktikan konsep inti.

Core MVP belum selesai jika hanya menampilkan mock match atau mint achievement setelah keputusan sepenuhnya diselesaikan backend tanpa aturan kontrak yang bermakna.

## 24. Kualitas produk dan kebutuhan nonfungsional

| Aspek | Target awal / acceptance |
|---|---|
| Respons interaksi | Feedback visual lokal segera; status accepted/confirmed tetap dibedakan |
| Deadline reliability | Sedikitnya 95% intended submissions berhasil sebelum deadline pada load alpha yang didaftarkan; target internal, bukan hasil saat ini |
| State consistency | Semua client akhirnya menampilkan phase/result canonical yang sama |
| Recovery | Refresh/reconnect tidak menghilangkan locked call yang sudah sah |
| Accessibility | Keyboard flow, focus state, teks terbaca, countdown tidak hanya lewat warna |
| Responsive | Desktop-first untuk match; mobile tetap dapat login, membaca, memilih, dan menonton |
| Observability | Pantau queue, transaction inclusion, reveal completion, RPC errors, API freshness, indexer lag |
| Auditability | Recompute hasil dari rule version, roster, reveals, dan snapshots yang tersedia |
| Security | Session scoped, no secret logging, rate limits, authorized membership, replay protection |
| Data integrity | Duplicate request/event tidak menghasilkan tambahan vote, reward, atau score |

Target latency final ditetapkan setelah load test terhadap jumlah roster aktual. Timer yang singkat tidak boleh dipakai untuk menyembunyikan transaksi yang belum reliable.

## 25. Metrics dan validation plan

### 25.1 North star produk

**Jumlah Hive yang kembali menyelesaikan match dengan anggota nyata pada minggu berikutnya.** Ini mengukur apakah HIVE menjadi ritual komunitas. Jumlah signup atau wallet bukan pengganti penggunaan.

### 25.2 Definisi metrik

| Metric | Definisi |
|---|---|
| Account activation | Account baru yang menyelesaikan identitas dan join/create Squad dalam tujuh hari / account baru |
| Competitive activation | Admitted users yang menyelesaikan initial commit dan explicit final decision pada satu ronde valid / admitted users yang masuk lobby |
| Match completion | Rostered participants yang menyelesaikan seluruh required actions tiga ronde / rostered participants; tampilkan defaulted Stay terpisah |
| Second-match rate | First-match completers yang menyelesaikan match kedua dalam tujuh hari / first-match completers |
| Hive return | Hive yang bermain lagi minggu berikutnya / Hive yang bermain minggu ini |
| Replay conversion | Visitor unik Replay yang kemudian mendaftar atau join Squad dalam tujuh hari / visitor unik Replay |
| Challenge acceptance | Challenge sah yang diterima / challenge sah yang dikirim |
| Wisdom Lift | Distribusi lift pada ronde valid dan complete, termasuk nol/negatif |
| Useful revision rate | Wrong→right switches / seluruh switches dengan outcome valid |
| Attribution coverage | Switches dengan attribution valid / seluruh switches valid |
| Infra completion | Intended actions yang terkonfirmasi tepat waktu / intended actions; pisahkan transport dan human timeout |

Gunakan definisi cohort, deduplication, dan time window yang sama dari minggu ke minggu. Analytics tidak menyimpan salt, private choice sebelum reveal, atau private text untuk tujuan growth.

### 25.3 Eksperimen pertama — apakah Council berguna dan menyenangkan?

Gunakan historical questions dengan evidence yang sama dan ground truth yang disembunyikan. Bentuk kelompok sebelum test, bekukan eligible question pool, lalu pilih pertanyaan tanpa memilih outcome yang dramatis.

Jika tersedia 30–40 peserta, bagi secara acak menjadi dua cohort dengan urutan kondisi **F–D–D–F** dan **D–F–F–D**. Kondisi menggunakan paket soal yang seimbang; rotasikan pemetaan soal terhadap timing untuk mengurangi efek difficulty. Roster/Squad tetap unit sosial; banyak klik dari orang yang sama bukan observasi independen.

Reputation disembunyikan pada eksperimen pertama. Fast dapat menggunakan baseline 60 detik diskusi Squad/Council; deliberate menguji 90–120 detik. Definisikan semua durasi sebelum sesi dan jangan mengubah beberapa faktor sekaligus.

Tiga primary outcomes: **Wisdom Lift, useful revision rate, dan kemampuan menjelaskan alasan perubahan**. Secondary outcomes: recall argumen yang berlawanan, completion, rushing, excitement, dan niat/aksi mengikuti match berikutnya.

Jika hanya 15–20 peserta, hasilnya merupakan usability dan mechanic sanity check. Small sample tidak membuktikan peningkatan collective intelligence secara umum.

### 25.4 Decision gates awal

Target internal yang perlu dikunci sebelum sesi: completion di atas 90%, minimal 70% peserta dapat mengingat alasan substantif dari Squad lain, median rushing maksimal 3/5, dan median excitement minimal 4/5. Nilai ini bukan benchmark industri.

Wisdom Lift positif pada satu sesi bukan syarat tunggal go/no-go. Periksa distribusi antarronde, kualitas alasan, dan apakah peserta benar-benar kembali. Jika kedua timing tetap membingungkan, perbaiki question/evidence/card mechanics sebelum sekadar menambah waktu.

Eksperimen kedua membandingkan arguments-only dengan arguments-plus-reputation setelah timing cukup stabil. Hasilnya menentukan apakah exposure status membantu atau justru mendorong peniruan.

### 25.5 Validasi market

Target rekrutmen: wawancara sekitar 10 admin; 3–5 founding communities; 30–60 peserta nyata secara keseluruhan. Jumlah ini target, bukan traction yang sudah ada. Closed alpha boleh bermain bergantian dalam roster tiga Squad per sisi; tidak setiap Hive harus langsung membawa lima Squad penuh.

Pertanyaan utama: kegiatan apa yang sudah mereka jalankan, apa yang membuat anggota hadir, apakah challenge antarkomunitas menarik, apakah mereka bersedia membawa anggota untuk sesi berikutnya, dan apa yang sponsor/organizer benar-benar bersedia bayar.

## 26. Roadmap dan exit criteria

| Tahap | Fokus | Syarat keluar |
|---|---|---|
| 1. Behavioral prototype | Paper/form-based Think sampai Resolve | Masalah pemahaman dan timing utama ditemukan; tidak membutuhkan app produksi |
| 2. Technical spike | Google, embedded wallet, scoped signing, auto-reveal, Steam capture | Satu user nyata menyelesaikan dua tahap commitment tanpa popup berulang dan tanpa kehilangan payload |
| 3. Vertical slice | Dua Hive, satu ronde end-to-end | Rule lock, aggregate, score, lift, Replay, dan evidence cocok |
| 4. Full MVP | Tiga ronde, exception handling, basic profiles/Home | Forfeit, timeout, reconnect, duplicate event, dan no contest teruji |
| 5. Founding alpha | Sesi komunitas nyata | Metrics dengan denominator, feedback, serta return behavior tercatat |
| 6. Submission polish | Live link, demo, documentation, proof | Reviewer eksternal dapat mengakses dan memahami alur tanpa bantuan founder |

Ownership demonstrator, jika dipilih, mendapat milestone sendiri setelah tahap 4. Perubahan jadwal tidak dibayar dengan menghapus integritas core game.

### 26.1 Verification minimum engineering

Pengujian harus mencakup membership ganda, domain-separated hash, nonce replay, deadline boundary, invalid salt, partial reveal, defaulted Stay, final reveal withholding, asymmetric roster rejection, equal Squad weighting, fixed-point rounding, kedua Hive benar, score tie, outcome tie/void, resolver timeout, reconnect, indexer duplicate/reorg, dan session revocation.

Lakukan setidaknya satu match nyata end-to-end serta satu controlled failure scenario. Screenshot dan deterministic fixture bermanfaat untuk QA, tetapi tidak dihitung sebagai partisipasi komunitas nyata.

## 27. Risk register dan keputusan terbuka

| Risiko | Prioritas | Pemilik fungsi | Tindakan terdekat |
|---|---|---|---|
| Council tidak membantu atau tidak seru | Kritis | Product/research | Playtest sebelum memperluas fitur |
| Orang tidak memahami belief vs confidence | Tinggi | Product/design | Uji comprehension dengan contoh anggota nyata |
| Outcome live terlalu lama | Tinggi | Product/ops | Pisahkan active session dari result wait; uji return saat resolve |
| Auto-reveal gagal, forfeit terlalu sering | Kritis | Engineering | Spike payload availability dan deadline reliability |
| Final revisions bocor lebih awal | Kritis | Smart contract/security | Commit final choice, tunda reveal hingga cutoff |
| Sybil protection tidak siap | Tinggi | Identity/ops | Limited-assurance alpha; tahan open ranked/economy |
| Steam metric lemah atau mudah dimanipulasi | Tinggi | Data/product | Review eligible pool, anomaly, dan menariknya pertanyaan |
| Operator/resolver terlalu dipercaya | Tinggi | Engineering | Bukti publik, keterbatasan yang jelas, upgrade roadmap |
| Cold start dan roster tidak lengkap | Tinggi | Community | Scheduled sessions, invite, forming state |
| Ekonomi menggeser motivasi ke farming | Tinggi | Product/business | Core tanpa payout; uji sponsor secara terpisah |
| Track 03 ownership belum terbukti | Tinggi | Founder | Tampilkan apa yang live dan gap economic stake dengan jujur |
| Scope membengkak | Tinggi | Product lead | Jaga satu arena dan satu core match mode |
| UI lebih menonjolkan angka daripada manusia | Sedang | Design | Prioritaskan presence, activity, dan next action |

### 27.1 Keputusan yang masih memerlukan bukti

- Provider embedded wallet, session/recovery behavior, sponsorship method, dan network deployment.
- Dukungan Human Passport, assurance method yang sesuai, action ID, biaya/friksi verifikasi, serta cara membawa hasil verifikasi ke Monad.
- Durasi optimal membaca dan berdiskusi; toleransi resolver dan finalization buffer.
- Apakah 30 menit Steam momentum cukup menarik, fair, dan mempunyai variasi hasil yang bermakna.
- Roster tiga vs lima Squad untuk launch awal berdasarkan pasokan peserta.
- Efektivitas reputation visibility dan attribution self-report.
- Sponsor demand, persentase ekonomi, biaya per completed match, dan governance vault jika diperluas.

Keputusan terbuka tidak mengubah konsep inti. Fitur terkait tidak boleh diberi label production-ready sebelum dependensinya terbukti.

## 28. Track 03 dan judging alignment

### 28.1 Basis rubric

Percakapan memuat teks Track 03 yang disalin pengguna: **Technical Execution 20%, Design & Craft 20%, Originality & Track Insight 15%, Founder & Market Readiness 25%, Traction & Path Forward 20%**. Dokumen ini memakai rubric tersebut untuk perencanaan karena lebih spesifik dan lebih baru dalam percakapan daripada tabel awal lima kategori sama besar.

Halaman live tidak berhasil diverifikasi pada penyusunan PRD. Deadline **14 Oktober 2026, 10:59 GMT+7**, bobot, dan deliverables berikut berstatus **berdasarkan salinan pengguna; wajib dicek kembali sebelum submission**. Rujukan organizer: [Monad Metropolis — Tracks](https://hackathon.monad.xyz/tracks). Dokumen rules upload lama tidak tersedia untuk diperiksa langsung dalam sesi ini.

### 28.2 Pemetaan produk ke rubric

| Kriteria | Bukti yang perlu diperlihatkan | Gap yang tidak boleh ditutupi |
|---|---|---|
| Technical Execution — 20% | Rules/roster lock, initial/final commitment, aggregation, outcome/void, public proof | Single resolver dan admission authority masih dipercaya |
| Design & Craft — 20% | Google onboarding, social Home, match yang mudah dipahami, Replay | UI mockup saja tidak membuktikan live experience |
| Originality & Track Insight — 15% | Human→Squad→Hive, attributable revision, persistent graph, ownership path | Histori portable belum sama dengan economic stake aktif |
| Founder & Market Readiness — 25% | Beachhead spesifik, admin interview, community distribution, kebutuhan event | “Semua gamer” dan hipotetis TAM tidak cukup |
| Traction & Path Forward — 20% | Peserta unik, complete matches, Hive return, real feedback | Seed accounts, scripts, dan simulasi tidak boleh dihitung sebagai users |

### 28.3 Klaim Track 03 yang defensible

Core value HIVE adalah hubungan sosial, ritual budaya gaming, dan identitas komunitas. Open affiliation/match graph memberi komunitas riwayat yang dapat diakses melalui antarmuka lain. Sponsored Arena menjelaskan arah bagaimana perhatian dapat menghasilkan nilai bersama, tetapi implementasi ekonomi harus dibuktikan terpisah.

Tidak ada kewajiban produk untuk meniru semua contoh track, misalnya algorithm marketplace. HIVE harus menunjukkan satu mekanisme sosial yang spesifik dan berjalan. Track fit adalah argumen yang perlu dinilai juri, bukan jaminan menang.

### 28.4 Demonstrasi tiga menit

| Durasi | Yang ditunjukkan |
|---|---|
| 0:00–0:25 | Home, identitas Squad/Hive, pertanyaan dan nilai produk |
| 0:25–0:55 | Initial call dikunci; receipt Monad nyata |
| 0:55–1:20 | Reveal: Squad berbeda pendapat; argumen sudah committed |
| 1:20–1:50 | Council dan satu revision; final aggregate belum bocor |
| 1:50–2:20 | Resolve: outcome, score, Wisdom Lift, attribution yang benar |
| 2:20–2:45 | Public Replay dan View Proof |
| 2:45–3:00 | Bukti usage aktual dan next step ownership yang dilabel jelas |

Untuk video pendek, gunakan historical practice atau potongan rekaman match live. Jangan mempercepat timer produk hanya demi video lalu mengklaim hasilnya live 30 menit. Label akun nyata, scripted participants, testnet, dan data historis secara terbuka.

### 28.5 Paket submission berdasarkan salinan Track 03

- Logo/graphic JPG, JPEG, PNG, atau WEBP maksimum 3 MB.
- Public GitHub repository yang dapat diakses reviewer.
- Technical demo maksimum tiga menit yang menunjukkan produk bekerja.
- Pitch video maksimum dua menit: team, problem, alasan membangun.
- Live product link di Monad Mainnet/Testnet dengan instruksi akses.
- Iklan produk opsional maksimum 30 detik, terpisah dari bukti teknis.

Tambahan kualitas internal: README setup, contract addresses, network, sample transactions, rules/trust assumptions, attribution dependensi, disclosure penggunaan AI, test instructions, dan demo fixtures yang dibedakan dari data live. Persyaratan administratif final mengikuti portal organizer yang berlaku saat pengiriman.

## 29. Research rationale dan batas evidence

Riset mendukung pertanyaan yang layak diuji; riset tidak membuktikan HIVE sudah menyenangkan, akurat, atau layak menjadi bisnis. Sumber primer berikut diperiksa untuk penyusunan ini.

| Sumber | Temuan atau kemampuan relevan | Implikasi bagi HIVE dan batasnya |
|---|---|---|
| [Navajas dkk. — Aggregated knowledge from a small number of debates outperforms the wisdom of large crowds](https://arxiv.org/abs/1703.00045) | Eksperimen 5.180 peserta menggabungkan jawaban individual, diskusi kelompok lima orang, dan revisi; agregasi consensus kelompok menunjukkan perbaikan pada task tersebut | Mendukung eksplorasi small-group deliberation; HIVE memakai A/B, text UI, kompetisi, dan dua lapis kelompok, sehingga hasil studi tidak dapat ditransfer langsung |
| [Lorenz dkk. — How social influence can undermine the wisdom of crowd effect](https://pmc.ncbi.nlm.nih.gov/articles/PMC3107299/) | Eksperimen menunjukkan social information dapat mengurangi keragaman tanpa memperbaiki error, sekaligus meningkatkan confidence | Alasan untuk blind initial calls, hidden reputation, serta mengukur lift negatif; bukan bukti bahwa semua pengaruh sosial buruk |
| [Brysbaert — How many words do we read per minute?](https://biblio.ugent.be/publication/8647789) | Meta-analysis 190 studi memperkirakan rata-rata silent reading non-fiction dewasa berbahasa Inggris sekitar 238 kata/menit | Mendukung card singkat dan buffer membaca; bukan standar waktu berpikir, bukan estimasi spesifik pembaca Indonesia atau UI pertandingan |
| [Steamworks — ISteamUserStats](https://partner.steamgames.com/doc/webapi/ISteamUserStats) | Endpoint current players menyediakan data app yang dapat diambil aplikasi | Memungkinkan measurement sederhana; bukan trustless oracle, unique-human count, atau penyedia histori HIVE secara otomatis |
| [Human Passport — Action IDs](https://docs.passport.human.tech/building-with-passport/individual-verifications/major-concepts/action-ids) | Mendefinisikan uniqueness per action dan ketersediaan custom ID melalui provider | Kandidat admission; perlu validasi integrasi, assurance, dan recovery |
| [Human Passport — Attestation Protocols](https://docs.passport.human.tech/building-with-passport/individual-verifications/major-concepts/attestation-protocols) | Attestation memiliki nullifier, action, issuer, recipient, dan expiry | Menjelaskan field yang harus diperiksa; dukungan pada network lain tidak membuktikan native verification Monad |
| [Monad — Wallets](https://docs.monad.xyz/tooling-and-infra/wallets) | Dokumentasi mengarahkan developer ke wallet infrastructure untuk fungsi lanjutan | Dasar mencari integrasi yang sesuai; kualitas seamless UX tetap harus dibuktikan melalui spike |

### 29.1 Apa yang berasal dari inferensi produk

Pemilihan Discord gaming communities, durasi 60 detik, equal Squad weight, season empat minggu, score system, satu attribution, dan growth loops merupakan keputusan/hipotesis HIVE. Jangan memberinya label “terbukti riset” hanya karena literatur terkait tersedia.

Benchmark produk dan winner hackathon dalam percakapan menginspirasi consumer UX, identitas komunitas, tindakan yang punya konsekuensi, dan demo yang mudah dipahami. PRD ini tidak membawa kembali skor subjektif ide atau klaim alasan kemenangan proyek lain sebagai fakta; tidak ada probabilitas kemenangan HIVE yang dapat diturunkan dari benchmark tersebut.

### 29.2 Research questions yang tetap hidup

1. Apakah peserta memahami bahwa belief adalah aggregate dukungan?
2. Apakah Council memperbaiki hasil pada cukup banyak pertanyaan, atau terutama meningkatkan conformity?
3. Apakah peserta mengingat alasan, atau hanya nama Squad?
4. Apakah terdapat alasan kembali ketika tidak ada uang atau hadiah?
5. Apakah waiting time live memperkuat anticipation atau menyebabkan abandonment?
6. Apakah organizer dapat merekrut roster berulang dengan biaya operasi yang masuk akal?
7. Apakah public verifiable history mempunyai nilai bagi komunitas selain untuk demo hackathon?

## 30. Product-design direction dan definition of done

### 30.1 Arah desain singkat

HIVE terasa seperti **premium social product dengan mature competitive gaming culture**: minimal, profesional, ultra clean, banyak whitespace, dan hierarki yang terbaca lewat typography serta spacing.

Human memakai PFP/pixel avatar; Squad memakai crest; Hive memakai community sigil. Gaming muncul melalui orang, Arena, season, rival, dan Replay. Light dan Dark memiliki struktur serta perilaku yang sama; Dark memakai pendekatan monochrome-first dengan aksen terbatas. Tidak ada kebutuhan menentukan token warna final dalam PRD ini.

Home menonjolkan manusia dan aktivitas. Match Room menonjolkan pertanyaan serta satu tindakan berikutnya. Council menonjolkan alasan. Resolve menonjolkan hasil dan cerita. View Proof berada pada lapisan detail. Layout tidak dipenuhi kartu, badge, telemetry, atau dekorasi yang membuat semua informasi tampak sama penting.

### 30.2 Definition of done — core MVP

MVP dinyatakan selesai ketika satu komunitas nyata dapat mengundang anggota melalui Google login, membentuk roster yang valid, bertanding tiga ronde melawan Hive lain, menyelesaikan seluruh fase dengan aturan privasi waktu yang benar, memperoleh hasil yang dapat dihitung ulang, dan membagikan Replay tanpa bantuan manual founder pada setiap langkah.

Tim juga harus dapat menunjukkan satu kondisi gagal yang ditangani dengan benar, menjelaskan siapa yang masih dipercaya dalam sistem, serta membedakan bukti usage nyata dari fixture demo. Belum ada klaim deployment, traction, atau hasil playtest aktual yang dibuat oleh dokumen ini.

### 30.3 Glossary

| Istilah | Definisi |
|---|---|
| Human | Satu peserta dengan identity dan eligibility yang dijelaskan |
| Squad | Kelompok 3–5 manusia dan unit representasi belief |
| Hive | Komunitas yang menaungi Squad dan menjadi peserta kompetisi tertinggi |
| Match roster / Active Council | Squad yang didaftarkan untuk satu pertandingan |
| Arena | Konteks event/pertandingan yang dimainkan atau ditonton |
| Call | Pilihan pribadi A atau B |
| Squad/Hive Belief | Distribusi dukungan yang dihitung dari pilihan dan bobot Squad |
| Blind Commit | Mengunci pilihan sebelum hasil orang lain dibuka |
| Council | Fase membaca dan mempertimbangkan alasan antarkelompok |
| Revision | Kesempatan satu final decision setelah Council |
| HiveScore | Skor kuadratik kualitas aggregate terhadap outcome |
| Wisdom Lift | Perbaikan jarak aggregate terhadap outcome dalam poin persentase |
| Council Score Lift | Selisih HiveScore final dan initial |
| Influence attribution | Sumber pengaruh yang dilaporkan peserta saat Switch |
| Resolver | Layanan yang mengambil dan mengirim data hasil sesuai rule |
| Void | Ronde tanpa outcome biner valid; tidak diberi skor |
| Forfeit | Kegagalan roster memenuhi required actions; skor kompetitif nol |
| No contest | Match tidak memenuhi syarat hasil ranked |
| Replay | Cerita terstruktur dari keputusan, perubahan, dan hasil |
| Agenda Ticket | Hak terbatas memilih agenda eligible pada pengembangan lanjut |
| Attention Dividend | Proposal pembagian dana sponsor kepada kontribusi yang memenuhi syarat |

---

**Pedoman keputusan:** bangun dan uji satu ritual komunitas yang lengkap. Pertahankan agency manusia, integritas keputusan, hasil yang jujur, dan cerita yang layak dibagikan. Setiap tambahan fitur harus memperkuat salah satu kebutuhan tersebut.
