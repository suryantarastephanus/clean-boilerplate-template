# 🧾 PANDUAN OPERASIONAL KASIR, HARDWARE & PANDUAN RAWBT

**Target Pembaca:** Admin Toko (Owner), Supervisor Toko, dan Kasir (Staff Operasional).  
_(Dokumen ini khusus operasional toko dan kasir, terpisah dari dokumen SaaS Management Platform)_

---

## 📌 DAFTAR ISI

1. [Alur Transaksi & Operasional POS Harian](#1-alur-transaksi--operasional-pos-harian)
2. [Pintasan Keyboard (Hotkeys) Kasir](#2-pintasan-keyboard-hotkeys-kasir)
3. [Arsitektur Hardware Kasir (Printer & Laci)](#3-arsitektur-hardware-kasir-printer--laci)
4. [Panduan Lengkap RawBT (Thermal USB & Bluetooth)](#4-panduan-lengkap-rawbt-thermal-usb--bluetooth)
    - [A. Mengapa Memerlukan RawBT?](#a-mengapa-memerlukan-rawbt)
    - [B. Instalasi & Setup RawBT di Tablet / HP Android](#b-instalasi--setup-rawbt-di-tablet--hp-android)
    - [C. Instalasi & Setup RawBT di Komputer / Laptop Windows](#c-instalasi--setup-rawbt-di-komputer--laptop-windows)
5. [Konfigurasi Printer Langsung (LAN / Wi-Fi) Tanpa RawBT](#5-konfigurasi-printer-langsung-lan--wi-fi-tanpa-rawbt)
6. [Pengaturan Laci Kasir (Cash Drawer Solenoid)](#6-pengaturan-laci-kasir-cash-drawer-solenoid)
7. [Panduan Lengkap Silent Printing (Zero-Click Printing)](#7-panduan-lengkap-silent-printing-zero-click-printing)
    - [A. Metode 1: Silent Printing via Browser Kiosk Mode (--kiosk-printing)](#a-metode-1-silent-printing-via-browser-kiosk-mode---kiosk-printing)
    - [B. Metode 2: Silent Printing via Direct Socket / RawBT (Port 9100)](#b-metode-2-silent-printing-via-direct-socket--rawbt-port-9100)
    - [C. Fitur Struk Otomatis (Auto Print [Alt + P])](#c-fitur-struk-otomatis-auto-print-alt--p)
    - [D. Tabel Perbandingan & Pemilihan Metode](#d-tabel-perbandingan--pemilihan-metode)
8. [Panduan Cetak Browser Universal & E-Struk WhatsApp (24 Jam)](#8-panduan-cetak-browser-universal--e-struk-whatsapp-24-jam)
    - [A. Mekanisme Cetak Browser Universal (executeBrowserPrint)](#a-mekanisme-cetak-browser-universal-executebrowserprint)
    - [B. E-Struk WhatsApp (Format Identik Struk Fisik)](#b-e-struk-whatsapp-format-identik-struk-fisik)
    - [C. Link E-Struk Publik Aktif 24 Jam (Signed Temporary Token)](#c-link-e-struk-publik-aktif-24-jam-signed-temporary-token)
    - [D. Pusat Uji & Pratinjau Seluruh Struk Toko (/store)](#d-pusat-uji--pratinjau-seluruh-struk-toko-store)
9. [Panduan Pemecahan Masalah (Troubleshooting)](#9-panduan-pemecahan-masalah-troubleshooting)

---

## 1. Alur Transaksi & Operasional POS Harian

### 1.1. Membuka Shift Kasir (Awal Kerja)

1. Setiap kasir wajib membuka shift sebelum dapat memulai transaksi.
2. Masukkan **Modal Awal Kasir** (uang pecahan kembalian di laci) dan **PIN 4 Digit** kasir.
3. Klik **Buka Shift Kasir**.

### 1.2. Input Barang & Scanner

- **Barcode Scanner**: Arahkan scanner ke barcode produk fisik (otomatis fokus pada mode scanner `F2`).
- **Satuan Bertingkat (Multi-UOM)**: Jika pelanggan membeli per Renceng atau Dus, klik tombol satuan bertingkat (misal: `+Dus` atau `+Renceng`) pada baris item.
- **Item Cepat Non-Barcode**: Gunakan tombol Fast Key kategori cepat di panel sebelah kiri untuk barang tanpa barcode (misal: kantong plastik, es batu, galon).

### 1.3. Memilih Tipe Pembayaran & Tombol Checkout Adaptif

Tombol pembayaran utama pada panel kasir secara cerdas menyesuaikan dengan metode pembayaran yang dipilih:

- **Tunai (`cash`)**:
    - Tombol berwarna **Hijau Emerald**.
    - Menampilkan nominal tagihan dan kembalian kasir: `BAYAR Rp XX.XXX • KEMBALI Rp XX.XXX [SPACE]`.
    - Pilihan cepat pecahan nominal (Uang Pas, 10k, 20k, 50k, 100k).
    - Laci kasir otomatis terbuka saat transaksi tunai selesai jika diaktifkan.
- **QRIS (`qris`)**:
    - Tombol berwarna **Biru Modern**.
    - Menampilkan label QRIS dan tagihan: `QRIS • Rp XX.XXX [SPACE]`.
    - Kode QR Dinamis siap dipindai pelanggan via e-wallet (BCA, GoPay, OVO, Dana, ShopeePay, dll).
- **Kasbon (`kasbon`)**:
    - Tombol berwarna **Amber/Oranye**.
    - Menampilkan label Kasbon dan tagihan: `KASBON • Rp XX.XXX [SPACE]`.
    - Wajib memilih data Pelanggan terlebih dahulu (`F3`). Plafon limit dan sisa hutang pelanggan dicek otomatis.

### 1.4. Menutup Shift Kasir & Z-Report (Akhir Kerja)

1. Di akhir sesi kerja, klik tombol **Tutup Shift (Blind Close)**.
2. Kasir menghitung fisik uang tunai di laci (_blind count_ tanpa melihat total sistem untuk mencegah kecurangan).
3. Masukkan nominal uang fisik, sistem akan mencetak **Ringkasan Z-Report Shift** yang menunjukkan selisih kas (apakah seimbang, surplus, atau defisit).

### 1.5. Bilah Navigasi & Alat Cepat Kasir (Top Navigation Toolbar)

Bagian atas layar POS dilengkapi bilah navigasi ergonomis terpadu:

- **Sisi Kiri (Identitas & Shift)**:
    - **Toko / Dashboard**: Tombol kembali ke dashboard manajemen toko.
    - **Profil Kasir**: Menampilkan nama kasir yang sedang bertugas, indikator dot hijau aktif, dan role.
    - **Jam Digital**: Waktu lokal real-time berformat monospaced.
    - **Status Shift**: Tombol indikator shift kasir (kuning untuk Shift Aktif, atau merah berdenyut jika shift belum dibuka).
- **Sisi Kanan (Toolbar Terpadu & Utilitas)**:
    - **Alat Kasir (Unified Toolbar)**:
        - **Absensi**: Membuka dialog Clock-In / Clock-Out cepat untuk staf toko.
        - **Laci `[F8]`**: Mentrigger pembukaan fisik laci kasir (dilengkapi badge shortcut `F8`).
        - **Printer**: Membuka pengaturan printer thermal Port 9100 / ESC-POS.
    - **Status Jaringan**: Indikator pill `Online (Sync 100%)`.
    - **Kontrol Cepat**: Tombol switch tema Gelap/Terang, tombol Mute/Unmute suara beep scanner, dan tombol Kunci Layar Kasir (_Idle Mode_).

---

## 2. Pintasan Keyboard (Hotkeys) Kasir

Untuk efisiensi tinggi tanpa menggunakan mouse:

|   Tombol    | Fungsi                  | Keterangan                                                         |
| :---------: | :---------------------- | :----------------------------------------------------------------- |
|  **`F1`**   | Bantuan Pintasan        | Membuka cheat sheet shortcut                                       |
|  **`F2`**   | Fokus Barcode Scanner   | Siap memindai barcode berikutnya                                   |
|  **`F3`**   | Cari Member / Pelanggan | Buka pencarian pelanggan cepat                                     |
|  **`F4`**   | VOID Keranjang Belanja  | Membatalkan seluruh belanjaan (otorisasi SPV)                      |
|  **`F5`**   | Metode Kasbon           | Memilih pembayaran kasbon pelanggan                                |
|  **`F6`**   | Diskon Manual / Kupon   | Input potongan harga atau voucher                                  |
|  **`F7`**   | HOLD Transaksi          | Menangguhkan antrian pelanggan atau membuka antrian yang tersimpan |
|  **`F8`**   | Buka Laci Kasir         | Membuka laci manual via sinyal printer                             |
|  **`F9`**   | Cetak Struk Terakhir    | Membuka kembali dialog cetak struk transaksi terakhir              |
| **`SPACE`** | Checkout / Bayar        | Membuka/memproses pembayaran kasir                                 |
| **`ENTER`** | Konfirmasi              | Melanjutkan aksi / input nominal                                   |
|  **`ESC`**  | Tutup Modal             | Menutup jendela dialog yang terbuka                                |

---

## 3. Arsitektur Hardware Kasir (Printer & Laci)

Sistem Kasir ini mendukung dua metode pencetakan struk thermal (58mm dan 80mm):

```
                               +-------------------------------------+
                               |         POS KASIR (BROWSER)         |
                               +------------------+------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
             [Metode 1: Direct TCP/IP]                            [Metode 2: RawBT Bridge]
                         |                                                 |
         Printer Jaringan LAN / Wi-Fi                             Printer USB / Bluetooth
        (Memiliki port LAN / IP statis)                           (Tidak memiliki kartu LAN)
                         |                                                 |
                         v                                                 v
             +-----------------------+                         +-----------------------+
             | Thermal Printer LAN   |                         | Aplikasi RawBT Server |
             | (Port 9100 RAW)       |                         | (Listen 127.0.0.1:9100|
             +-----------+-----------+                         +-----------+-----------+
                         |                                                 |
                         | (Kabel RJ11)                                    | (USB / Bluetooth)
                         v                                                 v
             +-----------------------+                         +-----------------------+
             |   Laci Kasir (Drawer) |                         |  Thermal Printer USB  |
             +-----------------------+                         +-----------+-----------+
                                                                           | (Kabel RJ11)
                                                                           v
                                                               +-----------------------+
                                                               |   Laci Kasir (Drawer) |
                                                               +-----------------------+
```

---

## 4. Panduan Lengkap RawBT (Thermal USB & Bluetooth)

### A. Mengapa Memerlukan RawBT?

Aplikasi web yang berjalan di browser (seperti Chrome/Edge) memiliki batasan keamanan sandboxing sehingga tidak bisa langsung mengakses port USB atau Bluetooth lokal tanpa perantara.  
**RawBT** bertindak sebagai jembatan (_virtual socket bridge_) yang menerima data cetak ESC/POS standar industri melalui port TCP lokal (`127.0.0.1:9100`) dan langsung meneruskannya ke printer USB atau Bluetooth dalam hitungan milidetik.

---

### B. Instalasi & Setup RawBT di Tablet / HP Android

Gunakan langkah ini jika kasir menggunakan tablet atau smartphone Android:

1. **Download & Install**:
    - Buka **Google Play Store** di perangkat Android kasir.
    - Cari aplikasi: **`RawBT print service`** (Developer: _402d_).
    - Tautan langsung: [Google Play Store - RawBT](https://play.google.com/store/apps/details?id=ru.a402d.rawbtprint).
    - Pasang aplikasi hingga selesai.

2. **Koneksikan Printer di RawBT**:
    - Nyalakan printer thermal Anda.
    - Buka aplikasi **RawBT**.
    - Masuk ke menu **Settings** > **Printer connection**.
    - Pilih jenis koneksi:
        - **Bluetooth**: Lakukan pairing dengan printer Bluetooth kasir (PIN default biasanya `0000` atau `1234`).
        - **USB**: Hubungkan kabel printer menggunakan adapter OTG, lalu beri izin akses USB.
    - Lakukan **Test Print** di aplikasi RawBT untuk memastikan printer merespons.

3. **Aktifkan Virtual Server (Port 9100)**:
    - Di aplikasi RawBT, masuk ke menu **Settings** > **Service** / **RawBT Virtual Server**.
    - Aktifkan opsi **Run in background** (Jalankan di latar belakang).
    - Pastikan port diset ke `9100`.

4. **Konfigurasi di POS Kasir**:
    - Buka POS Kasir di browser perangkat kasir.
    - Masuk ke dialog struk (`F9`) atau klik tombol **Pengaturan Printer**.
    - Masukkan:
        - **IP Printer**: `127.0.0.1` (atau `localhost`)
        - **Port**: `9100`
        - **Lebar Kertas**: Pilih `58 mm` atau `80 mm`
    - Klik **Tes Ping Socket** dan **Cetak Struk Tes**.

---

### C. Instalasi & Setup RawBT di Komputer / Laptop Windows

Gunakan langkah ini jika kasir menggunakan laptop atau komputer kasir Windows dengan printer thermal kabel USB:

1. **Download RawBT Server for Windows**:
    - Buka browser dan kunjungi situs resmi RawBT: **[https://rawbt.ru](https://rawbt.ru)**.
    - Download installer: **RawBT for Windows / Desktop Print Server**.

2. **Pemasangan & Pemilihan Printer**:
    - Jalankan file installer hingga selesai.
    - Buka aplikasi **RawBT Server** di Windows (akan muncul ikon RawBT di taskbar / system tray pojok kanan bawah).
    - Klik kanan ikon RawBT > pilih **Settings**.
    - Pada opsi printer, pilih nama printer thermal USB Anda (misal: _POS-58_, _Xprinter_, _Epson TM-T82_).

3. **Verifikasi Port TCP**:
    - Pastikan opsi **RAW TCP Server** berstatus **Active** pada Port **`9100`** (Listening on `0.0.0.0:9100` atau `127.0.0.1:9100`).

4. **Konfigurasi di POS Kasir**:
    - Buka aplikasi POS Kasir di browser Chrome / Edge.
    - Buka menu **Pengaturan Printer** (ikon gear di modal struk atau tekan `F9`).
    - Masukkan:
        - **IP Printer**: `127.0.0.1`
        - **Port**: `9100`
        - **Lebar Kertas**: `58 mm` (Kecil) atau `80 mm` (Standar)
    - Centang opsi:
        - `[x] Buka Laci Otomatis Saat Bayar Tunai`
        - `[x] Cetak Langsung ke Port 9100 Setelah Transaksi` (Opsional untuk _zero-click printing_)
    - Klik **Simpan Pengaturan**.

---

## 5. Konfigurasi Printer Langsung (LAN / Wi-Fi) Tanpa RawBT

Jika toko Anda memiliki printer thermal jaringan yang langsung terhubung ke router menggunakan kabel LAN (Ethernet RJ45) atau Wi-Fi:

- **Anda TIDAK PERLU menginstall RawBT**.
- Printer LAN sudah memiliki IP Address dan server Port 9100 bawaan pabrik.

**Langkah Setup:**

1. Cek IP printer Anda (biasanya dengan menahan tombol _FEED_ saat menyalakan printer untuk mencetak slip konfigurasi, misal keluar IP: `192.168.1.200`).
2. Pastikan komputer/tablet kasir berada di jaringan Wi-Fi/router yang sama.
3. Di POS Kasir, buka menu **Pengaturan Printer**:
    - **IP Printer**: Masukkan IP printer Anda (contoh: `192.168.1.200`).
    - **Port**: `9100`.
4. Klik **Tes Ping Socket** > Jika muncul notifikasi hijau, printer siap digunakan langsung!

---

## 6. Pengaturan Laci Kasir (Cash Drawer Solenoid)

1. Hubungkan kabel laci kasir (kabel RJ11 mirip kabel telepon) ke bagian belakang printer thermal (_port Cash Drawer / DK_).
2. Di sistem kasir:
    - **Otomatis**: Jika opsi _"Buka Laci Otomatis Saat Bayar Tunai"_ dicentang, laci kasir akan otomatis terbuka setiap kali transaksi tunai selesai diproses.
    - **Manual (Pintasan `F8`)**: Tekan tombol **`F8`** kapan saja di keyboard kasir untuk membuka laci kasir.
    - **Tombol Ikon Kilat**: Pada jendela struk pembayaran, klik tombol ikon kilat amber (_Buka Laci Kasir_).

---

---

## 7. Panduan Lengkap Silent Printing (Zero-Click Printing)

**Silent Printing** adalah mekanisme pencetakan struk belanja secara otomatis dan langsung (_direct print_) **tanpa memunculkan jendela dialog konfirmasi print browser**. Setiap kali kasir menekan tombol pembayaran atau pintasan `[SPACE]`, struk akan langsung keluar dari printer thermal dalam hitungan milidetik.

Sistem POS Waroeng mendukung **dua metode Silent Printing**:

---

### A. Metode 1: Silent Printing via Browser Kiosk Mode (`--kiosk-printing`)

> **Direkomendasikan untuk:** Komputer / laptop kasir Windows menggunakan printer thermal USB driver bawaan Windows (tanpa perlu install RawBT).

Browser modern berbasis Chromium (seperti **Google Chrome** dan **Microsoft Edge**) memiliki fitur bawaan bernama **Kiosk Printing**. Saat flag ini aktif, setiap perintah cetak (`window.print()`) akan dieksekusi secara instan ke printer default tanpa menampilkan pratinjau atau pop-up dialog.

#### Langkah-langkah Setup di Komputer Kasir Windows:

1. **Jadikan Printer Thermal sebagai Default Printer di Windows**:
    - Buka menu **Settings** Windows > **Bluetooth & devices** > **Printers & scanners**.
    - Klik printer thermal kasir Anda (misal: _POS-58_, _POS-80_, atau _Xprinter_).
    - Klik tombol **Set as default**.
    - Masuk ke **Printing preferences**:
        - Atur ukuran kertas (_Paper Size_) ke `58 x 297 mm` (untuk 58mm) atau `80 x 297 mm` (untuk 80mm).
        - Margin diatur ke `None` (0 mm).
        - Nonaktifkan _Header & Footer_ agar tanggal/URL web tidak tercetak di struk.

2. **Buat Shortcut Khusus "Kasir POS" di Desktop**:
    - Klik kanan pada ikon Google Chrome di Desktop Anda > pilih **Copy**, lalu **Paste** di Desktop.
    - Ubah nama shortcut baru tersebut menjadi: **`Waroeng POS - Kasir`**.

3. **Tambahkan Parameter `--kiosk-printing` pada Target Shortcut**:
    - Klik kanan pada shortcut **`Waroeng POS - Kasir`** > pilih **Properties**.
    - Pada tab **Shortcut**, perhatikan kolom **Target**.
    - Letakkan kursor di paling akhir teks kolom Target (setelah tanda petik penutup `chrome.exe"`), tambahkan **satu spasi**, lalu ketik:
        ```text
        --kiosk-printing
        ```
    - _(Opsional: Tambahkan URL POS agar browser langsung membuka kasir otomatis)_:
        ```text
        "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk-printing https://app.waroengpos.com/pos
        ```
    - Klik tombol **Apply** lalu **OK**.

4. **Uji Coba Silent Print**:
    - **PENTING**: Tutup seluruh jendela Google Chrome yang sedang terbuka (pastikan tidak ada proses Chrome yang tertinggal di background).
    - Buka kembali browser melalui shortcut **`Waroeng POS - Kasir`** yang baru saja dibuat.
    - Lakukan transaksi di POS kasir dan klik **Cetak Browser** atau aktifkan **Struk Auto**.
    - Struk thermal akan langsung keluar otomatis dari printer tanpa jendela pop-up print!

> 💡 **Untuk Pengguna Microsoft Edge:**
> Langkahnya sama persis, cukup tambahkan `--kiosk-printing` di akhir Target shortcut Edge:  
> `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk-printing`

---

### B. Metode 2: Silent Printing via Direct Socket / RawBT (Port 9100)

> **Direkomendasikan untuk:** Toko yang membutuhkan kecepatan cetak sub-detik, auto-cutter pemotong kertas otomatis, serta hentakan laci kasir otomatis (RJ11).

Metode ini tidak menggunakan driver cetak browser sama sekali, melainkan mengirimkan kode biner perintah mesin (_ESC/POS Byte Stream_) langsung ke soket TCP **Port 9100** printer.

#### Langkah-langkah Setup:

1. **Untuk Printer USB**: Pasang dan aktifkan aplikasi **RawBT Server** di Windows atau **RawBT Print Service** di Android (ikuti panduan lengkap di [Bagian 4](#4-panduan-lengkap-rawbt-thermal-usb--bluetooth)).
2. **Untuk Printer LAN / Wi-Fi**: Pastikan printer thermal jaringan memiliki IP lokal (misal: `192.168.1.200`).
3. **Konfigurasi di POS Kasir**:
    - Buka POS Kasir > tekan tombol `F9` atau klik ikon **Pengaturan Printer** (ikon roda gigi).
    - Masukkan:
        - **IP Printer**: `127.0.0.1` (untuk RawBT USB) atau IP Printer LAN (misal: `192.168.1.200`).
        - **Port**: `9100`.
        - **Lebar Kertas**: Pilih `58 mm` atau `80 mm`.
    - Centang opsi:
        - `[x] Cetak Langsung ke Port 9100 Setelah Transaksi`
        - `[x] Buka Laci Otomatis Saat Bayar Tunai`
    - Klik **Simpan Pengaturan**.

Setiap kali pembayaran dikonfirmasi, perintah cetak dikirim langsung secara _background silent_ ke printer thermal tanpa melalui dialog browser.

---

### C. Fitur Struk Otomatis (Auto Print `[Alt + P]`)

Di layar terminal POS kasir (pada panel kanan transaksi di samping tab pilihan pembayaran), tersedia tombol toggle status:

- **`Struk Auto`** (Pintasan cepat: **`Alt + P`**).
- Jika toggle berstatus **Aktif (Hijau)**:
    - Setiap kali transaksi diselesaikan melalui tombol `[SPACE]` atau `Enter`, sistem langsung memicu proses cetak struk tanpa menunggu kasir menekan tombol cetak lagi secara manual.
- Jika toggle berstatus **Mati (Abu-abu)**:
    - Struk hanya akan dicetak jika kasir secara manual membuka jendela struk (`F9`) atau mengklik tombol cetak (berguna untuk menghemat kertas bagi pelanggan yang tidak menginginkan struk).

---

### D. Tabel Perbandingan & Pemilihan Metode

| Parameter              | Metode 1: Chrome `--kiosk-printing`          | Metode 2: Direct Socket / RawBT             |
| :--------------------- | :------------------------------------------- | :------------------------------------------ |
| **Media Cetak**        | HTML / CSS melalui Canvas Browser            | Raw ESC/POS Byte Stream                     |
| **Instalasi Tambahan** | **Tidak perlu** (hanya edit shortcut Chrome) | Memerlukan RawBT Server (jika USB)          |
| **Dukungan Perangkat** | Komputer / Laptop (Windows, Mac, Linux)      | Windows PC, Tablet / HP Android             |
| **Kecepatan Cetak**    | Cepat (~1 - 2 detik)                         | **Sangat Cepat (< 0.5 detik)**              |
| **Ketajaman Teks**     | Mengikuti rendering font browser             | **Murni dot-matrix thermal (sangat tajam)** |
| **Auto Cutter & Laci** | Tergantung kemampuan driver printer          | **100% didukung via ESC/POS command hex**   |
| **Kemudahan Setup**    | ⭐⭐⭐⭐⭐ (Sangat mudah)                    | ⭐⭐⭐⭐ (Mudah, perlu setting IP/port)     |

---

---

---

## 8. Panduan Cetak Browser Universal & E-Struk WhatsApp (24 Jam)

Selain cetak thermal langsung via RawBT / Port 9100, sistem kasir menyediakan mekanisme pencetakan via browser (**Cetak Browser**) dan pengiriman **E-Struk WhatsApp** dengan tautan publik aktif 24 jam.

---

### A. Mekanisme Cetak Browser Universal (`executeBrowserPrint`)

> **Fungsi Utama:** Memberikan fleksibilitas cetak ke segala jenis printer (printer thermal USB tanpa RawBT, printer kantor Deskjet/Laserjet A4, atau cetak ke PDF) langsung melalui dialog cetak sistem operasi.

Sistem menggunakan utilitas terstandarisasi `executeBrowserPrint`:

1. **Mengatasi Bug 0x0 Iframe Chromium**: Pada browser Chrome & Edge terbaru, pencetakan background iframe yang berdimensi 0x0 sering kali dibatalkan secara diam-diam oleh rendering engine Blink. Utilitas ini menggunakan off-screen iframe berdimensi nyata (`350px x 600px`) sehingga dialog print selalu muncul dengan andal.
2. **Fallback Otomatis**: Jika browser menerapkan proteksi sandbox ketat yang memblokir iframe, sistem otomatis membuka jendela pop-up print khusus.
3. **Cakupan Seluruh Modul**: Tombol Cetak Browser tersedia di 9 jenis dokumen:
    - Struk Transaksi POS Penjualan (`receipt-modal`)
    - Bukti Pembayaran Kasbon Pelanggan (`debt-payment-receipt-modal`)
    - Bukti Kas Masuk & Kas Keluar Arus Kas (`cash-flow-receipt-modal`)
    - Bukti Kasbon Karyawan & Pelunasan Kasbon (`employee-kasbon-receipt-modal`)
    - Rekap Tutup Shift Kasir X-Report / Z-Report (`shift-summary-receipt-modal`)
    - Slip Gaji Karyawan (`payroll-slip-modal`)
    - Nota Penerimaan Barang Kulakan (`purchase-receipt-modal`)
    - Bukti Pengeluaran Kas Hutang Supplier (`vendor-payment-receipt-modal`)

---

### B. E-Struk WhatsApp (Format Identik Struk Fisik)

Format pesan teks WhatsApp diselaraskan 100% dengan media cetak kertas thermal untuk menjaga profesionalitas dan kepastian informasi pelanggan:

- **Header**: Nama toko, alamat, dan nomor telepon resmi.
- **Informasi Transaksi (Stack Rapi)**:
    - Nomor struk / referensi berdampingan dengan metode pembayaran (contoh: `No: PAY-20260927-40  |  TF BANK`).
    - Penyingkatan metode pembayaran bank transfer diseragamkan menjadi **`TF BANK`**.
    - Tanggal tunggal (tanpa duplikasi): `Tanggal: dd/mm/yyyy hh.mm`.
    - Nama kasir yang bertugas: `Kasir: Budi Santoso (Admin Toko)`.
    - Pelanggan Trader / Grosir: `[ TRADER / GROSIR ] Tina [t081]`.
- **Rincian Finansial**:
    - Kasbon Sebelumnya, Jumlah Dibayar, dan Sisa Kasbon.
    - Status Tagihan (`LUNAS` / `BELUM LUNAS`).
    - Catatan transaksi / alokasi faktur.
- **Footer**: Pesan terima kasih resmi dan disclaimer tanda terima sah.

---

### C. Link E-Struk Publik Aktif 24 Jam (Signed Temporary Token)

Setiap transaksi kas dan uang masuk dilengkapi fitur tanda terima elektronik yang aman:

1. **Keamanan URL Bertanda Tangan**: Tautan e-struk diamankan menggunakan token bertanda tangan (_temporary signed URL_) yang berlaku selama **24 jam** sejak transaksi dilakukan.
2. **Tanpa Perlu Login**: Pelanggan dapat membuka tautan kapan saja dari smartphone via browser tanpa perlu mendaftar atau login ke sistem kasir.
3. **Tampilan Responsif & Opsi Cetak**: Layar e-struk publik menampilkan nota digital berdesain rapi serta tombol untuk mengunduh atau mencetak ulang struk bagi keperluan administrasi pelanggan.

---

### D. Pusat Uji & Pratinjau Seluruh Struk Toko (`/store`)

Pemilik toko (Owner) atau Admin dapat meninjau format seluruh struk tanpa perlu membuat transaksi riil:

1. Masuk ke menu **Pengaturan Toko** (`/store`).
2. Buka tab **Struk**.
3. Di bagian bawah terdapat kartu **Uji & Pratinjau Seluruh Format Struk**:
    - **Pratinjau Struk Penjualan POS**
    - **Pratinjau Pembayaran Kasbon Pelanggan**
    - **Pratinjau Arus Kas Operasional**
    - **Pratinjau Kasbon Karyawan**
    - **Pratinjau Tutup Shift (Z-Report)**
4. Anda dapat mencoba langsung tombol **Cetak Browser**, **Bagikan WhatsApp**, dan **Salin Link E-Struk** untuk memastikan seluruh pengaturan identitas toko dan printer telah sesuai.

---

## 9. Panduan Pemecahan Masalah (Troubleshooting)

| Masalah                                         | Kemungkinan Penyebab                           | Solusi                                                                                                                                           |
| :---------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gagal Cetak Langsung (Direct Print)**         | IP Printer salah atau RawBT belum berjalan     | Pastikan RawBT berstatus aktif. Pastikan IP diisi `127.0.0.1` dan Port `9100`. Coba tombol _Tes Ping Socket_.                                    |
| **Tombol Cetak Browser tidak merespons**        | Pop-up blocker browser aktif                   | Jika browser memblokir pop-up fallback, klik ikon gembok / perisai di address bar browser dan pilih _Allow popups and redirects_.                |
| **Margin struk cetak browser terpotong**        | Pengaturan margin bawaan browser               | Pada dialog print browser, atur **Margins** ke _None_ atau _Minimum_, dan pastikan skala (_Scale_) diatur ke 100%.                               |
| **Tautan E-Struk kedaluwarsa**                  | Link dibuka setelah lebih dari 24 jam          | Untuk alasan keamanan data keuangan, tautan e-struk otomatis kedaluwarsa setelah 24 jam. Minta kasir mencetak ulang jika diperlukan arsip fisik. |
| **Karakter tercetak aneh / berantakan**         | Ukuran kertas salah atau baud rate tidak cocok | Pastikan memilih lebar kertas yang sesuai (58mm atau 80mm) di menu Pengaturan Printer.                                                           |
| **Laci kasir tidak terbuka**                    | Kabel RJ11 kendor atau printer mati            | Pastikan kabel laci tercolok kuat ke port DK di belakang printer thermal. Pastikan printer dalam kondisi menyala.                                |
| **Teks tombol tidak terbaca di kasir**          | Pengaturan tema warna                          | Sistem telah diperbarui mendukung Light Mode dan Dark Mode otomatis. Lakukan refresh halaman (`Ctrl + F5`).                                      |
| **Printer Bluetooth sering terputus (Android)** | Penghemat baterai Android mematikan RawBT      | Masuk ke _Settings Android > Apps > RawBT > Battery > No Restrictions_ (Jangan batasi latar belakang).                                           |
