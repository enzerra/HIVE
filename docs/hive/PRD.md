# PRD — HIVE Frontend

**Status:** spesifikasi build v1.0. Sumber konsep: [PRD lengkap](references/HIVE_Final_Product_PRD_Concept_Operating_Model_MVP_v1.0_ID.md). Paket ini memperinci frontend; aturan kompetisi tidak diganti.

## 1. Produk dan pengguna

HIVE adalah ruang sosial kompetitif tempat komunitas menguji penilaian bersama. Human membuat pilihan pribadi, Squad berdiskusi, dan Hive bertanding melalui aggregate Squad. Pengalaman utama: datang bersama teman, punya posisi, mendengar alasan berbeda, memilih tetap/berubah, lalu melihat apa yang benar-benar terjadi.

Target awal adalah komunitas PC gaming Indonesia yang sudah berkumpul di Discord. Anggota biasa membutuhkan alur yang mudah; representative membutuhkan alat menyusun argumen; organizer membutuhkan roster/jadwal; spectator membutuhkan cerita yang dapat dipahami tanpa akun. HIVE tidak menggantikan seluruh chat komunitas asal.

Masalah utama: komunitas memiliki percakapan tetapi sedikit aktivitas kompetitif terstruktur yang menghasilkan histori bersama; poll terbuka mudah menjadi ikut mayoritas; hasil diskusi sulit dilacak; onboarding Web3 dapat mengalihkan perhatian dari bermain.

## 2. Hasil yang harus diberikan frontend

| ID | Kebutuhan |
|---|---|
| P01 | Visitor memahami siapa bertanding lewat Public Landing dan dapat Explore/Watch/Replay tanpa login |
| P02 | Google menjadi primary auth live; identity → Squad → Hive → Ready mempertahankan invite intent |
| P03 | Home menunjukkan manusia, afiliasi, aktivitas nyata, dan satu tindakan relevan |
| P04 | Human/PFP, Squad/crest, dan Hive/sigil berbeda serta selalu memiliki label konteks |
| P05 | Community Match tujuh fase berjalan lengkap, termasuk pending, reconnect, dan deadline |
| P06 | Pilihan dan aggregate hanya tersedia sesuai information barrier |
| P07 | Score, belief, Wisdom Lift, influence, dan reputation memiliki makna serta unit yang benar |
| P08 | Resolve memisahkan hasil ronde, match, pending, void, forfeit, draw, dan no contest |
| P09 | Replay publik mempertahankan konteks/privasi dan dapat dibagikan melalui tindakan pengguna |
| P10 | Light/dark, mobile/desktop, keyboard, reduced motion, empty/error tetap usable |
| P11 | Wallet/proof/verification tersedia di lapisan tepat tanpa mengganggu alur utama |
| P12 | Frontend dapat dibangun menggunakan mock deterministik dan beralih ke live adapter tanpa menulis ulang UI |

## 3. Model sosial dan kewenangan

- Human memiliki satu active Squad per season. Follow Hive lain tidak memberi suara tambahan.
- Squad ranked berisi 3–5 eligible Human; kurang dari tiga berstatus forming. Squad berafiliasi pada tepat satu Hive dalam season/snapshot match.
- Community Match target dua Hive × lima Squad. Closed alpha mendukung dua Hive × tiga Squad sebagai format berbeda. Jumlah Squad kedua pihak sama.
- Tiap Squad berbobot sama dalam Hive, meskipun jumlah anggotanya berbeda. Bukan pooling seluruh suara Human.
- Representative hanya menyusun satu argument card resmi; ia tidak mengunci atau mengubah pilihan orang lain.
- Organizer/admin mengelola membership dan jadwal sebelum lock. Tidak dapat memilih winner, mengubah call, atau mengganti roster sesudah lock.
- Spectator hanya melihat projection publik. Reaksi sosial tidak masuk aggregate kompetisi.

## 4. Alur wajib

`Landing → Explore/Hive/Replay → Google Auth → Identity → Squad → Hive → Ready → Home → Arena Lobby → Match → Resolve → Replay`.

Returning user kembali ke Home atau deep link sah. Pengguna yang menunda afiliasi melalui Explore first dapat memakai Home/browse, tetapi belum berhak ranked. Invite penuh/kedaluwarsa harus memiliki jalan keluar. Wallet provisioning yang gagal tidak membuat akun duplikat.

Landing memakai **Jelajahi Hives** sebagai CTA utama desain terbaru; Join/Google tetap jelas di navigasi serta pada tindakan bergabung. Perbedaan dari PRD awal dicatat dalam [Decisions](DECISIONS_AND_DEPENDENCIES.md), tanpa mengubah auth flow.

## 5. Kompetisi dan aturan yang terkunci

### 5.1 Waktu dan informasi

Think 20 s → Deliberate 60 s → Commit 15 s → Reveal 10 s → Council 60 s → Revision 20 s → Resolve dengan buffer finalization kandidat 5 s. Total interaksi baseline 190 s per ronde. Durasi berasal dari config terkunci, bukan konstanta tersembunyi dalam komponen. Final Lock adalah barrier, bukan fase kedelapan.

Tiga ronde dimainkan; outcome live dapat masih ditunggu ketika ronde berikutnya berjalan. Jendela observasi Steam Pulse baseline 30 menit dimulai setelah final decision barrier. UI tidak menjanjikan seluruh hasil live selesai dalam sepuluh menit.

Dalam Think tidak ada chat/aggregate. Deliberate membuka chat privat Squad, tanpa pilihan individual orang lain atau aggregate. Commit membuat chat read-only. Initial reveal hanya sesudah Commit tertutup; tampilkan aggregate tervalidasi secara batch. Council menampilkan argument card Hive sendiri, tanpa rank/accuracy badge/influence. Revision hanya Stay/Switch dan initial aggregate frozen; final values/attribution tetap tersembunyi sampai barrier semua peserta tutup.

Argument maksimal **30 kata DAN 240 karakter**; dibekukan akhir Deliberate dan hash dikomit paling lambat akhir Commit. Tidak bisa direvisi setelah melihat belief.

### 5.2 Hasil

Steam Pulse mengukur pertumbuhan relatif concurrent players, bukan total popularitas. Outcome A/B ditentukan data valid sesuai rule bundle. Outcome TIE/invalid membuat ronde void.

`SquadBelief = A votes / frozen roster size`; `HiveBelief = mean(SquadBeliefs)`.

`HiveScore = 100 × (1 − (p − y)²)`; outcome A memiliki y=1, B y=0. MatchScore adalah jumlah final HiveScore ronde outcome-valid, dengan forfeit 0 sesuai policy. Pemenang bukan jumlah ronde unggul. Sedikitnya dua dari tiga ronde harus memiliki outcome valid untuk ranked result. Total canonical sama menghasilkan draw; kurang dari dua valid menghasilkan no contest.

`WisdomLift_pp = 100 × (abs(initial−y) − abs(final−y))`. Council Score Lift adalah selisih score, bukan Wisdom Lift. Belief shift sebelum outcome tidak boleh disebut wisdom. Belief adalah distribusi dukungan, bukan probabilitas terkalibrasi atau akurasi.

### 5.3 Kegagalan

Missing/invalid initial commitment atau required reveal membuat Hive terkait forfeit ronde: skor 0; aggregate lengkap/lift N/A. Denominator tidak diperkecil. Tidak mengirim final commitment menghasilkan defaulted Stay; mengirim final commitment tetapi gagal reveal menghasilkan forfeit, bukan fallback Stay. Argument unavailable tidak otomatis mengubah score; label incomplete Council. Gangguan bersama dapat mendapat adjudication disputed/no contest terpisah dari raw chain result.

## 6. Reputation dan influence

Profil Squad memuat Independent Performance, Influence Quality, Contrarian Edge, Reliability dengan periode, format, sample size, dan provisional. Baseline window maksimal 20 ronde eligible terakhir; di bawah 10 ronde atau 10 attribution events memakai provisional sesuai metriknya. UI tidak menciptakan angka jika data belum tersedia.

Influence valid hanya jika pengguna benar-benar Switch, card berasal dari Squad lain dalam Council Hive sendiri, reveal sah, dan sumber dapat ditelusuri. Helpful/harmful ditentukan outcome; sebelumnya unresolved. Stay tidak menghasilkan event influence. Self-report attribution tidak disajikan sebagai bukti kausal. Tidak ada reputasi yang meningkatkan voting power.

## 7. Scope frontend

**Harus ada:** seluruh public/authenticated routes dalam Routes & Screens; primary Google UI dan adapter; onboarding; social Home; profile; Arena/list/lobby; tujuh fase; argument/chat privat sesuai fase; Stay/Switch; Resolve; Replay/share; rankings; notifications; settings; advanced proof/verification; minimal operator views untuk jadwal, roster, health, dan moderation. Operator views dapat sederhana dan terpisah dari navigasi consumer.

**Demo build:** semua interaksi inti memakai mock gateway terpusat dengan scenario deterministik. Demo auth diberi label, bukan OAuth pura-pura. Timer memakai virtual server clock di harness. Seed/ground truth tidak masuk public payload sebelum waktunya.

**Live integration:** UI sama, services nyata disambungkan lewat contract adapter. Authentication, eligibility, commit/reveal, outcome, dan standings tidak dapat diselesaikan oleh client sendiri.

**Di luar scope:** token/betting/wager, wallet landing utama, ekonomi sponsor, Agenda Ticket, ladder Squad Duel, algorithmic social network, generic posting, Elo produksi, matchmaking otomatis, voice/video, public lintas-Squad chat, mini-game, level/quest baru, native mobile app, AI-generated arguments/story sebagai dependensi.

## 8. Ukuran keberhasilan

Ukur pemahaman hierarchy, keberhasilan onboarding, ketepatan next action, completion fase, kesalahan baca hasil, kemampuan membaca alasan, Replay comprehension, dan kunjungan sesi berikutnya. Excitement tidak boleh membaik sambil completion/reading memburuk. Tidak mengklaim conversion/retention sebelum ada pengguna nyata.

Telemetry minimal dan bebas private choice/chat dijelaskan di Architecture. Passing frontend demo berarti acceptance behavior lengkap, bukan bukti market fit atau proof of human uniqueness.

## 9. Definisi selesai

Semua P01–P12 terpetakan ke screen, komponen, data, scenario, dan acceptance di [Traceability](TRACEABILITY.md). Tidak ada tombol inti tanpa perilaku; tidak ada hasil fixture yang saling bertentangan; routes dapat dibuka langsung; mobile/light/dark memiliki state sama; control utama keyboard-accessible; tidak ada kebocoran final data; live dependencies memiliki error/configuration state yang jujur.
