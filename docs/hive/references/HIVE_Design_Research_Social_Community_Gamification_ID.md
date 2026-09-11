# HIVE — Riset Desain Social Community & Gamification

**Arah produk:** premium, sosial, bersih, dengan energi kompetitif pada momen penting.  
**Tanggal pemeriksaan sumber dan antarmuka:** 9 September 2026.  
**Status:** rekomendasi untuk desain screen berikutnya; bukan desain visual final atau hasil validasi pengguna.  
**Basis aturan:** [HIVE Final Product PRD v1.0](HIVE_Final_Product_PRD_Concept_Operating_Model_MVP_v1.0_ID.md).  
**Pendamping:** [Papan perbandingan visual interaktif](HIVE_Design_Comparison_Board.html).

## 1. Keputusan yang direkomendasikan

Gunakan **Porcelain + indigo** sebagai arah utama HIVE. Halaman sosial memakai permukaan netral, tipografi yang jelas, identitas manusia yang mudah dikenali, dan ruang antarkelompok konten. Energi meningkat ketika Squad siap, call terkunci, belief dibuka, dan pertandingan selesai.

Karakter yang dituju adalah **tempat berkumpul komunitas gaming yang memiliki pertandingan bermakna**. Orang datang karena ada teman dan kelompok yang mereka pedulikan; pertandingan memberi alasan untuk berkumpul; Replay memberi cerita yang bisa dibawa kembali ke komunitas.

Gamification dalam rancangan ini berasal dari mekanik HIVE yang sudah ada: identitas, kesiapan bersama, pilihan, ketidakpastian, argumen, rival, perubahan pendapat, hasil, dan histori. Tidak ada penambahan level, misi harian, mata uang, taruhan, loot box, atau ekonomi hadiah.

Tiga keputusan operasional:

1. **Home mengutamakan manusia dan tindakan.** Tampilkan siapa yang relevan, apa yang sedang dilakukan Squad, dan satu langkah berikutnya.
2. **Match Room mengikuti kebutuhan setiap fase.** Berpikir memerlukan ketenangan; Reveal memerlukan keterbacaan perbedaan; Council memerlukan ruang membaca; Resolve memerlukan hasil yang jujur.
3. **Perayaan mengikuti status sah.** Call pending belum sukses. Initial Reveal belum kemenangan. Final belief belum outcome. Kemenangan ronde belum kemenangan match.

Rekomendasi palet merupakan penilaian desain berdasarkan kebutuhan produk dan perbandingan visual. Belum ada bukti bahwa satu palet meningkatkan conversion atau retention HIVE.

## 2. Metode, cakupan, dan batas bukti

Riset menggabungkan pemeriksaan halaman publik melalui browser, dokumentasi resmi produk, penelitian perilaku, dan persyaratan aksesibilitas. Setiap temuan diberi konteks berikut:

| Jenis bukti | Arti | Cara menggunakannya |
|---|---|---|
| **Observasi langsung** | Elemen terlihat pada halaman yang dibuka dan screenshot yang diperiksa | Mendukung uraian layout, warna, density, dan hierarki pada permukaan tersebut |
| **Dokumentasi resmi** | Perilaku atau contoh dijelaskan oleh pembuat produk | Menjelaskan fitur; tidak otomatis membuktikan tampilan pengguna saat ini |
| **Penelitian** | Temuan atau model dari publikasi yang disebutkan | Memberi rationale dengan keterbatasan konteks dan metode |
| **Interpretasi desain** | Terjemahan bukti menjadi keputusan HIVE | Perlu diuji, bukan dipresentasikan sebagai fakta psikologis |
| **Hipotesis HIVE** | Dugaan mengenai respons pengguna HIVE | Memerlukan playtest atau penggunaan nyata |

### 2.1 Log akses referensi

Semua entri diperiksa pada **9 September 2026**. Pemeriksaan live terutama menggunakan viewport desktop sekitar 1280 × 720. Tidak ada akun yang dibuat atau sesi terautentikasi yang diakses. Mobile dalam deliverable adalah rancangan HIVE, bukan audit mobile lengkap keenam produk.

| Produk | Permukaan yang diperiksa | Bukti dan keterbatasan |
|---|---|---|
| Discord | [Landing publik](https://discord.com/) dan [panduan profil resmi](https://discord.com/blog/how-to-customize-your-discord-profile) | Hero dan screenshot produk pada landing diperiksa. Aplikasi dengan akun tidak diaudit langsung. Presence aktual pengguna tidak diuji. |
| FACEIT | [Landing publik](https://www.faceit.com/en) dan [What is a Club?](https://support.faceit.com/hc/en-us/articles/14996811385372-What-is-a-Club) | Landing berhasil dibuka setelah timeout awal. Struktur Clubs dibaca dari artikel resmi bertanggal 18 Juli 2024; gambar di artikel tidak dipakai sebagai bukti UI live terautentikasi. Cookie overlay membatasi inspeksi visual artikel. |
| Steam Community | [Community home](https://steamcommunity.com/) | Header, navigasi, sign-in, hub populer, search, dan filter terlihat. Feed UGC masih menampilkan Loading; isi feed yang selesai dimuat tidak diasumsikan terlihat. |
| Reddit | [r/gaming](https://www.reddit.com/r/gaming/) dan [pengumuman penyederhanaan produk](https://redditinc.com/news/new-features-aimed-at-making-reddit-easier-to-use-an-update-on-our-product-priorities-focused-on-simplification) | Halaman komunitas meminta verifikasi manusia. Tidak diteruskan. Pengganti berupa dokumentasi resmi 7 Maret 2023, sehingga bukan bukti visual Reddit tahun 2026. |
| Strava | [Landing publik](https://www.strava.com/), [Challenges](https://support.strava.com/en-us/articles/15401916-strava-challenges), dan [Trophy Case](https://support.strava.com/en-us/articles/15402068-the-strava-trophy-case) | Landing diperiksa setelah menolak cookie nonesensial. Feed, klub, dan profil terautentikasi tidak diperiksa langsung. |
| Duolingo | [Landing publik](https://www.duolingo.com/) dan [dokumentasi desain milestone](https://blog.duolingo.com/streak-milestone-design-animation/) | Landing dan penjelasan animasi/share card diperiksa. Lesson flow, streak aktual, dan eksperimen internal tidak direplikasi. |

Tidak dilakukan pengukuran frame-by-frame motion referensi, survei pengguna, pengujian longitudinal, atau eksperimen conversion. Karena itu, durasi animasi HIVE di bawah adalah **spesifikasi kandidat**, bukan durasi yang diklaim berasal dari audit produk lain.

### 2.2 Apa yang disediakan papan visual

Papan HTML dapat dibuka secara lokal tanpa dependensi jaringan. Pilih halaman, palet, tema, mode perbandingan tiga arah, dan lebar mobile. Lima template yang sama menghasilkan **30 kombinasi utama: 5 halaman × 3 palet × 2 tema**. Konten, ukuran komponen, dan susunan tidak berubah ketika palet diganti.

Papan juga menyediakan contoh aktivitas rendah, loading, error, serta sembilan storyboard interaktif. Contoh merupakan fixture berlabel ilustrasi. Tombol di dalam preview menunjukkan maksud tindakan, tanpa menjalankan autentikasi, pertandingan, atau berbagi ke layanan eksternal. Navigasi produk adalah representasi visual, bukan aplikasi lengkap. Rancangan screen berikutnya perlu memperluas bagian bawah halaman dan seluruh variasi operasional yang dijelaskan dalam dokumen ini.

## 3. Audit enam referensi

### 3.1 Discord — orang, presence, dan tempat berkumpul

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | Landing mendahulukan headline besar dan screenshot perangkat, kemudian manfaat aktivitas bersama. Navigasi atas luas. |
| Density | Hero padat secara ilustrasi, tetapi headline dan CTA tetap terpisah jelas. Screenshot produk memperlihatkan beberapa kolom percakapan dan anggota. |
| Warna dan typography | Biru/ungu dominan, putih kontras, display uppercase sangat tebal. Nama font tidak diverifikasi. |
| Identitas | Avatar dan representasi percakapan memberi konteks manusia. Panduan resmi menjelaskan kustomisasi profil dan status. |
| Motion | Tidak diukur. Ilustrasi pada snapshot tidak membuktikan perilaku animasinya. |
| Tindakan berikutnya | Download atau membuka Discord di browser. |

Sumber: [landing Discord](https://discord.com/) dan [panduan profil](https://discord.com/blog/how-to-customize-your-discord-profile).

**Terjemahan HIVE:** tampilkan Squad dan alasan untuk hadir sebelum statistik. Presence harus berguna, misalnya “Raka siap di Lobby”, dengan izin dan waktu pembaruan yang jelas. Hindari membawa seluruh struktur channel/chat ke Home; kebutuhan HIVE adalah memulai sesi kompetisi dan mengikuti komunitas.

### 3.2 FACEIT — kompetisi dengan konteks kelompok

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | Landing live memakai hero luas, headline dominan, CTA Play Now, lalu format kompetisi. Dokumentasi Clubs membagi Parties, Feed, Leaderboards, Members, Rules, Chat, dan Queues. |
| Density | Hero relatif lapang; konten kompetisi lebih terstruktur dan padat. Density Clubs live tidak diukur. |
| Warna dan typography | Landing yang terlihat memakai abu terang, hitam, aksen oranye, dan judul uppercase berat. Tidak diasumsikan seluruh produk bertema terang. |
| Identitas | Dokumentasi menghubungkan pemain dengan party dan klub. |
| Motion | Beberapa kata headline muncul dalam struktur halaman; timing pergantiannya tidak diukur. |
| Tindakan berikutnya | Bermain, memilih aktivitas kompetitif, atau menemukan party. |

Sumber: [landing FACEIT](https://www.faceit.com/en) dan [dokumentasi Clubs](https://support.faceit.com/hc/en-us/articles/14996811385372-What-is-a-Club).

**Terjemahan HIVE:** halaman komunitas perlu menghubungkan roster, Arena berikutnya, dan histori. Kesiapan Squad lebih relevan daripada deretan badge. Ranking dapat menjadi tujuan tersendiri; tidak perlu mendominasi Home atau membiasakan peserta melihat reputasi saat membaca argumen.

### 3.3 Steam Community — identitas dan kontinuitas aktivitas

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | Header global, judul Community Activity, area sign-in/hub populer/search, lalu tab jenis konten dan filter waktu/popularitas. |
| Density | Area utilitas cukup padat dengan beberapa kolom. Konten utama berada dalam lebar terpusat. |
| Warna dan typography | Navy/slate, header gelap, aksen cyan dan tombol hijau; teks utilitas lebih kecil daripada judul. |
| Identitas | Hub game menjadi unit discovery; search produk dan orang dipisahkan. Profil individual belum diperiksa. |
| Motion | Tidak terukur. Loading terlihat saat audit. |
| Tindakan berikutnya | Masuk, menemukan hub, mencari orang/game, atau memilih tipe konten. |

Sumber: [Steam Community](https://steamcommunity.com/).

**Terjemahan HIVE:** gunakan histori dan Replay sebagai alasan kembali, dengan discovery berbasis komunitas serta Arena. Jangan meniru banyak tab media pada MVP. Saat feed belum ada, halaman harus tetap menjelaskan tindakan nyata yang tersedia; indikator loading tidak boleh menjadi keadaan permanen tanpa opsi pemulihan.

### 3.4 Reddit — komunitas sebagai konteks membaca

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | UI komunitas live tidak dapat dinilai karena verifikasi manusia. Artikel resmi 2023 menjelaskan upaya mempermudah discovery, bergabung, dan kontribusi. |
| Density | Penyederhanaan merupakan tujuan dokumentasi; density halaman live belum dinilai. |
| Warna dan typography | Tidak diberikan kesimpulan visual terkini dari halaman yang terblokir. |
| Identitas | Dokumentasi menempatkan komunitas sebagai konteks konten dan partisipasi. |
| Motion | Tidak diamati. |
| Tindakan berikutnya | Menemukan komunitas relevan dan berpartisipasi; deskripsi ini berasal dari dokumen historis. |

Sumber: [upaya akses r/gaming](https://www.reddit.com/r/gaming/) dan [pengumuman resmi 2023](https://redditinc.com/news/new-features-aimed-at-making-reddit-easier-to-use-an-update-on-our-product-priorities-focused-on-simplification).

**Terjemahan HIVE:** public Hive harus menjelaskan topik, budaya, aturan, anggota, dan jalur bergabung. Council memakai judul alasan yang jelas dan isi yang mudah dibaca. Meminjam pola feed tidak berarti menambahkan upvote yang dapat menjadi tekanan mayoritas saat keputusan berlangsung.

### 3.5 Strava — aktivitas menjadi cerita sosial

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | Landing menempatkan pesan komunitas serta pilihan signup di tengah, diapit foto aktivitas dan perangkat. |
| Density | Ruang putih luas; satu jalur conversion utama. |
| Warna dan typography | Putih, footer netral hangat, oranye sebagai aksen tindakan. Headline tebal, paragraf ringkas. |
| Identitas | Foto manusia membawa konteks aktivitas. Profil terautentikasi tidak diaudit. |
| Motion | Tidak diukur. |
| Tindakan berikutnya | Signup lewat Google, Apple, atau email. Dokumentasi menjelaskan progres challenges dan histori pencapaian. |

Sumber: [landing Strava](https://www.strava.com/), [Challenges](https://support.strava.com/en-us/articles/15401916-strava-challenges), dan [Trophy Case](https://support.strava.com/en-us/articles/15402068-the-strava-trophy-case).

**Terjemahan HIVE:** selesai bermain dapat menghasilkan objek sosial yang jelas: siapa bermain, apa yang berubah, dan apa hasilnya. Histori yang dapat dibuka lebih berguna daripada badge tanpa konteks. Tidak ada kebutuhan menambahkan tantangan harian baru; pertandingan dan Replay sudah menjadi unit aktivitas.

### 3.6 Duolingo — feedback yang terasa dan dapat dibagikan

| Dimensi | Observasi atau batas observasi |
|---|---|
| Hierarki dan layout | Landing sangat lapang: karakter di kiri, pesan dan CTA di kanan, lalu pilihan bahasa di bawah. |
| Density | Rendah di area conversion; satu tindakan utama dan login sekunder. |
| Warna dan typography | Putih dengan aksen hijau; ilustrasi membawa warna tambahan. Tombol berbayang dangkal terasa dapat ditekan. |
| Identitas | Karakter memberi kepribadian yang kuat; pendekatan ini tidak langsung cocok untuk identitas matang HIVE. |
| Motion | Artikel resmi membahas iterasi timing milestone dan share card; durasi tidak diukur. |
| Tindakan berikutnya | Mulai belajar; sesudah pencapaian, berbagi cerita. |

Sumber: [landing Duolingo](https://www.duolingo.com/) dan [desain animasi milestone](https://blog.duolingo.com/streak-milestone-design-animation/).

**Terjemahan HIVE:** rayakan kejadian yang benar-benar bermakna dengan feedback singkat dan objek yang bisa dibagikan. Gunakan crest, sigil, dan hasil pertandingan. Mascot besar, streak wajib, dan perayaan setiap klik akan mengaburkan karakter komunitas serta mengurangi kekuatan momen penting.

### 3.7 Sintesis audit

| Kebutuhan HIVE | Referensi paling berguna | Keputusan desain |
|---|---|---|
| Merasa punya kelompok | Discord, FACEIT | Identitas anggota, roster, kesiapan, dan afiliasi terlihat |
| Membaca argumen | Prinsip penyederhanaan Reddit; kebutuhan PRD | Satu kolom baca utama, judul alasan, metadata terbatas |
| Menemukan aktivitas relevan | Steam, FACEIT | Discovery berdasarkan Hive, Arena, dan histori |
| Punya alasan kembali | Strava, Steam | Aktivitas yang meninggalkan jejak dan sesi komunitas berikutnya |
| Merasakan pencapaian | Duolingo, Strava | Feedback pada kejadian sah, lalu Replay/share preview |
| Tetap premium dan bersih | Perbandingan lintas referensi | Aksen hemat, hierarchy kuat, sedikit permukaan, tidak menyalin semua fitur |

## 4. Rationale perilaku dan hipotesis HIVE

### 4.1 Belonging, kompetensi, dan agency

Model motivasi video game berbasis self-determination theory mengaitkan daya tarik permainan dengan kemungkinan memenuhi kebutuhan kompetensi, otonomi, dan keterhubungan sosial. Ini adalah kerangka penjelasan, bukan jaminan bahwa avatar atau leaderboard tertentu akan membuat HIVE menyenangkan. [Przybylski, Rigby & Ryan, 2010](https://selfdeterminationtheory.org/SDT/documents/2010_PrzybylskiRigbyRyan_ROGP.pdf).

Eksperimen Sailer dan kolega menemukan bahwa kombinasi elemen desain dapat berkaitan dengan kebutuhan psikologis yang berbeda: badges/leaderboards/performance graphs dengan kompetensi dan makna tugas; avatars/story/teammates dengan relatedness. Hasil tersebut tidak mengisolasi efek setiap elemen dan tidak menguji pertandingan HIVE. [Sailer et al., 2017, repositori LMU](https://epub.ub.uni-muenchen.de/53202/).

**Interpretasi desain:** berikan tempat yang terlihat bagi Human di dalam Squad dan Hive; jelaskan kontribusi yang sah; pertahankan kebebasan Stay/Switch. Jangan menjadikan popularitas sosial sebagai bobot keputusan.

**Hipotesis H1:** Home dengan orang yang dikenal dan satu tindakan Squad lebih mudah mendorong partisipasi sesi daripada Home yang dipenuhi statistik global. Uji lewat keberhasilan menemukan Squad dan tindakan berikutnya, lalu perilaku masuk sesi nyata.

### 4.2 Progres dan anticipation

Penelitian goal-gradient menunjukkan bahwa upaya dapat meningkat ketika orang mendekati tujuan dalam konteks program reward yang diteliti. Transfer ke kesiapan Squad atau fase pertandingan HIVE belum terbukti. [Kivetz, Urminsky & Zheng, 2006](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf).

**Interpretasi desain:** tampilkan progres yang benar-benar terukur: 3/4 anggota siap, commit diterima, fase sekarang, dan waktu hasil tersedia. Jangan menciptakan progres awal palsu atau countdown tanpa kejadian nyata.

**Hipotesis H2:** kesiapan kelompok dan transisi fase yang jelas meningkatkan antisipasi tanpa membuat peserta terburu-buru membaca. Nilai bersama completion, kesalahan memahami fase, kemampuan mengingat argumen, dan laporan excitement; jangan mengoptimalkan excitement sendirian.

### 4.3 Celebration dan cerita yang dibawa pulang

Duolingo mendokumentasikan upaya membuat milestone lebih mudah dipahami, lebih terasa sebagai perayaan, dan mudah dibagikan. Laporan keberhasilan berasal dari pembuat produk; bukan eksperimen HIVE yang dapat direplikasi dari artikel tersebut. [Dokumentasi desain Duolingo](https://blog.duolingo.com/streak-milestone-design-animation/).

**Interpretasi desain:** satu momen singkat cukup jika hasil dan identitas kelompok sudah kuat. Kartu hasil harus tetap bermakna ketika diam, tanpa sound, dan tanpa animasi.

**Hipotesis H3:** Replay yang menunjukkan perubahan belief dan alasan menghasilkan percakapan lebih bermakna daripada kartu kemenangan tanpa konteks. Ukur apakah penerima memahami siapa bertanding, apa yang berubah, dan apakah hasil sudah sah.

**Hipotesis H4:** tone kekalahan yang menghormati pemain membantu mereka kembali untuk sesi berikutnya. Uji dengan sesi nyata; niat kembali saja belum membuktikan retention.

### 4.4 Ritme emosional yang diusulkan

| Bagian pengalaman | Intensitas relatif | Sumber rasa hidup |
|---|---|---|
| Home / Profile | Tenang | Nama, wajah, afiliasi, aktivitas yang relevan |
| Lobby | Meningkat | Anggota hadir, roster lengkap, rival terlihat |
| Think / Deliberate | Terarah | Pertanyaan dan percakapan internal |
| Commit | Singkat dan tegas | Konfirmasi bahwa keputusan diterima |
| Reveal | Tinggi tetapi ringkas | Perbedaan yang sebelumnya tersembunyi |
| Council | Kembali tenang | Alasan, bukan reputasi atau popularitas |
| Revision | Tegang dan jelas | Agency terakhir dan tenggat bersama |
| Final belief / Awaiting outcome | Lega, lalu menunggu | Keputusan selesai; hasil belum diketahui |
| Resolve | Puncak yang pantas | Hasil valid, identitas kelompok, perubahan yang nyata |
| Replay | Reflektif dan sosial | Cerita yang mudah dipahami serta dibagikan |

Intensitas di tabel adalah arahan desain kualitatif, bukan hasil pengukuran emosi.

## 5. Arsitektur informasi dan aturan navigasi

### 5.1 Jalur utama

```text
Public Landing
  ├─ Explore → Public Hive → jalur bergabung
  ├─ Rankings → Hive / Squad / Human Profile yang diizinkan
  └─ Watch / Public Replay → konteks pertandingan
                    ↓ tindakan yang memerlukan akun
              Google Auth
                    ↓
       Username + PFP → Squad → Hive → Ready
                    ↓
          Authenticated Home
           ├─ Squad / Hive / Human
           ├─ Arena → Lobby → Match Room
           │                     ↓
           │       Resolve / Awaiting outcome → Replay
           └─ Settings → Advanced → View Proof
```

View Proof juga dapat ditautkan dari hasil/Replay sesuai izin publik. Pengguna tidak perlu melewati Settings untuk memverifikasi hasil tertentu.

Navigasi authenticated mengikuti PRD: **Home, Arena, Hives, Rankings**, dengan search, notifications, dan menu PFP. Squad terbuka dari Home, profil, dan Hive. Pada mobile, Home/Arena/Hives/Profile dapat menjadi navigasi bawah; Rankings tetap dapat ditemukan melalui Arena dan menu tambahan. Jangan menghapus akses Rankings hanya karena tidak masuk empat slot utama.

Simpan tujuan deep link setelah auth. Pengguna yang datang dari invite Squad tidak perlu mencari Squad tersebut lagi. Berikan konteks tujuan sebelum meminta login. Identitas Web3, address, gas, dan receipt tidak menjadi langkah utama onboarding.

### 5.2 Tata bahasa identitas

| Entitas | Representasi | Informasi pendamping wajib | Batas |
|---|---|---|---|
| Human | PFP bundar; pixel avatar atau upload sesuai PRD | Handle/nama dan konteks peran | PFP tidak menyatakan rank, rarity, atau voting power |
| Squad | Crest berbentuk perisai | Nama Squad, afiliasi Hive, roster 3–5 Human | Crest tidak memakai glow untuk menandai kualitas argumen |
| Hive | Sigil komunitas dengan siluet berbeda dari crest | Nama Hive dan label komunitas | Tidak hanya dibedakan oleh warna |

Ukuran membentuk konteks, bukan kasta: avatar kecil untuk aktivitas, crest sedang untuk roster, sigil besar di profil atau duel. Pada komponen kompak tetap tampilkan label entitas. Papan memakai SVG orisinal sederhana sebagai placeholder identitas; belum merupakan koleksi PFP final. Variasi wajah, crest, dan sigil perlu diperluas pada tahap art direction.

### 5.3 Batas kepadatan bersama

Angka berikut adalah target desain awal, bukan ukuran universal:

- Desktop lebar konten sekitar 1120–1200 px; halaman baca 640–720 px. Gunakan paling banyak dua kolom konten utama. Navigasi tetap tidak dihitung sebagai kolom informasi tambahan.
- Home menampilkan satu modul Arena prioritas, satu rangkaian aktivitas, dan satu konteks Squad di area awal. Mulai dari tiga item feed bermakna sebelum “lihat lainnya”.
- Maksimum satu CTA primer terisi per area keputusan. CTA sekunder memakai outline atau teks.
- Pisahkan bagian dengan spacing 24–40 px dan heading; tidak semua kelompok membutuhkan kotak. Kartu hanya untuk objek dengan batas, aksi, atau status yang jelas.
- Mobile sekitar 390 px memakai gutter 20 px, satu kolom, target sentuh 44 px pilihan desain. Isi panjang bertambah tinggi; tidak dipaksa menjadi kartu kecil.
- Dalam Match, pertanyaan, pilihan, fase, dan tindakan harus tetap mudah dijangkau. Aktivitas sosial umum tidak menjadi panel samping permanen.

## 6. Spesifikasi kelompok halaman

Urutan di bawah adalah prioritas dari atas ke bawah. Detail dapat dibuka bertahap, tetapi aturan yang memengaruhi keputusan tidak boleh disembunyikan di tooltip.

### 6.1 Public Landing

**Tujuan:** dalam pembacaan singkat, pengguna memahami bahwa Human membentuk Squad dan Squad mewakili Hive dalam pertandingan penilaian.

**Urutan:** navigasi ringkas → proposisi produk → contoh duel/Replay → Human–Squad–Hive → cara bermain dalam tiga bagian (pikirkan, bandingkan alasan, lihat hasil) → contoh Replay valid → komunitas yang tersedia → CTA bergabung → FAQ dan footer.

**CTA:** Jelajahi Hives; Tonton Replay sebagai alternatif. Login tersedia tetapi tidak memutus jalur memahami produk. **Density:** satu headline, satu paragraf, dua tindakan maksimum dalam hero; tanpa deretan angka traction ilustratif.

**Desktop:** teks dan objek cerita berdampingan. **Mobile:** teks, tindakan, lalu duel; hierarki identitas menjadi urutan vertikal. **Aktivitas rendah:** tampilkan cara bermain atau Replay demo berlabel jelas; jangan menulis “live sekarang” tanpa sesi aktif. **Loading/error:** copy inti tetap tersedia; kegagalan modul komunitas tidak menghilangkan penjelasan produk.

### 6.2 Explore, Public Hive, dan Rankings

**Explore:** search/minat → daftar Hive yang relevan → Arena atau Replay terkait. Tiap baris memuat sigil, nama, budaya/topik singkat, dan akses bergabung. Hindari tag bertumpuk.

**Public Hive:** identitas dan deskripsi → cara bergabung → aktivitas/Arena → Squad → histori → pedoman. CTA “Lihat cara bergabung” atau tindakan sesuai aturan membership; public profile tidak menjanjikan kursi kompetisi otomatis.

**Rankings:** konteks season dan entitas → definisi ukuran → tabel → posisi relevan bila login → histori. Pisahkan ranking Human/Squad/Hive; jangan membandingkan angka yang memakai definisi berbeda. Sertakan sample size serta empty state untuk entitas belum memenuhi syarat.

**Density:** Explore awal 6–8 baris desktop atau 4–5 mobile; ranking awal sekitar 10 baris, lebih banyak melalui pagination. Angka adalah batas desain kandidat. **Desktop:** filter ringkas dengan daftar utama. **Mobile:** filter dalam sheet, tabel menjadi baris berlabel tanpa menghilangkan metrik utama. **Aktivitas rendah:** komunitas baru tetap tampil lewat deskripsi, anggota, jadwal nyata, dan pedoman. **Loading/error:** skeleton ukuran stabil, retry di daftar; jangan mengubah error menjadi “tidak ada komunitas”.

### 6.3 Public Watch dan Replay

**Watch:** siapa bertanding → status/fase dan jadwal → pertanyaan yang boleh dipublikasikan → aggregate yang sudah boleh dibuka → konteks aturan. **Replay:** hasil/status → identitas dan pertanyaan → initial belief → argumen resmi yang publik → final belief → outcome dan skor → link bukti → bagikan/lihat Hive.

**CTA:** Ikuti ceritanya atau Buka Replay, lalu Bergabung setelah pengguna memahami konteks. **Density:** satu scene utama, satu timeline, satu panel penjelasan. **Desktop:** timeline di sisi atau bawah. **Mobile:** satu scene dengan tombol sebelumnya/berikutnya; sediakan versi teks lengkap, bukan scrubber saja.

**Aktivitas rendah:** jelaskan tidak ada match live dan tawarkan histori nyata. **Loading/error:** scene yang datanya belum tersedia ditandai belum tersedia; Replay tidak mengisi celah dengan dugaan. Spectator menggunakan batas data yang sama; private call/chat tidak dibuka hanya karena tampilan Watch bersifat publik.

### 6.4 Google Auth dan Onboarding

**Urutan:** alasan perlu akun dan tujuan setelah masuk → Google Auth → username/PFP → Squad → Hive → ringkasan siap. Invite yang valid memberi konteks afiliasi; langkah afiliasi yang sudah ditentukan tidak perlu diulang sebagai pilihan palsu.

**CTA:** Lanjutkan dengan Google, kemudian satu tindakan Lanjut per langkah. **Density:** satu keputusan utama per screen; tidak ada wallet prompt, gas, token, atau checklist gamification baru. **Desktop:** form terpusat sekitar 440–520 px dengan konteks kecil. **Mobile:** form penuh dengan keyboard tidak menutupi error/CTA.

**Kasus:** username bentrok, upload tidak valid, auth dibatalkan, invite kedaluwarsa, Squad penuh, koneksi terputus. Simpan input yang aman; sediakan kembali/pilih jalur lain. Komunitas kosong tidak menjadi dead end: tampilkan pilihan yang memang diizinkan PRD, termasuk jalur membuat/mencari Squad jika tersedia. Tidak memberi status “verified human” hanya karena Google login berhasil.

### 6.5 Authenticated Home

**Urutan:** konteks pribadi singkat → aksi Squad/Arena paling relevan → aktivitas orang/kelompok → Squad dan afiliasi → sesi berikutnya atau Replay. Sapaan tidak perlu mengambil satu layar.

**CTA adaptif:** Masuk Lobby bila eligible dan aktif; Buka Squad bila perlu persiapan; Lihat Replay setelah hasil tersedia. Prioritas tidak boleh menghasilkan CTA masuk pertandingan untuk anggota yang tidak ada dalam roster.

**Density:** satu prioritas, tiga item aktivitas awal, roster Squad 3–5 orang. **Desktop:** aliran utama dan panel Squad. **Mobile:** prioritas → ringkasan Squad → aktivitas; daftar anggota dapat dibuka. **Aktivitas rendah:** pedoman, anggota, tindakan undang yang diizinkan, dan rencana sesi nyata. **Loading/error:** data lama berlabel waktu bila tersedia; presence stale tidak dihitung sebagai siap. Tidak ada skeleton beranimasi tanpa batas.

### 6.6 Human, Squad, dan Hive Profile

**Human:** PFP/handle → afiliasi → histori partisipasi dan metrik yang diizinkan → Replay → kontrol profil sendiri. Reputation/influence perlu definisi, sample size, dan batas interpretasi. Profil tidak menyiratkan ukuran kecerdasan umum.

**Squad:** crest/nama/afiliasi → roster → kesiapan atau jadwal → histori match → budaya/peran. CTA Buka Lobby atau lihat anggota sesuai status.

**Hive:** sigil/nama/budaya → Arena → Squad yang mewakili → histori dan metrik → pedoman. Anggota komunitas dan match roster harus dibedakan.

**Density:** tiga metrik ringkas maksimum di bagian awal; sisanya melalui tab histori. **Desktop:** identitas horizontal, konten dengan konteks samping. **Mobile:** identitas bertumpuk, tab tetap singkat. **Baru:** “Belum ada match selesai”, tanpa rank/default score yang terlihat seperti prestasi. **Error:** kegagalan statistik tidak menghilangkan identitas; data kosong berbeda dari gagal dimuat.

### 6.7 Arena Lobby

**Urutan:** nama Arena/rival → waktu serta format → pertanyaan/aturan yang tersedia → roster dan eligibility → kesiapan → tindakan. Tampilkan “Match roster”, bukan “Active Council”, agar tidak tertukar dengan fase Council.

**CTA:** Siap atau Masuk Match sesuai state server. **Density:** satu blok rival, satu roster terkelompok, satu CTA. **Desktop:** dua pihak seimbang. **Mobile:** ringkasan rival lalu roster milik sendiri; roster lawan bisa diperluas.

**Menunggu:** tampilkan siapa belum siap tanpa tekanan atau ejekan. **Tidak ada Arena:** jelaskan jadwal atau next action organizer yang memang tersedia. **Disconnect:** last seen, status sinkronisasi, dan reconnect. Kesiapan animasi tidak dapat mengganti validasi eligibility atau roster lock.

### 6.8 Match Room

**Shell tetap:** identitas match → fase/waktu dari server → pertanyaan/evidence → ruang fase → tindakan berikutnya. Peralihan fase boleh mengganti isi, tetapi lokasi timer dan pertanyaan tidak berpindah tanpa alasan.

| Fase | Konten prioritas | Larangan desain |
|---|---|---|
| Think | Pertanyaan, sumber konteks, draft pribadi | Tidak memperlihatkan call anggota lain |
| Deliberate | Diskusi Squad dan keputusan pribadi | Tidak menampilkan aggregate lawan yang belum dibuka |
| Commit | Call pribadi, batas waktu, pending/accepted | Tidak menyebut tersimpan sebelum acknowledgement |
| Reveal | Initial Squad/Hive Belief yang sah | Tidak ada trophy, pemenang, atau label Wisdom Lift |
| Council | Argument card resmi, crest, nama, initial belief | Tanpa rank, badge akurasi, atau influence pada card |
| Revision | Stay/Switch; attribution sesuai PRD jika berubah | Final totals tetap tersembunyi; tidak ada live final choice |
| Resolve | Final belief lalu status outcome/hasil | Pending atau incomplete tidak diberi hasil buatan |

**Density:** satu kolom argument 640–720 px dengan maksimal dua card ringkas dalam viewport desktop; isi panjang dibaca penuh melalui expand. Jumlah card berasal dari roster, tidak dikurangi untuk estetika. **Mobile:** question summary dapat diciutkan, timer dan aksi tetap jelas, satu card dibaca per bagian; tidak memakai carousel otomatis.

**Loading/error:** simpan draft lokal yang aman, bedakan belum terkirim/pending/diterima, sinkronkan ulang fase setelah reconnect. Client animation tidak menambah waktu atau memberi kesempatan revisi setelah tenggat. Argument unavailable harus berlabel; jangan menggantinya dengan alasan buatan.

### 6.9 Resolve dan Replay setelah pertandingan

**Urutan:** status validitas → outcome ronde atau status match → identitas → skor → belief before/after → Wisdom Lift jika valid → cerita argumen/attribution yang diizinkan → Replay/share → proof detail.

**CTA:** Lihat Replay atau Review bersama; Bagikan sebagai tindakan sekunder. **Density:** satu pesan hasil, dua skor perbandingan, satu nilai lift, satu penjelasan. **Desktop:** identitas dan hasil mendapat ruang luas. **Mobile:** hasil utama dan status sebelum statistik; jangan mengecilkan disclaimer status menjadi teks yang terlewat.

**Awaiting outcome:** final belief boleh tampil setelah barrier sah; sebut Belief Shift, belum Wisdom Lift. **VOID:** alasan data/aturan, tanpa kemenangan ronde. **NO CONTEST:** status match tanpa pemenang palsu. **Forfeit/incomplete:** label aturan terkait, metrik N/A bila tidak sah dihitung. **Draw:** hasil match yang seri, berbeda dari sumber outcome TIE yang membuat ronde void sesuai PRD.

### 6.10 Settings dan View Proof

**Settings:** akun/profil → privasi/presence → notifikasi → tema → reduced motion → sound off/on → advanced account. **View Proof:** ringkasan yang bisa dibaca manusia → match/round ID → rule version → data sumber dan waktu → commitment/hasil → transaction references.

**CTA:** Simpan preferensi atau Buka bukti terkait. **Density:** satu kelompok kontrol per bagian, label yang menjelaskan dampak. **Mobile:** field ditumpuk; identifier dapat disalin tanpa merusak lebar layar. **Error:** perubahan gagal tidak terlihat seolah tersimpan. Bukti tidak tersedia berbeda dari hasil invalid; tampilkan status keduanya secara terpisah. Blockchain receipt membuktikan catatan tertentu, bukan kebenaran asal seluruh data eksternal.

## 7. Tiga arah visual pada struktur yang sama

### 7.1 Karakter dan tradeoff

| Arah | Karakter yang dituju | Kekuatan | Tradeoff |
|---|---|---|---|
| **A. Porcelain + indigo** | Digital, tenang, komunitas gaming yang matang | Identitas brand cukup jelas, mudah menahan aksen saat membaca, dark tetap netral | Bisa terasa generik jika PFP/crest/sigil dan copy tidak khas; indigo berlebihan kembali terasa ramai |
| **B. Warm neutral + teal** | Ramah, dekat, mengundang diskusi | Halaman sosial terasa hangat; baik untuk komunitas yang tidak mengutamakan rivalry | Teal berdekatan dengan asosiasi success; perlu pemisahan ikon/label dan restraint ekstra |
| **C. Cool neutral + cobalt** | Tegas, cepat, kompetitif | CTA dan pertandingan punya ketegasan; cocok untuk Arena | Lebih mudah terasa seperti layanan esports atau dashboard umum; perlu menahan outline dan data |

Tidak ada pergantian layout, ilustrasi berbeda, atau penambahan dekorasi untuk memenangkan satu opsi. Papan membandingkan konten yang identik.

### 7.2 Token eksplorasi light/dark

Nilai ini adalah kandidat yang sudah dihitung kontrasnya. Finalisasi token dilakukan setelah screen dan state diuji.

| Token | A Light | A Dark | B Light | B Dark | C Light | C Dark |
|---|---|---|---|---|---|---|
| Canvas | `#F7F7FB` | `#101116` | `#F7F5EF` | `#111816` | `#F3F6FA` | `#101620` |
| Surface | `#FFFFFF` | `#181A21` | `#FFFEFA` | `#19231F` | `#FFFFFF` | `#182232` |
| Elevated | `#F0F0F7` | `#22252F` | `#EEEEE5` | `#22312A` | `#EAF0F8` | `#223148` |
| Text utama | `#20212A` | `#F3F3F8` | `#222B28` | `#EDF4EF` | `#1B2638` | `#F0F5FF` |
| Text sekunder | `#606374` | `#B0B2C1` | `#596860` | `#ACBEB2` | `#5B687C` | `#AABAD0` |
| Brand / focus | `#5146C7` | `#A29AFF` | `#116D65` | `#72CEBD` | `#2455CE` | `#8CB5FF` |
| Text di tombol brand | `#FFFFFF` | `#111117` | `#FFFFFF` | `#10201B` | `#FFFFFF` | `#101B2F` |
| Divider halus | `#DCDEE7` | `#353846` | `#D6DED5` | `#374B3F` | `#D5DFEC` | `#3A4C66` |
| Batas kontrol penting | `#777B8D` | `#777B8D` | `#6E8075` | `#7E9888` | `#6D7E97` | `#8297B7` |

Status bersama semua arah: Light Live `#A74319`, Success `#237247`, Danger `#B33D46`; Dark Live `#FFAC7D`, Success `#83C99C`, Danger `#F0A0A7`. Status memakai teks dan ikon, bukan warna saja. Background mayoritas netral; divider dekoratif tidak digunakan sebagai satu-satunya batas input.

**A/B:** tetap memakai label A/B, nama game, angka, dan pola solid/arsir netral. Brand tidak berarti A, hijau tidak berarti pilihan benar sebelum outcome, dan oranye tidak berarti B. Pilihan personal memakai outline/ikon selected dengan label eksplisit.

### 7.3 Typography, permukaan, dan identitas

Gunakan satu keluarga sans-serif yang jelas, dengan system sans sebagai baseline eksplorasi; papan memakai Segoe UI/Arial fallback tanpa font jaringan. Display memakai ukuran dan weight, bukan banyak keluarga font. Hierarki kandidat: hero desktop 48–58 px, mobile 36–40; judul halaman 28–36; section 16–20; body produk 16; metadata 12–14. Beberapa metadata pada papan komparatif lebih kecil untuk menjelaskan fixture; jangan menjadikannya standar teks penting produk final.

Argumen memakai line-height sekitar 1,55–1,7 dan baris yang cukup pendek untuk dibaca. Angka hasil memakai tabular numerals. Uppercase hanya label pendek; tidak untuk paragraf atau seluruh navigasi.

Gunakan tiga tingkat permukaan: canvas, surface, elevated. Dark memiliki hierarchy sama dengan light. Mayoritas panel tidak memakai glow; elevation ringan melalui perbedaan surface dan separator. Ekspresi warna PFP/crest/sigil dapat lebih kaya daripada chrome, tetapi koleksi identitas harus diuji sebagai satu layar, bukan satu ikon terpisah.

### 7.4 Pemeriksaan kontras

Perhitungan memakai relative luminance sRGB dan rasio WCAG, atas warna solid yang benar-benar ditulis pada papan. Kolom teks/brand/status/batas adalah **rasio terendah terhadap canvas, surface, dan elevated**; tombol memakai pasangan ink terhadap brand.

| Arah / tema | Teks utama | Sekunder | Brand | Status terendah | Batas kontrol | Teks tombol |
|---|---:|---:|---:|---:|---:|---:|
| A Light | 14,11 | 5,24 | 6,07 | 5,04 | 3,70 | 6,88 |
| A Dark | 13,82 | 7,27 | 6,26 | 7,49 | 3,64 | 7,71 |
| B Light | 12,46 | 5,04 | 5,29 | 4,90 | 3,59 | 6,18 |
| B Dark | 12,19 | 6,99 | 7,32 | 6,68 | 4,37 | 9,06 |
| C Light | 13,26 | 4,93 | 5,61 | 4,99 | 3,60 | 6,43 |
| C Dark | 12,00 | 6,65 | 6,35 | 6,43 | 4,41 | 8,34 |

Target: teks normal minimal 4,5:1; teks besar minimal 3:1; kontrol/grafik yang diperlukan minimal 3:1, dengan syarat penerapan sesuai kriteria terkait. Semua pasangan uji di atas melewati target yang relevan. Ini **bukan sertifikasi aksesibilitas seluruh halaman**; gambar upload, focus, zoom, state disabled, dan implementasi final tetap perlu diperiksa. [WCAG 2.2, 1.4.3 dan 1.4.11](https://www.w3.org/TR/WCAG22/).

### 7.5 Penilaian pada lima contoh

| Contoh | Yang dibandingkan | A | B | C |
|---|---|---|---|---|
| Landing | Proposisi, duel, hierarchy | Seimbang antara komunitas dan identitas digital | Paling hangat secara palet | Paling tegas secara aksen |
| Home | Orang, satu Arena, aktivitas | Tenang dengan CTA jelas | Cocok untuk percakapan; success perlu hati-hati | Bersih, tetapi mudah terasa seperti control panel bila data ditambah |
| Hive Profile | Sigil, roster, histori | Memberi ruang bagi identitas komunitas | Membawa rasa kelompok yang ramah | Menonjolkan aspek kompetisi |
| Reveal | Belief netral dan perbedaan | Aksen fase cukup jelas | Tetap terbaca; jangan memakai teal untuk hasil benar | Tajam, tetapi A/B harus tetap netral |
| Resolve | Hasil, lift, next action | Dapat merayakan tanpa menguasai layar | Hasil terasa lebih hangat/reflektif | Hasil terasa lebih sportif/tegas |

Tabel adalah interpretasi reviewer desain, bukan skor preferensi peserta. **A dipilih karena paling mudah memenuhi kebutuhan sosial sekaligus momen Arena dalam satu sistem.** B tetap kandidat kuat bila playtest menunjukkan indigo terasa terlalu umum. C layak bila pengguna lebih menginginkan identitas kompetitif dan tetap dapat membaca Council dengan nyaman.

## 8. Gamification dan storyboard momen penting

### 8.1 Prinsip motion

Motion menjelaskan perubahan yang sudah sah. UI tidak menunggu animasi selesai untuk menjadi dapat digunakan. Timer dan event server menjadi otoritas; client tidak menggeser tenggat. Jika pengguna kembali ke tab setelah kejadian lewat, langsung tampilkan state terbaru tanpa mengantre semua animasi yang terlewat.

Reduced motion mengganti gerak dengan ikon, teks, dan perubahan state langsung. Tidak ada screen shake, strobe, confetti terus-menerus, atau suara otomatis. Sound **default nonaktif**, diaktifkan melalui preferensi eksplisit; tidak membawa informasi eksklusif dan berhenti ketika konteks match ditinggalkan.

### 8.2 Storyboard

| Momen | Sebelum → kejadian sah → sesudah | Copy dan visual | Durasi kandidat | Reduced motion / batas |
|---|---|---|---|---|
| Squad lengkap | 3/4 siap → anggota terakhir diakui siap → 4/4 siap | PFP terakhir mendapat check; crest diberi satu aksen; “Squad-mu lengkap” | 250–400 ms | Check statis; tidak menjanjikan start bila roster/eligibility belum valid |
| Call terkunci | Draft → pending → commitment diterima | Tombol menjadi “Call tersimpan”, ikon kunci/check, waktu penerimaan | 120–180 ms | Pergantian teks langsung; pending tidak merayakan sukses |
| Initial Reveal | Aggregate tersembunyi → initial reveal valid → perbedaan terlihat | Identitas tetap diam; angka A/B muncul bersama; “Dua sudut pandang” | 300–450 ms | Angka final langsung; tanpa count-up dari angka fiktif, tanpa trophy |
| Final belief | Revision terbuka → barrier semua peserta tertutup dan final reveal valid → aggregate final | Before/after, label “Final belief”; Belief Shift jika outcome belum diketahui | 250–400 ms | Dua angka statis; tidak membuka final lebih awal |
| Menang | Awaiting settlement → match settled → W | Sigil pemenang, roster, hasil eksplisit; aksen singkat di area hasil | 400–700 ms | Sigil dan label W statis; perayaan tidak menutup skor/CTA |
| Kalah | Awaiting settlement → match settled → L | “Kali ini Chog unggul”; hasil dan Review bersama | 180–250 ms | Hasil statis; tanpa shake merah atau penghinaan |
| Draw | Semua ronde selesai → perhitungan sah → D | Kedua sigil setara dan “Match berakhir imbang” | 180–250 ms | Tampilan statis; bukan pengganti status ronde void |
| Wisdom Lift negatif | Belief berubah → outcome valid → jarak memburuk | Nilai minus terlihat, “Belief menjauh dari outcome”; link tinjau alasan | 180–250 ms | Minus + penjelasan; tidak ada pujian akurasi |
| Milestone | Histori belum lengkap → pertandingan pertama benar-benar selesai → catatan histori | “Pertandingan pertama, jadi cerita”; identitas dan link Replay | 350–500 ms | Kartu statis; tidak menciptakan level atau reward baru |
| Replay siap dibagikan | Replay tersusun → payload publik valid → preview | Ringkasan hasil, identitas, status, dan CTA berbagi | 150–250 ms | Preview langsung; pengiriman tetap tindakan pengguna |

Papan menggabungkan milestone dan Replay dalam satu storyboard interaktif agar kaitan pencapaian–cerita terlihat. Timeline spesifikasi di atas tetap memisahkan trigger keduanya.

### 8.3 Koreksi hasil dan kondisi tidak ideal

Jika hasil direvisi melalui mekanisme resmi atau data invalid, tampilkan status terbaru dan alasan perubahan dengan jejak histori; jangan memutar perayaan lama. Gunakan “Menunggu hasil”, “Ronde void”, “Match no contest”, dan “Forfeit” sebagai state berbeda. N/A tidak boleh diganti nol jika nol berarti skor sah.

Pada reduced motion, sound off, dan jaringan lambat, pengguna tetap dapat memahami siapa bermain, apa yang berubah, dan hasil apa yang sudah sah. Motion gagal atau tidak didukung tidak menghilangkan informasi.

## 9. Konsistensi data dan batas aturan produk

### 9.1 Fixture yang dipakai papan

Contoh Purple memiliki lima Squad, masing-masing empat Human. Initial Squad Belief A adalah 75%, 25%, 100%, 25%, 50%; rata-rata setara per Squad **55% A**. Final menjadi 100%, 50%, 100%, 50%, 50%; rata-rata **70% A**. Chog memakai final belief **60% A** untuk perbandingan hasil.

Jika outcome A valid:

```text
HiveScore = 100 × (1 − (p − y)²)
Purple initial score = 79,75
Purple final score   = 91,00
Chog final score     = 84,00
Wisdom Lift Purple   = +15 pp
Council Score Lift   = +11,25 poin skor
```

Jika B yang benar, Purple final score **51**, dan Wisdom Lift **−15 pp**. Replay tidak boleh tetap memuji perbaikan. Nilai 91 vs 84 dalam papan adalah hasil **ronde**, bukan otomatis pemenang match tiga ronde.

Sebelum outcome tersedia, 55 → 70% A hanya dapat disebut **Belief Shift +15 pp menuju A**. Wisdom Lift baru dinilai setelah outcome valid. Lift tidak membuktikan sebab-akibat Council; atribusi pengaruh juga merupakan laporan peserta, bukan bukti kausal otomatis.

### 9.2 Data yang boleh memengaruhi UI

| Informasi | Sumber otoritatif | Konsekuensi desain |
|---|---|---|
| Login/onboarding | Auth dan state akun | Google login bukan bukti unik-manusia yang sempurna |
| Roster/eligibility | Aturan dan roster snapshot pertandingan | “Siap” dan “boleh bermain” merupakan status berbeda |
| Deadline/fase | Waktu serta event sistem pertandingan | Animasi dan waktu perangkat tidak memperpanjang fase |
| Commit accepted | Acknowledgement valid sesuai arsitektur PRD | Jangan menganggap klik sebagai berhasil |
| Initial/final aggregate | Hasil reveal yang sah | Nilai final tidak bocor selama Revision terbuka |
| Score/lift | Outcome valid dan formula/rule version | Bukan angka dekoratif; N/A/void dipertahankan |
| Presence/activity | Data sosial offchain dengan freshness | Bukan event onchain untuk setiap interaksi |
| Argument/Replay | Konten yang diizinkan dan commitment terkait | Private chat dan call individual mengikuti izin PRD |
| Proof | Catatan contract dan bukti sumber | Tampilan detail menjelaskan trust boundary, bukan klaim “trustless” menyeluruh |

Sybil dan anti-cheat tetap mengikuti PRD. Tidak menambahkan lencana “human verified” hanya dari autentikasi Google, tidak menyiratkan onchain identity menyelesaikan multi-account, dan tidak memperluas ranking menjadi voting power. Identity management tersembunyi dari jalur utama; detail advanced tetap bisa diakses saat relevan.

## 10. Replay, growth, dan retention tanpa aktivitas palsu

### 10.1 Unit cerita yang dibagikan

Share preview minimal memuat: nama kedua Hive, identitas/crest yang relevan, Arena dan ronde/match, status hasil, initial/final belief, outcome, skor, Wisdom Lift yang valid, waktu, serta tautan Replay. Untuk kartu ringkas, fokus pada satu perubahan dan satu hasil; detail lain di Replay. Status pending/void tidak dipoles menjadi kemenangan.

Chat privat, siapa berpindah pilihan, dan attribution personal mengikuti izin PRD. Tidak ada checkbox publik yang otomatis tercentang untuk data personal sensitif. Preview dapat dibaca sebelum pengguna mengirim atau menyalin link.

### 10.2 Loop yang diusulkan

| Loop | Pemicu → pengalaman → alasan kembali | Guardrail |
|---|---|---|
| Belonging | Invite teman → identitas/afiliasi → bertemu Squad pada sesi berikutnya | Tidak memaksa semua kontak atau mengarang presence |
| Kompetisi | Rival dan roster → match → histori bersama | Ranking tidak menyusup ke fase keputusan |
| Pembelajaran | Hasil valid → review perbedaan alasan → sesi berikutnya | Wisdom Lift negatif tetap terlihat |
| Cerita | Replay → percakapan di komunitas asal → kunjungan anggota baru | Preview jujur dan privacy terjaga |
| Ritual komunitas | Jadwal nyata → berkumpul → recap → jadwal berikutnya | Notifikasi berdasarkan minat/izin, tanpa urgency palsu |

Tidak semua aktivitas harus masuk feed. Prioritaskan perubahan yang memberi konteks sosial: anggota bergabung, roster siap, Arena dibuka, hasil tersedia, Replay dibagikan. Hindari notifikasi untuk tiap klik, typing, atau perubahan kecil yang tidak memerlukan perhatian.

### 10.3 Ketika komunitas masih kecil

Home yang sehat tidak bergantung pada feed ramai. Identitas Squad, deskripsi komunitas, pedoman, undangan, dan sesi terjadwal dapat menjadi isi utama. Bila belum ada sesi, jelaskan apa yang diperlukan untuk mengadakannya sesuai peran organizer. Demo Replay boleh dipakai untuk edukasi hanya dengan label demo yang konsisten pada halaman dan kartu bagikan.

## 11. Pemeriksaan keputusan dan rencana validasi

### 11.1 Gate sebelum screen final

| Kriteria | Bukti yang sudah ada | Yang masih perlu diuji |
|---|---|---|
| Pengguna baru tahu siapa bertanding | Landing menjelaskan Human → Squad → Hive dan duel berlabel Hive | Uji pemahaman tanpa penjelasan moderator |
| Home memperlihatkan manusia dan next action | Roster, nama, aktivitas dan satu CTA prioritas di papan | Relevansi untuk pengguna dengan/tanpa roster aktif |
| Identitas mudah dibedakan | Bentuk PFP, crest, sigil dan label konsisten | Recognition pada ukuran kecil dan koleksi identitas beragam |
| Euforia tidak menyalahi status | Reveal netral; round win dan match win dipisahkan; storyboard gated | Playtest transisi, pending, disconnect, late arrival |
| Light/dark terbaca | Rasio warna solid dihitung; hierarchy template sama | Zoom, keyboard, screen reader, warna upload, perangkat nyata |
| Tetap menarik tanpa motion/aktivitas palsu | Empty states, reduced motion, data ilustrasi berlabel | Uji komunitas baru dan mode tanpa animasi |

Gate ini **lolos pemeriksaan rancangan**, bukan dinyatakan lolos riset pengguna. Temuan pengguna yang bertentangan harus mengubah desain sebelum polish lebih jauh.

### 11.2 Playtest yang disarankan

Rekrut awal 6–8 anggota komunitas gaming yang mewakili anggota biasa, pengurus, dan calon pengguna baru. Sampel ini untuk menemukan masalah pemahaman, bukan menyimpulkan preferensi populasi atau perbedaan conversion secara statistik.

1. Tampilkan Landing singkat; minta peserta menjelaskan Human, Squad, Hive, dan siapa melawan siapa.
2. Beri Home aktif dan sepi; minta menemukan Squad serta tindakan yang bisa dilakukan sekarang.
3. Tampilkan Reveal; tanyakan apakah sudah ada pemenang dan data apa yang masih tersembunyi.
4. Jalankan Council/Revision dengan argumen nyata; catat salah klik, kehabisan waktu, recall argumen, dan dugaan kebocoran final.
5. Tampilkan Resolve positif, negatif, draw, dan pending; minta peserta menjelaskan perbedaan belief, outcome, lift, dan pemenang match.
6. Bandingkan A/B/C dengan urutan diacak pada konten sama; tanya rasa sosial, ketenangan membaca, dan karakter gaming. Jangan memberi tahu rekomendasi sebelum respons.
7. Minta membuka Replay sebagai penerima link yang belum punya akun; periksa apakah cerita dipahami sebelum login.

Kriteria awal yang diusulkan: mayoritas dapat menjelaskan hierarchy tanpa bantuan; tidak ada salah tafsir status hasil kritis yang dibiarkan; semua peserta dapat menemukan next action yang sah. Angka keberhasilan terukur sebaiknya ditetapkan sebelum sesi, lalu masalah kritis diperbaiki meskipun rata-rata terlihat baik.

Aksesibilitas berikutnya: navigasi keyboard/focus, reflow dan zoom, label/announcement status, warna tidak menjadi satu-satunya kode, gerak dapat dikurangi. Target sentuh 44 px adalah pilihan HIVE; WCAG 2.2 AA minimum target size memiliki ketentuan 24 px dan pengecualian. Penonaktifan animasi interaksi berada pada kriteria 2.3.3 tingkat AAA; HIVE mengadopsinya sebagai arah kenyamanan. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

### 11.3 Risiko desain utama

| Risiko | Gejala | Respons |
|---|---|---|
| Terlalu steril | Home bersih tetapi orang tidak merasa punya kelompok | Perkuat identitas, activity copy, roster dan ritual; jangan langsung menambah warna |
| Terlalu ramai | Semua status berupa badge/card/warna | Kurangi permukaan dan metadata; kembalikan satu prioritas per area |
| Esports generik | Rangking/hero kompetisi mengalahkan manusia | Tambahkan wajah, afiliasi dan cerita komunitas pada hierarchy |
| Gamification dangkal | Perayaan tidak berhubungan dengan hasil | Ikat feedback pada acknowledgement dan event sah |
| Konformitas sosial | Rank/popularitas menentukan cara membaca argumen | Sembunyikan reputation/influence dalam fase yang dilarang PRD |
| Hasil disalahpahami | Reveal dianggap menang; pp dianggap persen skor | Label fase, unit, dan status eksplisit pada semua ukuran layar |
| Cold start | Landing menjanjikan live tetapi komunitas sepi | Gunakan jadwal, anggota, pedoman dan demo berlabel |
| Palet menyesatkan | Teal dianggap success atau brand dianggap pilihan A | Pertahankan label, ikon, pola dan token semantik terpisah |

## 12. Design brief untuk tahap berikutnya

**Objective:** merancang alur yang membuat pengguna berkata: “Aku tahu komunitasku, tahu Squad-ku, tahu apa yang bisa kulakukan, dan ingin mengikuti ceritanya sampai selesai.”

**Arah utama:** A — Porcelain + indigo; light/dark menjaga struktur 1:1. Ekspresi gaming hadir melalui identitas dan momen, dengan Home serta Council yang tenang. B/C disimpan sebagai alternatif terdokumentasi, bukan dicampur dalam satu produk.

**Prioritas screen:** Landing → Google Auth dan onboarding → Home aktif/sepi → Squad/Hive → Lobby → Think/Commit/Reveal/Council/Revision → Awaiting outcome/Resolve → Replay/share preview. Explore/Rankings/Settings/View Proof mengikuti setelah struktur inti jelas. Ini urutan pengerjaan desain, bukan perubahan scope produk PRD.

**Komponen yang perlu dibuat:** identity row; roster; aktivitas; Arena summary; phase indicator; pilihan private; pending/accepted feedback; argument card tanpa reputasi; belief comparison; outcome/score/lift; Replay timeline; share preview; empty/error states; advanced proof disclosure.

**Copy:** ramah, singkat, konkret. Sebut “Squad-mu siap”, “Call tersimpan”, “Belief awal”, “Menunggu outcome”, “Ronde resolved”. Hindari jargon chain di jalur utama, klaim kecerdasan umum, dan pesan kemenangan sebelum settlement. Konsistensi istilah Indonesia/Inggris perlu diputuskan pada content design; nama fase canonical boleh tetap berbahasa Inggris dengan bantuan ringkas.

**Data dan state wajib:** fixture valid di bagian 9; long name/argument; Squad penuh/tidak lengkap; pengguna belum punya afiliasi; tanpa Arena; outcome pending; void/no contest/forfeit; lift nol/negatif; retry; reconnect; reduced motion; dark/mobile. Tidak cukup membuat happy path saja.

**Tidak termasuk tahap ini:** redesign aturan kompetisi, ekonomi baru, token/wager, badge level baru, voting power reputasi, feed algoritmik kompleks, mini-game tambahan, ilustrasi mascot dominan, dan klaim produksi atas prototipe.

**Handoff berikutnya:** screen teranotasi, component/state inventory, prototype alur inti, motion specification, pemeriksaan contrast/focus/reflow, dan catatan hasil playtest. Tentukan token final setelah state lengkap terbaca, bukan dari hero saja.

Kaitan dengan positioning Track 03 mengikuti PRD: komunitas menjadi aktor, histori pertandingan menjadi identitas dan cerita yang dapat dibawa keluar, sedangkan Monad bekerja di belakang pengalaman. Desain harus menunjukkan apa yang dapat dimainkan dan diverifikasi. Riset ini tidak memverifikasi ulang rubric hackathon, membuktikan traction, atau menyelesaikan gap economic ownership yang sudah dicatat PRD.

## Lampiran A — pemeriksaan deliverable

Papan dibuka dan diperiksa melalui browser lokal pada 9 September 2026. Seluruh 30 kombinasi utama berhasil menampilkan heading dan konten, tanpa overflow horizontal pada viewport desktop pemeriksaan. Kelima halaman juga diperiksa pada viewport 390 px, tanpa overflow horizontal. Screenshot Landing, perbandingan Home dark, Reveal, dan Resolve mobile ditinjau untuk komposisi dan keterbacaan.

Kontrol palet, tema, halaman, perbandingan tiga arah, dan lebar mobile bekerja. Contoh Resolve aktivitas rendah/loading/error diperiksa. Storyboard Wisdom Lift negatif menampilkan −15 pp dan final score 51; saat reduced motion aktif, animasi nilainya dinonaktifkan. Tombol preview memberi feedback bahwa tidak ada tindakan akun/data nyata. Kontras enam palet dihitung seperti tabel bagian 7.4.

Pemeriksaan ini terbatas pada studi desain interaktif. Belum mencakup implementasi app produksi, alur autentikasi, contract, audit screen reader menyeluruh, atau playtest pengguna.

## Lampiran B — daftar sumber inti

Semua sumber diakses/diperiksa pada 9 September 2026; tahun publikasi disebutkan jika diketahui dan relevan. Tautan pada bagian audit menunjukkan permukaan yang diamati, bukan klaim bahwa seluruh produk telah diuji.

| Sumber | Peran dalam riset |
|---|---|
| [Discord](https://discord.com/) · [Profile customization](https://discord.com/blog/how-to-customize-your-discord-profile) | Landing aktual; identitas melalui dokumentasi |
| [FACEIT](https://www.faceit.com/en) · [What is a Club?](https://support.faceit.com/hc/en-us/articles/14996811385372-What-is-a-Club) | Landing aktual; struktur komunitas/party/kompetisi dari panduan |
| [Steam Community](https://steamcommunity.com/) | Struktur header, discovery, search, filter yang terlihat |
| [Reddit simplification, 2023](https://redditinc.com/news/new-features-aimed-at-making-reddit-easier-to-use-an-update-on-our-product-priorities-focused-on-simplification) | Referensi historis discover/join/contribute; live komunitas terblokir |
| [Strava](https://www.strava.com/) · [Challenges](https://support.strava.com/en-us/articles/15401916-strava-challenges) · [Trophy Case](https://support.strava.com/en-us/articles/15402068-the-strava-trophy-case) | Landing aktual, progres dan histori pencapaian dari dokumentasi |
| [Duolingo](https://www.duolingo.com/) · [Streak milestone animation](https://blog.duolingo.com/streak-milestone-design-animation/) | Landing aktual dan rationale celebration/share card |
| [Przybylski, Rigby & Ryan, 2010](https://selfdeterminationtheory.org/SDT/documents/2010_PrzybylskiRigbyRyan_ROGP.pdf) | Model motivasi video game berbasis kebutuhan psikologis |
| [Sailer et al., 2017](https://epub.ub.uni-muenchen.de/53202/) | Eksperimen elemen gamification dan need satisfaction; ringkasan institusional |
| [Kivetz, Urminsky & Zheng, 2006](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf) | Goal-gradient; generalisasi ke HIVE dinyatakan sebagai hipotesis |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Ambang kontras dan persyaratan aksesibilitas terkait |

Dokumen membedakan apa yang terlihat, apa yang dijelaskan sumber, dan apa yang direkomendasikan untuk HIVE. Keputusan berikutnya adalah menguji pemahaman serta ritme pertandingan dengan pengguna, sambil memakai papan ini sebagai baseline perbandingan yang konsisten.
