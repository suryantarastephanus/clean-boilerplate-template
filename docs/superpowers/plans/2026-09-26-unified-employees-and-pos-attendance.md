# Unified Employees & POS Quick Attendance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menggabungkan manajemen user (`/users`) dan pegawai (`/hrd/employees`) menjadi 1 pintu terpadu ("Karyawan & Akses"), membedakan staf operasional (tanpa email, bebas kuota) dengan akun login (kasir/supervisor/admin), serta menambahkan fitur modal absensi staf langsung di dalam POS terminal kasir.

**Architecture:**

- **Backend (HrdController & AttendanceService):**
    - Perluas `HrdController` untuk menangani pembuatan/pembaruan akun `User` otomatis saat peran login (`kasir`, `supervisor`, `tenant_admin`) dipilih, lengkap dengan pengecekan kuota langganan (`max_users`).
    - Untuk peran `staff`, akun `User` tidak dibuat/dihubungkan (`user_id = null`), sehingga tidak mengonsumsi kuota user toko.
    - Sediakan endpoint JSON response untuk absensi cepat di POS (`/api/pos/quick-clock` atau perluas `kioskClock`).
    - Redirect rute `/users` ke `/hrd/employees` agar kompatibel ke belakang.
- **Frontend (employees.tsx & app-sidebar.tsx):**
    - Perbarui form tambah/edit di `resources/js/pages/hrd/employees.tsx` dengan pilihan Role: `Staff Operasional`, `Kasir POS`, `Supervisor`, `Admin Toko`.
    - Kolom Email & Password otomatis tampil hanya ketika memilih role dengan akses login.
    - Tampilkan informasi kuota pengguna di header halaman.
    - Perbarui sidebar: lebur menu `/users` ke `/hrd/employees` dengan judul "Karyawan & Akses".
- **POS Integration (pos/index.tsx & pos-attendance-modal.tsx):**
    - Buat komponen modal terpisah `PosAttendanceModal` dengan digital clock, input PIN, virtual keypad, dan instant feedback alert.
    - Tambahkan tombol pintas "Absensi Staf" di topbar POS kasir.

**Tech Stack:** Laravel 12, PHP 8.4, Inertia React, TypeScript, Tailwind CSS, Shadcn UI, Pest PHP.

---

## Task 1: Backend Integration for Unified Employee & User Creation

**Files:**

- Modify: `app/Http/Controllers/HrdController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/HrdAndPayrollTest.php`

**Steps:**

- [ ] 1.1 Perbarui validasi dan logika di `HrdController::storeEmployee` dan `HrdController::updateEmployee`:
    - Tambahkan input `account_type` / `role`: `staff`, `kasir`, `supervisor`, `tenant_admin`.
    - Jika `role !== 'staff'`:
        - Validasi `email` (required, email, unique:users,email) dan `password` (required saat create, nullable saat update, min:6).
        - Cek kuota pengguna toko (`$tenant->users()->count() >= $tenant->getMaxUsers()`).
        - Buat atau update instance `User` (`role`, `name`, `email`, `pin_code`, `password`, `is_active`).
        - Kaitkan `user_id` pada model `Employee`.
    - Jika `role === 'staff'`:
        - Set `$employee->user_id = null`.
- [ ] 1.2 Sertakan data `quota` (`getUsersUsage`) dan informasi akun `user` pada setiap pegawai di method `employees()` `HrdController`.
- [ ] 1.3 Tambahkan API endpoint JSON untuk absensi cepat di POS `/api/pos/quick-clock` (atau jadikan `kioskClock` support JSON jika request expects JSON).
- [ ] 1.4 Pasang redirect route `/users` mengarah ke `/hrd/employees`.
- [ ] 1.5 Jalankan `vendor/bin/pint --dirty --format agent` dan verifikasi test `php artisan test --filter=HrdAndPayrollTest`.

---

## Task 2: Unified Frontend Page for "Karyawan & Akses"

**Files:**

- Modify: `resources/js/pages/hrd/employees.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`

**Steps:**

- [ ] 2.1 Perbarui antarmuka `employees.tsx`:
    - Ganti judul halaman menjadi **"Karyawan & Akses Pengguna"**.
    - Tampilkan banner/badge kuota pengguna toko (`quota.used` / `quota.max` akun login terpakai).
    - Di form Tambah / Edit Pegawai:
        - Tambahkan Radio/Select pemilihan Peran: `Staff Operasional`, `Kasir POS`, `Supervisor`, `Admin Toko (Owner)`.
        - Buat conditional section: Jika memilih `staff`, sembunyikan Email & Password dan tampilkan info bebas kuota.
        - Jika memilih `kasir`/`supervisor`/`tenant_admin`, tampilkan input Email & Password (dengan toggle visibility & keterangan memakan 1 kuota akun).
        - Pertahankan switch **Fitur Penggajian** (`has_payroll`) yang sudah berfungsi sebelumnya.
- [ ] 2.2 Perbarui tabel daftar karyawan:
    - Tampilkan badge Akun/Role (misal: "Staff (Hanya Absensi)", "Kasir POS (Email: ...)", "Supervisor", dll).
    - Tampilkan indikator status login & status payroll.
- [ ] 2.3 Perbarui `app-sidebar.tsx`:
    - Hapus item menu `/users` yang terpisah.
    - Ganti label menu `/hrd/employees` menjadi **"Karyawan & Akses"** dengan icon `UserCog` atau `UserCheck`.

---

## Task 3: POS Quick Attendance Modal Component

**Files:**

- Create: `resources/js/components/pos-attendance-modal.tsx`
- Modify: `resources/js/pages/pos/index.tsx`

**Steps:**

- [ ] 3.1 Buat komponen `PosAttendanceModal.tsx`:
    - Dialog / Modal responsif dengan jam digital dinamis (_real-time_).
    - Input PIN / Kode Pegawai dengan autofocus.
    - Virtual Numpad (tombol angka 0-9, C, dan Backspace) untuk kemudahan operasional layar sentuh kasir.
    - Tombol aksi "Catat Kehadiran (Clock In / Out)".
    - Feedback visual interaktif:
        - Hijau untuk Clock In sukses (menampilkan nama & jam masuk).
        - Biru untuk Clock Out sukses (menampilkan nama & jam keluar).
        - Merah untuk PIN salah / pegawai tidak aktif.
    - Auto-close timer (2.5 detik setelah berhasil) atau tombol tutup cepat.
- [ ] 3.2 Pasang tombol **"Absensi Staf"** di Header / Topbar POS (`pos/index.tsx`):
    - Letakkan di sebelah info shift / profil kasir.
    - Integrasikan dengan state open/close `PosAttendanceModal`.
    - Pastikan tidak mengganggu keranjang belanja belanjaan kasir (`cart` state tetap utuh).

---

## Task 4: Testing & Verification

**Files:**

- Test: `tests/Feature/HrdAndPayrollTest.php`
- Modify / Add: Unit/Feature test untuk pembuatan staff vs login user & quick clock di POS.

**Steps:**

- [ ] 4.1 Jalankan test suite `php artisan test --compact` untuk memastikan seluruh skenario lulus tanpa regresi.
- [ ] 4.2 Jalankan `npm run build` untuk memverifikasi TypeScript dan CSS bundle bersih.
- [ ] 4.3 Jalankan Pint code formatter `vendor/bin/pint --dirty --format agent`.
- [ ] 4.4 Commit perubahan secara lokal dan laporkan kepada pengguna.
