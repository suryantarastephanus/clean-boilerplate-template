# ==========================================
# STAGE 1: Install PHP Composer Dependencies
# ==========================================
FROM composer:2 AS composer-builder
WORKDIR /app

COPY composer*.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize --no-dev

# ==========================================
# STAGE 2: Production Web Server (PHP 8.4-FPM + Nginx + Supervisor)
# Frontend assets (public/build) are pre-compiled locally and included from repo.
# ==========================================
FROM php:8.4-fpm-alpine AS runner

# Platform build arguments
ARG APP_ENV
ARG APP_NAME
ARG GIT_SHA
ENV APP_ENV=${APP_ENV:-production} \
    APP_NAME=${APP_NAME:-App}

# Install production system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    tzdata

# Copy official PHP extension installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions reliably with automated dependency resolution
RUN install-php-extensions \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    pdo_sqlite \
    bcmath \
    mbstring \
    zip \
    opcache \
    sockets \
    intl \
    exif \
    gd \
    pcntl

# Copy Nginx, PHP, and Supervisor configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-custom.ini
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# Set working directory
WORKDIR /var/www/html

# Copy application files (termasuk public/build hasil compile lokal)
COPY . /var/www/html

# Copy built vendor from composer-builder
COPY --from=composer-builder /app/vendor /var/www/html/vendor

# Create storage and bootstrap cache directories and set permissions
RUN mkdir -p /var/www/html/storage/app/public \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose HTTP port
EXPOSE 80

# Configure entrypoint and process supervisor
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

