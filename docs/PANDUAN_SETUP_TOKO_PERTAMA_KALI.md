# 🚀 PANDUAN LENGKAP SETUP PERTAMA KALI TOKO (WAROENG POS & SAAS)

**Target Pengguna:** Pemilik Toko (Owner / Tenant Admin), Manajer Operasional, dan Supervisor.  
**Tujuan Dokumen:** Membimbing toko baru dari tahap pendaftaran nol hingga siap melayani transaksi di meja kasir secara 100% tuntas, rapi, dan minim kendala.

---

## 📑 DAFTAR ISI PANDUAN

1. [Ikhtisar Alur Onboarding (Checklist Roadmap)](#1-ikhtisar-alur-onboarding-checklist-roadmap)
2. [Panduan Domain, Port & Lingkungan Sistem](#2-panduan-domain-port--lingkungan-sistem)
3. [Direktori Lengkap Path & URL Rute Aplikasi Kasir](#3-direktori-lengkap-path--url-rute-aplikasi-kasir)
4. [Langkah 1: Registrasi Toko Baru & Verifikasi Akun](#4-langkah-1-registrasi-toko-baru--verifikasi-akun)
5. [Langkah 2: Login Pertama Kali & Pengamanan Kredensial](#5-langkah-2-login-pertama-kali--pengamanan-kredensial)
6. [Langkah 3: Konfigurasi Identitas Toko & Desain Struk Belanja](#6-langkah-3-konfigurasi-identitas-toko--desain-struk-belanja)
7. [Langkah 4: Pengaturan Pajak (PPN), Keamanan Layar & Master Shift](#7-langkah-4-pengaturan-pajak-ppn-keamanan-layar--master-shift)
8. [Langkah 5: Penyesuaian Modul Fitur Toko (Feature Toggles)](#8-langkah-5-penyesuaian-modul-fitur-toko-feature-toggles)
9. [Langkah 6: Instalasi Hardware Kasir (Printer Thermal & Laci Uang)](#9-langkah-6-instalasi-hardware-kasir-printer-thermal--laci-uang)
10. [Langkah 7: Pengaturan Master Data Awal (Kategori, Rak, Supplier)](#10-langkah-7-pengaturan-master-data-awal-kategori-rak-supplier)
11. [Langkah 8: Input Katalog Produk & Satuan Bertingkat (Multi-UOM)](#11-langkah-8-input-katalog-produk--satuan-bertingkat-multi-uom)
12. [Langkah 9: Setup Pelanggan & Plafon Kasbon Piutang](#12-langkah-9-setup-pelanggan--plafon-kasbon-piutang)
13. [Langkah 10: Pembuatan Akun Kasir, Staf & Sinkronisasi HRD](#13-langkah-10-pembuatan-akun-kasir-staf--sinkronisasi-hrd)
14. [Langkah 11: Uji Coba Transaksi Perdana & Buka Shift Kasir (Go-Live)](#14-langkah-11-uji-coba-transaksi-perdana--buka-shift-kasir-go-live)
15. [Troubleshooting & FAQ Setup Pertama Kali](#15-troubleshooting--faq-setup-pertama-kali)

---

## 1. Ikhtisar Alur Onboarding (Checklist Roadmap)

Gunakan tabel checklist di bawah ini untuk memantau progres persiapan toko Anda sebelum hari peluncuran (_grand opening_ / _go-live_):

|    Fase    | Tahapan Setup                        | Lokasi Menu (Path)                    | Target Hasil                                      | Status |
| :--------: | :----------------------------------- | :------------------------------------ | :------------------------------------------------ | :----: |
| **Fase 1** | Registrasi Toko & Akun Pemilik       | `/register` atau via Admin            | Menerima email akun & kode toko (WRGxxx)          |  [ ]   |
| **Fase 1** | Ganti Password & PIN Owner           | `/settings/security`                  | Password aman & PIN 4-digit supervisor aktif      |  [ ]   |
| **Fase 2** | Profil Toko, Kontak & Logo           | `/settings/store` (Tab Profil)        | Logo tercetak di struk & alamat lengkap muncul    |  [ ]   |
| **Fase 2** | Kustomisasi Header & Footer Struk    | `/settings/store` (Tab Profil)        | Pesan ramah & kebijakan toko siap di struk        |  [ ]   |
| **Fase 2** | Pengaturan PPN (Inklusif/Eksklusif)  | `/settings/store` (Tab Fitur)         | Skema pajak transaksi POS terkonfigurasi          |  [ ]   |
| **Fase 2** | Penentuan Pola Shift Kerja Toko      | `/settings/store` (Tab Fitur)         | Pola 1 Shift Penuh / 2 Shift / 3 Shift siap       |  [ ]   |
| **Fase 3** | Koneksi Printer Thermal & Port 9100  | Modal Printer `/settings/store`       | Uji cetak kertas 58mm/80mm & laci kasir terbuka   |  [ ]   |
| **Fase 4** | Buat Kategori, Rak & Supplier        | `/categories`, `/racks`, `/suppliers` | Struktur penempatan barang rapi                   |  [ ]   |
| **Fase 4** | Input Produk & Fast Keys 1-9         | `/products` / `/products/create`      | Barcode terdaftar, harga jual & stok terisi       |  [ ]   |
| **Fase 4** | Setup Multi-UOM (Grosir/Renceng/Dus) | Form Edit Satuan Produk               | Kasir bisa jual satuan eceran maupun karton       |  [ ]   |
| **Fase 5** | Buat Akun Kasir & Atur PIN           | `/users`                              | Kasir memiliki akun login & PIN masing-masing     |  [ ]   |
| **Fase 6** | Uji Buka Shift, Transaksi & Tutup    | `/pos` & `/shifts`                    | Transaksi lancar, struk keluar, Z-Report seimbang |  [ ]   |

---

## 2. Panduan Domain, Port & Lingkungan Sistem

Sistem kasir Waroeng POS dapat diakses melalui berbagai tingkatan lingkungan (_environment_), baik secara lokal di komputer toko maupun secara online di cloud server.

### 🌐 A. Lingkungan Produksi (Live Cloud Server - Easypanel)

Gunakan alamat ini jika toko Anda menggunakan instalasi cloud terpusat:

- **Domain Utama**: `https://waroeng.umkaem.my.id`
- **Protokol**: `HTTPS (Port 443 / SSL Aman)`
- **Akses Login Produksi**: `https://waroeng.umkaem.my.id/login`
- **Pendaftaran Toko Produksi**: `https://waroeng.umkaem.my.id/register`

---

### 💻 B. Lingkungan Komputer Lokal (Local Machine / Server Kasir Mandiri)

Gunakan alamat ini saat menjalankan aplikasi di komputer kasir toko secara _stand-alone_:

- **URL Dasar (Localhost)**: `http://localhost:8000` atau `http://127.0.0.1:8000`
- **Protokol**: `HTTP (Port 8000)`
- **Akses Login Lokal**: `http://localhost:8000/login`
- **Pendaftaran Toko Lokal**: `http://localhost:8000/register`

---

### 📶 C. Lingkungan Jaringan Lokal Toko (LAN / Wi-Fi Intranet Toko)

Jika toko memiliki 1 komputer server/kasir utama dan ingin diakses oleh tablet/HP kasir lain atau perangkat staf di toko yang sama tanpa internet:

1. Cari tahu **IPv4 Address** komputer server di toko (buka CMD di Windows, ketik `ipconfig`, cari _IPv4 Address_, contoh: `192.168.1.50`).
2. Jalankan aplikasi dengan binding IP jaringan: `php artisan serve --host=0.0.0.0 --port=8000`.
3. Seluruh perangkat kasir di jaringan Wi-Fi toko dapat mengakses:
    - **URL Akses LAN**: `http://192.168.1.50:8000`
    - **Akses Login LAN**: `http://192.168.1.50:8000/login`
    - **Terminal POS LAN**: `http://192.168.1.50:8000/pos`

---

### 🖨️ D. Port Khusus Hardware & Periferal Kasir

- **Port 9100 (RAW TCP / ESC-POS Socket)**: Port standar komunikasi langsung dari server/browser ke printer thermal kasir (LAN, Wi-Fi, atau Virtual Print Server RawBT di `127.0.0.1:9100`).
- **Port 5432**: Database Utama PostgreSQL.
- **Port 5173**: Vite HMR Dev Server (khusus lingkungan pengembang frontend).

---

## 3. Direktori Lengkap Path & URL Rute Aplikasi Kasir

Berikut adalah matriks direktori seluruh path URL yang tersedia di dalam aplikasi, lengkap dengan fungsi dan tingkat kewenangan akses:

| Modul                     | Path Endpoint (URL Relatif) | Contoh URL Produksi Lengkap                           | Contoh URL Lokal Lengkap                       | Hak Akses Minimal    |
| :------------------------ | :-------------------------- | :---------------------------------------------------- | :--------------------------------------------- | :------------------- |
| **Pendaftaran Toko**      | `/register`                 | `https://waroeng.umkaem.my.id/register`               | `http://localhost:8000/register`               | Publik (Calon Toko)  |
| **Konfirmasi Daftar**     | `/register/success`         | `https://waroeng.umkaem.my.id/register/success`       | `http://localhost:8000/register/success`       | Publik               |
| **Login Petugas**         | `/login`                    | `https://waroeng.umkaem.my.id/login`                  | `http://localhost:8000/login`                  | Publik               |
| **Terminal Kasir POS**    | `/pos`                      | `https://waroeng.umkaem.my.id/pos`                    | `http://localhost:8000/pos`                    | Kasir / Staf         |
| **Dashboard Toko**        | `/dashboard`                | `https://waroeng.umkaem.my.id/dashboard`              | `http://localhost:8000/dashboard`              | Supervisor / Owner   |
| **Pengaturan Warung**     | `/settings/store`           | `https://waroeng.umkaem.my.id/settings/store`         | `http://localhost:8000/settings/store`         | Owner (Tenant Admin) |
| **Pengaturan Modul**      | `/settings/modules`         | `https://waroeng.umkaem.my.id/settings/modules`       | `http://localhost:8000/settings/modules`       | Owner (Tenant Admin) |
| **Keamanan & PIN**        | `/settings/security`        | `https://waroeng.umkaem.my.id/settings/security`      | `http://localhost:8000/settings/security`      | Semua Pengguna       |
| **Profil Pengguna**       | `/settings/profile`         | `https://waroeng.umkaem.my.id/settings/profile`       | `http://localhost:8000/settings/profile`       | Semua Pengguna       |
| **Katalog Produk**        | `/products`                 | `https://waroeng.umkaem.my.id/products`               | `http://localhost:8000/products`               | Supervisor / Owner   |
| **Tambah Produk**         | `/products/create`          | `https://waroeng.umkaem.my.id/products/create`        | `http://localhost:8000/products/create`        | Supervisor / Owner   |
| **Import Produk Excel**   | `/products/import`          | `https://waroeng.umkaem.my.id/products/import`        | `http://localhost:8000/products/import`        | Supervisor / Owner   |
| **Master Kategori**       | `/categories`               | `https://waroeng.umkaem.my.id/categories`             | `http://localhost:8000/categories`             | Supervisor / Owner   |
| **Master Rak Barang**     | `/racks`                    | `https://waroeng.umkaem.my.id/racks`                  | `http://localhost:8000/racks`                  | Supervisor / Owner   |
| **Master Supplier**       | `/suppliers`                | `https://waroeng.umkaem.my.id/suppliers`              | `http://localhost:8000/suppliers`              | Supervisor / Owner   |
| **Daftar Pelanggan**      | `/customers`                | `https://waroeng.umkaem.my.id/customers`              | `http://localhost:8000/customers`              | Kasir / Supervisor   |
| **Buku Kasbon Pelanggan** | `/customers/debts`          | `https://waroeng.umkaem.my.id/customers/debts`        | `http://localhost:8000/customers/debts`        | Kasir / Supervisor   |
| **Pembelian (Kulakan)**   | `/purchases`                | `https://waroeng.umkaem.my.id/purchases`              | `http://localhost:8000/purchases`              | Supervisor / Owner   |
| **Input Faktur Beli**     | `/purchases/create`         | `https://waroeng.umkaem.my.id/purchases/create`       | `http://localhost:8000/purchases/create`       | Supervisor / Owner   |
| **Hutang Dagang (AP)**    | `/purchases/payables`       | `https://waroeng.umkaem.my.id/purchases/payables`     | `http://localhost:8000/purchases/payables`     | Supervisor / Owner   |
| **Kartu Stok Barang**     | `/inventory/stock-ledger`   | `https://waroeng.umkaem.my.id/inventory/stock-ledger` | `http://localhost:8000/inventory/stock-ledger` | Supervisor / Owner   |
| **Stock Opname Fisik**    | `/inventory/stock-opname`   | `https://waroeng.umkaem.my.id/inventory/stock-opname` | `http://localhost:8000/inventory/stock-opname` | Supervisor / Owner   |
| **Buku Kas Masuk/Keluar** | `/finance/cash-flows`       | `https://waroeng.umkaem.my.id/finance/cash-flows`     | `http://localhost:8000/finance/cash-flows`     | Supervisor / Owner   |
| **Laporan Shift Kasir**   | `/shifts`                   | `https://waroeng.umkaem.my.id/shifts`                 | `http://localhost:8000/shifts`                 | Supervisor / Owner   |
| **Pengguna Toko**         | `/users`                    | `https://waroeng.umkaem.my.id/users`                  | `http://localhost:8000/users`                  | Owner (Tenant Admin) |
| **Kiosk Absensi Staf**    | `/hrd/attendances`          | `https://waroeng.umkaem.my.id/hrd/attendances`        | `http://localhost:8000/hrd/attendances`        | Semua Karyawan       |
| **Data Karyawan (HRD)**   | `/hrd/employees`            | `https://waroeng.umkaem.my.id/hrd/employees`          | `http://localhost:8000/hrd/employees`          | Owner (Tenant Admin) |
| **Penggajian / Payroll**  | `/hrd/payrolls`             | `https://waroeng.umkaem.my.id/hrd/payrolls`           | `http://localhost:8000/hrd/payrolls`           | Owner (Tenant Admin) |
| **Jadwal & Shift Kerja**  | `/hrd/schedules`            | `https://waroeng.umkaem.my.id/hrd/schedules`          | `http://localhost:8000/hrd/schedules`          | Owner (Tenant Admin) |
| **Audit Log Keamanan**    | `/audit/activity-logs`      | `https://waroeng.umkaem.my.id/audit/activity-logs`    | `http://localhost:8000/audit/activity-logs`    | Owner (Tenant Admin) |
| **Contoh E-Struk Publik** | `/receipts/sample/{type}`   | `https://waroeng.umkaem.my.id/receipts/sample/pos`    | `http://localhost:8000/receipts/sample/pos`    | Publik (Uji Coba)    |

---

## 4. Langkah 1: Registrasi Toko Baru & Verifikasi Akun

Terdapat dua jalur pendaftaran toko baru:

### Opsi A: Registrasi Mandiri Publik

- **Path**: `/register`
- **URL Produksi**: `https://waroeng.umkaem.my.id/register`
- **URL Lokal**: `http://localhost:8000/register`

1. Buka URL registrasi di atas melalui browser Anda.
2. Lengkapi formulir pendaftaran:
    - **Nama Toko / Warung**: Masukkan nama komersial toko (contoh: _Minimarket Barokah Mart_).
    - **Nama Pemilik**: Nama lengkap penanggung jawab toko.
    - **Email Resmi**: Email aktif yang akan digunakan untuk login sebagai Admin Toko (Owner).
    - **No. Telepon / WhatsApp**: Nomor aktif pemilik untuk notifikasi dan bantuan teknis.
    - **Alamat Toko**: Alamat fisik operasional toko.
    - **Verifikasi Captcha Cloudflare Turnstile**: Centang kotak verifikasi keamanan anti-bot.
3. Klik tombol **Daftarkan Toko Sekarang**.
4. Halaman akan dialihkan ke layar sukses: `/register/success` (`https://waroeng.umkaem.my.id/register/success`). Tim SuperAdmin platform akan memvalidasi data dan mengaktifkan tenant toko Anda.

### Opsi B: Didaftarkan Langsung oleh SuperAdmin

Jika sistem dikelola oleh tim IT internal perusahaan:

- **Path Admin**: `/superadmin/tenants/create`
- SuperAdmin membuatkan toko dan memberikan email akun serta password sementara kepada pemilik toko.

---

## 5. Langkah 2: Login Pertama Kali & Pengamanan Kredensial

Setelah akun toko Anda diverifikasi dan aktif:

- **Path Login**: `/login`
- **URL Produksi**: `https://waroeng.umkaem.my.id/login`
- **URL Lokal**: `http://localhost:8000/login`

1. Kunjungi tautan login di atas.
2. Masukkan **Email** dan **Password** awal Anda.
3. Setelah berhasil masuk ke Dashboard (`/dashboard`), segera amankan akun Anda:
    - Buka **Pengaturan Keamanan**:
        - **Path**: `/settings/security`
        - **URL Produksi**: `https://waroeng.umkaem.my.id/settings/security`
        - **URL Lokal**: `http://localhost:8000/settings/security`
    - **Ganti Password**: Masukkan kata sandi baru yang kuat (minimal 8 karakter kombinasi huruf besar, kecil, dan angka).
    - **Atur PIN Otorisasi 4 Digit**: Masukkan 4 angka PIN pribadi Anda (misal: `9999`).
    > [!IMPORTANT]
    > PIN 4 Digit ini berfungsi ganda: sebagai PIN buka kasir dan sebagai **PIN Otorisasi Supervisor** saat kasir membutuhkan persetujuan khusus (seperti membatalkan transaksi / void item, memberikan diskon manual khusus, atau menyetujui transaksi kasbon melebihi limit plafon).
4. Masuk ke menu **Profil Akun** (`/settings/profile` atau `https://waroeng.umkaem.my.id/settings/profile`) untuk memastikan nama tampilan dan nomor kontak sudah akurat.

---

## 6. Langkah 3: Konfigurasi Identitas Toko & Desain Struk Belanja

Identitas toko yang lengkap memberikan kesan profesional kepada pelanggan dan memastikan nota transaksi sah sebagai bukti belanja.

- **Path**: `/settings/store` (Tab: _Pengaturan Warung_)
- **URL Produksi**: `https://waroeng.umkaem.my.id/settings/store`
- **URL Lokal**: `http://localhost:8000/settings/store`

1. Buka tautan di atas dan pastikan berada di tab **Pengaturan Warung**.
2. **Unggah Logo Toko**:
    - Klik **Unggah Logo Toko**.
    - Gunakan format gambar **PNG transparan**, **JPG**, **WEBP**, atau **SVG** dengan ukuran maksimal 2 MB.
    - _Tips:_ Gambar rasio 1:1 (persegi) dengan kontras tinggi memberikan hasil cetak paling tajam pada printer thermal kasir.
3. **Data Identitas Toko**:
    - **Nama Warung / Toko**: Ditampilkan di kop struk, kop laporan PDF, dan header aplikasi.
    - **No. Telepon / WhatsApp**: Nomor kontak yang akan tercetak di bawah nama toko pada struk.
    - **Email Usaha**: Email resmi toko.
    - **Alamat Lengkap**: Tuliskan jalan, nomor, RT/RW, kelurahan, dan kota dengan rapi agar tercetak jelas pada nota fisik maupun e-Struk digital WhatsApp.
4. **Kustomisasi Teks Struk Transaksi**:
    - **Pesan Sambutan / Header Struk**: Masukkan tagline atau informasi tambahan.  
      _Contoh:_ `Sedia Sembako, Pulsa & Token Listrik • IG: @barokah.mart`
    - **Catatan Kaki Struk / Footer**: Masukkan ucapan terima kasih dan ketentuan retur/komplain.  
      _Contoh:_
        ```text
        Terima kasih atas kunjungan Anda!
        Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan
        kecuali ada perjanjian tertulis sebelumnya.
        Simpan struk ini sebagai bukti pembayaran yang sah.
        ```
5. Klik **Simpan Pengaturan Warung**.

---

## 7. Langkah 4: Pengaturan Pajak (PPN), Keamanan Layar & Master Shift

Buka tab kedua di halaman `/settings/store`, yaitu **Pengaturan Fitur**:

- **Path**: `/settings/store` (Tab: _Pengaturan Fitur_)
- **URL Produksi**: `https://waroeng.umkaem.my.id/settings/store`
- **URL Lokal**: `http://localhost:8000/settings/store`

```
+--------------------------------------------------------------------------------------------------+
| TAB 2: PENGATURAN FITUR (PPN • Idle Lock • Operational Shift)                                    |
+--------------------------------------------------------------------------------------------------+
```

### A. Pengaturan PPN / Pajak Penjualan

1. Geser sakelar **Pajak Pertambahan Nilai (PPN / Tax)** menjadi **AKTIF** jika toko Anda memungut PPN, atau biarkan **NONAKTIF** untuk toko kelontong/warung retail non-PKP biasa.
2. Jika diaktifkan, pilih salah satu metode perhitungan:
    - **Inklusif (Tax Inclusive) [Rekomendasi Ritel]**: Harga jual barang di kasir sudah termasuk pajak. Pajak dipisahkan sebagai rincian di struk tanpa menambah nilai belanja yang harus dibayar pembeli.
    - **Eksklusif (Tax Exclusive)**: Harga barang belum termasuk pajak. Nilai pajak (misal +11%) akan ditambahkan di atas subtotal saat checkout.
3. Tentukan **Besaran Tarif PPN**: Standar Indonesia adalah `11%` (atau `12%`). Sistem menyediakan tombol cepat 10%, 11%, 12% dan kotak simulasi interaktif belanja Rp 100.000.

### B. Penguncian Layar Kasir Otomatis (Idle Lock / Screen Timeout)

1. Aktifkan sakelar **Kunci Layar Kasir Otomatis (Screen Timeout)**.
2. Tentukan durasi idle (default: **180 detik** / 3 menit).
3. Jika kasir meninggalkan meja kasir dan tidak ada input mouse/keyboard/layar sentuh selama durasi tersebut, layar POS akan terkunci secara otomatis. Kasir wajib memasukkan PIN 4-digit mereka untuk membuka kunci. Ini mencegah transaksi tidak sah saat kasir sedang ke toilet atau melayani pembeli di lorong rak.

### C. Pemilihan Pola Jam Kerja & Shift Toko (Operational Shift Preset)

Pilih preset yang sesuai dengan model operasional toko Anda:

- **1 Shift Penuh (Single Full Shift)**: Cocok untuk warung mandiri yang dijaga 1 orang seharian penuh (contoh: Pk 08:00 - 21:00).
- **2 Shift Bergantian (Two Shifts - Pagi & Siang/Malam)**: Pola minimarket standar:
    - Shift Pagi: Pk 07:00 - 15:00
    - Shift Siang/Sore: Pk 14:30 - 22:30 (dengan jeda serah terima kasir 30 menit).
- **3 Shift Operasional (Three Shifts - 24 Jam)**: Untuk toko yang buka 24 jam non-stop (Pagi, Sore, Malam/Dini Hari).
- **Kustom**: Anda bebas menambah shift baru, mengatur jam mulai-selesai, memberi label warna, serta mengaktifkan indikator _Night Shift_.

Klik tombol **Simpan Pengaturan Warung** setelah menyelesaikan penyesuaian.

---

## 8. Langkah 5: Penyesuaian Modul Fitur Toko (Feature Toggles)

Aplikasi kasir ini menganut arsitektur modular (_Feature Gating_). Anda dapat menyederhanakan antarmuka dengan menonaktifkan fitur-fitur yang belum diperlukan:

- **Path**: `/settings/modules`
- **URL Produksi**: `https://waroeng.umkaem.my.id/settings/modules`
- **URL Lokal**: `http://localhost:8000/settings/modules`

1. Kunjungi tautan pengaturan modul di atas.
2. Periksa daftar fitur yang berhak diakses toko Anda:
    - **Kasir POS & Transaksi (`pos_terminal`)**: Terminal utama kasir.
    - **Kartu Stok (`inventory_stock_ledger`)**: Riwayat mutasi kronologis stok masuk dan keluar.
    - **Stock Opname Fisik (`inventory_stock_opname`)**: Modul audit fisik stok di rak gudang.
    - **Pembelian & Hutang Supplier (`purchases`)**: Faktur pembelian kulakan dan buku hutang (AP).
    - **Pelanggan & Piutang Kasbon FIFO (`customer_kasbon`)**: Pencatatan kasbon pelanggan dengan pelunasan otomatis invoice tertua.
    - **Buku Kas Masuk & Keluar (`finance_cash_flows`)**: Pencatatan uang masuk operasional dan biaya harian toko (listrik, kebersihan, air).
    - **Kiosk Absensi Staf (`hrd_attendance`)**: Presensi clock-in / clock-out pegawai.
    - **Penggajian & Slip Gaji (`hrd_payroll`)**: Penghitungan gaji pokok, uang makan, tunjangan, dan cetak slip.
    - **Manajemen Shift & Rekonsiliasi Kas (`shifts`)**: Kontrol uang laci kasir dan Z-Report.
    - **Hardware ESC/POS Port 9100 (`hardware_escpos`)**: Pencetakan thermal raw dan kontrol laci kasir.
    - **Audit Trail & Otorisasi PIN (`audit_trail`)**: Perekaman log aktivitas krusial untuk mencegah kebocoran kas.
3. Centang fitur yang ingin Anda tampilkan pada navigasi kasir dan manajemen toko.
4. Klik **Simpan Konfigurasi Modul**. Menu navigasi samping toko akan langsung disesuaikan secara instan.

---

## 9. Langkah 6: Instalasi Hardware Kasir (Printer Thermal & Laci Uang)

Sistem mendukung tiga jenis jalur koneksi printer thermal: **Port 9100 Direct Socket**, **Aplikasi RawBT Print Server**, dan **Universal Browser Print**.

- **Lokasi Menu**: Buka `/settings/store`, lalu klik tombol **Buka Pengatur Margin & Pratinjau**.

```
+--------------------------------------------------------------------------------------------------+
| MODAL PENGATURAN HARDWARE PRINTER & FORMAT STRUK                                                 |
+--------------------------------------------------------------------------------------------------+
| [Tab 1: Tata Letak & Font]           | [Tab 2: Koneksi Port 9100 & Hardware]                     |
|                                      |                                                           |
| - Lebar Kertas: [58 mm] vs [80 mm]   | - IP Address Printer: [192.168.1.200 atau 127.0.0.1]    |
| - Margin Kiri/Kanan: [0 mm] / [1 mm] | - Port Socket: [9100]                                     |
| - Margin Atas/Bawah: [1 mm] / [3 mm] | - Dorong Laci Otomatis: [x] AKTIF                         |
| - Ketebalan Font: [Medium / Bold]    | - Cetak Langsung Otomatis: [x] Zero-Click Printing        |
| - Ukuran Font: [Normal / Compact]    | - Tombol: [Uji Tes Koneksi] [Uji Tendang Laci (Kick)]     |
+--------------------------------------------------------------------------------------------------+
```

### Panduan Berdasarkan Tipe Printer Anda:

#### Skenario 1: Printer LAN / Wi-Fi (Memiliki Port Kabel LAN atau Wi-Fi)

1. Sambungkan kabel LAN printer ke router toko, atau sambungkan printer ke Wi-Fi toko yang sama dengan komputer/tablet kasir.
2. Cari tahu IP Address printer (biasanya dapat dicetak dengan mematikan printer, lalu menekan tombol _FEED_ sambil menyalakan sakelar daya hingga keluar kertas _Self-Test_). Contoh IP: `192.168.1.200`.
3. Buka tab **Koneksi Port 9100**, masukkan IP tersebut pada kolom **IP Address Printer**, dengan port default `9100`.
4. Klik **Uji Tes Koneksi Port 9100**. Printer akan mencetak struk uji coba.

#### Skenario 2: Printer USB atau Bluetooth (Menggunakan Driver RawBT)

Jika printer kasir menggunakan kabel USB langsung ke komputer atau Bluetooth ke tablet Android:

1. **Untuk Android (Tablet/HP Kasir)**:
    - Unduh aplikasi **RawBT Print Service** gratis dari Google Play Store.
    - Buka aplikasi RawBT, pasangkan (_pair_) printer Bluetooth atau sambungkan kabel USB OTG.
    - Buka menu Settings RawBT -> aktifkan fitur **Wi-Fi / Network Virtual Server (Port 9100)**.
    - Di kasir Waroeng POS, masukkan IP: `127.0.0.1` dan Port: `9100`.
2. **Untuk Windows PC / Laptop**:
    - Pasang driver printer thermal bawaan Windows.
    - Atau jalankan utilitas _RawBT Windows Print Server_ (dari `rawbt.ru`) untuk membuat socket virtual port 9100.
    - Masukkan IP: `127.0.0.1` dan Port: `9100`.

#### Skenario 3: Cetak Menggunakan Browser Bawaan (Universal Browser Print)

Jika Anda tidak ingin mengonfigurasi IP Port 9100, kosongkan kolom IP Printer. Setiap kali kasir menekan tombol Cetak, jendela dialog cetak bawaan Google Chrome / Microsoft Edge akan terbuka secara otomatis dengan ukuran kertas struk yang sudah disesuaikan secara presisi.

### Pengaturan Laci Kasir (Cash Drawer):

1. Tancapkan kabel kabel RJ11/RJ12 dari laci kasir ke soket **DK (Drawer Kick)** di bagian belakang printer thermal.
2. Centang opsi **Buka Laci Otomatis (Auto Kick Drawer)**.
3. Klik tombol **Uji Tendang Laci (Kick Cash Drawer)** untuk memastikan laci kasir terbuka secara mulus.

### Uji Coba Pratinjau 6 Format Struk Toko (Path Uji Coba Publik):

Di bagian bawah tab pengaturan warung, tersedia tombol **Uji Cetak** dan tautan publik aktif 24 jam untuk 6 jenis dokumen transaksi:

1. **Struk Penjualan Kasir POS**: `/receipts/sample/pos` (`https://waroeng.umkaem.my.id/receipts/sample/pos`)
2. **Bukti Pembayaran Cicilan Kasbon**: `/receipts/sample/debt-payment` (`https://waroeng.umkaem.my.id/receipts/sample/debt-payment`)
3. **Bukti Kas Masuk (BKM)**: `/receipts/sample/cash-flow-in` (`https://waroeng.umkaem.my.id/receipts/sample/cash-flow-in`)
4. **Bukti Kas Keluar Biaya (BKK)**: `/receipts/sample/cash-flow-out` (`https://waroeng.umkaem.my.id/receipts/sample/cash-flow-out`)
5. **Bukti Pencairan Kasbon Karyawan**: `/receipts/sample/employee-kasbon`
6. **Bukti Cicilan Kasbon Karyawan**: `/receipts/sample/employee-kasbon`

Pastikan hasil cetakan tampak jelas, font tidak terpotong ke samping, dan garis batas nota lurus rapi.

---

## 10. Langkah 7: Pengaturan Master Data Awal (Kategori, Rak, Supplier)

Sebelum memasukkan ratusan produk, susun pondasi pengelompokan barang terlebih dahulu:

### 1. Buat Kategori Produk

- **Path**: `/categories`
- **URL Produksi**: `https://waroeng.umkaem.my.id/categories`
- **URL Lokal**: `http://localhost:8000/categories`
- _Contoh Kategori Umum:_ Sembako, Minuman Dingin, Snack & Biskuit, Makanan Instan, Rokok, Perlengkapan Mandi, Obat & Farmasi, Rumah Tangga.
- Pilih ikon yang representatif untuk setiap kategori agar mudah dikenali kasir di POS.

### 2. Buat Master Rak Toko & Gudang

- **Path**: `/racks`
- **URL Produksi**: `https://waroeng.umkaem.my.id/racks`
- **URL Lokal**: `http://localhost:8000/racks`
- Buat kode dan nama rak yang sistematis untuk mempercepat pencarian barang fisik dan audit fisik stok (_Stock Opname_):
    - `RAK-A1`: Rak Depan - Sembako & Beras
    - `RAK-B1`: Rak Tengah - Biskuit & Makanan Ringan
    - `CHILLER-01`: Kulkas Minuman Dingin
    - `GUDANG-01`: Gudang Belakang Cadangan

### 3. Daftarkan Supplier / Pemasok Barang

- **Path**: `/suppliers`
- **URL Produksi**: `https://waroeng.umkaem.my.id/suppliers`
- **URL Lokal**: `http://localhost:8000/suppliers`
- Masukkan Nama Supplier (contoh: _PT Sumber Alfaria Trijaya_, _Grosir Berkah Sembako_, _Distributor Wings_).
- Masukkan No. Telepon sales/agen dan alamat distributor untuk kemudahan saat menginput faktur pembelian barang di `/purchases`.

---

## 11. Langkah 8: Input Katalog Produk & Satuan Bertingkat (Multi-UOM)

Aplikasi menyediakan dua opsi input produk: **Input Satuan via Form** atau **Import Massal via File Excel/CSV**.

### Opsi A: Input Produk Satu per Satu

- **Path Tambah Produk**: `/products/create`
- **URL Produksi**: `https://waroeng.umkaem.my.id/products/create`
- **URL Lokal**: `http://localhost:8000/products/create`

1. Kunjungi tautan form input di atas.
2. **Scan / Masukkan Barcode**: Tembak scanner ke barcode produk fisik (misal: `8992388111018`).
3. **Kode SKU**: Sistem otomatis menyarankan SKU unik, atau Anda dapat menyesuaikan format internal toko Anda.
4. **Fast Key / Quick Code (Khusus Barang Non-Barcode)**:
    > [!TIP]
    > Untuk barang yang sering terjual namun tidak memiliki barcode (seperti kantong kresek, galon aqua isi ulang, tabung gas melon 3kg, es batu, telur kiloan, kopi seduh), isi kolom **Quick Code** dengan angka `1` sampai `9`. Produk ini akan otomatis muncul sebagai **Tombol Cepat (Fast Keys)** di layar kasir POS tanpa perlu dicari.
5. **Nama Produk**: Tuliskan nama merek, varian, dan ukuran (contoh: _Indomie Goreng Original 85g_).
6. **Hubungkan Kategori, Rak, dan Supplier**: Pilih dari daftar yang telah dibuat di Langkah 7.
7. **Harga Beli (HPP) & Harga Jual Satuan Terkecil (Pcs/Bks)**:
    - Contoh Harga Beli: `Rp 2.800`
    - Contoh Harga Jual: `Rp 3.500`
8. **Stok Awal & Batas Minimal Stok (Low Stock Alert)**:
    - Masukkan jumlah stok saat ini di toko (misal: `120`).
    - Masukkan batas minimum peringatan stok menipis (misal: `10`).

### Mengonfigurasi Satuan Bertingkat (Multi-UOM):

Jika toko Anda juga melayani penjualan grosir per renteng, pak, atau karton/dus:

1. Pada form produk, buka bagian **Satuan Bertingkat (Multi-UOM)**.
2. Klik **+ Tambah Satuan Baru**:
    - **Nama Satuan**: Pilih atau ketik misalnya `Dus` atau `Karton`.
    - **Jumlah Isi (Konversi)**: Masukkan isi satuan terkecil di dalamnya (contoh: 1 Dus = `40` Pcs).
    - **Harga Beli Satuan**: Masukkan HPP per dus (contoh: `Rp 110.000`).
    - **Harga Jual Khusus**: Masukkan harga jual grosir per dus (contoh: `Rp 135.000`).
    - **Barcode Dus (Opsional)**: Scan barcode luar dus jika berbeda dengan barcode bungkusan eceran.
3. _Keuntungan Multi-UOM:_ Saat kasir menjual 1 Dus di POS, sistem otomatis memotong stok sebanyak 40 Pcs tanpa perlu membuat produk terpisah.

### Opsi B: Import Massal Produk via Excel/CSV

- **Path Import**: `/products/import`
- **URL Produksi**: `https://waroeng.umkaem.my.id/products/import`
- **URL Lokal**: `http://localhost:8000/products/import`

1. Kunjungi tautan import di atas.
2. Klik **Unduh Template Import (.xlsx / .csv)**.
3. Buka file template di Microsoft Excel atau Google Sheets.
4. Isi kolom sesuai petunjuk: `barcode`, `sku`, `name`, `category`, `unit`, `buy_price`, `sell_price`, `stock`, `min_stock`, `rack_code`.
5. Simpan file, lalu unggah kembali melalui form import. Sistem akan memvalidasi duplikasi barcode dan memasukkan seluruh data produk sekaligus.

---

## 12. Langkah 9: Setup Pelanggan & Plafon Kasbon Piutang

Jika toko Anda melayani pelanggan langganan atau warung kecil sekitar yang sering mengambil barang terlebih dahulu:

- **Path Pelanggan**: `/customers`
- **URL Produksi**: `https://waroeng.umkaem.my.id/customers`
- **URL Lokal**: `http://localhost:8000/customers`

1. Buka tautan di atas -> klik tombol **Tambah Pelanggan**.
2. Masukkan data profil pelanggan:
    - **Nama Pelanggan**: Contoh _Ibu Siti (Warung Kopi Sebelah)_.
    - **Nomor WhatsApp**: Wajib menggunakan format Indonesia (misal: `081234567890`).  
      _Keunggulan:_ Nomor WhatsApp ini digunakan untuk mengirimkan nota e-Struk digital otomatis dan bukti pelunasan kasbon.
    - **Tipe Pelanggan**:
        - `Retail / Umum`: Pelanggan belanja harian biasa.
        - `Trader / Grosir`: Pelanggan pedagang yang berhak mendapatkan harga grosir khusus.
3. **Pengaturan Plafon Kasbon (Kredit Limit)**:
    - Tentukan batas maksimal kasbon yang diizinkan (misal: `Rp 500.000` atau `Rp 2.000.000`).
    - _Mekanisme Keamanan:_ Jika belanjaan kasbon pelanggan telah melebihi plafon ini, kasir tidak dapat memproses transaksi kecuali diotorisasi langsung oleh Supervisor menggunakan PIN.
4. Simpan data pelanggan. Riwayat piutang dapat dipantau di `/customers/debts` (`https://waroeng.umkaem.my.id/customers/debts`).

---

## 13. Langkah 10: Pembuatan Akun Kasir, Staf & Sinkronisasi HRD

Jangan pernah membagikan akun atau password Pemilik Toko (Owner) kepada staf kasir. Buatkan akun khusus untuk setiap kasir agar rekaman transaksi dan pembukuan kas dapat dipertanggungjawabkan secara akurat.

- **Path Pengguna**: `/users`
- **URL Produksi**: `https://waroeng.umkaem.my.id/users`
- **URL Lokal**: `http://localhost:8000/users`

1. Buka tautan manajemen pengguna di atas -> klik **Tambah Pengguna Baru**.
2. Lengkapi formulir akun:
    - **Nama Lengkap**: Contoh _Siti Rahmawati_.
    - **Email Kasir**: Masukkan email unik kasir (contoh: `kasir1@barokah.com`).
    - **Kata Sandi**: Tentukan kata sandi login awal kasir.
    - **Peran Akun (Role)**:
        - `Kasir`: Hanya dapat mengakses layar kasir POS, membuka shift, melayani pembayaran, dan menutup shift kasir. Menu laporan rahasia dan laba toko terkunci rapat.
        - `Supervisor`: Memiliki hak otorisasi void transaksi, diskon manual khusus, dan penerimaan stok.
        - `Tenant Admin`: Akses penuh setara pemilik toko.
    - **PIN Otorisasi (4 Digit)**: Masukkan 4 digit angka rahasia untuk kasir ini (contoh: `1234`). PIN ini digunakan kasir untuk membuka shift kerja dan membuka kunci layar saat layar kasir idle terkunci.
3. **Centang Opsi Integrasi HRD**:
    - Beri centang pada `[x] Daftarkan juga sebagai Karyawan (HRD)`.
    - Tentukan jabatan (misal: _Kasir Shift Pagi_) dan gaji pokok/uang makan jika ingin langsung menggunakan modul penggajian toko di `/hrd/payrolls`.
4. Klik **Simpan Pengguna**.

---

## 14. Langkah 11: Uji Coba Transaksi Perdana & Buka Shift Kasir (Go-Live)

Sekarang toko Anda telah 100% siap. Mari lakukan simulasi satu putaran transaksi kerja harian penuh di Terminal POS:

- **Path Terminal POS**: `/pos`
- **URL Produksi**: `https://waroeng.umkaem.my.id/pos`
- **URL Lokal**: `http://localhost:8000/pos`

### Tahap 1: Kasir Melakukan Presensi Absensi (Opsional)

1. Kasir membuka **Kiosk Absensi** (`/hrd/attendances` atau `https://waroeng.umkaem.my.id/hrd/attendances`) atau mengklik ikon jam di pojok kanan atas layar POS.
2. Masukkan PIN 4 digit kasir, lalu klik **Clock In (Masuk Kerja)**. Waktu hadir tercatat presisi untuk slip gaji bulanan.

### Tahap 2: Buka Shift Kasir Perdana

1. Akses menu **Terminal Kasir POS** di `/pos`.
2. Layar modal **Buka Shift Kasir** akan muncul secara otomatis jika kasir belum memiliki shift aktif.
3. Masukkan **Modal Awal Kasir** (uang tunai pecahan kembalian yang ada di laci kasir, contoh: `Rp 200.000`).
4. Masukkan **PIN 4 Digit** kasir, lalu klik **Buka Shift Kasir**. Indikator shift di atas layar akan berubah menjadi warna hijau/kuning aktif.

### Tahap 3: Uji Coba Transaksi Penjualan

1. **Uji Scan Barcode**: Pindai barcode barang menggunakan scanner. Pastikan nama barang, harga, dan subtotal langsung masuk ke daftar keranjang belanja di sebelah kanan.
2. **Uji Fast Keys (1-9)**: Tekan angka `1` atau klik tombol cepat kantong kresek di panel sebelah kiri.
3. **Uji Satuan Bertingkat**: Klik tombol `+Dus` pada barang yang memiliki Multi-UOM untuk memastikan harga grosir diterapkan.
4. **Pilih Metode Pembayaran**:
    - **Uji Tunai**: Masukkan nominal bayar (atau klik tombol Fast Cash `Pas`, `50k`, `100k`). Tekan tombol **BAYAR [SPASI]**. Pastikan struk tercetak rapi dan laci kasir terbuka secara otomatis.
    - **Uji QRIS**: Pilih metode QRIS, pastikan kode QR muncul di layar, lalu selesaikan pembayaran.
    - **Uji Kasbon**: Pilih nama pelanggan yang sudah didaftarkan (`F3`), pilih metode Kasbon, lalu selesaikan transaksi. Cek bahwa nota mencatat sisa plafon dan rincian hutang pelanggan.

### Tahap 4: Uji Coba E-Struk WhatsApp Publik

1. Pada modal konfirmasi transaksi berhasil, klik tombol **Kirim WhatsApp**.
2. Nomor WhatsApp pelanggan akan otomatis terisi dengan pesan struk ramah berformat nota thermal.
3. Pelanggan dapat membuka tautan e-Struk publik (link token aktif 24 jam) yang dapat disimpan di smartphone mereka tanpa perlu mencetak kertas fisik.

### Tahap 5: Tutup Shift Kasir & Cetak Z-Report (Akhir Hari)

1. Di akhir jam kerja kasir, klik tombol **Status Shift** di bilah atas POS -> klik **Tutup Shift Kasir (Blind Close)**.
2. **Blind Count (Penting untuk Mencegah Kebocoran Kas)**: Kasir wajib menghitung uang fisik yang ada di dalam laci kasir tanpa melihat angka total penjualan sistem.
3. Kasir memasukkan nominal fisik uang tunai yang dihitung, uang koin, dan catatan serah terima.
4. Masukkan PIN kasir dan klik **Konfirmasi Tutup Shift**.
5. Sistem akan mencetak **Ringkasan Z-Report Penutupan Shift** yang membandingkan:
    - Total modal awal.
    - Total penjualan tunai sistem.
    - Total uang fisik di laci.
    - Status selisih (_Seimbang / Selisih Lebih / Selisih Kurang_).
6. Rekonsiliasi selesai, riwayat shift dapat diaudit kapan saja di `/shifts` (`https://waroeng.umkaem.my.id/shifts`)!

---

## 15. Troubleshooting & FAQ Setup Pertama Kali

### ❓ Tanya 1: Printer kasir tidak merespons sama sekali saat transaksi selesai.

- **Solusi**:
    1. Pastikan kabel printer tertancap kokoh dan lampu indikator daya (Power) menyala biru/hijau (bukan merah kedip-kedip).
    2. Jika menggunakan IP Port 9100, pastikan tablet/komputer kasir terhubung ke jaringan Wi-Fi toko yang sama dengan printer. Lakukan uji _ping_ atau tes koneksi di modal printer `/settings/store`.
    3. Jika menggunakan RawBT di Windows/Android, pastikan aplikasi RawBT sedang berjalan di latar belakang (_background service_ pada `127.0.0.1:9100`).

### ❓ Tanya 2: Laci kasir (Cash Drawer) tidak mau membuka saat transaksi tunai selesai.

- **Solusi**:
    1. Pastikan kabel telepon laci (RJ11/RJ12) terpasang di soket **DK (Drawer Kick)** di bagian belakang printer thermal, bukan di soket router internet.
    2. Pastikan lubang kunci fisik laci kasir berada pada posisi **Vertikal (Otomatis)**, bukan posisi terkunci manual horisontal.
    3. Pastikan opsi `[x] Buka Laci Otomatis` di halaman `/settings/store` sudah dicentang.

### ❓ Tanya 3: Teks di struk thermal terpotong di tepi kanan kertas.

- **Solusi**:
  Buka modal pengaturan printer di `/settings/store`, ubah pengaturan **Lebar Kertas** dari `80 mm` menjadi `58 mm` (atau sebaliknya sesuaikan dengan lebar roll kertas Anda), lalu atur Margin Kanan menjadi `1 mm` dan ukuran font ke mode `Compact`.

### ❓ Tanya 4: Barcode scanner membaca angka tetapi tidak otomatis menekan Enter.

- **Solusi**:
  Hampir semua scanner barcode baru membutuhkan scan barcode konfigurasi bawaan buku manual scanner untuk mengaktifkan fitur `Auto Carriage Return (CR / Enter Suffix)`. Buka lembar panduan bawaan scanner Anda dan scan barcode bernama **"Add CR Suffix"** atau **"Enter Suffix"**.

### ❓ Tanya 5: Kasir tidak sengaja salah input modal awal saat buka shift.

- **Solusi**:
  Admin Toko atau Supervisor dapat membuka menu **Laporan Shift** di `/shifts` (`https://waroeng.umkaem.my.id/shifts`), memilih shift kasir yang bersangkutan, lalu memeriksa buku kas masuk/keluar untuk melakukan koreksi melalui modul **Buku Kas Toko** di `/finance/cash-flows`.

---

> [!TIP]
> **Dukungan & Bantuan Operasional:**  
> Simpan tautan panduan ini pada _bookmark browser_ komputer kasir Anda. Untuk rincian teknis mengenai arsitektur server, silakan merujuk pada [Panduan Teknis Development & Deployment](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_TEKNIS_DEVELOPMENT_DAN_DEPLOYMENT.md). Untuk rincian pintasan keyboard kasir, rujuk pada [Panduan Operasional Kasir & Hardware](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_OPERASIONAL_KASIR_DAN_HARDWARE.md).
