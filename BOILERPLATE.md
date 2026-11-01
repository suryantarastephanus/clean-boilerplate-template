# 🚀 Master Clean Boilerplate

> **Modern Full-Stack Starter Template** powered by Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4, PostgreSQL 16, and 62 Global AI Skills.

---

## 🌟 Tech Stack Overview

- **Backend**: PHP 8.4, Laravel 13 (`laravel/framework: ^13.17`)
- **Authentication**: Laravel Fortify (`laravel/fortify: ^1.37.2`) with 2FA/TOTP & WebAuthn / Passkeys (`@laravel/passkeys`)
- **Frontend**: React 19 (`react: ^19.2.0`), TypeScript 5.7, Inertia.js v3 (`@inertiajs/react: ^3.0.0`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI Primitives, Lucide Icons, Sonner
- **Bundler & Compiler**: Vite-Plus core, Babel React Compiler preset, Laravel Wayfinder typed routes
- **Database**: PostgreSQL 16 (`pgsql`) default, with SQLite support for lightweight tests
- **Cache & Queue**: Redis Alpine, Laravel Queue listener
- **DevOps**: Production Multi-stage Dockerfile (Nginx + PHP 8.4-FPM + Supervisor), Docker Compose
- **Testing & Quality**: Pest PHP v5, PHPStan / Larastan, Laravel Pint

---

## 🤖 62 Global AI Skills

Semua 62 AI skills telah terpasang secara global di:
- `C:\Users\stanley\.agents\skills`
- `C:\Users\stanley\.claude\skills`

### Menghubungkan Skills ke Project Baru
Di project baru mana pun yang dibuat dari template ini, jalankan:
```powershell
.\scripts\link-skills.ps1
```
Atau di Linux / macOS / Bash:
```bash
./scripts/link-skills.sh
```
Skrip ini membuat **Directory Junction / Symlink** ke folder global sehingga AI Agent (Antigravity, Claude Code, Cursor) langsung memiliki akses instan ke 62 skills tanpa menduplikasi storage disk.

---

## ⚡ Memulai Project Baru (Quick Start)

### 1. Inisialisasi Otomatis (Wizard)
Jalankan wizard inisialisasi:
```powershell
.\scripts\init-new-project.ps1
```

### 2. Manual Setup
```bash
# 1. Install dependencies
composer install
npm install

# 2. Salin environment
copy .env.example .env
php artisan key:generate

# 3. Hubungkan Global Skills
.\scripts\link-skills.ps1

# 4. Migrasi Database PostgreSQL
php artisan migrate --seed

# 5. Jalankan Development Server (Server + Queue + Vite)
composer run dev
```

---

## 🐳 Deployment via Docker (PostgreSQL & Redis)

Satu perintah untuk build dan menjalankan seluruh aplikasi production:
```bash
docker compose up -d --build
```
- **Web App**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Auto Migrate & Seed**: Otomatis dijalankan saat container boot pertama kali.

---

## 🧪 Testing & Code Quality

```bash
# Jalankan test suite Pest
php artisan test

# Format kode sesuai standar Laravel Pint
vendor/bin/pint

# Validasi type TypeScript
npm run check
npm run types:check
```

---

## 👤 Akun Default Seeder

Setelah menjalankan `php artisan db:seed`:
- **Admin**: `admin@example.com` / `password`
- **Demo User**: `user@example.com` / `password`

