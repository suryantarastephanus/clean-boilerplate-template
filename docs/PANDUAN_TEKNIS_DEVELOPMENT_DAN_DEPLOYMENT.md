# 🛠️ PANDUAN TEKNIS PENGEMBANGAN & DEPLOYMENT (WAROENG POS)

**Target Pembaca:** Tim Pengembang (Software Engineer / Fullstack Developer), DevOps, dan Technical Lead.  
**Tujuan Dokumen:** Menstandarisasi alur kerja pengembangan lokal, strategi kompilasi aset frontend, arsitektur container Docker, dan prosedur deployment cepat ke server produksi.

---

## 📌 DAFTAR ISI

1. [Arsitektur Sistem & Stack Teknologi](#1-arsitektur-sistem--stack-teknologi)
2. [Strategi Build: Local Pre-Compiled vs Server Build](#2-strategi-build-local-pre-compiled-vs-server-build)
3. [Arsitektur Dockerfile (Fast 2-Stage Container)](#3-arsitektur-dockerfile-fast-2-stage-container)
4. [Standard Operating Procedure (SOP) Pengembang](#4-standard-operating-procedure-sop-pengembang)
5. [Mekanisme Deployment ke Server Produksi (Easypanel)](#5-mekanisme-deployment-ke-server-produksi-easypanel)
6. [Troubleshooting & FAQ Tim Teknis](#6-troubleshooting--faq-tim-teknis)

---

## 1. Arsitektur Sistem & Stack Teknologi

- **Backend**: Laravel 12 (PHP 8.4)
    - Arsitektur: Single-Database Multi-Tenant dengan Global Scope `tenant_id`
    - ORM: Eloquent dengan relasi eager loading teroptimasi
    - Routing & Typed Actions: Laravel Wayfinder (menghasilkan fungsi TypeScript otomatis)
- **Frontend**: React 19 + Inertia.js v3 + TypeScript
    - Styling: Tailwind CSS v4 + Shadcn/ui
    - Bundler: Vite (dengan plugin `@laravel/vite-plugin-wayfinder` dan `@tailwindcss/vite`)
- **Web & Runtime Container**: Nginx Alpine + PHP 8.4-FPM + Supervisor
- **Database**: PostgreSQL / MySQL 8
- **Platform Cloud**: VPS Easypanel (Docker Swarm / Standalone Container)

---

## 2. Strategi Build: Local Pre-Compiled vs Server Build

### ⚡ Mengapa Build Frontend Dilakukan di Lokal?

Sebelumnya, proses deploy di VPS memakan waktu **3 s/d 5 menit** per rilis karena Dockerfile di VPS melakukan kompilasi penuh:

1. Menarik image `node:22-alpine` dari registry publik.
2. Menginstall paket PHP di dalam container Node untuk kebutuhan Wayfinder (`apk add php84 ...`).
3. Menjalankan `npm ci` yang mengunduh ratusan megabyte dependensi node dari registry npm.
4. Menjalankan `npm run build` yang memakan konsumsi CPU dan RAM tinggi pada VPS.
5. Sering menimbulkan lonjakan beban (CPU spike) atau kegagalan _Out-of-Memory (OOM)_ pada spesifikasi VPS kecil/menengah.

### Solusi: Local Pre-Compiled Assets

Dengan strategi **Local Pre-Compiled Assets**:

- Tim pengembang mengompilasi aset frontend di mesin lokal sebelum melakukan commit:
    ```powershell
    npm run build
    ```
- File output build di direktori `public/build/` (termasuk `manifest.json` dan bundle JS/CSS) **ikut dicatat dan di-commit ke Git**.
- Server VPS **tidak lagi memerlukan Node.js, NPM, maupun dependensi build frontend**.
- **Hasil:** Waktu proses deployment di VPS terpangkas drastis dari **~3 menit menjadi hanya 30–45 detik**.

---

## 3. Arsitektur Dockerfile (Fast 2-Stage Container)

Dockerfile proyek ini dioptimasi menjadi **2-Stage Multi-Stage Build** yang sangat ramping:

```dockerfile
# ==========================================
# STAGE 1: Composer Dependency Builder
# ==========================================
FROM composer:2 AS composer-builder
WORKDIR /app
COPY composer*.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev

# ==========================================
# STAGE 2: Production Web Server (PHP 8.4-FPM + Nginx + Supervisor)
# ==========================================
FROM php:8.4-fpm-alpine AS runner
# Install Nginx, Supervisor, Ekstensi PHP
...
# Copy source code aplikasi (termasuk folder public/build hasil compile lokal)
COPY . /var/www/html
# Copy vendor hasil dump-autoload dari Stage 1
COPY --from=composer-builder /app/vendor /var/www/html/vendor
```

### Keuntungan Arsitektur Ini:

1. **Zero-Node di Produksi**: Container produksi tidak memerlukan Node.js, menghemat ukuran image dan memperkecil celah keamanan (attack surface).
2. **Layer Caching Efektif**: Ekstensi PHP dan Composer di-cache oleh Docker daemon VPS, sehingga deploy berikutnya hanya memproses delta kode PHP/aset statis.

---

## 4. Standard Operating Procedure (SOP) Pengembang

Bagi setiap pengembang yang melakukan perubahan fitur atau perbaikan bug:

### Langkah 1: Jalankan Build Frontend (Wajib jika ada perubahan UI/JS/CSS)

```powershell
npm run build
```

_Pastikan tidak ada galat TypeScript atau error Vite._

### Langkah 2: Format & Validasi Kode PHP

```powershell
# Format otomatis standar PSR/Pint
vendor/bin/pint --format agent

# Jalankan pengujian otomatis
php artisan test --compact
```

### Langkah 3: Git Commit Termasuk Folder Build

```powershell
git add -A
git commit -m "feat/fix: deskripsi ringkas perubahan"
```

### Langkah 4: Push ke Remote Repository

```powershell
git push origin main
```

---

## 5. Mekanisme Deployment ke Server Produksi (Easypanel)

Setelah kode berhasil di-push ke branch `origin/main`, trigger build container produksi dengan script otomatis:

### Menjalankan Trigger Deploy:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/trigger-deploy.ps1
```

### Apa yang Terjadi di Balik Layar?

1. Script mengirimkan HTTP POST request ke Webhook URL Easypanel:
   `http://43.157.212.24:3000/api/deploy/a5552c860c2792106fbde40c8fb365116680437cdea0f597`
2. Easypanel menarik commit terbaru dari GitHub (`origin/main`).
3. Docker menjalankan build cepat (Stage 1 Composer + Stage 2 Nginx/PHP).
4. Container baru dijalankan dan [docker/entrypoint.sh](file:///c:/Users/stanley/Documents/GitHub/kasir/docker/entrypoint.sh) mengeksekusi:
    - Migrasi database otomatis (`php artisan migrate --force`).
    - Penautan storage link (`php artisan storage:link`).
    - Caching rute, konfigurasi, dan view (`php artisan config:cache`, `route:cache`, `view:cache`).
5. Layanan kasir langsung aktif dan dapat diakses di `https://waroeng.umkaem.my.id/`.

---

## 6. Troubleshooting & FAQ Tim Teknis

### Q1: Muncul error "Vite manifest not found at /var/www/html/public/build/manifest.json" di server.

**Penyebab:** Pengembang melakukan push tanpa menjalankan `npm run build` di lokal, atau folder `public/build` tidak sengaja terhapus.  
**Solusi:** Jalankan `npm run build` di lokal, cek `git status` untuk memastikan file di `public/build/` masuk ke staging, lalu commit dan deploy ulang.

### Q2: Perubahan tombol / CSS di halaman tidak terlihat oleh pengguna setelah deploy.

**Penyebab:** Browser pengguna masih menyimpan cache JavaScript versi lama, atau pengembang lupa menjalankan `npm run build` sebelum push.  
**Solusi:**

1. Pastikan aset lokal sudah di-build (`npm run build`).
2. Tekan `Ctrl + Shift + R` (Hard Refresh) di browser klien untuk membersihkan cache aset statis.

### Q3: Apakah bisa melakukan debugging container di VPS jika diperlukan?

Bisa, akses console container melalui dashboard Easypanel di menu **Terminal**, atau gunakan perintah docker:

```bash
docker exec -it <container_id> sh
```
