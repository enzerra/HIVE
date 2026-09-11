# Fixtures & Scenarios

Semua fixture adalah ilustrasi untuk build/test, bukan traction, presence nyata, data Steam live, atau kontrak deployed. Mock engine server-only mengungkap projection sesuai fase; public bundle tidak memuat world/ground truth penuh.

## 1. Seed identitas

Season `season-founding-01`; mode default `demo`; format `community_5_squads`; match `match-demo-001`; Hive `hive-purple`/slug `purple`, dan `hive-chog`/slug `chog`. Tiap Hive mempunyai lima Squad × empat Human pada fixture utama.

| Hive | Squad IDs/nama | Urutan roster |
|---|---|---|
| Purple | `sq-p-aster` Aster; `sq-p-orbit` Orbit; `sq-p-moss` Moss; `sq-p-echo` Echo; `sq-p-nova` Nova | p01–p04; p05–p08; p09–p12; p13–p16; p17–p20 |
| Chog | `sq-c-kite` Kite; `sq-c-rune` Rune; `sq-c-drift` Drift; `sq-c-vale` Vale; `sq-c-flux` Flux | c01–c04; c05–c08; c09–c12; c13–c16; c17–c20 |

Main viewer p01=Nara, p02=Raka, p03=Mika, p04=Juno. Representative p02; organizer p01; role kedua ini tidak memberi suara tambahan. Sisanya handle deterministik `PlayerP05`… dan `PlayerC01`… atau nama orisinal, tanpa identitas orang nyata. Each ID unik; frozen affiliation mengikat match.

Nama Squad pada riset merupakan alias presentasi fixture PRD (Alpha Wolves→Aster, Chaos Labs→Orbit, Quant Boys→Moss, Apex→Echo, Signal House→Nova). Vektor dan aturan sama; alias bukan perubahan histori produksi. Jangan campur nama alias dalam satu Replay.

## 2. F-POSITIVE — ronde 1 canonical dengan positive lift

Question `q-demo-cs2-dota2`: A Counter-Strike 2 app ID 730; B Dota 2 app ID 570. Penggunaan app ID nyata tidak berarti snapshot fixture berasal dari Steam live. Label wajib Historical/demo.

Untuk tiap Squad, beri A pada `aCount` anggota pertama sesuai urutan; sisanya B. Ini membuat roster individual dan aggregate dapat dihitung ulang.

| Squad | Initial A/4 | Final A/4 | Initial %A | Final %A |
|---|---:|---:|---:|---:|
| Aster | 3 | 4 | 75 | 100 |
| Orbit | 1 | 2 | 25 | 50 |
| Moss | 4 | 4 | 100 | 100 |
| Echo | 1 | 2 | 25 | 50 |
| Nova | 2 | 2 | 50 | 50 |
| Purple mean | | | **55** | **70** |
| Chog counts (Kite/Rune/Drift/Vale/Flux) | 3/2/3/2/2 | 3/2/3/2/2 | **60 mean** | **60 mean** |

Outcome A. Purple initial score 79,75; final 91; Wisdom Lift +15 pp; Council Score Lift +11,25. Chog final score 84; lift 0. Purple unggul ronde, match belum selesai.

Snapshot numerik demo yang menghasilkan A: A start 100.000/end 110.000 (+10%); B start 80.000/end 84.000 (+5%). Angka hanya muncul sebagai outcome evidence sesudah barrier/jendela simulasi selesai. Context snapshot terpisah dari scoring snapshot.

Argument Aster: “Momentum terakhir mendukung A, tetapi kita perlu melihat pertumbuhan relatif, bukan hanya jumlah pemain awal.” Card Orbit/Echo berbeda dan singkat. Jangan memasukkan nama rank/influence ke argument DTO. p06 dan p14 Switch B→A dengan attribution ke Aster; p04 Switch B→A karena own_reconsideration. Hasil: dua helpful attributed switches, target dua Squad; tidak mengklaim seluruh anggota Orbit/Echo dipengaruhi. Graph Aster→Orbit dan Aster→Echo, tanpa rantai palsu.

## 3. Tiga ronde utuh

| Ronde | Purple initial counts → final counts | Chog initial → final | Outcome | Final score Purple / Chog | Purple Wisdom Lift |
|---|---|---|---|---|---|
| 1 | [3,1,4,1,2] → [4,2,4,2,2] | [3,2,3,2,2] → sama | A | 91 / 84 | +15 pp |
| 2 | [2,2,2,2,2] → sama | [3,3,3,3,4] → sama | B | 75 / 36 | 0 pp |
| 3 | [2,2,2,2,2] → [1,1,2,1,1] | [1,1,1,1,0] → sama | B | 91 / 96 | +20 pp |
| Match | | | 3 valid | **257 / 216** | Tidak dijumlah sebagai headline tanpa definisi |

Total micro-points 257000000 / 216000000. Semua round outcomes selesai → Purple W/Chog L. Sebelum itu hanya subtotal berlabel pending. Angka 2 ronde unggul tidak dipakai untuk menentukan winner.

Waktu seed `T0=2026-09-09T12:00:00Z` (19:00 WIB); relative virtual clock dipakai agar demo tidak kedaluwarsa di hari berikut. Ronde 2 dimulai T0+190s; ronde 3 T0+380s. End finalizing masing-masing T0+190/+380/+570. Baseline observation 1800s setelah finalization yang valid dalam fixture; hasil tidak dimajukan hanya karena user klik Next. Fast demo controller menggeser **virtual server time**, berlabel, bukan memberi client hak menentukan fase.

## 4. Alternate result vectors

| ID | Input | Expected |
|---|---|---|
| F-NEGATIVE | Round1 sama, outcome B (misal A +2%, B +5%) | Purple score 51, initial69,75, lift −15 pp, score lift −18,75; Chog64 |
| F-DRAW | Kedua Hive tiap ronde mean50%; outcomes A/B/A | Masing-masing75 per ronde; total 225; D bila3 valid |
| F-ROUND-COUNT | R1 P70%C60%A→91/84; R2 sama; R3 P10%C90%A→19/99 | Purple unggul2 ronde tetapi total 201<267, Chog menang |
| F-VOID | A dan B sama-sama +5% | Ronde void; score/lift N/A, tidak0 |
| F-TWO-VALID | R1 normal, R2 void, R3 normal | 2 valid; totals182/180; Purple W |
| F-NO-CONTEST | Hanya R1 valid, R2/R3 void | No contest; tidak W/L/D ranked |
| F-FORFEIT | p20 missing initial reveal pada R1 outcome valid | Purple0; full aggregate/lift N/A; Chog84; denominator tidak mengecil |
| F-DEFAULT | p04 tanpa final commitment pada R1, lainnya sama | Aster tetap75%, Purple final65%, score 87,75, lift+10 pp; p04 defaulted Stay |
| F-FINAL-FAIL | p04 final commitment ada tetapi reveal gagal | Purple forfeit0; tidak memakai F-DEFAULT |
| F-ARGUMENT-FAIL | Aster argument hash mismatch, calls lengkap | Card unavailable; score 91 tetap; incompleteCouncil true; attribution ke card invalid ditolak |
| F-EQUAL-WEIGHT | Alpha3 orang semuaA, Beta5 orang semuaB, Gamma4orang2A | Hive50%=mean100/0/50; bukan5/12=41,67% |
| F-THIRDS | Tiga Squad masing-masing A/size=1/3,1/4,1/5 | p floor333333,250000,200000; Hive261111; score(A)45404304 micro sesuai reference |

F-THIRDS adalah vector presisi yang harus diverifikasi generator, bukan angka UI yang dibulatkan lalu dimasukkan kembali. Bila reference backend berbeda, blok live dan selesaikan versioned contract; jangan mengubah UI fixture agar tes hijau.

## 5. Scenario catalog minimum

| ID | Pengaturan awal | Jalur/expected yang diuji |
|---|---|---|
| S01 public-new | Guest, tidak ada aktivitas | Landing/Explore edukatif, tanpa fake counts |
| S02 invite-happy | Guest valid invite Aster | Auth demo → identity → Squad/Hive confirm → Home |
| S03 invite-full | pendaftaran bersamaan memenuhi kapasitas | 409 full; identity tetap; cari Squad lain |
| S04 forming | Human + Squad 2 orang | Home invite; ranked locked dengan alasan |
| S05 explore-first | Identity lengkap, afiliasi deferred | Home browse; membership CTA, bukan fake roster |
| S06 eligibility-expired | Member roster tetapi expiry | Lobby menolak readiness ranked; advanced flow |
| S07 roster-ready | Normal seed 4/4 | Ready feedback; belum start sebelum authoritative lock |
| S08 match-happy | Normal seed, clock deterministic | Tujuhfase,3 ronde, F-POSITIVE result |
| S09 receipt-unknown | Network putus setelah server menerima | Receipt reconcile; no duplicate choice |
| S10 stale-event | v10 datang setelah v11 | v11 tetap; no phase regression |
| S11 phase-boundary | t=deadline−1 ms lalu t=deadline | Sebelum dapat request; tepat batas ditolak/disabled |
| S12 reconnect | Accepted commit, tab reload saat Council | Own receipt dipulihkan, phase aktual, no reset |
| S13 multi-tab | Actor sama submit dua intent berbeda | Satu canonical commit; tab kedua conflict/reconcile |
| S14 negative | F-NEGATIVE | No confetti; minus dan penjelasan |
| S15 outcomes | F-DRAW/F-VOID/F-NO-CONTEST/F-FORFEIT | Label dan numeric semantics benar |
| S16 no-final vs failed-final | F-DEFAULT/F-FINAL-FAIL | Perbedaan penting tidak hilang |
| S17 privacy | Participant/rival/spectator pada tiap fase | DTO/HTML/cache tidak memuat hidden data |
| S18 argument-moderated | Card hidden dengan reason | Placeholder, score tidak otomatis berubah |
| S19 auth-expired | Session expired during match | Safe login return, receipt tidak hilang |
| S20 empty-stale-error | Empty feed, expired presence,503 | Tiga state berbeda dan recovery |
| S21 accessible | keyboard/mobile/dark/reduced motion | Action/focus/reading utuh |
| S22 share | Published/unpublished/pending Replay | Share public only; cancel normal; no auto-post |
| S23 operator | Authorized/unauthorized/pre/postlock | Reject winner override dan edit frozen rules |
| S24 correction | Settled raw result + disputed record | Raw vs adjudicated terlihat; no repeated celebration |
| S25 long-content | Handle 24 karakter, nama 48, argumen 240 code points | Wrap, no overflow, no truncation alasan kritis |

## 6. Harness behavior

Fixture reset menghasilkan IDs/output sama. Scenario control hanya development/test atau demo deployment yang sengaja diaktifkan server; tidak ada query parameter untuk melewati live authorization. Simulated participants/controller selalu berlabel. Seed berada server-only; random delay hanya bila seed deterministik atau scenario menyatakan latency. Freeze browser clock saja tidak cukup: mock gateway memiliki clock authority yang sama untuk endpoints/events.

Generator harus memvalidasi membership unik, roster size, seats sama, counts≤roster, card limits, attribution valid, score/round/match totals, unit precision, serta visibility per fase. Component tests tidak boleh membuat angka baru yang bertentangan dengan fixture utama.
