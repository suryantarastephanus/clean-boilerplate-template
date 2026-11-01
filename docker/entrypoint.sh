#!/bin/sh
set -e

echo "🚀 Memulai container Application Boilerplate..."

cd /var/www/html

# 1. Pastikan .env ada
if [ ! -f .env ]; then
    echo "📄 File .env tidak ditemukan, menduplikasi dari .env.example..."
    cp .env.example .env
fi

# Helper function untuk update atau append key=value ke .env (mendukung baris yang dikomentari # KEY=)
set_env_var() {
    key="$1"
    val="$2"
    if [ -n "$val" ]; then
        if grep -q "^#\? *${key}=" .env; then
            sed -i "s|^#\? *${key}=.*|${key}=${val}|" .env
        else
            echo "${key}=${val}" >> .env
        fi
    fi
}

# 2. Sinkronkan environment variables dari runtime container (Easypanel / Docker) ke .env
if [ -n "$APP_KEY" ]; then
    set_env_var "APP_KEY" "$APP_KEY"
elif ! grep -q "^APP_KEY=base64:" .env; then
    echo "🔑 Menghasilkan APP_KEY baru..."
    php artisan key:generate --force
fi

set_env_var "APP_NAME" "$APP_NAME"
set_env_var "APP_ENV" "$APP_ENV"
set_env_var "APP_DEBUG" "$APP_DEBUG"
set_env_var "APP_URL" "$APP_URL"
set_env_var "DB_CONNECTION" "$DB_CONNECTION"
set_env_var "DB_HOST" "$DB_HOST"
set_env_var "DB_PORT" "$DB_PORT"
set_env_var "DB_DATABASE" "$DB_DATABASE"
set_env_var "DB_USERNAME" "$DB_USERNAME"
set_env_var "DB_PASSWORD" "$DB_PASSWORD"

# 3. Handle SQLite jika digunakan
if [ "$DB_CONNECTION" = "sqlite" ] || grep -q "^DB_CONNECTION=sqlite" .env; then
    if [ ! -f database/database.sqlite ]; then
        echo "📦 Membuat database/database.sqlite..."
        mkdir -p database
        touch database/database.sqlite
    fi
    chown -R www-data:www-data database/database.sqlite
fi

# 4. Pastikan direktori public storage & symlink terhubung kuat
echo "🔗 Menyiapkan direktori public storage & symlink..."
mkdir -p /var/www/html/storage/app/public
rm -rf /var/www/html/public/storage
php artisan storage:link --force --no-interaction || true

# 5. Fix permissions direktori cache dan storage & bersihkan sisa hot reload
rm -f /var/www/html/public/hot
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 6. Database Migration & Initialization
if [ "$SKIP_MIGRATION" != "true" ]; then
    echo "🔄 Membersihkan cache konfigurasi lama..."
    php artisan config:clear || true

    echo "🔄 Menjalankan migrasi database otomatis (php artisan migrate --force)..."
    php artisan migrate --force || {
        echo "⚠️ Migrasi pertama belum berhasil (kemungkinan DB sedang boot), mencoba kembali dalam 5 detik..."
        sleep 5
        php artisan migrate --force || true
    }

    # Cek apakah tabel user masih kosong; jika iya atau AUTO_SEED=true, jalankan seeder
    if [ "$AUTO_SEED" = "true" ] || ! php artisan tinker --execute 'exit(\App\Models\User::exists() ? 0 : 1);' 2>/dev/null; then
        echo "🌱 Menginisialisasi data awal toko & akun demo (php artisan db:seed --force)..."
        php artisan db:seed --force || true
    fi
fi

# 7. Optimize cache jika di production
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Mengoptimalkan cache konfigurasi, route, dan view..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# 8. Pastikan kepemilikan storage dan logs aman untuk www-data setelah semua command artisan
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
if [ -f /var/www/html/storage/logs/laravel.log ]; then
    chown www-data:www-data /var/www/html/storage/logs/laravel.log
    chmod 664 /var/www/html/storage/logs/laravel.log || true
fi

echo "✅ Container siap! Menjalankan layanan web server..."
exec "$@"
