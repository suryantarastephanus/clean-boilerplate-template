# 🏢 PANDUAN SAAS MANAGEMENT & SUPERADMIN PLATFORM

**Target Pembaca:** Platform Owner, Super Admin, dan Tim DevOps / Sysadmin.  
_(DOKUMEN RAHASIA / INTERNAL: Hanya untuk pengelola platform SaaS, TIDAK DIBAGIKAN ke kasir toko atau pengguna umum)_

---

## 📌 DAFTAR ISI

1. [Prinsip & Arsitektur Multi-Tenancy](#1-prinsip--arsitektur-multi-tenancy)
2. [Akses & Kredensial SuperAdmin](#2-akses--kredensial-superadmin)
3. [Manajemen Tenant (Toko Klien)](#3-manajemen-tenant-toko-klien)
4. [Paket Langganan & Fitur Modular (Plan Management)](#4-paket-langganan--fitur-modular-plan-management)
5. [Infrastruktur, Docker & Deployment (Easypanel)](#5-infrastruktur-docker--deployment-easypanel)
6. [Skema Database & Keamanan Data Antar-Tenant](#6-skema-database--keamanan-data-antar-tenant)
7. [Prosedur Backup & Pemeliharaan Server](#7-prosedur-backup--pemeliharaan-server)

---

## 1. Prinsip & Arsitektur Multi-Tenancy

Platform ini dibangun menggunakan arsitektur **Multi-Tenant Hybrid**:

- **Aplikasi Terpusat**: Satu instalasi basis kode Laravel 12 + Inertia.js React melayani banyak toko secara simultan.
- **Tenant Scope Enforcement**: Seluruh tabel bisnis (`products`, `sales_transactions`, `customers`, `users`, `stock_ledgers`, dll.) memiliki kolom `tenant_id` dengan relasi otomatis via Global Scopes Eloquent.
- **Impersonasi & Support**: SuperAdmin dapat masuk dan meninjau dashboard toko tertentu (_impersonate_) untuk memberikan bantuan teknis tanpa meminta password toko.

---

## 2. Akses & Kredensial SuperAdmin

| Komponen                 | Lingkungan Lokal              | Lingkungan Server / Produksi                                         |
| :----------------------- | :---------------------------- | :------------------------------------------------------------------- |
| **URL Login**            | `http://127.0.0.1:8000/login` | `https://waroeng.umkaem.my.id/login`                                 |
| **Email Akun**           | `superadmin@waroeng.com`      | Sesuai konfigurasi seeder admin platform                             |
| **Password**             | `password`                    | Wajib diganti di database produksi                                   |
| **PIN Otorisasi**        | `0000`                        | Digunakan untuk bypass proteksi platform                             |
| **Dashboard SuperAdmin** | `/superadmin/dashboard`       | Dashboard analitik pendapatan SaaS, total toko, dan kesehatan server |

---

## 3. Manajemen Tenant (Toko Klien)

Endpoint: `/superadmin/tenants`

### 3.1. Mendaftarkan Toko Baru

1. Masuk ke menu **Kelola Toko** (`/superadmin/tenants`).
2. Klik tombol **Tambah Toko Baru**.
3. Isi parameter tenant:
    - **Nama Toko**: Nama resmi bisnis (misal: _Waroeng Berkah Mart_).
    - **Kode Toko**: Kode unik identitas singkat (misal: `WRG002`).
    - **Subdomain / Slug**: Pengenal URL toko.
    - **Paket Langganan**: Pilih tier paket (Basic, Standard, Pro, Enterprise).
    - **Admin Pertama**: Masukkan email dan nama pemilik toko. Sistem akan menginisialisasi akun role `admin`.
4. Sistem otomatis membuat data master default: kategori produk awal, pengaturan toko, dan shift kasir pertama.

### 3.2. Mengatur Status Tenant (Suspend / Aktif)

- Jika toko terlambat membayar langganan, SuperAdmin dapat mengubah status menjadi **Suspended**.
- Toko yang di-_suspend_ akan otomatis diblokir saat mencoba login atau mengakses terminal POS.

---

## 4. Paket Langganan & Fitur Modular (Plan Management)

Endpoint: `/superadmin/plans`

Sistem menyediakan matriks fitur modular yang dapat dinyalakan/dimatikan per paket langganan:

| Modul Fitur             | Kunci Fitur (Flag)     | Deskripsi                                              |
| :---------------------- | :--------------------- | :----------------------------------------------------- |
| **Kasir POS & Struk**   | `feature_pos`          | Akses terminal kasir utama, barcode, struk             |
| **Multi-UOM (Grosir)**  | `feature_multi_uom`    | Harga satuan bertingkat (Dus, Pack, Renceng, Pcs)      |
| **Kasbon / Piutang**    | `feature_credit_debt`  | Pencatatan hutang pelanggan dengan plafon limit        |
| **Pembelian (PO)**      | `feature_purchases`    | Faktur kulakan barang ke supplier & buku hutang dagang |
| **Stock Opname**        | `feature_stock_opname` | Sesi hitung fisik rak dan penyesuaian selisih          |
| **HRD & Kiosk Absensi** | `feature_hrd`          | Clock-in/out, jadwal kerja shift, slip penggajian      |
| **Laporan & Export**    | `feature_analytics`    | Unduh laporan laba rugi Excel/PDF                      |

SuperAdmin dapat mengubah harga bulanan/tahunan serta kuota maksimal produk dan pengguna per paket.

---

## 5. Infrastruktur, Docker & Deployment (Easypanel)

### 5.1. Alur CI/CD Webhook

Sistem dideploy di cloud VPS menggunakan platform kontainer **Easypanel**:

```
Developer Commit -> GitHub Repository (origin main) -> Webhook Easypanel -> Docker Build & Container Restart
```

### 5.2. Prosedur Deploy Resmi

Sesuai standar operasional:

1. Pastikan seluruh pengujian lokal lulus:
    ```powershell
    npm run build
    php artisan test --compact
    ```
2. Lakukan commit lokal dan push ke GitHub:
    ```powershell
    git push origin main
    ```
3. Trigger webhook Easypanel secara otomatis menggunakan script:
    ```powershell
    powershell -ExecutionPolicy Bypass -File scripts/trigger-deploy.ps1
    ```
    _Webhook URL:_ `http://43.157.212.24:3000/api/deploy/a5552c860c2792106fbde40c8fb365116680437cdea0f597`

---

## 6. Skema Database & Keamanan Data Antar-Tenant

1. **Foreign Key Restraints**: Seluruh transaksi keuangan terikat pada `tenant_id`.
2. **Pemberian Hak Akses (Role-Based Access Control)**:
    - `superadmin`: Akses level platform (manajemen SaaS).
    - `admin`: Akses level tenant (pemilik toko).
    - `supervisor`: Akses otorisasi kasir (void, margin, plafon kasbon).
    - `cashier`: Akses kasir terbatas pada shift aktif dan POS.
3. **Penyimpanan Password & PIN**:
    - Seluruh password di-hash menggunakan algoritma `Bcrypt`.
    - PIN otorisasi supervisor di-hash untuk audit trail yang aman.

---

## 7. Prosedur Backup & Pemeliharaan Server

1. **Database Dump Harian**:
    ```bash
    # Jalankan via Cron Server
    pg_dump -U postgres kasir_db | gzip > /backups/kasir_db_$(date +\%Y\%m\%d).sql.gz
    ```
2. **Optimasi Cache Aplikasi**:
    ```bash
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```
3. **Monitoring Log Error**:
   Cek file log di `storage/logs/laravel.log` secara berkala.
