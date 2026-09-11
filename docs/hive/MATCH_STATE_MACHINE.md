# Match State Machine

Dokumen ini adalah kontrak perilaku paling kritis. UI merender state canonical dan mengirim intent; UI tidak menentukan hasil, deadline, atau membuka data. Semua event/response memiliki version dan scope yang diverifikasi.

## 1. Tiga state yang berbeda

`MatchLifecycle`: draft → scheduled → registering → lobby → locked → running → awaiting_outcomes → settled; cabang cancelled sebelum lock, disputed/no_contest melalui incident/adjudication.

`RoundPhase`: think → deliberate → commit → reveal → council → revision → resolve.

`ResolveStatus`: finalizing → awaiting_outcome → resolved | void. `MatchSettlement` dan per-Hive forfeit berbeda dari RoundPhase. Match dapat menjalankan ronde 2 sementara ronde 1 awaiting outcome. Hasil ronde yang selesai tidak menimpa current interactive round.

## 2. Timeline baseline

| Offset dari awal ronde | Fase | Kontrol utama |
|---|---|---|
| [0,20) s | Think | Draft A/B, baca evidence |
| [20,80) s | Deliberate | Draft choice, chat Squad, representative draft argument |
| [80,95) s | Commit | Lock A/B; argument frozen + commit transport |
| [95,105) s | Reveal | Read aggregate initial batch; tidak ada mutation choice |
| [105,165) s | Council | Baca card, chat Squad; draft final belum dikomit |
| [165,185) s | Revision | Stay/Switch + attribution; final commitment |
| [185,190) s kandidat | Resolve/finalizing | Read-only; menunggu valid final reveal |
| setelah finalization | Resolve/awaiting_outcome | Final belief, jadwal hasil; lanjut ronde berikut sesuai scheduler |

Semua waktu di atas berasal config match terkunci. Finalization dapat perlu buffer berbeda yang disetujui sebelum pertandingan. Pada `now >= deadline` fase lama ditutup; `start <= now < deadline` adalah jendela valid. Countdown mencapai nol berarti kontrol lama nonaktif, bukan izin untuk fallback local completion.

## 3. Visibility matrix

| Data | Think | Deliberate | Commit | Reveal | Council | Revision | Resolve sebelum outcome |
|---|---|---|---|---|---|---|---|
| Own draft/call | Owner | Owner | Owner + receipt | Owner | Owner | Owner initial/final draft | Owner history |
| Other personal calls UI | Tidak | Tidak | Tidak | Tidak; aggregate saja | Tidak | Tidak | Tidak otomatis publik |
| Initial aggregate | Tidak | Tidak | Tidak | Bila batch valid | Frozen | Frozen | Available bila valid |
| Final aggregate | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Hanya sesudah barrier dan batch valid |
| Chat posting | Tidak | Own Squad | Tidak | Tidak | Own Squad | Tidak | Tidak |
| Argument text | Tidak | Own Squad draft | Own Squad frozen | Menunggu Council UI | Own Hive cards valid | Read-only | Published Replay projection |
| Reputation/influence UI | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Sekunder bila relevan/sah |
| Score/Wisdom Lift | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak sampai outcome sah |

Data hidden **tidak dikirim** dalam API/HTML/RSC/cache public/member projection. CSS blur, `display:none`, disabled chart, atau tooltip tersembunyi bukan perlindungan. Public chain dapat membuat individual reveals dapat diperiksa sesudah waktunya; jangan menjanjikan privasi permanen.

## 4. Decision receipt state machine

```text
idle → selected → preparing → submitting
                               ├─ transport_unknown → reconcile receipt
                               ├─ rejected → selected/retry hanya jika sah
                               └─ service_accepted → chain_submitted
                                                        ├─ failed
                                                        └─ canonical_locked
```

`service_accepted` berarti request tercatat layanan, bukan finalitas chain. Copy “Diterima layanan, sedang diproses”. `canonical_locked` hanya setelah authority/finality policy menyatakan commitment sah. Copy “Call terkunci”. Data Contracts memakai enum yang sama. Mock harus memodelkan perbedaan ini; jangan langsung menjadikan semua click locked.

Setiap intent mendapatkan idempotency key sekali. Payload mencakup actor/round/stage/rules/phase version. Unknown transport: query receipt by key; jika sudah accepted, ikuti statusnya. Jika belum ada dan masih dalam jendela, kirim ulang payload **identik**, bukan pilihan baru. Server menolak key sama dengan payload berbeda.

Setelah preparing/submitting, draft tidak bisa berubah sambil request lama masih mungkin diterima. Explicit rejection aman dapat membuka pilihan lagi bila belum ada canonical commitment dan deadline belum lewat. Retry chain failure mengikuti provider policy dengan intent yang sama, bukan transaksi kedua yang mengubah choice. Default client retry mutation = off sampai reconciliation eksplisit.

## 5. Argument freeze

Representative menulis plain text; canonicalize sesuai encoding version di Data Contracts. Editor membeku pada akhir Deliberate. Pada Commit, provider/gateway mengirim salted argument commitment sebelum deadline. Owner Squad dapat melihat frozen text, tidak mengedit. Hash mismatch/missing text menghasilkan card unavailable, bukan AI fallback. Tidak ada post-Reveal rewrite.

Jika frozen text belum berhasil disimpan, tampilkan failure dan receipt status; service tidak boleh diam-diam mengomit card lalu mengklaim complete Council. Client menghitung counter untuk UX; server memvalidasi canonical text yang sama.

## 6. Revision

Pilihan Stay mempertahankan initial call; Switch membalik A/B dan meminta attribution kind. Jika `other_squad_argument`, wajib card valid milik Squad lain di Hive sendiri pada ronde sama. Source lain: internal_discussion/new_evidence/own_reconsideration/undisclosed; cardId null.

Hanya satu final decision sah per participant/round. Tidak ada final commitment sampai deadline = defaulted Stay; tampilkan berbeda dari explicit Stay. Ada final commitment tetapi failed reveal = forfeit; tidak boleh kembali ke initial setelah melihat final orang lain. Nilai final dan attribution tidak dipublikasikan selama masih ada hak revisi.

## 7. Failure matrix

| Kondisi | Domain result | UI |
|---|---|---|
| Missing initial commit/reveal pada satu anggota | Hive terkait forfeit ronde | Skor kompetitif 0; initial/final lengkap dan lift N/A sesuai validity |
| Tidak ada final commitment | Defaulted Stay | Initial berlaku; reliability mencatat defaulted, bukan explicit |
| Final commitment ada, reveal invalid/missing | Hive terkait forfeit | Jangan fallback Stay |
| Kedua Hive forfeit, outcome valid | Keduanya skor 0 | Reason dan valid outcome count tetap dari service |
| Argument missing/mismatch/hidden | Incomplete/unavailable Council | Placeholder alasan; skor pilihan dapat tetap valid |
| Source outcome TIE/invalid/timeout | Ronde void kedua pihak | N/A score/lift; tidak masuk total |
| Kurang dari 2 outcome valid dari 3 ronde | Match no contest | Tidak memberi W/L/D ranked |
| Total canonical sama dan syarat valid terpenuhi | Match draw | D; tidak disamakan void |
| Incident platform luas | Disputed/adjudication mungkin no contest | Tampilkan raw record dan keputusan resmi terpisah |

Jangan menyimpulkan failure hanya dari timeout browser. Service snapshot authoritative memutuskan missing/forfeit. Sistem tidak mengecilkan denominator atau mengisi missing vote dengan A/B/50%.

## 8. Reconnect, events, dan multi-tab

Saat tab dibuka/reconnect: disable submit sementara → fetch session + snapshot + own receipts → validate → sync clock → pilih current round/phase → enable hanya allowed actions. Draft boleh hilang; accepted intent tidak hilang. Late join non-roster diarahkan Watch.

Event version lebih kecil/sama dibuang. Gap sequence/ref tidak cocok memicu refetch. Event bukan kesempatan mengubah snapshot secara parsial hingga membocorkan final. Event phase baru memicu snapshot baru yang sudah projected. Data dari request phase lama tidak menimpa phase baru walaupun datang terlambat.

Multi-tab: tab lain membaca accepted receipt untuk participant sama; duplicate submit ditangani idempotency/uniqueness server. Local BroadcastChannel opsional hanya membawa invalidation ID, tidak choice/salt. Session logout membatalkan stream dan menghapus private state. Reorg/finality regression memakai correction event dan sync state; jangan menyatakan ulang success dari cache lama.

## 9. Exit dan next round

Exit tidak mengirim draft, tidak membatalkan accepted commitment, dan tidak memaksa semua orang menekan Continue. Informasikan konsekuensi deadline bila masih ada aksi required. Ronde selanjutnya diambil dari scheduler; user dapat kembali ke Home ketika seluruh interaksi selesai dan outcome masih menunggu. Notification hasil hanya muncul sesudah status valid tersedia.

Motion dipicu dari transisi sah sekali per event ID. Reload tidak memutar ulang kemenangan; reduced-motion tetap memperlihatkan status. Semua tes boundary dan leak dijelaskan di [Testing](TESTING_AND_ACCEPTANCE.md).
