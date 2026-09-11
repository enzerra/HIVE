# Catatan implementasi frontend HIVE

Tanggal pemeriksaan: 10 September 2026.

## Keputusan utama

1. **Next.js + shadcn/ui + Tailwind CSS** mengikuti instruksi stack pengguna. Tidak memakai Vinext atau melakukan deployment otomatis.
2. Palet utama memakai porcelain/indigo dan pasangan dark graphite. Layout, hierarchy, serta PFP–crest–sigil dipertahankan lintas tema.
3. Demo memakai gateway server dalam proses Next.js. Fixture rahasia pertandingan tidak diimpor oleh komponen client. State pertandingan tidak ditentukan oleh tab browser.
4. Public replay memakai projection terpisah. Payload tidak berisi session ID, private receipt, pilihan individu, atau chat Squad.
5. Snapshot menggunakan polling satu detik. SSE dan reconnect stream replay menjadi pekerjaan adapter live, bukan klaim kapabilitas saat ini.
6. Afiliasi dan status belum lengkap tetap bisa dijelajahi. Hanya kursi demo Aster yang eligible untuk Founding match. Pembuatan Squad menyimpan nama dan afiliasinya, tanpa otomatis membuat roster kompetisi baru.
7. Tidak ada betting, token, wager, levels, quest, atau reward economy. Animasi singkat hanya memperkuat state yang sudah disahkan dan menghormati reduced motion.

## Perbedaan antara demo dan spesifikasi live

| Spesifikasi produk | Implementasi sekarang | Integrasi berikutnya |
|---|---|---|
| Google primary auth | Tombol dinonaktifkan dengan penjelasan; sesi demo terpisah | Provider OAuth, callback, recovery, session persistence |
| Human identity & eligibility | Status belum terverifikasi; enrollment demo terbatas | Proof-of-humanity/anti-sybil provider dan aturan eligibility server |
| Realtime community | Aktivitas ilustratif, chat lokal sesi, follow lokal sesi | Data komunitas persisten, presence aktual, multiuser channels |
| Match commitments | Accepted → submitted → locked disimulasikan | Commitment service, sponsored transaction, reorg/finality handling |
| Outcome | Angka sintetis server dan contoh historis berlabel | Source snapshots, observation windows, adjudication, oracle validity |
| Reputasi & influence | Definisi dan provisional/N/A yang jujur | Rolling window, valid attributed switches, quality calculations |
| Replay | Public projection sementara di memori | Penyimpanan durable, versioned presentation, moderated updates, OG metadata per hasil |
| Operator | Draft event dan hide/unhide laporan demo | Event orchestration, scoped administrator permissions, incident tooling |

## Validasi yang dilakukan

- Pengujian gateway memeriksa sesi HTTP-only, origin, role, roster lock, input, idempotency, timing, dan disclosure.
- Formula integer memproduksi contoh 55% → 70%, skor 91,00, Wisdom Lift +15 pp, serta perubahan skor +11,25.
- Tiga ronde dimainkan melalui browser dan menghasilkan total Purple 257,00, Chog 216,00.
- Tautan replay hasil permainan berhasil dibaca tanpa session cookie dan tidak mengandung pilihan privat atau chat.
- UI diperiksa pada desktop, mobile 390 px, dan layar sempit 320 px; pencarian kosong dan komunitas tanpa Arena aktif tetap memiliki tindakan berikutnya.
- Tampilan dark, menu akun, pengaturan, dan copy-link replay diperiksa. Perubahan scroll mengikuti panduan Next.js 16 yang dibundel di `node_modules/next/dist/docs/`.
- 24 test domain/gateway lolos. Refresh Landing dan Home dengan sesi aktif menghasilkan pemeriksaan console tanpa hydration error; hook sesi mempertahankan projection anonim selama hydration setiap boundary.

## Batas pengujian

Tidak ada klaim audit keamanan produksi, pengujian perangkat fisik, validasi sybil, pengujian transaksi Monad, atau uji multiuser nyata. Data demo bersifat sementara. Sebelum deployment live, gateway harus diganti atau dihubungkan ke layanan yang memenuhi kontrak produk dan diuji kembali end-to-end.
