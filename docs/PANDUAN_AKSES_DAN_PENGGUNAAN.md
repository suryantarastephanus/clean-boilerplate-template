# 📖 PANDUAN INDUK AKSES & SISTEM (WAROENG POS & SAAS)

> [!IMPORTANT]
> **PEMISAHAN DOKUMENTASI SISTEM:**
> Untuk menjaga privasi, keamanan, dan relevansi informasi, dokumentasi sistem ini **DIPISAHKAN SECARA TEGAS** menjadi dua kategori:
>
> 1. **🏢 [PANDUAN SAAS MANAGEMENT & SUPERADMIN](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_SAAS_MANAGEMENT_SUPERADMIN.md)**  
>    _Khusus SuperAdmin / Pemilik Platform / Tim DevOps (Internal & Rahasia)._  
>    Berisi: Pengelolaan multi-tenant (pendaftaran toko baru, suspend), manajemen paket & kuota (`/superadmin/plans`), infrastruktur server, webhook deploy Easypanel, skema isolasi database, dan pemeliharaan server. **Tidak boleh dibagikan kepada kasir atau pengguna umum.**
>
> 2. **🧾 [PANDUAN OPERASIONAL KASIR, HARDWARE & RAWBT](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_OPERASIONAL_KASIR_DAN_HARDWARE.md)**  
>    _Khusus Admin Toko, Supervisor, dan Kasir (Staff Operasional Toko)._  
>    Berisi: Alur kasir POS harian, shortcut keyboard (`F1`-`F9`), cara kerja tombol bayar adaptif (Tunai, QRIS, Kasbon), serta **Panduan Lengkap Setup Printer Thermal & RawBT** (instalasi di Android Google Play Store & Windows PC via `rawbt.ru`, port virtual 9100, kabel laci kasir).
>
> 3. **🛠️ [PANDUAN TEKNIS PENGEMBANGAN & DEPLOYMENT](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_TEKNIS_DEVELOPMENT_DAN_DEPLOYMENT.md)**  
>    _Khusus Tim Pengembang (Fullstack/Frontend/Backend), DevOps, dan Technical Lead._  
>    Berisi: Strategi pre-compiled build frontend lokal, arsitektur Dockerfile 2-stage (deploy 30-40 detik), SOP pengembang (`npm run build`, Pint, pest test), dan troubleshooting.
>
> 4. **🚀 [PANDUAN SETUP PERTAMA KALI TOKO](file:///c:/Users/stanley/Documents/GitHub/kasir/docs/PANDUAN_SETUP_TOKO_PERTAMA_KALI.md)**  
>    _Khusus Pemilik Toko (Owner / Tenant Admin) & Manajer Toko Baru._  
>    Berisi: Panduan langkah demi langkah dari pendaftaran toko, pengamanan kredensial & PIN, profil toko & logo, pengaturan PPN & shift kerja, konfigurasi printer thermal & laci uang, input master data (kategori, rak, supplier), input produk & Multi-UOM, plafon kasbon pelanggan, pembuatan akun kasir, hingga simulasi buka shift transaksi perdana (Go-Live).
>
> Di bawah ini adalah ringkasan kredensial dan peta rute keseluruhan sistem.

---

## 🔑 1. Kredensial & Hak Akses Pengguna

Sistem telah dilengkapi data demo akun siap pakai untuk seluruh tingkatan pengguna:

| Role / Jabatan           | Email                    | Password   | PIN (4 Digit) |    Kode Pegawai (HRD)     | Hak Akses Utama                                                                            |
| :----------------------- | :----------------------- | :--------- | :-----------: | :-----------------------: | :----------------------------------------------------------------------------------------- |
| **Super Admin**          | `superadmin@waroeng.com` | `password` |    `0000`     |     _N/A (Platform)_      | Pengelolaan platform, multi-tenant, paket langganan _(Dokumen: SaaS Management)_           |
| **Tenant Admin (Owner)** | `admin@waroeng.com`      | `password` |    `9999`     | `EMP-000` _(Non-Payroll)_ | Akses penuh seluruh fitur toko, laporan, produk, & keuangan _(Dokumen: Operasional Toko)_  |
| **Supervisor Toko**      | `spv@waroeng.com`        | `password` |    `8888`     |   `EMP-001` _(Payroll)_   | Otorisasi void barang/struk, bypass limit kasbon, jual rugi _(Dokumen: Operasional Toko)_  |
| **Kasir Utama (Pagi)**   | `kasir@waroeng.com`      | `password` |    `1234`     |   `EMP-002` _(Payroll)_   | Terminal POS, penjualan, cetak struk, buka laci, shift kasir _(Dokumen: Kasir & Hardware)_ |

> 💡 **Integrasi Dua Arah Akun Pengguna & Data Karyawan (HRD):**
>
> - **Akun Pengguna (`/users`)**: Mengatur hak akses login aplikasi & PIN kasir. Saat menambah pengguna baru, terdapat opsi centang `[x] Daftarkan juga sebagai Karyawan (HRD)` sehingga otomatis dibuatkan profil pegawai tanpa perlu input ulang. Untuk akun yang belum terdaftar, tersedia tombol `+ Hubungkan ke HRD`.
> - **Modul Karyawan (`/hrd/employees`)**: Mengatur data presensi/absen, jam kerja/shift, kasbon, dan slip gaji. Admin dapat menautkan akun pengguna yang sudah ada melalui opsi dropdown _"Tautkan dari Akun Pengguna Toko"_ tanpa memakan kuota akun baru.

---

## 🌐 2. Tautan & URL Akses Halaman

### Lingkungan Lokal:

- **URL Dasar**: `http://127.0.0.1:8000` (atau `http://localhost:8000`)
- **Login**: `http://127.0.0.1:8000/login`

### Lingkungan Deployment (Easypanel / Server):

- **URL Produksi**: `https://waroeng.umkaem.my.id/`
- **Login Produksi**: `https://waroeng.umkaem.my.id/login`

### Peta Rute Utama Aplikasi:

| Modul                           | URL Endpoint              | Deskripsi Fitur                                                 |
| :------------------------------ | :------------------------ | :-------------------------------------------------------------- |
| **SaaS Dashboard (SuperAdmin)** | `/superadmin/dashboard`   | Kendali platform SaaS, total tenant, paket & analitik platform  |
| **Kelola Toko (SuperAdmin)**    | `/superadmin/tenants`     | Pendaftaran toko, akun admin toko, dan toggle fitur modular     |
| **Paket & Fitur (SuperAdmin)**  | `/superadmin/plans`       | Matriks fitur modular dan tarif paket langganan SaaS            |
| **Terminal POS**                | `/pos`                    | Terminal kasir transaksi sub-detik, barcode, shortcut           |
| **Dashboard Toko**              | `/dashboard`              | Ringkasan analitik penjualan, laba kotor, dan tren              |
| **Katalog Produk**              | `/products`               | Daftar produk, stok, barcode, dan satuan bertingkat             |
| **Tambah Produk**               | `/products/create`        | Form input produk baru dengan Multi-UOM                         |
| **Kartu Stok**                  | `/inventory/stock-ledger` | Mutasi buku besar stok masuk/keluar per barang                  |
| **Stock Opname**                | `/inventory/stock-opname` | Sesi penghitungan fisik stok rak & penyesuaian                  |
| **Pembelian (PO)**              | `/purchases`              | Faktur pembelian kulakan barang dari supplier                   |
| **Hutang Supplier**             | `/purchases/payables`     | Buku hutang dagang (AP) dan cicilan pembayaran                  |
| **Pelanggan**                   | `/customers`              | Data pelanggan Retail & Grosir/Trader                           |
| **Piutang Kasbon**              | `/customers/debts`        | Buku kasbon pelanggan & pelunasan metode FIFO                   |
| **Buku Kas Toko**               | `/finance/cash-flows`     | Kas masuk (modal/lain) & kas keluar operasional                 |
| **Kiosk Absensi**               | `/hrd/attendances`        | Clock-in / clock-out jam kerja staf toko                        |
| **Jadwal & Shift Staf**         | `/hrd/schedules`          | Ploting jam kerja, matriks roster mingguan, kelola master shift |
| **Manajemen Karyawan**          | `/hrd/employees`          | Data pegawai, jabatan, gaji pokok, tunjangan                    |
| **Penggajian**                  | `/hrd/payrolls`           | Draf & slip pembayaran gaji bulanan karyawan                    |
| **Laporan Shift**               | `/shifts`                 | Riwayat shift kasir, rekonsiliasi kas, & Z-Report               |
| **Audit Trail**                 | `/audit/activity-logs`    | Rekam jejak audit keamanan & override supervisor                |

---

## 🛒 3. Modul 1: Terminal Kasir POS (`/pos`)

Terminal kasir dirancang dengan tata letak **High-Density 60/40 Split** untuk efisiensi transaksi kecepatan tinggi tanpa mouse.

### Visual Layout Terminal POS:

```
+--------------------------------------------------------------------------------------------------+
| [Toko: WRG001] [Shift #1]   [Buka Laci (F8)] [Printer 9100] [Online] [(O) Beep] [(Lock)] [User]   |
+--------------------------------------------------------------------------------------------------+
| [F2] Scan Barcode / SKU / Nama Produk: [_______________________________]                         |
+-------------------------------------------------------------+------------------------------------+
| PANEL KATALOG & FAST KEYS (60% Lebar Layar)                 | KERANJANG & CHECKOUT (40% Lebar)   |
| [Semua] [Minuman] [Makanan] [Sembako] [Snack] [Rokok]       | Pelanggan: [Umum / Toko Bu Siti]   |
|                                                             | Mode: (o) Retail   ( ) Grosir/Trader|
| [1: Kantong]  [2: Es Batu]   [3: Kopi Seduh]                | ---------------------------------- |
| [4: Gorengan] [5: Tabung Gas][6: Galon Aqua]                | Indomie Goreng     2 x 3.500= 7.000|
| [7: Telur 1kg][8: Beras 1kg] [9: Minyak 1L]                 | Aqua 600ml         1 x 4.000= 4.000|
|                                                             |                                    |
| DAFTAR PRODUK POPULER:                                      | Subtotal:                 Rp 11.000|
| +-------------------------+ +-------------------------+     | Diskon Member:            -Rp   500|
| | Indomie Mi Goreng       | | Aqua Air Mineral 600ml  |     | TOTAL BELANJA:            Rp 10.500|
| | Rp 3.500 | Stok: 150    | | Rp 4.000 | Stok: 85     |     | ---------------------------------- |
| +-------------------------+ +-------------------------+     | FAST CASH: [Pas] [20k] [50k] [100k]|
| | Kopi Kapal Api Mix      | | Beras Ramos Super 5kg   |     | [ BAYAR (Spasi / Klik) - Rp 10.500]|
| | Rp 2.000 | Stok: 120    | | Rp 74.000 | Stok: 20    |     | [F4: Void] [F5: Kasbon]            |
+-------------------------------------------------------------+------------------------------------+
| SHORTCUT: [F2: Cari] [F3: Member] [F4: Void] [F5: Kasbon] [F7: Hold] [F8: Buka Laci] [F9: Struk] |
+--------------------------------------------------------------------------------------------------+
```

### Tombol Shortcut Kasir (Keyboard Hotkeys):

- **`F2`**: Langsung fokus ke kolom input Scan Barcode.
- **`F3`**: Buka pencarian Member / Pelanggan (ketik nama atau kode panggil, misal `s020`).
- **`F4`**: Hapus seluruh isi keranjang belanja (Void Bill). Butuh PIN Supervisor.
- **`F5`**: Pilih metode pembayaran **Kasbon** (Hutang).
- **`F8`**: **Buka Laci Kasir** (mengirim sinyal pulsa solenoid ke printer thermal Port 9100).
- **`F9`**: Buka kembali dialog Cetak Struk transaksi terakhir.
- **`Spasi`**: Buka modal pembayaran kasir jika keranjang terisi.
- **`Enter`**: Submit pencarian barcode, konfirmasi pembayaran, atau transaksi baru.
- **`Escape`**: Menutup modal dialog yang sedang aktif.

### Alur Transaksi Kasir:

1. **Input Barang**:
    - Arahkan scanner ke barcode barang fisik, **atau**
    - Tekan tombol Fast Key `1` s/d `9` untuk barang non-barcode (kantong kresek, es batu, kopi seduh), **atau**
    - Klik kartu produk pada katalog layar sentuh.
2. **Pilih Satuan Bertingkat (Multi-UOM)**:
    - Jika membeli satuan karton/renceng, pilih opsi unit (misal: _Dus 40 Bks_ seharga Rp 132.000).
3. **Pilih Pelanggan (Opsional)**:
    - Tekan `F3`, pilih pelanggan (misal: _Warung Bu Siti_). Otomatis menerapkan harga grosir dan menampilkan sisa limit kasbon.
4. **Pembayaran & Opsi Pecahan Uang Cepat (Smart Fast Cash)**:
    - Klik tombol **Bayar (Spasi)** atau langsung pilih tombol pecahan cepat (_Fast Tender_):
        - **Uang Pas**: Mengisi nominal tepat sebesar total tagihan.
        - **Pecahan Terdekat**: Sistem secara cerdas menghitung 3-4 pecahan uang tunai terdekat di atas total belanja berbasis kelipatan Rp 10.000, Rp 20.000, Rp 50.000, dan Rp 100.000.
            - _Contoh_: Jika tagihan **Rp 60.000**, opsi yang muncul adalah `Uang Pas`, `Rp 70.000`, `Rp 80.000`, dan `Rp 100.000`.
            - _Proteksi Uang Kurang_: Opsi nominal di bawah total tagihan otomatis dalam kondisi **Disabled** (`cursor-not-allowed` & `opacity-40`) agar kasir terhindar dari salah tekan uang kurang.
    - Pilih metode: **Tunai**, **QRIS**, **Transfer**, atau **Kasbon**.
5. **Penyelesaian Transaksi, Bukti Struk & E-Struk WhatsApp**:
    - Jika pembayaran tunai: Laci kasir otomatis terbuka (_Auto Drawer Kick_).
    - Layar menampilkan modal struk transaksi dan kembalian dengan 4 opsi distribusi:
        - **Cetak Thermal Langsung (Port 9100 / RawBT)**: Cetak sub-detik tanpa pop-up dialog.
        - **Cetak Browser**: Cetak universal via sistem operasi ke printer thermal USB, printer biasa (A4), atau simpan ke PDF.
        - **Kirim WhatsApp & Salin Pesan**: Format struk teks WA diselaraskan 100% dengan struk kertas (nomor, metode `TF BANK`/`QRIS`/`TUNAI`, tanggal tunggal `dd/mm/yyyy hh.mm`, kasir, pelanggan trader/grosir `[quick_code]`, dan rincian belanja).
        - **Salin Link E-Struk (Aktif 24 Jam)**: Tautan nota publik aman berumur 24 jam yang dapat dibuka pelanggan kapan saja tanpa login.
    - Tekan **Enter** untuk langsung memulai transaksi baru.

### Keamanan & Idle Lock Terminal Kasir:

- **Idle Screen Lock (180 Detik)**: Jika tidak ada aktivitas mouse/keyboard selama batas waktu, layar terkunci otomatis dan hanya dapat dibuka dengan PIN kasir tanpa menghapus transaksi berjalan.
- **Zero Layout Shift**: Slot notifikasi status (error/peringatan) pada modal kunci dan modal otorisasi Supervisor menggunakan ruang tetap (_reserved height_), sehingga modal tidak bergeser atau "naik-turun" saat ada kesalahan input PIN.
- **Auto-Redirect Session Expiry**: Jika sesi browser kasir kedaluwarsa saat layar terkunci, sistem memberikan pesan informatif berbahasa Indonesia dan otomatis mengarahkan ke halaman login.

---

## 🖨️ 4. Modul 2: Hardware ESC/POS & Printer Daemon Bridge

Sistem mendukung pencetakan langsung berkecepatan tinggi ke printer thermal LAN/Wi-Fi melalui raw TCP Port 9100 tanpa jendela dialog browser.

### Visual Layout Modal Pengaturan Printer:

```
+--------------------------------------------------------------------+
| [Printer Icon] Pengaturan Hardware & Printer ESC/POS               |
| Port 9100 RAW TCP Direct Print & Cash Drawer Kick                  |
+--------------------------------------------------------------------+
| IP Printer (LAN / Wi-Fi): [ 192.168.1.200    ]  Port: [ 9100     ] |
|                                                                    |
| Lebar Kertas Thermal:                                              |
| [*] 58 mm (Standard - 32 Kolom)      [ ] 80 mm (Lebar - 48 Kolom)  |
|                                                                    |
| [X] Buka Laci Otomatis Saat Bayar Tunai                            |
| [X] Cetak Langsung ke Port 9100 Setelah Transaksi                  |
| ------------------------------------------------------------------ |
| Diagnostik:                                                        |
| [Tes Ping Socket]   [Cetak Struk Tes]   [Tes Buka Laci]            |
|                                                                    |
| [Tutup]                                       [ Simpan Pengaturan ]|
+--------------------------------------------------------------------+
```

### Cara Konfigurasi Printer Thermal:

1. Klik tombol **Printer 9100** di pojok kanan atas layar POS Kasir.
2. Masukkan alamat IP printer thermal Anda (contoh: `192.168.1.200` atau `127.0.0.1` jika menggunakan daemon bridge lokal).
3. Pilih lebar kertas yang digunakan: **58 mm** atau **80 mm**.
4. Klik **Tes Ping Socket** untuk menguji keterhubungan. Status latensi respon akan muncul (misal: `Respon: 4.5ms`).
5. Klik **Cetak Struk Tes** untuk mencetak slip verifikasi alignment kertas.
6. Klik **Tes Buka Laci** untuk memastikan kabel solenoid laci kasir (Pin 2 / Pin 5) terhubung dengan benar.
7. Klik **Simpan Pengaturan**.

### Cetak Struk Transaksi:

- **Direct Print (Port 9100)**: Mencetak seketika tanpa pop-up browser.
- **Cetak Browser (Ctrl+P)**: Fallback otomatis jika printer thermal jaringan sedang mati/offline.

---

## 📦 5. Modul 3: Produk, Satuan Bertingkat & Impor Massal (`/products`)

### Struktur Satuan Bertingkat (Multi-UOM):

Setiap produk dapat memiliki banyak kemasan berjenjang dengan harga dan barcode masing-masing:

- **Satuan Dasar (Base Unit)**: Pcs / Bungkus / Botol / Kg.
- **Tingkat 2**: Renceng (misal: 10 Bungkus) atau Karung 5 Kg.
- **Tingkat 3**: Dus / Karton (misal: 40 Bungkus / 24 Botol).
  Setiap transaksi penjualan satuan besar akan otomatis memotong stok satuan dasar sesuai rasio konversi secara tepat.

### Cara Impor Massal Produk (Excel / CSV):

1. Buka menu **Katalog Produk & Stok** (`/products`).
2. Klik tombol **Impor Excel / CSV**.
3. Klik tautan **Unduh Template Impor** (`/products/import/template`) untuk mendapatkan format resmi.
4. Isi data produk:
    - `barcode`, `sku`, `name`, `category_name`, `unit_name`, `buy_price`, `sell_price`, `stock`, `min_stock`.
5. Upload file spreadsheet yang sudah diisi, lalu klik **Proses Impor Produk**. Sistem akan menyisipkan seluruh data secara atomik.

---

## 👥 6. Modul 4: Pelanggan & Piutang Kasbon FIFO (`/customers`, `/customers/debts`)

### Pendaftaran Pelanggan & Plafon Kasbon:

1. Masuk ke menu **Pelanggan & Kasbon** (`/customers`).
2. Klik **Tambah Pelanggan**.
3. Masukkan Nama, Nomor WhatsApp, Tipe Pelanggan (_Retail_ atau _Trader/Grosir_), dan **Batas Maksimal Kredit/Kasbon (Limit)**.
4. Sistem otomatis membuat **Quick Code** (contoh: Nama `Siti`, WA `081298765432` $\rightarrow$ kode `s432`).

### Alur Kasbon di Kasir:

1. Saat transaksi di kasir, tekan `F3` dan ketik kode panggil atau nama pelanggan.
2. Tekan `F5` untuk memilih metode bayar **Kasbon**.
3. Sistem memverifikasi apakah `Total Belanja + Hutang Berjalan <= Limit Plafon`.
4. Jika melebihi limit, layar meminta **PIN Supervisor** untuk otorisasi bypass.
5. Transaksi selesai, tercatat di **Buku Piutang Kasbon**.

### Pelunasan Hutang Kasbon (FIFO Engine) & Bukti Penerimaan Kas:

1. Buka menu **Buku Piutang Kasbon** (`/customers/debts`).
2. Pilih faktur kasbon pelanggan atau klik tombol **Bayar Cicilan / Lunas**.
3. Masukkan nominal uang yang disetor pelanggan dan metode pembayaran (Tunai / Transfer).
4. Sistem menggunakan algoritma **FIFO (First-In, First-Out)** untuk melunasi faktur paling lama terlebih dahulu secara otomatis.
5. **Bukti Penerimaan Kas Masuk (Kuitansi Pembayaran)**:
    - Setelah pelunasan berhasil, sistem menyediakan dialog opsi cetak bukti pembayaran resmi.
    - Mendukung **Cetak Thermal Langsung (Port 9100)** untuk printer kasir 58mm/80mm tanpa dialog pop-up browser.
    - Mendukung **Cetak Browser (Ctrl+P / Standar Kuitansi)** dengan layout voucher rapi yang mencantumkan nama pelanggan, nominal yang dibayar, sisa sisa saldo piutang, dan tanda tangan kasir/penyetor.

---

## 🚚 7. Modul 5: Pengadaan (Kulakan) & Hutang Supplier (`/purchases`)

### Pembelian Barang Dagang & Penerimaan Kulakan (`/purchases/create`):

1. **Form Pembelian Bersih (Blank Form)**:
    - Form pembelian baru dibuka dalam kondisi bersih (tidak ada supplier yang terpilih otomatis, dan nomor faktur diawali dengan placeholder watermark yang jelas).
2. **Pemilihan Pemasok & Filter Produk Otomatis**:
    - Pengguna memilih **Pemasok (Supplier)** dari dropdown.
    - Tabel rincian barang secara otomatis **hanya menampilkan katalog produk yang terafiliasi dengan supplier terpilih**.
    - Jika ingin memesan produk dari supplier lain dalam satu faktur, pengguna dapat mengaktifkan toggle _"Tampilkan Semua Produk Toko"_.
3. **Pendaftaran Produk Baru Instan (+ Quick Add)**:
    - Jika barang yang dikirim supplier belum terdaftar di sistem toko, klik tombol **`+ Daftarkan Produk Baru`** di samping pencarian.
    - Dialog pendaftaran cepat akan terbuka dengan supplier yang sudah terpilih otomatis, memungkinkan staf mendaftarkan nama produk, barcode, dan kategori tanpa meninggalkan alur kulakan.
4. **Kalkulator Konversi Satuan Grosir & Auto-HPP**:
    - Pengadaan dari supplier umumnya menggunakan kemasan besar (Dus, Karton, Bal, Pack).
    - Pengguna cukup mengisi:
        - **Satuan Supplier**: misal `Dus` atau `Karton`.
        - **Qty Pembelian**: Jumlah dus yang datang (misal: `5 Dus`).
        - **Isi per Satuan**: Jumlah eceran per dus (misal: `40 Pcs`).
        - **Harga Beli Satuan Besar**: Harga per dus (misal: `Rp 120.000 / Dus`).
    - Sistem secara otomatis menghitung:
        - **Stok Eceran Masuk**: $5 \times 40 = 200\text{ Pcs}$ (stok inventori dicatat dalam satuan dasar eceran).
        - **HPP Otomatis**: $\text{Rp } 120.000 / 40 = \text{Rp } 3.000\text{ / Pcs}$ (harga pokok penjualan tercatat akurat).
5. **Kebijakan HPP Master Produk & Proteksi Penjualan POS**:
    - Saat mendaftarkan produk baru di katalog, kolom HPP (harga beli) boleh **dikosongkan / bernilai 0** hingga barang kulakan pertama kali diterima dari supplier.
    - **Proteksi Penjualan POS**: Produk yang belum memiliki HPP (HPP $\le 0$) **TIDAK DAPAT DIJUAL** di kasir POS guna mencegah kerugian margin dan kekacauan pembukuan laba kotor. Kasir akan menerima peringatan bahwa barang wajib dimasukkan melalui penerimaan kulakan terlebih dahulu.
6. Simpan transaksi dengan status pembayaran **Lunas** (mengurangi kas toko) atau **Hutang / Tempo** (masuk ke buku hutang dagang).

### Pembayaran Hutang Supplier (AP) & Bukti Pengeluaran Kas:

1. Buka menu **Hutang Supplier (AP)** (`/purchases/payables`).
2. Pantau faktur yang belum lunas atau mendekati tanggal jatuh tempo (_due date_).
3. Klik **Bayar Hutang**, masukkan jumlah pembayaran, tanggal bayar, dan metode (Tunai / Transfer Bank).
4. **Voucher Bukti Kas Keluar**:
    - Sistem otomatis mencatat arus kas keluar pada buku kas toko.
    - Tersedia tombol **Cetak Bukti Kas Keluar** (Voucher Resmi) dan **Cetak Thermal Port 9100** yang memuat nomor faktur pembelian, nama supplier, rincian pembayaran, sisa hutang, serta kolom tanda tangan bagian keuangan dan penerima.

---

## 📊 8. Modul 6: Inventori, Kartu Stok & Stock Opname (`/inventory/*`)

### Memeriksa Kartu Stok (Stock Ledger):

1. Masuk ke **Kartu Stok** (`/inventory/stock-ledger`).
2. Pilih barang yang ingin diinspeksi.
3. Anda dapat melihat mutasi kronologis:
    - `purchase_in`: Penambahan dari kulakan supplier.
    - `sale_out`: Pengurangan dari penjualan kasir POS.
    - `opname_adjustment`: Penyesuaian fisik hasil stock opname.

### Menjalankan Stock Opname:

1. Masuk ke menu **Stock Opname** (`/inventory/stock-opname`).
2. Klik **Mulai Sesi Opname Baru**.
3. Masukkan jumlah stok fisik yang dihitung di rak/gudang (_Physical Count_).
4. Sistem menampilkan selisih (_variance_) antara stok fisik vs stok sistem komputer.
5. Beri keterangan selisih (misal: _kemasan rusak / bocor_).
6. Klik **Selesaikan & Sesuaikan Stok**. Sistem otomatis memperbarui stok akhir barang.

---

## ⏰ 9. Modul 7: HRD, Absensi Kiosk Staf & Payroll (`/hrd/*`)

### Kiosk Absensi Staf Toko:

1. Buka menu **Absensi Kiosk Staf** (`/hrd/attendances`).
2. Staf toko memilih nama mereka atau memasukkan PIN karyawan.
3. Klik **Clock In (Masuk)** saat datang atau **Clock Out (Pulang)** saat selesai shift.
4. Sistem mencatat jam kerja aktual serta mendeteksi keterlambatan (_Late Minutes_) dan lembur (_Overtime_).

### Ploting Jadwal & Shift Kerja Staf (`/hrd/schedules`):

Modul ini digunakan oleh Supervisor/Owner untuk memetakan penugasan shift kerja karyawan toko per minggu:

1. **Master Shift Kerja**:
    - Klik **Kelola Master Shift** untuk menambah/mengedit template shift kerja (contoh: _Shift Pagi: 07:00 - 15:00_, _Shift Siang: 14:30 - 22:30_, _Shift Malam: 22:00 - 06:00_, atau _Libur/OFF_).
    - Setiap shift memiliki label warna unik dan tanda apakah shift tersebut termasuk hari aktif atau hari libur.
2. **Matriks Roster Mingguan**:
    - Menampilkan grid 7 hari kerja (Senin s/d Minggu) untuk seluruh karyawan toko yang aktif.
    - **Ploting 1-Klik**: Cukup klik pada sel hari & staf yang bersangkutan untuk memilih shift, menghapus penugasan, atau menandai libur.
3. **Ploting Massal (Batch Plotting)**:
    - Klik **Ploting Jadwal**, pilih karyawan, rentang tanggal (mulai - selesai), dan shift kerja yang diinginkan.
    - Sistem akan menerapkan jadwal kerja secara serentak dalam rentang tanggal tersebut.
4. **Salin Jadwal Minggu Lalu (Copy Previous Week)**:
    - Untuk menghemat waktu rotasi berkala, klik tombol **Salin Minggu Lalu**. Roster minggu sebelumnya langsung diduplikasi ke minggu yang sedang dibuka.
5. **Indikator Kebutuhan Staf (Coverage Health Check)**:
    - Panel ringkasan di bawah matriks memantau jumlah staf dan kasir yang bertugas setiap hari.
    - Sistem memberikan peringatan visual jika ada hari yang **belum memiliki kasir** atau kekurangan staf bertugas.

### Penggajian Otomatis (Payroll Engine):

1. Buka menu **Penggajian (Payroll)** (`/hrd/payrolls`).
2. Klik **Generate Draf Gaji Bulanan**.
3. Sistem mengkalkulasi secara otomatis:
    - `Total Gaji Pokok = Hari Masuk x Upah Harian`
    - `Total Uang Makan = Hari Masuk x Uang Makan Harian`
    - `Tunjangan Kehadiran Penuh`
    - `Potongan Keterlambatan / Izin`
4. Supervisor/Owner memeriksa draf rekapitulasi gaji.
5. Klik **Setujui & Bayar Payroll**. Sistem menandai gaji lunas dan mencatat pengeluaran kas toko.

---

## 💰 10. Modul 8: Buku Kas Toko (Cash Flow) (`/finance/cash-flows`)

Gunakan modul ini untuk mencatat transaksi keuangan di luar penjualan kasir:

- **Kas Keluar**: Pembelian token listrik PLN, iuran kebersihan RT/RW, pembelian plastik kresek kasir, air galon, servis AC.
- **Kas Masuk**: Suntikan modal kas kecil dari owner, bagi hasil konsinyasi kue basah, pendapatan parkir toko.

---

## 🛡️ 11. Modul 9: Audit Trail Keamanan (`/audit/activity-logs`)

Menu ini merekam seluruh aksi sensitif toko demi transparansi dan pencegahan manipulasi kasir:

- Otorisasi PIN Supervisor untuk Void Barang di keranjang.
- Pembatalan transaksi total (_Void Bill_).
- Otorisasi penjualan di bawah harga modal (_Margin Protection_).
- Otorisasi bypass batas plafon kredit kasbon pelanggan.
- Perubahan harga jual master produk.
- Log buka dan tutup shift kasir (_Blind Close variance_).

---

## 💳 12. Modul 10: Kasbon Karyawan (`/hrd/kasbons`)

Modul ini memberikan pengelolaan kasbon internal staf yang aman, transparan, dan terukur:

- **Workday-Based Credit Limit**: Batas maksimal kasbon dihitung otomatis proporsional terhadap hari kerja aktif bulan berjalan (maks. 3x rata-rata upah harian).
- **Potongan Otomatis di Slip Gaji (Auto-Deduct)**: Draf gaji di `/hrd/payrolls` secara otomatis memasukkan kasbon aktif sebagai pengurang take-home-pay.
- **Pelunasan Mandiri**: Staf dapat mencicil atau melunasi kasbon tunai/transfer kapan saja, yang otomatis dicatat ke buku kas masuk toko.

---

## ⚙️ 13. Modul 11: Pengaturan Toko & Shift Operasional (`/settings/store`)

Pusat kendali operasional warung / toko ritel:

1. **Identitas & Struk Toko**: Nama usaha, logo, alamat, kop struk, footer nota thermal, serta **Pusat Uji & Pratinjau Struk** untuk menguji tampilan cetak browser, share WhatsApp, dan e-struk 24 jam (POS, Kasbon Pelanggan, Arus Kas, Kasbon Karyawan, dan Z-Report).
2. **Pengaturan Pajak (PPN)**: Opsi tarif PPN (11%), serta sistem harga inklusif vs eksklusif pajak.
3. **Keamanan Layar Kasir (Auto Idle Lock)**: Mengunci layar otomatis setelah 1-30 menit tidak tersentuh untuk mencegah transaksi tanpa izin.
4. **Kontrol Modul Aktif Toko (Feature Toggles)**: Pemilik toko dapat menyembunyikan modul yang tidak dipakai agar menu aplikasi lebih ramping.
5. **Pengaturan Shift Operasional & Jam Kerja**:
    - **Preset 1 Orang Jaga (Full Shift)**: Khusus toko/warung tunggal yang dijaga 1 orang kasir dari buka sampai tutup (`08:00 - 21:00` / 13 Jam Kerja), tanpa pergantian kasir di tengah hari.
    - **Preset 2 Shift**: Standar minimarket (Pagi 07:00-15:00 & Siang 14:30-22:30).
    - **Preset 3 Shift**: Untuk toko 24 jam dengan shift malam lintas hari (+1).
    - **Live Duration Calculation**: Durasi jam kerja otomatis terhitung saat jam mulai/selesai diubah.

---

## 🎮 14. Tema Visual: Doom-64 Cyber Retro

Sistem kasir mengadopsi tema visual **Doom-64** (`https://tweakcn.com/r/themes/doom-64.json`):

- **Gaya Retro Sci-Fi FPS**: Warna Crimson Blood Red (`primary`), Toxic Green (`secondary`), Plasma Blue (`accent`), dan sudut angular flat (`radius: 0px`).
- **Tipografi Presisi**: Menggunakan font Google `Oxanium` untuk teks utama dan `Source Code Pro` untuk font angka serta barcode scanner.
- **Preservasi Homepage (`welcome.tsx`)**: Halaman landing page diisolasi (`.homepage-isolated`) dengan gaya modern rounded, font `Inter`, dan aksen biru-emerald.

---

## 📷 Panduan Pengambilan Screenshot untuk Dokumentasi Visual

Untuk melengkapi laporan atau buku panduan visual toko Anda, disarankan mengambil tangkapan layar (_screenshot_) pada tampilan utama berikut:

1. **`01_halaman_login.png`**: Buka `/login`, tampilkan form login modern dengan tema Doom-64.
2. **`02_dashboard_utama.png`**: Buka `/dashboard`, tampilkan grafik pendapatan 14 hari, omset hari ini, dan stok menipis.
3. **`03_pos_terminal_kasir.png`**: Buka `/pos`, tampilkan terminal kasir dengan keranjang terisi, fast keys 1-9, dan daftar produk populer.
4. **`04_modal_pengaturan_printer.png`**: Pada `/pos`, klik tombol _Printer 9100_, tampilkan modal setting IP port 9100 dan tombol diagnostik.
5. **`05_modal_struk_transaksi.png`**: Selesaikan satu checkout tunai, tampilkan modal struk thermal dengan tombol _Direct Print (Port 9100)_.
6. **`06_katalog_produk_uom.png`**: Buka `/products`, tampilkan tabel produk lengkap dengan badge multi-satuan (Dus, Renceng, Pcs).
7. **`07_buku_piutang_kasbon.png`**: Buka `/customers/debts`, tampilkan tabel faktur kasbon pelanggan dengan status _Belum Lunas_ / _Lunas_.
8. **`08_absensi_kiosk_payroll.png`**: Buka `/hrd/attendances` dan `/hrd/payrolls`, tampilkan absensi staf dan slip gaji karyawan.
9. **`09_jadwal_shift_karyawan.png`**: Buka `/hrd/schedules`, tampilkan matriks jadwal mingguan staf, indikator coverage harian, serta tombol salin minggu lalu.
10. **`10_kasbon_karyawan.png`**: Buka `/hrd/kasbons`, tampilkan riwayat pinjaman kasbon staf dan status pelunasan payroll.
11. **`11_pengaturan_shift_toko.png`**: Buka `/settings/store`, tampilkan kartu mode 1 Orang Jaga (Full Shift), daftar shift, dan toggle modul aktif toko.
