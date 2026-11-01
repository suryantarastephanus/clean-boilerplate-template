# 🚀 Clean Full-Stack Boilerplate & Starter Template

[![PHP 8.4](https://img.shields.io/badge/PHP-8.4-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)
[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js v3](https://img.shields.io/badge/Inertia.js-v3-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Pest Tests](https://img.shields.io/badge/Tests-Pest_PHP-22C55E?style=flat&logo=pest&logoColor=white)](https://pestphp.com/)

Template starter kit modern full-stack berkinerja tinggi, bersih (*zero-bloat*), dan *production-ready*. Dirancang khusus sebagai fondasi standar untuk membangun aplikasi SaaS, portal web internal, sistem manajemen, atau platform digital enterprise tanpa keterikatan pada modul bisnis spesifik.

Template ini telah dilengkapi konfigurasi **PostgreSQL 16 default**, otentikasi lengkap (Fortify + 2FA + Passkeys/WebAuthn), type-safe routing (Laravel Wayfinder), pipeline Docker multi-stage, serta ekosistem **65 Global AI Agent Skills** yang siap dihubungkan langsung ke berbagai AI coding assistant (Gemini, Antigravity, Claude Code, Cursor, Hermes).

---

## 🌟 Tech Stack & Fitur Utama

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | **Laravel 12** (PHP 8.4) | Framework PHP modern dengan arsitektur modular, Form Requests, Policies, dan Service Container. |
| **Authentication** | **Laravel Fortify** | Sistem otentikasi komprehensif: Login, Registrasi, Reset Password, Two-Factor Authentication (TOTP / QR), dan WebAuthn Passkeys. |
| **Frontend** | **React 19** + **TypeScript 5.7** | Client-side reactive SPA bertenaga React 19 dengan dukungan penuh TypeScript strictly typed. |
| **SPA Bridge** | **Inertia.js v3** | Single Page Application modern tanpa kompleksitas API manual, dilengkapi Layout Props, Instant Visits, dan Optimistic Updates. |
| **Styling** | **Tailwind CSS v4** + **Radix UI** | Styling berbasis CSS-first token, komponen UI aksesibel dari Radix UI Primitives, Lucide Icons, dan Sonner Toast. |
| **Typed Routing** | **Laravel Wayfinder** | Auto-generate fungsi TypeScript untuk controller dan named routes Laravel (`@/actions`, `@/routes`). |
| **Database** | **PostgreSQL 16** (`pgsql`) | Database relational enterprise kelas dunia sebagai default driver, didukung SQLite untuk fast-testing. |
| **Cache & Queue** | **Redis Alpine** | Caching berkecepatan tinggi dan background job worker queue. |
| **DevOps** | **Docker Multi-Stage** | Multi-stage Dockerfile (Nginx + PHP 8.4-FPM + Supervisor) & Docker Compose untuk orkestrasi lokal/production. |
| **Testing** | **Pest PHP v5** | 48 unit & feature tests bawaan yang mencakup alur otentikasi, profil pengguna, dan proteksi rute. |
| **Code Formatter** | **Laravel Pint** | Standardisasi gaya kode PHP mengikuti aturan Laravel PSR-12 secara otomatis. |
| **AI Skills** | **65 Global AI Skills** | Ekosistem keahlian AI modular terpusat (Architecture, Testing, Security, Frontend, Database, dll). |

---

## 🤖 Integrasi 65 Global AI Skills

Template ini telah terhubung dengan arsitektur **Global AI Skills Hub**. Anda tidak perlu menduplikasi puluhan file skill ke setiap repositori proyek baru.

Semua 65 skill AI terpasang secara terpusat di mesin pengembang:
- `~/.gemini/config/skills` (Gemini & Google Antigravity)
- `~/.agents/skills` (Open-source AI coding agents)
- `~/.claude/skills` (Claude Code)

### Menghubungkan Skills ke Proyek Baru:
Cukup jalankan satu perintah berikut di root folder proyek:

**Windows (PowerShell):**
```powershell
.\scripts\link-skills.ps1
```

**Linux / macOS (Bash):**
```bash
./scripts/link-skills.sh
```

> **Catatan Teknis**: Skrip ini membuat **NTFS Junction** (Windows) atau **Symlink** (Unix) ke folder global, sehingga asisten AI langsung mengenali seluruh 65 skill secara instan dengan konsumsi disk 0 byte tambahan.

---

## ⚡ Panduan Memulai Cepat (Quick Start)

### Metode A: Menggunakan Inisialisasi Otomatis (Wizard)

Tersedia wizard interaktif untuk menyiapkan proyek baru dalam hitungan detik:

```powershell
.\scripts\init-new-project.ps1
```

Wizard ini akan secara otomatis:
1. Meminta nama aplikasi baru Anda.
2. Menyalin file `.env.example` ke `.env` dan menyesuaikan konfigurasi database.
3. Melakukan instalasi dependency (`composer install` & `npm install`).
4. Men-generate App Key (`php artisan key:generate`).
5. Menghubungkan 65 Global AI Skills ke proyek.
6. Menyiapkan database PostgreSQL dan menjalankan migrasi awal.

---

### Metode B: Panduan Manual (Step-by-Step)

#### 1. Clone & Masuk ke Folder Proyek
```bash
git clone https://github.com/suryantarastephanus/clean-boilerplate-template.git nama-project-anda
cd nama-project-anda
```

#### 2. Install Dependency
```bash
composer install
npm install
```

#### 3. Salin Konfigurasi Environment & Generate Key
```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env

# Generate Application Encryption Key
php artisan key:generate
```

#### 4. Hubungkan AI Skills
```powershell
.\scripts\link-skills.ps1
```

#### 5. Konfigurasi Database PostgreSQL
Buka file `.env` dan sesuaikan koneksi database Anda:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nama_db_anda
DB_USERNAME=postgres
DB_PASSWORD=secret
```

#### 6. Jalankan Migrasi & Database Seeder
```bash
php artisan migrate --seed
```

#### 7. Jalankan Development Server
Gunakan perintah terpadu untuk menjalankan server web, queue worker, dan vite bundler secara bersamaan:
```bash
composer run dev
```
Akses aplikasi melalui browser di: `http://localhost:8000`

---

## 🔒 Informasi Khusus File `.gitignore`

Pada template master ini, seluruh aturan di dalam `.gitignore` sengaja ditandai dengan tanda pagar (`#`) dan label instruksi. Hal ini bertujuan agar saat Anda mencadangkan atau mengekspor repositori boilerplate ini ke GitHub, seluruh struktur direktori esensial (seperti `scripts/`, template konfigurasi, dan file pendukung) tidak terlewatkan.

### Cara Mengaktifkan `.gitignore` di Proyek Baru:
Ketika Anda membuat repositori git baru untuk proyek aplikasi riil:
1. Buka file `.gitignore`.
2. Hapus tanda pagar (`#`) pada baris-baris standar yang perlu diabaikan oleh Git (seperti `/vendor`, `/node_modules`, `.env`, `/public/build`, dll).
3. Jalankan `git init` dan lakukan commit awal proyek Anda.

---

## 🐳 Deployment & Menjalankan via Docker

Template ini menyertakan konfigurasi Docker siap pakai dengan PostgreSQL 16 dan Redis:

```bash
# Build dan jalankan seluruh container di background
docker compose up -d --build
```

### Akses Layanan Container:
- **Aplikasi Web**: [http://localhost:8080](http://localhost:8080)
- **PostgreSQL Database**: `localhost:5432` (User: `postgres`, Password: `secret`, DB: `boilerplate_db`)
- **Redis Cache/Queue**: `localhost:6379`

Untuk menghentikan container:
```bash
docker compose down
```

---

## 🧪 Testing, Formatting, & Validasi Tipe

Pastikan kualitas dan stabilitas kode selalu terjaga:

```bash
# 1. Menjalankan Test Suite Pest PHP
php artisan test

# 2. Format kode PHP sesuai standar PSR-12 / Laravel Pint
vendor/bin/pint

# 3. Validasi type-checking TypeScript (Inertia + React)
npm run check
npm run types:check

# 4. Generate ulang typed routes Wayfinder (jika ada controller/route baru)
php artisan wayfinder:generate --with-form

# 5. Build asset frontend untuk production
npm run build
```

---

## 👥 Akun Demo Bawaan (Default Seeder)

Setelah menjalankan `php artisan migrate --seed`, akun demo berikut tersedia untuk pengujian:

| Role | Email | Password | Fitur Bawaan |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `password` | Manajemen user, toggle impersonasi, akses dashboard, pengaturan keamanan 2FA & Passkeys |
| **Regular User** | `user@example.com` | `password` | Akses profil, ubah password, autentikasi 2 faktor |

---

## 📂 Struktur Direktori Utama

```
├── app/
│   ├── Actions/Fortify/      # Logika pendaftaran, pembaruan profil & password
│   ├── Http/Controllers/    # Controller Dashboard, User Management, Settings
│   └── Models/              # Model User & UserActivity
├── config/                  # Konfigurasi Laravel (database pgsql, fortify, auth, dll)
├── database/
│   ├── factories/           # Factory User
│   ├── migrations/          # Migrasi inti (users, sessions, passkeys, fortify)
│   └── seeders/             # DatabaseSeeder (Admin & Demo User)
├── docker/                  # Nginx vhost & konfigurasi Supervisor
├── resources/
│   ├── css/app.css          # Tailwind CSS v4 styling & theme tokens
│   └── js/
│       ├── actions/         # Wayfinder typed controller actions
│       ├── components/      # UI components (Radix primitives, modals, buttons)
│       ├── layouts/         # App & auth layout wrappers
│       ├── pages/           # Halaman Inertia (auth, dashboard, users, settings)
│       └── routes/          # Wayfinder typed named routes
├── routes/
│   ├── auth.php             # Rute otentikasi tambahan
│   └── web.php              # Rute utama aplikasi
├── scripts/
│   ├── init-new-project.ps1 # Wizard otomatis inisialisasi proyek baru
│   ├── link-skills.ps1      # Skrip junction global skills untuk Windows
│   ├── link-skills.sh       # Skrip symlink global skills untuk Linux/macOS
│   └── sync-global-skills.ps1 # Sinkronisasi master skills ke folder global
├── tests/
│   └── Feature/             # Pest feature tests (Auth, Security, Profile, Users)
├── docker-compose.yml       # Orkestrasi Docker (App + Postgres 16 + Redis)
├── Dockerfile               # Multi-stage production container
└── vite.config.ts           # Konfigurasi Vite-Plus dengan React Compiler & Wayfinder
```

---

## 📄 Lisensi

Boilerplate ini bersifat open-source di bawah lisensi [MIT License](https://opensource.org/licenses/MIT). Anda bebas menggunakannya untuk proyek komersial maupun personal.
