# Implementation Plan - Informasi Struk: Metode Bayar, Rincian Kasbon & Trader

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menampilkan metode bayar rata kanan di header, format Trader ringkas `[ TRADER / GROSIR ] Toko Berkah (Bpk. Joko)`, format kasbon tanpa kata bayar/kembalian dengan rincian (Masuk Kasbon Baru, Kasbon Sebelumnya, TOTAL KASBON SAAT INI), menyembunyikan kembalian 0 untuk Kasbon dan QRIS, dan label `Bayar (Tunai)` / `Bayar (QRIS)`.

**Architecture:**

1. Backend Controller (`PosController::receipt`) & Service (`EscPosService`): Eager-load `customer`, format ESC/POS header rata kanan, format Trader ringkas 1-baris, format kasbon transparan dengan rincian kasbon baru + sebelumnya + saat ini, dan sembunyikan baris kembalian 0 pada kasbon/qris.
2. Frontend POS Modal (`receipt-modal.tsx`): Menyesuaikan `handleBrowserPrint` dan kartu pratinjau struk kasir dengan layout yang sama persis.
3. Automated Testing (`tests/Feature/ReceiptDetailAndThermalTest.php`): Pengujian Pest untuk memvalidasi payload dan format ESC/POS.

---

## Global Constraints

- Menggunakan konvensi kode eksisting di repository.
- Mendukung lebar kertas thermal `58mm` dan `80mm`.
- `git commit` lokal diperbolehkan setelah lulus pengujian, namun **DILARANG** melakukan `git push` atau `deploy` tanpa instruksi eksplisit pengguna.

---

## Tasks

### Task 1: Backend Support & ESC/POS Formatting

**Files:**

- Modify: `app/Http/Controllers/PosController.php`
- Modify: `app/Services/EscPosService.php`
- Create: `tests/Feature/ReceiptDetailAndThermalTest.php`

- [ ] **Step 1: Write Pest Test for Receipt Details & Thermal Output**
- [ ] **Step 2: Update `PosController::receipt` to load `customer`**
- [ ] **Step 3: Update `EscPosService.php` with Trader format, Right-aligned payment method, and Kasbon breakdown**
- [ ] **Step 4: Run Pest tests to verify**

### Task 2: Frontend Receipt Modal Updates

**Files:**

- Modify: `resources/js/components/receipt-modal.tsx`

- [ ] **Step 1: Update Browser Print HTML in `receipt-modal.tsx`**
- [ ] **Step 2: Update On-Screen Receipt Preview in `receipt-modal.tsx`**
- [ ] **Step 3: Run `npm run build` to verify frontend compilation**

### Task 3: Verification & Local Commit

- [ ] **Step 1: Run complete test suite**
- [ ] **Step 2: Update `docs/PANDUAN_OPERASIONAL_KASIR_DAN_HARDWARE.md`**
- [ ] **Step 3: Git commit locally and report to user**
