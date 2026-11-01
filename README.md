# 🏪 WAROENG - Smart Retail POS & Multi-Tenant SaaS Platform

Sistem Point-of-Sale (POS) kasir ritel sub-detik berbasis web dengan arsitektur Multi-Tenant SaaS, mendukung pencetakan thermal printer langsung (ESC/POS & RawBT), laci kasir otomatis, multi-satuan bertingkat (Multi-UOM), kasbon pelanggan, kiosk absensi, dan manajemen inventori.

---

## 📚 STRUKTUR DOKUMENTASI SISTEM (TERPISAH)

Sesuai tata kelola keamanan dan wewenang pengguna, dokumentasi sistem **dipisahkan menjadi 2 bagian independen**:

### 1. 🏢 [Dokumentasi SaaS Management & SuperAdmin](docs/PANDUAN_SAAS_MANAGEMENT_SUPERADMIN.md)

> **Khusus Pemilik Platform (SuperAdmin), DevOps, & Tim Teknis SaaS.**  
> _(Dokumen Internal/Confidential - Tidak untuk pengguna kasir toko)_

- Arsitektur Multi-Tenancy & Global Scope Scoping.
- Pendaftaran & Aktivasi Toko Baru (`/superadmin/tenants`).
- Pengaturan Paket Langganan & Fitur Modular (`/superadmin/plans`).
- Infrastruktur Cloud Docker & Webhook Deployment Easypanel.
- Strategi Keamanan Database & Backup.

---

### 2. 🧾 [Dokumentasi Operasional Kasir, Hardware & RawBT](docs/PANDUAN_OPERASIONAL_KASIR_DAN_HARDWARE.md)

> **Khusus Admin Toko (Owner), Supervisor, & Kasir (Staff Operasional Toko).**

- Alur kerja kasir POS (Buka Shift, Barcode Scanner, Multi-UOM, Kasbon/QRIS/Tunai, Z-Report).
- Cheat Sheet Shortcut Keyboard Kasir (`F1` s/d `F9`, `SPACE`, `ENTER`).
- **Panduan Instalasi & Konfigurasi RawBT**:
    - Download & Setup di Android (Google Play Store).
    - Download & Setup di Windows PC (`rawbt.ru` Print Server).
    - Konfigurasi Virtual Port 9100 (`127.0.0.1:9100`).
- Setup Printer Thermal Jaringan (LAN/Wi-Fi Port 9100 Direct Socket).
- Pengaturan Laci Kasir Otomatis (Cash Drawer Solenoid RJ11).
- **Panduan Lengkap Silent Printing** (Chrome/Edge `--kiosk-printing` & Direct Socket Port 9100 Zero-Click).

---

### 3. 📖 [Panduan Induk Akses & Peta Rute URL](docs/PANDUAN_AKSES_DAN_PENGGUNAAN.md)

- Kredensial akun demo (`superadmin`, `admin`, `spv`, `kasir`).
- Daftar seluruh URL rute halaman sistem kasir & SaaS.
- Tata letak visual antarmuka POS High-Density 60/40 Split.

---

### 4. 🛠️ [Panduan Teknis Pengembangan & Deployment](docs/PANDUAN_TEKNIS_DEVELOPMENT_DAN_DEPLOYMENT.md)

> **Khusus Tim Pengembang (Software Engineer / Fullstack), DevOps, dan Technical Lead.**

- Strategi kompilasi aset frontend lokal (_Local Pre-Compiled Assets_).
- Arsitektur Dockerfile 2-stage (waktu deploy di VPS terpangkas dari 3 menit menjadi ~30-40 detik).
- Standard Operating Procedure (SOP) pengembang: `npm run build`, Pint, pest test, commit, push, dan webhook trigger.
- Troubleshooting build dan deployment.

---

## 🛠️ Stack Teknologi

- **Backend**: Laravel 12 (PHP 8.4)
- **Frontend**: React 19 + Inertia.js v3 + TypeScript + Tailwind CSS
- **Hardware Integration**: ESC/POS Protocol, Raw Socket Port 9100 TCP, RawBT Virtual Bridge
- **Deployment**: Docker, Easypanel, PostgreSQL
