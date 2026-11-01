# Rencana Migrasi Database MySQL ke PostgreSQL di Production

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memindahkan seluruh data operasional aplikasi Kasir dari database MySQL/MariaDB ke PostgreSQL di environment production secara aman, terverifikasi, dan zero-data-loss.

**Architecture:** Menggunakan dual-connection Laravel (`DB::connection('mysql')` sebagai sumber data aktif dan `DB::connection('pgsql')` sebagai target migrasi) melalui Artisan command `php artisan db:migrate-to-pgsql`, dengan isolasi constraints `session_replication_role`, auto-casting boolean, dan penyesuaian otomatis PostgreSQL serial sequences.

**Tech Stack:** Laravel 12, PHP 8.4, PostgreSQL 16/17/18, MySQL / MariaDB, Docker / Easypanel.

**Spec:** Dokumen operasional panduan migrasi production.

## Global Constraints

- Database lama (MySQL) tidak boleh di-drop atau dimodifikasi selama proses migrasi untuk menjamin rollback aman.
- Proses pemindahan data wajib dilakukan saat aplikasi dalam Maintenance Mode (`php artisan down`) agar tidak ada transaksi baru yang tertinggal (zero data gap).
- Seluruh sequence PostgreSQL wajib di-sinkronisasi sebelum aplikasi dibuka kembali untuk mencegah duplicate key exception saat insert baru.
- Push & deploy ke production hanya dilakukan sesuai otorisasi eksplisit pengguna.

## Review Focus

1. **Foreign Key Order Deadlocks**: Dinonaktifkan sementara via `session_replication_role = 'replica'` di PostgreSQL selama proses transfer.
2. **PostgreSQL ID Sequence De-sync**: Seluruh serial sequence (`setval`) diatur ke `MAX(id)` masing-masing tabel setelah transfer selesai.
3. **Boolean Column Type Mismatch**: Nilai `tinyint(1)` (1/0) dari MySQL dicast secara otomatis menjadi boolean (`true/false`) sebelum di-insert ke PostgreSQL.
4. **Connection Caching**: `php artisan config:cache` wajib dijalankan setiap kali terjadi perubahan `.env` di production agar Laravel membaca driver baru.
5. **Rollback Availability**: Jika terjadi error pada PostgreSQL, aplikasi dapat kembali ke MySQL dalam < 1 menit cukup dengan mengubah `DB_CONNECTION=mysql` dan `php artisan up`.

---

### Task 1: Persiapan & Sinkronisasi Kode ke Production

**Files:**

- Modify: `config/database.php` (sudah di-commit di lokal)
- Create: `app/Console/Commands/MigrateMysqlToPgsqlCommand.php` (sudah di-commit di lokal)

**Interfaces:**

- Produces: Artisan command `php artisan db:migrate-to-pgsql` tersedia di server production.

- [ ] **Step 1: Push commit lokal terbaru ke repository remote**
    - Jalankan `git push origin main` setelah diinstruksikan oleh pengguna.
- [ ] **Step 2: Deploy / Pull kode terbaru ke server production**
    - Trigger deploy di panel hosting (Easypanel / Git Webhook) atau jalankan `git pull` di container production.
    - Pastikan container berhasil me-restart dan kode baru telah aktif.
- [ ] **Step 3: Verifikasi command di server production**
    - Jalankan di terminal production:
        ```bash
        php artisan list db
        ```
    - Pastikan `db:migrate-to-pgsql` muncul dalam daftar command.

---

### Task 2: Konfigurasi Environment (ENV) di Production

**Files:**

- Modify: Environment variables di server production (panel hosting / `.env`)

**Interfaces:**

- Consumes: Kredensial PostgreSQL production dan kredensial MySQL production yang masih aktif.
- Produces: Dual-connection yang berfungsi simultan di production.

- [ ] **Step 1: Pastikan database PostgreSQL production telah dibuat**
    - Database name: `kasir` (atau sesuai konfigurasi di server).
    - User & Password PostgreSQL memiliki akses penuh (CREATE TABLE, SELECT, INSERT, UPDATE, DELETE, TRUNCATE).
- [ ] **Step 2: Konfigurasikan variabel environment di production**
    - Pertahankan koneksi utama MySQL:
        ```dotenv
        DB_CONNECTION=mysql
        DB_HOST=mysql_host_production
        DB_PORT=3306
        DB_DATABASE=kasir
        DB_USERNAME=user_mysql
        DB_PASSWORD=password_mysql
        ```
    - Tambahkan parameter PostgreSQL untuk koneksi migrasi:
        ```dotenv
        PGSQL_HOST=postgres_host_production
        PGSQL_PORT=5432
        PGSQL_DATABASE=kasir
        PGSQL_USERNAME=postgres_user
        PGSQL_PASSWORD=postgres_password
        ```
- [ ] **Step 3: Refresh cache konfigurasi di production**
    - Jalankan:
        ```bash
        php artisan config:cache
        ```
- [ ] **Step 4: Tes koneksi ke kedua database dari terminal production**
    - Jalankan:
        ```bash
        php artisan tinker --execute "echo 'MySQL: ' . DB::connection('mysql')->getDatabaseName() . ' | PgSQL: ' . DB::connection('pgsql')->getDatabaseName() . PHP_EOL;"
        ```
    - Expected: Output menampilkan kedua database tanpa error koneksi.

---

### Task 3: Eksekusi Migrasi & Transfer Data (Maintenance Window)

**Files:**

- Database PostgreSQL (Target)
- Database MySQL (Sumber / Read-only)

**Interfaces:**

- Consumes: Data MySQL live production.
- Produces: Database PostgreSQL dengan struktur dan data yang 100% identik.

- [ ] **Step 1: Aktifkan Maintenance Mode**
    - Tampilkan pesan pemberitahuan pemeliharaan kepada pengguna toko:
        ```bash
        php artisan down --secret="migrasi-kasir-2026" --render="errors::503"
        ```
- [ ] **Step 2: Jalankan proses migrasi dan transfer data**
    - Eksekusi command migrasi dengan opsi `--fresh`:
        ```bash
        php artisan db:migrate-to-pgsql --fresh
        ```
    - _Catatan: Opsi `--fresh` akan membuat ulang seluruh tabel PostgreSQL dari skema migrasi Laravel resmi, menonaktifkan trigger/FK, mentransfer data per 500 baris, mengaktifkan kembali FK, dan menyinkronkan serial sequences._
- [ ] **Step 3: Periksa tabel ringkasan hasil transfer**
    - Pastikan output menampilkan seluruh tabel dengan status `Sukses` atau `Kosong`.
    - Pastikan tidak ada tabel dengan status `Beda Jumlah!`.

---

### Task 4: Switchover Koneksi Utama & Validasi Aplikasi

**Files:**

- Modify: Environment variables di server production (`DB_CONNECTION`)

**Interfaces:**

- Consumes: PostgreSQL yang sudah terisi data lengkap.
- Produces: Aplikasi production live berjalan penuh di atas PostgreSQL.

- [ ] **Step 1: Ubah koneksi utama di production env menjadi PostgreSQL**
    - Ubah parameter database utama:
        ```dotenv
        DB_CONNECTION=pgsql
        DB_HOST=postgres_host_production
        DB_PORT=5432
        DB_DATABASE=kasir
        DB_USERNAME=postgres_user
        DB_PASSWORD=postgres_password
        ```
- [ ] **Step 2: Bersihkan dan perbarui seluruh cache Laravel**
    - Jalankan di terminal production:
        ```bash
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        ```
- [ ] **Step 3: Uji fungsi database dari Tinker**
    - Uji baca data dan uji auto-increment sequence PostgreSQL:
        ```bash
        php artisan tinker --execute "echo 'Active DB: ' . DB::connection()->getDriverName() . ' | Tenants: ' . App\Models\Tenant::count() . ' | Users: ' . App\Models\User::count() . PHP_EOL;"
        ```
- [ ] **Step 4: Buka kembali Maintenance Mode**
    - Jalankan:
        ```bash
        php artisan up
        ```
- [ ] **Step 5: Smoke Testing pada Web Production**
    - Buka browser ke URL production (`https://waroeng.umkaem.my.id`).
    - Login sebagai Super Admin atau Kasir Toko.
    - Cek halaman Dashboard, Produk, dan Riwayat Transaksi Penjualan.
    - Lakukan 1 transaksi uji coba di POS untuk memastikan `sales_transactions` dan `sales_transaction_items` dapat di-insert dengan auto-increment baru tanpa error.

---

### Task 5: Rencana Darurat (Emergency Rollback Plan)

Jika ditemukan masalah kritis yang tidak dapat segera diatasi setelah switchover:

- [ ] **Langkah 1: Aktifkan maintenance mode**
    ```bash
    php artisan down
    ```
- [ ] **Langkah 2: Kembalikan `.env` ke MySQL**
    ```dotenv
    DB_CONNECTION=mysql
    DB_HOST=mysql_host_production
    DB_PORT=3306
    DB_DATABASE=kasir
    DB_USERNAME=user_mysql
    DB_PASSWORD=password_mysql
    ```
- [ ] **Langkah 3: Re-cache konfigurasi & aktifkan kembali aplikasi**
    ```bash
    php artisan config:cache
    php artisan up
    ```
    _(Aplikasi langsung kembali berjalan normal di MySQL tanpa kehilangan data historis)._
