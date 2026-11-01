# DEFINITIVE MASTER SPECIFICATION, ROADMAP & AI AGENT DIRECTIVE (V5)

**Project:** SaaS Minimarket POS & Mini-ERP (Single DB Multi-Tenant)
**Target Environment:** Antigravity (Gemini 1.5 Pro / Claude 3.5 Sonnet / Claude 3.7 Sonnet)
**Stack:** Laravel 11, MySQL 8, React 18, Tailwind CSS, Shadcn UI, Node.js Daemon (ESC/POS)
**Version:** 5.0 Definitive Master Release

---

## 1. SYSTEM ARCHITECTURE & CORE CONVENTIONS

### 1.1 Universal SaaS Feature Toggle Engine

Seluruh modul dan sub-fitur operasional dikendalikan penuh oleh Super Admin melalui kolom `features_json` pada tabel `subscription_plans`. Setiap request API dan menu UI wajib memverifikasi permission ini:

```json
{
    "hrd_module": true,
    "wholesale_pricing": true,
    "debt_management": {
        "is_enabled": true,
        "fast_lookup": true,
        "credit_limit": true
    },
    "margin_protection": {
        "is_enabled": true,
        "pin_override": true
    },
    "idle_screen_lock": {
        "is_enabled": true,
        "timeout_seconds": 180
    },
    "tax_management": {
        "is_enabled": true,
        "default_mode": "inclusive"
    }
}
```

### 1.2 Multi-Device Concurrency & Terminal Binding

- Setiap mesin fisik (PC Kasir, Tablet, Mobile) wajib terdaftar di tabel `devices` dengan `device_uuid` unik di `localStorage`.
- Pembukaan shift kasir (`shifts`), transaksi struk (`sales`), dan audit trail (`activity_logs`) **wajib** mengikat `device_id` bersama `user_id`.
- Gunakan _Optimistic Locking_ (`lockForUpdate()`) saat memotong kuantitas batch FIFO `purchase_items` untuk mencegah _race condition_ antar kasir.

### 1.3 User Authentication & 4-Digit Numeric PIN

- Setiap user (Kasir, Supervisor, TenantAdmin, SuperAdmin) wajib memiliki `pin_code` 4 digit numerik.
- **Auto-Lock Saat Idle:** Listener JS mendeteksi ketiadaan aktivitas mouse/keyboard/sentuh selama 180 detik. Layar terkunci dengan full-screen blur dan hanya dapat dibuka dengan PIN 4 angka milik kasir aktif tanpa mereset keranjang belanja.
- **Supervisor Override (4-Digit PIN):** Digunakan untuk menyetujui diskon di bawah modal HPP FIFO serta pelampauan batas maksimal kasbon pelanggan.

### 1.4 Fast Kasbon Lookup & Credit Limit Engine

- **Quick Code:** Kode panggil instan dari inisial nama + 3 digit terakhir nomor WA (contoh: `Anti` - `085310101020` -> `a020`).
- **Tampilan Saldo Hutang:** Menampilkan total hutang aktif berjalan (`current_debt`) saat pelanggan dipilih di kasir.
- **Credit Limit Plafon:** Jika $(\text{current\_debt} + \text{new\_total}) > \text{max\_credit\_limit}$, sistem memblokir tombol bayar dan mewajibkan otorisasi PIN 4 digit Supervisor.

### 1.5 Inline UI Principles (Shadcn UI)

- Mutasi data keranjang (Qty, diskon item), perubahan master harga, dan pengisian jumlah fisik Stock Opname dilakukan secara **inline** (cell inputs atau popovers/drawers) tanpa modal kaku atau berpindah halaman.
- Navigasi keyboard: `F2` (fokus scan barcode), `F4` (batal transaksi), `Space` (eksekusi bayar).

---

## 2. BUSINESS FLOWCHARTS

### Flow 1: Fast Kasbon & Credit Limit Verification

```text
[Kasir di POS] ➔ [Pilih Metode Kasbon] ➔ [Ketik Shortcut 'a020']
       ➔ [Sistem Temukan Pelanggan: 'Anti - 085310101020']
       ➔ [Tampilkan Saldo Hutang Lama: Rp 350.000 | Plafon: Rp 500.000]
       ➔ [Total Belanja Baru: Rp 200.000 ➔ Akumulasi: Rp 550.000]
       ➔ [Melebihi Batas Kredit?]
           ├── [TIDAK] ➔ [Transaksi Selesai ➔ Cetak Struk]
           └── [YA]    ➔ [Layar Freeze: 'Limit Kredit Terlampaui']
                       ➔ [Supervisor Input 4-Digit PIN] ➔ [Disetujui ➔ Transaksi Diproses]
```

### Flow 2: Margin Protection (Anti Jual Rugi)

```text
[Kasir Masukkan Diskon Item/Global] ➔ [Sistem Cek Estimasi HPP FIFO]
       ➔ [Harga Jual Akhir < Total Modal HPP?]
           ├── [TIDAK] ➔ [Lolos Validasi]
           └── [YA]    ➔ [Layar Freeze: 'Peringatan Jual Rugi']
                       ➔ [Supervisor Input 4-Digit PIN] ➔ [Bypass Disetujui ➔ Tercatat di Audit Log]
```

### Flow 3: Auto-Lock Idle Terminal

```text
[Kasir Tinggalkan Terminal] ➔ [Timer 180 Detik Habis Tanpa Aktivitas]
       ➔ [Layar Mengabur & Muncul Lock Screen]
       ➔ [Kasir Kembali ➔ Input 4-Digit PIN Pribadi]
       ➔ [Validasi Berhasil ➔ Layar Terbuka Kembali, Keranjang Utuh]
```

---

## 3. MASTER DATABASE SCHEMA (MySQL 8)

```sql
-- 1. SaaS & Multi-Tenancy
CREATE TABLE subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    max_users INT NOT NULL DEFAULT 5,
    features_json JSON NOT NULL, -- Toggle seluruh modul/fitur
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE tenants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT UNSIGNED NOT NULL,
    store_name VARCHAR(150) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    subscription_ends_at DATE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

CREATE TABLE devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    device_uuid VARCHAR(100) NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_type ENUM('Desktop', 'Tablet', 'Mobile') NOT NULL DEFAULT 'Desktop',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    is_authorized BOOLEAN NOT NULL DEFAULT TRUE,
    last_active_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_tenant_device (tenant_id, device_uuid),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pin_code VARCHAR(4) NOT NULL, -- PIN numerik 4 digit universal
    role ENUM('SuperAdmin', 'TenantAdmin', 'Supervisor', 'Kasir') NOT NULL DEFAULT 'Kasir',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 2. Master Data Produk & Pelanggan
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    is_taxable BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE, -- Freeze saat opname
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_tenant_sku (tenant_id, sku),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE product_units (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    barcode VARCHAR(100) NOT NULL,
    unit_name VARCHAR(50) NOT NULL, -- Pcs, Renceng, Karton
    conversion_qty INT NOT NULL DEFAULT 1,
    retail_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    wholesale_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_product_barcode (barcode),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE customers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    wa_number VARCHAR(30) NOT NULL,
    quick_code VARCHAR(10) GENERATED ALWAYS AS (
        LOWER(CONCAT(LEFT(TRIM(name), 1), RIGHT(TRIM(wa_number), 3)))
    ) STORED, -- Inisial nama + 3 digit akhir WA (contoh: a020)
    customer_type ENUM('Retail', 'Trader') NOT NULL DEFAULT 'Retail',
    current_debt DECIMAL(15,2) NOT NULL DEFAULT 0,
    max_credit_limit DECIMAL(15,2) NOT NULL DEFAULT 500000,
    address TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_quick_code (tenant_id, quick_code),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100) NULL,
    wa_number VARCHAR(30) NULL,
    deal_notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 3. Pembelian, FIFO Queue & Hutang Vendor
CREATE TABLE purchases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    payment_status ENUM('Lunas', 'Tempo') NOT NULL DEFAULT 'Lunas',
    due_date DATE NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE purchase_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    purchase_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    buy_price DECIMAL(15,2) NOT NULL,
    qty_received INT NOT NULL,
    qty_remaining INT NOT NULL, -- Antrean stok FIFO berjalan
    expired_date DATE NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE vendor_payables (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NOT NULL,
    purchase_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    remaining_balance DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
);

CREATE TABLE vendor_payable_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    payable_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Transfer',
    created_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (payable_id) REFERENCES vendor_payables(id) ON DELETE CASCADE
);

-- 4. Shift Kasir, POS & Piutang Kasbon
CREATE TABLE shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    starting_cash DECIMAL(15,2) NOT NULL DEFAULT 0,
    expected_cash DECIMAL(15,2) NULL,
    actual_cash DECIMAL(15,2) NULL,
    difference DECIMAL(15,2) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    shift_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NULL,
    receipt_number VARCHAR(100) NOT NULL,
    pricing_type_used ENUM('Retail', 'Wholesale') NOT NULL DEFAULT 'Retail',
    subtotal DECIMAL(15,2) NOT NULL,
    global_discount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(15,2) NOT NULL,
    payment_method ENUM('Tunai', 'QRIS', 'Debit', 'Kasbon', 'Transfer') NOT NULL,
    cash_given DECIMAL(15,2) NULL,
    cash_change DECIMAL(15,2) NULL,
    is_margin_override BOOLEAN NOT NULL DEFAULT FALSE,
    is_credit_limit_override BOOLEAN NOT NULL DEFAULT FALSE,
    override_by_user_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (override_by_user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE sale_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT UNSIGNED NOT NULL,
    product_unit_id BIGINT UNSIGNED NOT NULL,
    qty INT NOT NULL,
    base_price DECIMAL(15,2) NOT NULL,
    item_discount DECIMAL(15,2) NOT NULL DEFAULT 0,
    final_price DECIMAL(15,2) NOT NULL,
    total_hpp DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_unit_id) REFERENCES product_units(id)
);

CREATE TABLE fifo_ledgers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_item_id BIGINT UNSIGNED NOT NULL,
    purchase_item_id BIGINT UNSIGNED NOT NULL,
    qty_deducted INT NOT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (sale_item_id) REFERENCES sale_items(id) ON DELETE CASCADE,
    FOREIGN KEY (purchase_item_id) REFERENCES purchase_items(id)
);

CREATE TABLE customer_debts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    customer_id BIGINT UNSIGNED NOT NULL,
    sale_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    remaining_balance DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE customer_debt_payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    debt_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    amount_paid DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Tunai',
    created_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (debt_id) REFERENCES customer_debts(id) ON DELETE CASCADE
);

-- 5. Kartu Stok, Arus Kas & Audit Trail
CREATE TABLE stock_ledgers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NULL,
    date DATETIME NOT NULL,
    reference_type ENUM('PO', 'POS', 'Retur_Supplier', 'Retur_Customer', 'Opname_Plus', 'Opname_Minus') NOT NULL,
    reference_id BIGINT UNSIGNED NOT NULL,
    qty_in INT NOT NULL DEFAULT 0,
    qty_out INT NOT NULL DEFAULT 0,
    balance INT NOT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cash_flows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('IN', 'OUT') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NULL,
    date DATETIME NOT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    device_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    subject_type VARCHAR(100) NULL,
    subject_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 6. Modul HRD, Absensi & Payroll
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    employee_code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NULL,
    position VARCHAR(100) NOT NULL,
    daily_wage DECIMAL(15,2) NOT NULL DEFAULT 0,
    meal_allowance DECIMAL(15,2) NOT NULL DEFAULT 0,
    attendance_allowance DECIMAL(15,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE attendances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    clock_in_time DATETIME NULL,
    clock_out_time DATETIME NULL,
    status ENUM('Hadir', 'Sakit', 'Izin', 'Alpa') NOT NULL DEFAULT 'Hadir',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_emp_date (employee_id, date),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE work_shifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL, -- Shift Pagi, Shift Siang, Shift Malam, Libur/OFF
    code VARCHAR(30) NOT NULL, -- PAGI, SIANG, MALAM, OFF
    start_time TIME NULL,
    end_time TIME NULL,
    color VARCHAR(30) NOT NULL DEFAULT 'blue',
    is_night_shift BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_tenant_shift_code (tenant_id, code),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE employee_schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT UNSIGNED NOT NULL,
    employee_id BIGINT UNSIGNED NOT NULL,
    work_shift_id BIGINT UNSIGNED NULL,
    date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- scheduled, attended, off, leave
    notes TEXT NULL,
    created_by_user_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uk_emp_schedule_date (tenant_id, employee_id, date),
    INDEX idx_schedule_date (tenant_id, date),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (work_shift_id) REFERENCES work_shifts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 4. ACTIONABLE CHECKLIST IMPLEMENTASI (8 SPRINT)

### Sprint 1: Multi-Tenancy, 4-Digit PIN, Device Binding & Idle Lock

- [ ] Setup Laravel 11, Sanctum Auth & MySQL 8.
- [ ] Migration: `subscription_plans` dengan schema `features_json` lengkap.
- [ ] Migration: `tenants`, `devices`, dan `users` dengan kolom `pin_code VARCHAR(4)`.
- [ ] Trait `BelongsToTenant` & `TenantScope` di seluruh model Eloquent.
- [ ] Middleware `DeviceIdentificationMiddleware`: Baca `X-Device-UUID` header dan otomatis catat ke tabel `devices`.
- [ ] Frontend React: Hook `useIdleTimer` (inaktivitas 180 detik) dan komponen `IdleLockOverlay` dengan input 4-digit PIN pad.

### Sprint 2: Master Data, Dynamic Multi-UOM & Mass Importer

- [ ] Migration: `products`, `product_units`, `customers`, `suppliers`.
- [ ] Frontend: Shadcn Inline Edit Table untuk Master Data Produk.
- [ ] Frontend: Form dinamis Multi-UOM (Base Unit = 1, Renceng, Karton, dsb).
- [ ] Backend: Job Worker `ImportProductFromExcel` (menggunakan `maatwebsite/excel`).
- [ ] Validasi: Unique barcode per tenant dan auto-generate batch saldo awal.

### Sprint 3: Pembelian, FIFO Queue & Hutang Vendor (AP)

- [ ] Migration: `purchases`, `purchase_items`, `vendor_payables`, `vendor_payable_payments`.
- [ ] Service `PurchaseService`: Konversi satuan besar ke base unit dan simpan ke `purchase_items` (`qty_remaining = qty_received`).
- [ ] Frontend: PO creation screen dengan autocomplete supplier, input expired date, dan Deal Notes.
- [ ] Backend: Auto-create catatan hutang tempo di `vendor_payables` dan histori cicilan.

### Sprint 4: POS Engine, Fast Kasbon Lookup & Margin Protection

- [ ] Migration: `sales`, `sale_items`, `fifo_ledgers`, `customer_debts`, `customer_debt_payments`.
- [ ] Frontend POS: Layout responsif (Desktop Split-Screen, Tablet 50:50, Mobile Vertical Flow).
- [ ] Fitur Kasbon Cepat: Input pencarian mendeteksi shortcut inisial nama + 3 digit akhir WA (misal: `a020`).
- [ ] Credit Limit Engine: Validasi `current_debt + grand_total > max_credit_limit`. Jika lewat batas, muncul modal input PIN 4 digit Supervisor.
- [ ] Margin Protection Service: Bandingkan harga jual vs estimasi total HPP FIFO. Jika minus, minta PIN 4 digit Supervisor.

### Sprint 5: Shift Kasir (Blind Close) & Node.js Daemon Hardware

- [ ] Migration: `shifts` yang mengikat `device_id` dan `user_id`.
- [ ] Flow Buka Shift (modal awal) & Tutup Shift (Blind Close hitung fisik laci tanpa ekspektasi saldo).
- [ ] Service daemon Node.js lokal (`bridge-server.js`) pada port 9100.
- [ ] Integrasi cetak struk ESC/POS thermal (58mm/80mm) dan sinyal kick cash drawer otomatis.

### Sprint 6: Modul HRD, Absensi & Dynamic Payroll

- [ ] Migration: `employees` dan `attendances`.
- [ ] Frontend: Touchpad UI Clock-In/Clock-Out kasir di layar login/POS.
- [ ] Engine Payroll: Formula otomatis upah harian, uang makan (cair bila hadir), dan tunjangan kehadiran (hangus bila terlambat/izin/alpa).
- [ ] Otomatisasi pembukuan: Pengeluaran gaji otomatis membukukan transaksi pengeluaran (OUT) ke `cash_flows`.

### Sprint 7: Stock Opname, Kartu Stok & Audit Trail

- [ ] Migration: `stock_ledgers`, `cash_flows`, `activity_logs`.
- [ ] Observer Eloquent: Otomatis mencatat seluruh mutasi barang masuk/keluar ke `stock_ledgers`.
- [ ] Service `StockOpnameService`: Freeze rak produk terpilih, input fisik inline, kalkulasi selisih, dan otomatisasi jurnal beban barang hilang.
- [ ] Observer Universal `AuditTrailObserver`: Mencatat `activity_logs` immutable pada mutasi model kritis dengan data sebelum dan sesudah perubahan.

### Sprint 8: Dashboard BI, E2E Testing & Deployment

- [ ] Query Aggregation: Fast Moving & Slow Moving item berdasarkan POV toko dan POV supplier.
- [ ] Widget Dashboard: Omset hari ini, Real-time Gross Profit (HPP FIFO), Arus Kas, Piutang, dan Hutang Jatuh Tempo.
- [ ] Table Warning: Peringatan barang expired (< 30/60 hari) dan low stock alert.
- [ ] Dockerization: Dockerfile multi-stage untuk Laravel backend, Nginx reverse proxy, MySQL 8, dan Vite frontend build.

### Sprint 9: Staff Work Shift Management & POS UX Refinements

- [x] Migration: `work_shifts` dan `employee_schedules` multi-tenant.
- [x] Service: `WorkScheduleService` untuk ploting jadwal, batch assignment rentang tanggal, duplikasi jadwal minggu lalu (copy week), dan staffing coverage summary.
- [x] Controller & API: `WorkScheduleController` (`/hrd/schedules`, `/hrd/work-shifts`, `/hrd/schedules/batch`, `/hrd/schedules/copy-week`).
- [x] Frontend: Halaman matriks interaktif 7 hari kerja (`resources/js/pages/hrd/schedules.tsx`) dengan modal master shift, dialog plot massal, dan visual indicator coverage.
- [x] POS Quick Cash: Perhitungan cerdas pecahan uang tunai terdekat berbasis kelipatan Rp 10.000, Rp 20.000, Rp 50.000, dan Rp 100.000, serta penonaktifan tombol pecahan di bawah total tagihan belanja.
- [x] UI Stability: Zero layout shift pada modal PIN supervisor dan Idle Lock screen dengan container reserved-height, serta auto-redirect ramah pengguna saat session expired.
