# Panduan Penyusunan Dokumen Eksekusi Lengkap

Panduan ini mendefinisikan prinsip, teknik ekstraksi data, dan standar penulisan untuk mengonsolidasikan laporan multi-tahap menjadi satu dokumen eksekusi yang kohesif.

---

## 1. Prinsip Utama Konsolidasi

1. **Satu Sumber Kebenaran (Single Source of Truth)**:
   Laporan tahapan seringkali tersebar di pesan obrolan, artefak parsial (`walkthrough.md`), log konsol, atau catatan sementara. Dokumen Eksekusi Lengkap bertindak sebagai arsip final yang mencakup seluruh konteks tanpa mengharuskan reviewer membaca ulang riwayat pengerjaan dari awal.

2. **Fokus pada Dampak & Bukti Nyata**:
   Hindari narasi spekulatif atau rencana yang belum dieksekusi. Setiap poin dalam dokumen harus didukung oleh kode nyata di repository atau log verifikasi yang telah berjalan.

3. **Struktur yang Mudah Dipindai (Scannable)**:
   Gunakan tabel untuk tahapan, daftar berkas, dan log pengujian. Pengambil keputusan atau rekan tim pengembang harus dapat memahami apa yang berubah dalam waktu kurang dari 2 menit.

---

## 2. Cara Mengumpulkan Data dari Tiap Tahapan

Saat menyusun laporan gabungan, periksa sumber data berikut secara berurutan:

1. **Rencana Implementasi (`implementation_plan.md`)**:
    - Ambil konteks latar belakang dan arsitektur awal.
    - Bandingkan rencana awal dengan apa yang akhirnya benar-benar diimplementasikan.

2. **Walkthrough Tiap Sesi (`walkthrough.md`)**:
    - Catat rincian perubahan yang telah diselesaikan di sesi-sesi sebelumnya.

3. **Status Git & Commit Log**:

    ```bash
    git status --short
    git diff --stat
    ```
    - Gunakan data ini untuk mengisi _File Changes Manifest_. Pastikan path file presisi dan memiliki link markdown `[File](file:///path)`.

4. **Log Pengujian & Build**:
    - Jalankan atau periksa hasil pengujian (misal `php artisan test`, `npm run test`, atau `vendor/bin/pint`).
    - Salin ringkasan output pengujian (jumlah assertions, pass/fail) ke dalam matriks verifikasi.

---

## 3. Checklist Kualitas Dokumen Sebelum Diserahkan

Pastikan dokumen eksekusi memenuhi kriteria berikut:

- [ ] Seluruh tahapan pengerjaan terdokumentasi secara berurutan.
- [ ] Komponen teknis (Backend, Frontend, Database, Route) diuraikan secara ringkas namun jelas.
- [ ] Seluruh file baru (`[NEW]`), modifikasi (`[MODIFY]`), dan penghapusan (`[DELETE]`) tercatat lengkap dengan tautan yang dapat diklik.
- [ ] Hasil pengujian otomatis (automated test) atau verifikasi manual dicantumkan sebagai bukti keberhasilan.
- [ ] Kendala teknis yang sempat terjadi beserta penyelesaiannya dicatat agar menjadi referensi troubleshooting di masa depan.
- [ ] Terdapat panduan operasional / post-deployment yang jelas bagi tim lain (misal migrasi database atau build frontend).
