# Spesifikasi Teknis: Customer-Facing Display (Layar Kedua Kasir) & Manajemen Iklan Promosi

**Tanggal:** 27 Oktober 2026  
**Status:** DRAFT (Menunggu Review User)  
**Tipe:** Architectural Spec  
**Target Modul:** Kasir POS (`/pos`), Layar Pelanggan (`/pos/customer-display`), Dashboard Promosi (`/promotions`)

---

## 1. Latar Belakang & Tujuan

Untuk meningkatkan transparansi transaksi, kepercayaan pelanggan di kasir, serta mendukung promosi visual toko ritel/minimarket, sistem memerlukan:

1. **Layar Kedua Kasir (_Customer-Facing Display_)**: Tampilan sekunder yang dapat dibuka di monitor kedua (HDMI/VGA/Portable Monitor) atau tablet terpisah.
2. **Monetisasi SaaS & Feature Entitlement Toggle**: Fitur Layar Kedua & Promosi Kasir didaftarkan ke `PlatformFeature::PosCustomerDisplay` (`pos_customer_display`), sehingga Super Admin dapat menjadikannya fitur berbayar (add-on berbayar / paket premium SaaS) yang dapat diaktifkan atau dinonaktifkan per paket atau per toko di dashboard Super Admin.
3. **Sinkronisasi Real-Time 0-Latensi**: Pembaruan langsung daftar belanja, diskon, dan total tagihan saat kasir memindai barcode.
4. **Pembayaran Terintegrasi di Layar Pelanggan**: Menampilkan QR Code QRIS dinamis beresolusi tinggi saat opsi QRIS dipilih, atau rincian uang diterima & kembalian saat tunai.
5. **Manajemen Iklan & Promosi Toko di Dashboard**: CRUD banner iklan dengan jadwal tanggal mulai & selesai, rotasi durasi per tayang, serta _fallback banner default_ jika tidak ada promo aktif.
6. **Konsistensi Tema & Estetika**: Menggunakan identitas visual Terminal Precision POS (dark surface `#131316`, aksen emerald `#00a572`, font `Instrument Sans`, dan typography monospaced untuk angka harga).

---

## 2. Arsitektur Komunikasi Data (Inter-Window Real-Time Sync)

### A. Mekanisme Komunikasi

Sistem menggunakan **HTML5 `BroadcastChannel` API** yang didukung secara _native_ oleh browser modern:

- **Nama Channel**: `pos_customer_display_${tenantCode}`
- **Karakteristik**:
    - Latensi 0 milidetik (instan).
    - Berjalan 100% lokal di browser tanpa membebani server backend.
    - Bekerja secara _offline-first_ (transaksi tetap sinkron meski koneksi internet terputus).
- **Fallback**: Menggunakan event `window.addEventListener('storage')` pada `localStorage` agar sinkronisasi tetap berjalan jika browser versi lama membatasi BroadcastChannel.

### B. Payload Kontrak Event

```typescript
export type DisplayState =
    | 'IDLE'
    | 'ACTIVE_CART'
    | 'PAYMENT_QRIS'
    | 'PAYMENT_CASH'
    | 'PAYMENT_SUCCESS';

export interface CustomerDisplayPayload {
    type: 'STATE_CHANGE' | 'CART_UPDATE' | 'PAYMENT_UPDATE' | 'RESET_IDLE';
    state: DisplayState;
    store: {
        name: string;
        code: string;
        logoUrl?: string | null;
        cashierName?: string;
    };
    cart: {
        items: Array<{
            id: number;
            product_id: number;
            name: string;
            unit_name?: string;
            quantity: number;
            unit_price: number;
            discount: number;
            subtotal: number;
        }>;
        totalItemCount: number;
        subtotal: number;
        discountAmount: number;
        taxAmount: number;
        grandTotal: number;
    };
    payment?: {
        method: 'cash' | 'qris';
        amountDue: number;
        // Detail QRIS
        qrisString?: string;
        qrisImageUrl?: string;
        // Detail Tunai
        cashReceived?: number;
        changeDue?: number;
        // Selesai
        receiptNumber?: string;
    };
    timestamp: number;
}
```

---

## 3. Desain Tata Letak Layar Pelanggan (_Customer Display Layouts_)

Layar kedua dirancang responsif untuk resolusi standar monitor kasir (1024x768, 1280x720, 1366x768, hingga 1920x1080 Full HD).

### A. State 1: IDLE (Standby / Toko Sedang Menunggu Pembeli)

- **Header Atas**: Logo toko, nama toko, tanggal & jam digital real-time.
- **Area Utama (Hero Spot)**: Carousel/slideshow banner iklan promosi toko yang sedang aktif.
    - Durasi perpindahan slide sesuai konfigurasi (default: 6–8 detik).
    - Efek transisi halus (_crossfade_) dengan bilah _progress bar_ durasi.
    - Jika tidak ada promosi yang aktif pada tanggal tersebut: Otomatis menampilkan **Default Banner** toko.
- **Footer Bawah**: Running text (_marquee_) ucapan selamat datang & informasi toko.

### B. State 2: ACTIVE_CART (Kasir Sedang Memindai Belanjaan)

- **Kolom Kiri (60% Lebar)**:
    - Header tabel: Nama Barang, Qty, Harga Satuan, Subtotal.
    - Daftar belanjaan yang baru discan muncul di posisi atas (_auto-scroll_).
    - Ringkasan di bawah: Total Item, Total Hemat/Diskon, dan **TOTAL BELANJA** dengan font besar berlatar kontras hijau emerald.
- **Kolom Kanan (40% Lebar)**:
    - **Spot Iklan Sidebar**: Rotasi banner promosi aktif yang disesuaikan untuk aspek rasio samping (4:3 atau 16:9 compact).
    - Kartu profil toko & info loyalty/member.
    - Running text promo mini di bagian paling bawah.

### C. State 3: PAYMENT_QRIS (Kasir Memilih Pembayaran QRIS)

- Kolom kiri menampilkan ringkasan tagihan belanja.
- Kolom kanan bertransformasi menjadi **Modul QRIS Interaktif**:
    - QR Code QRIS dinamis ukuran besar (mudah dipindai kamera HP dari jarak 50–100 cm).
    - Nominal tepat yang harus dibayar (`Rp xxx.xxx`).
    - Nama Merchant (NMID).
    - Animasi denyut / status _"Menunggu Pembayaran dari Aplikasi Bank/E-Wallet Anda..."_.
    - Logo bank/e-wallet yang didukung (BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana, dll).

### D. State 4: PAYMENT_CASH (Kasir Memilih Pembayaran Tunai)

- Menampilkan rincian:
    - Total Tagihan: `Rp 150.000`
    - Uang Diterima: `Rp 200.000`
    - **Uang Kembali: Rp 50.000** (warna hijau terang `#00a572` dengan ukuran huruf sangat besar).

### E. State 5: PAYMENT_SUCCESS (Transaksi Selesai & Lunas)

- Animasi centang hijau sukses (`lucide CheckCircle2`).
- Tulisan _"Pembayaran Berhasil! Terima Kasih Telah Berbelanja."_
- Nomor struk transaksi dan ringkasan kembalian.
- Pemutaran suara nada _chime_ sukses via Web Audio API.
- _Auto-timer_: Setelah 5 detik, layar kembali otomatis ke State 1 (IDLE).

---

## 4. Modul Manajemen Iklan & Promosi (Dashboard Admin)

### A. Skema Basis Data (`pos_advertisements`)

```php
Schema::create('pos_advertisements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('title');                           // Judul kampanye promo
    $table->string('banner_image_path');               // Path file di storage
    $table->string('placement')->default('all');       // 'all', 'idle_hero', 'sidebar'
    $table->dateTime('start_date')->nullable();        // Waktu mulai tayang
    $table->dateTime('end_date')->nullable();          // Waktu selesai tayang
    $table->boolean('is_default')->default(false);      // Flag fallback default banner
    $table->boolean('is_active')->default(true);        // Saklar aktif/nonaktif
    $table->integer('display_order')->default(0);       // Urutan tayang
    $table->integer('duration_seconds')->default(6);    // Durasi per slide (detik)
    $table->timestamps();

    $table->index(['tenant_id', 'is_active']);
    $table->index(['start_date', 'end_date']);
});
```

### B. Aturan Penayangan & Fallback Otomatis

1. **Iklan Terjadwal Aktif**:
    ```sql
    WHERE tenant_id = :tenant_id
      AND is_active = true
      AND is_default = false
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
    ORDER BY display_order ASC, created_at DESC
    ```
2. **Kondisi Fallback (Default Banner)**:
    - Jika query iklan terjadwal di atas menghasilkan 0 baris (tidak ada promo yang sedang berlaku hari ini):
    - Ambil iklan dengan kondisi: `tenant_id = :tenant_id AND is_active = true AND is_default = true`.
3. **Kondisi Zero-Asset Fallback**:
    - Jika toko baru belum mengunggah banner default sekalipun:
    - Sistem merender _built-in dynamic banner component_ berbasis SVG/CSS bertuliskan:  
      _"Selamat Datang di [Nama Toko] — Belanja Nyaman, Lengkap & Hemat"_ dengan logo toko otomatis.

### C. Antarmuka Dashboard (`/promotions`)

- **Menu Navigasi Sidebar**: Item baru bertajuk **"Promosi Layar Kasir"** dengan ikon `Tv` / `Megaphone`.
- **Tabel Monitoring Iklan**:
    - Preview thumbnail banner.
    - Judul promo & tipe penempatan.
    - Status Badge Cerdas:
        - `🟢 Sedang Tayang` (waktu sekarang berada di dalam rentang tayang).
        - `🟡 Terjadwal` (tanggal mulai masih di masa depan).
        - `⚪ Berakhir / Kadaluarsa` (tanggal selesai sudah lewat).
        - `⭐ Banner Default` (banner cadangan utama).
    - Toggle aktif/nonaktif langsung tanpa refresh.
    - Tombol **"Preview Layar Pelanggan"**: Membuka modal simulasi layar kedua untuk melihat hasil banner.
- **Form Modal Tambah / Edit**:
    - Upload file gambar (JPG, PNG, WebP hingga 5MB) dengan preview cropping 16:9 / 4:3.
    - Input Judul Promosi.
    - Pemilih Rentang Tanggal & Waktu Mulai – Selesai (opsional).
    - Switch: _"Jadikan Banner Default (Tampil saat tidak ada promo terjadwal)"_.
    - Input durasi rotasi per slide (3 s/d 30 detik).

---

## 5. Integrasi Pada Terminal Kasir POS (`/pos`)

1. **Tombol Header Baru**:
    - Di bar navigasi atas kasir POS, ditambahkan tombol:  
      `[🖥️ Layar Pelanggan]` (Icon `MonitorCheck` atau `Tv`).
    - Saat diklik: Mengeksekusi `window.open('/pos/customer-display', 'MartPosCustomerDisplay', 'width=1280,height=720,menubar=no,toolbar=no')`.
    - Menampilkan status koneksi layar kedua (indikator hijau: terhubung / abu-abu: belum dibuka).
2. **Hook Pemancar Event (`useCustomerDisplayBroadcast`)**:
    - Merekam setiap perubahan pada `cart`, item tambah/kurang/hapus.
    - Merekam pemicu pembayaran (klik tombol QRIS, input uang tunai, modal QRIS muncul).
    - Merekam penyelesaian transaksi (cetak bon / transaksi sukses).
    - Menyiarkan payload ke BroadcastChannel secara real-time.

---

## 6. Verifikasi & Pengujian

1. **Unit & Feature Test Backend (Pest)**:
    - `PromotionsCrudTest`: Pengujian Create, Read, Update, Delete banner promosi.
    - `PromotionScheduleQueryTest`: Pengujian banner aktif sesuai tanggal mulai & berakhir.
    - `PromotionDefaultFallbackTest`: Pengujian fallback ke banner default ketika promo terjadwal kadaluarsa.
    - `MultiTenantIsolationTest`: Memastikan banner Toko A tidak dapat diakses atau dilihat Toko B.
2. **Frontend Build & Linter**:
    - Eksekusi `npm run build` untuk memverifikasi kompilasi TypeScript & asset Vite tanpa error.
    - Eksekusi `vendor/bin/pint --format agent` untuk standardisasi format PHP Laravel.
3. **Penyelarasan Desain (UI/UX Review)**:
    - Memastikan tidak ada glitch tampilan pada resolusi 1024x768 (layar POS standar) hingga 1920x1080.
    - Memastikan kontras teks harga dan QRIS sangat mudah terbaca dari jarak meja kasir.

---

## 7. Rencana Tahapan Eksekusi

1. **Tahap 1**: Migrasi database `pos_advertisements`, Model `PosAdvertisement`, Factory, dan Pest Tests.
2. **Tahap 2**: Backend Controller & Routing untuk CRUD promosi serta endpoint data iklan layar kasir.
3. **Tahap 3**: Frontend Dashboard Admin Promosi (`/promotions`) dengan upload banner, datepicker, status badge, dan toggle default.
4. **Tahap 4**: Frontend Halaman Layar Pelanggan (`/pos/customer-display`) lengkap dengan 5 state (Idle, Active Cart, QRIS, Cash, Success) dan komponen rotasi iklan.
5. **Tahap 5**: Integrasi `BroadcastChannel` pemancar pada `resources/js/pages/pos/index.tsx` dan tombol "Layar Pelanggan".
6. **Tahap 6**: Verifikasi end-to-end, testing suite, formatting Pint, dan pembuatan commit lokal.
