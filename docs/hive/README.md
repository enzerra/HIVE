# HIVE — Frontend Build Guide

**Versi:** 1.0 · **Tanggal:** 9 September 2026 · **Bahasa:** Indonesia  
**Deliverable:** paket spesifikasi sebelum implementasi frontend. Belum ada aplikasi produksi yang dibangun dalam paket ini.

Paket ini menerjemahkan konsep produk dan riset desain HIVE menjadi panduan yang dapat dipakai designer, frontend engineer, backend engineer, QA, dan coding agent. Target build pertama adalah frontend lengkap dengan data demo yang deterministik, lalu integrasi layanan nyata melalui batas yang sudah ditetapkan.

## Mulai dari sini

1. Baca [PRD](PRD.md) untuk scope dan aturan yang tidak boleh berubah.
2. Baca [Design](DESIGN.md), [Routes & Screens](ROUTES_AND_SCREENS.md), dan [Components](COMPONENTS.md) untuk membentuk antarmuka.
3. Baca [Architecture](ARCHITECTURE.md), [Data Contracts](DATA_CONTRACTS.md), [Match State Machine](MATCH_STATE_MACHINE.md), dan [Auth/Security/Web3](AUTH_SECURITY_WEB3.md) sebelum menulis state atau integrasi.
4. Gunakan [Fixtures & Scenarios](FIXTURES_AND_SCENARIOS.md) untuk demo dan pengujian yang konsisten.
5. Ikuti [Implementation Plan](IMPLEMENTATION_PLAN.md), lalu periksa [Testing & Acceptance](TESTING_AND_ACCEPTANCE.md).

## Peta dokumen

| File | Pertanyaan yang dijawab |
|---|---|
| [PRD.md](PRD.md) | Apa yang dibangun, untuk siapa, dan apa arti selesai? |
| [DESIGN.md](DESIGN.md) | Bagaimana warna, typography, layout, density, dan identitas diterapkan? |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Bagaimana kode, rendering, state, data, dan adapter dipisahkan? |
| [ROUTES_AND_SCREENS.md](ROUTES_AND_SCREENS.md) | URL apa saja, siapa boleh membuka, isi dan tindakan tiap halaman? |
| [COMPONENTS.md](COMPONENTS.md) | Komponen apa yang reusable, dengan props dan state apa? |
| [MATCH_STATE_MACHINE.md](MATCH_STATE_MACHINE.md) | Kapan pilihan bisa dikirim, data bisa dibuka, dan hasil sah? |
| [DATA_CONTRACTS.md](DATA_CONTRACTS.md) | Bentuk DTO, endpoint, event, error, dan aturan cache? |
| [FIXTURES_AND_SCENARIOS.md](FIXTURES_AND_SCENARIOS.md) | Data mana yang dipakai bersama dan hasil mana yang benar? |
| [CONTENT_AND_ASSETS.md](CONTENT_AND_ASSETS.md) | Copy, format angka, validasi input, gambar, serta asset yang diperlukan? |
| [ACCESSIBILITY_AND_MOTION.md](ACCESSIBILITY_AND_MOTION.md) | Bagaimana keyboard, screen reader, reduced motion, dan sound bekerja? |
| [AUTH_SECURITY_WEB3.md](AUTH_SECURITY_WEB3.md) | Batas Google auth, eligibility, session, privasi, dan integrasi Monad? |
| [TESTING_AND_ACCEPTANCE.md](TESTING_AND_ACCEPTANCE.md) | Skenario wajib, expected result, dan bukti yang diperlukan? |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Urutan build, scripts, environment, release, dan definition of done? |
| [DECISIONS_AND_DEPENDENCIES.md](DECISIONS_AND_DEPENDENCIES.md) | Keputusan baru, konflik yang diselesaikan, dan dependency produksi? |
| [BUILD_PROMPT.md](BUILD_PROMPT.md) | Brief siap pakai untuk memulai implementasi berikutnya? |
| [TRACEABILITY.md](TRACEABILITY.md) | Di mana setiap kebutuhan dijelaskan dan bagaimana diverifikasi? |
| [DOCUMENTATION_VERIFICATION.md](DOCUMENTATION_VERIFICATION.md) | Apa yang sudah diperiksa pada paket panduan ini? |

## Sumber dan precedence

- [PRD konsep lengkap](references/HIVE_Final_Product_PRD_Concept_Operating_Model_MVP_v1.0_ID.md): sumber aturan produk/kompetisi.
- [Riset desain](references/HIVE_Design_Research_Social_Community_Gamification_ID.md): rationale, audit referensi, dan tiga eksplorasi warna.
- [Papan visual](references/HIVE_Design_Comparison_Board.html): contoh 30 kombinasi. Ini referensi komposisi, bukan aplikasi yang perlu disalin persis.

Instruksi pengguna terbaru mendahului semua dokumen. Aturan kompetisi tetap mengikuti PRD konsep. Paket ini menentukan implementasi frontend yang sebelumnya belum dirinci. Perbedaan tampilan dan istilah dicatat eksplisit dalam Decisions; jangan menyelesaikan konflik dengan mengubah scoring, privacy, atau deadline secara diam-diam.

**Baseline desain build:** A — Porcelain + indigo, light/dark setara. Pilihan ini mengikuti rekomendasi riset yang diteruskan pengguna. B dan C tetap sebagai arsip eksplorasi, bukan tiga theme brand yang harus dikirim ke pengguna.

## Dua arti selesai yang berbeda

**Frontend demo selesai** bila seluruh route inti, interaksi, state, fixture, responsive, accessibility dasar, dan pengujian berjalan melalui mock gateway; seluruh data simulasi berlabel. Tidak cukup hanya Landing atau gambar screen.

**Frontend terintegrasi siap live** menambahkan auth nyata, provider account/session, contract/ABI, data gateway, otorisasi server, finality policy, resolver, serta pengujian integrasi. Dependency ini dicatat, bukan dianggap sudah tersedia. Mock mode tidak otomatis berubah menjadi live saat credential hilang.

Dokumen ini lengkap untuk memulai pekerjaan frontend tanpa mengarang aturan produk. Keputusan provider dan kesiapan layanan eksternal memiliki gate tersendiri. Tidak diperlukan build backend atau deployment agar paket panduan ini dinyatakan selesai.

## Pemakaian dalam repository nanti

Tempatkan isi paket di `docs/hive/`. Gunakan nama file dan link relatif yang sama. Kode aplikasi baru mengikuti struktur Architecture; jangan meletakkan file runtime di folder referensi. Simpan keputusan perubahan di Decisions dan update Traceability serta test terkait dalam perubahan yang sama.

Tidak ada secrets, API key, atau wallet material di paket. ZIP pendamping berisi salinan dokumen dan referensi agar seluruh panduan dapat dipindahkan bersama.
