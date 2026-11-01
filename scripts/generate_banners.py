import os
import sys
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "storage", "app", "public", "tenants", "1", "banners"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

BANNERS = [
    {
        "filename": "banner-1-promo-jsm.png",
        "title": "Promo JSM Hemat Akhir Pekan",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 80% 20%, #b91c1c 0%, #7f1d1d 35%, #450a0a 80%, #1f0404 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
    overflow: hidden;
    position: relative;
  }
  .bg-decor {
    position: absolute;
    right: -100px;
    top: -100px;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .store-tag {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 12px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }
  .promo-badge {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #451a03;
    font-weight: 900;
    font-size: 24px;
    padding: 14px 36px;
    border-radius: 999px;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.5);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    margin-top: 20px;
  }
  .super-title {
    font-size: 82px;
    font-weight: 950;
    line-height: 1.05;
    letter-spacing: -2px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.6);
  }
  .highlight-text {
    background: linear-gradient(90deg, #fde047, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    font-size: 32px;
    color: #fecaca;
    margin-top: 20px;
    font-weight: 500;
    max-width: 1200px;
    line-height: 1.4;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 50px;
    position: relative;
    z-index: 2;
  }
  .promo-card {
    background: rgba(0, 0, 0, 0.45);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 28px;
    padding: 32px;
    backdrop-filter: blur(16px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
  }
  .promo-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
  }
  .card-category {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 2px;
    color: #fca5a5;
  }
  .card-item-name {
    font-size: 30px;
    font-weight: 800;
    margin-top: 8px;
    color: white;
  }
  .price-box {
    margin-top: 24px;
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  .current-price {
    font-size: 44px;
    font-weight: 900;
    color: #fde047;
    font-family: monospace, sans-serif;
  }
  .old-price {
    font-size: 24px;
    color: #9ca3af;
    text-decoration: line-through;
    font-weight: 600;
    font-family: monospace, sans-serif;
  }
  .save-tag {
    display: inline-block;
    align-self: flex-start;
    background: #ef4444;
    color: white;
    font-size: 16px;
    font-weight: 800;
    padding: 4px 14px;
    border-radius: 8px;
    margin-top: 12px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 30px;
    position: relative;
    z-index: 2;
    font-size: 20px;
    color: #fca5a5;
  }
  .footer-badge {
    font-weight: 700;
    color: white;
    background: rgba(255,255,255,0.1);
    padding: 8px 20px;
    border-radius: 999px;
  }
</style>
</head>
<body>
  <div class="bg-decor"></div>
  <div class="bg-grid"></div>

  <div class="header">
    <div class="store-tag">🏪 Waroeng Berkah Mart</div>
    <div class="promo-badge">⚡ Promo JSM Spesial Kasir</div>
  </div>

  <div class="hero-content">
    <h1 class="super-title">GEBYAR DISKON <span class="highlight-text">SEMBAKO HEMAT</span></h1>
    <p class="subtitle">Belanja kebutuhan harian lebih untung setiap Jumat, Sabtu & Minggu. Stok melimpah & harga terjamin termurah!</p>
    
    <div class="cards-grid">
      <div class="promo-card">
        <div>
          <span class="card-category">Kebutuhan Dapur</span>
          <h3 class="card-item-name">Minyak Goreng Pouch 2L</h3>
        </div>
        <div>
          <div class="price-box">
            <span class="current-price">Rp 33.500</span>
            <span class="old-price">Rp 39.000</span>
          </div>
          <span class="save-tag">HEMAT Rp 5.500</span>
        </div>
      </div>

      <div class="promo-card">
        <div>
          <span class="card-category">Bahan Pokok</span>
          <h3 class="card-item-name">Beras Premium Raja 5kg</h3>
        </div>
        <div>
          <div class="price-box">
            <span class="current-price">Rp 68.000</span>
            <span class="old-price">Rp 76.500</span>
          </div>
          <span class="save-tag">HEMAT Rp 8.500</span>
        </div>
      </div>

      <div class="promo-card">
        <div>
          <span class="card-category">Bahan Masak</span>
          <h3 class="card-item-name">Gula Pasir Kristal 1kg</h3>
        </div>
        <div>
          <div class="price-box">
            <span class="current-price">Rp 15.500</span>
            <span class="old-price">Rp 18.000</span>
          </div>
          <span class="save-tag">HEMAT Rp 2.500</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>🏷️ Berlaku di Kasir • Periode Akhir Pekan Ini • Selama Persediaan Masih Ada</div>
    <div class="footer-badge">Maks. 2 Pcs / Pelanggan</div>
  </div>
</body>
</html>"""
    },
    {
        "filename": "banner-2-qris-cashless.png",
        "title": "Bayar Praktis & Cepat Pakai QRIS",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 75% 40%, #064e3b 0%, #022c22 40%, #090e17 80%, #020617 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
    overflow: hidden;
    position: relative;
  }
  .bg-glow {
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .store-tag {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge-qris {
    background: #00a572;
    color: #022c22;
    font-weight: 900;
    font-size: 22px;
    padding: 12px 32px;
    border-radius: 999px;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 0 30px rgba(0, 165, 114, 0.4);
  }
  .main-stage {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .super-title {
    font-size: 80px;
    font-weight: 950;
    line-height: 1.05;
    letter-spacing: -2px;
  }
  .highlight-emerald {
    color: #34d399;
  }
  .subtitle {
    font-size: 30px;
    color: #94a3b8;
    margin-top: 24px;
    line-height: 1.45;
  }
  .features-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 36px;
  }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 26px;
    font-weight: 600;
    color: #e2e8f0;
  }
  .icon-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(16, 185, 129, 0.2);
    border: 2px solid #10b981;
    border-radius: 50%;
    color: #34d399;
    font-size: 24px;
    font-weight: 900;
    flex-shrink: 0;
  }
  .qris-card {
    background: rgba(15, 23, 42, 0.7);
    border: 2px solid rgba(16, 185, 129, 0.3);
    border-radius: 36px;
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
  }
  .qris-mockup {
    width: 220px;
    height: 220px;
    background: white;
    border-radius: 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .qr-pattern {
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(#1e293b 40%, transparent 40%),
      radial-gradient(#1e293b 40%, transparent 40%);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px;
    border-radius: 12px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qr-center {
    background: #00a572;
    color: white;
    font-weight: 900;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }
  .qris-card-title {
    font-size: 28px;
    font-weight: 800;
    margin-top: 28px;
    color: white;
  }
  .qris-card-sub {
    font-size: 18px;
    color: #94a3b8;
    margin-top: 8px;
  }
  .supported-apps {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
  }
  .app-pill {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #cbd5e1;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    font-size: 20px;
    color: #94a3b8;
    position: relative;
    z-index: 2;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>

  <div class="header">
    <div class="store-tag">🏪 Waroeng Berkah Mart</div>
    <div class="badge-qris">⚡ Pembayaran Modern QRIS</div>
  </div>

  <div class="main-stage">
    <div>
      <h1 class="super-title">SCAN & BAYAR <br><span class="highlight-emerald">LEBIH PRAKTIS</span></h1>
      <p class="subtitle">Bebas uang kembalian rusak, bebas repot bawa uang pas. Cukup 1 detik scan QRIS dinamis di layar kasir ini!</p>

      <div class="features-list">
        <div class="feature-item">
          <div class="icon-check">✓</div>
          <div>Mendukung Semua Mobile Banking (BCA, Mandiri, BRI, BNI, dll)</div>
        </div>
        <div class="feature-item">
          <div class="icon-check">✓</div>
          <div>Bisa Pakai E-Wallet Favorit (GoPay, OVO, ShopeePay, DANA)</div>
        </div>
        <div class="feature-item">
          <div class="icon-check">✓</div>
          <div>0% Biaya Admin Tambahan • Transaksi Langsung Terverifikasi</div>
        </div>
      </div>
    </div>

    <div class="qris-card">
      <div class="qris-mockup">
        <div class="qr-pattern">
          <div class="qr-center">QRIS</div>
        </div>
      </div>
      <h3 class="qris-card-title">Tinggal Scan di Layar</h3>
      <p class="qris-card-sub">Kode QRIS muncul otomatis saat kasir memproses total tagihan Anda</p>
      <div class="supported-apps">
        <span class="app-pill">BCA Mobile</span>
        <span class="app-pill">Livin' Mandiri</span>
        <span class="app-pill">BRImo</span>
        <span class="app-pill">GoPay</span>
        <span class="app-pill">OVO</span>
        <span class="app-pill">ShopeePay</span>
        <span class="app-pill">DANA</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>🔒 Standar Pembayaran Nasional Bank Indonesia • Cepat, Aman & Lunas Otomatis</div>
    <div>Kasir Waroeng Berkah</div>
  </div>
</body>
</html>"""
    },
    {
        "filename": "banner-3-beli-2-gratis-1.png",
        "title": "Beli 2 Gratis 1 Aneka Minuman Dingin & Snack",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 80% 30%, #0369a1 0%, #0c4a6e 40%, #0f172a 85%, #020617 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
    overflow: hidden;
    position: relative;
  }
  .bg-circle {
    position: absolute;
    right: -80px;
    top: 50%;
    transform: translateY(-50%);
    width: 750px;
    height: 750px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .store-tag {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge-chiller {
    background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
    color: white;
    font-weight: 900;
    font-size: 22px;
    padding: 12px 32px;
    border-radius: 999px;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4);
  }
  .hero-content {
    position: relative;
    z-index: 2;
  }
  .bogo-tag {
    display: inline-block;
    background: #f59e0b;
    color: #451a03;
    font-size: 28px;
    font-weight: 950;
    padding: 10px 24px;
    border-radius: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .super-title {
    font-size: 92px;
    font-weight: 950;
    line-height: 1.0;
    letter-spacing: -2px;
  }
  .highlight-cyan {
    background: linear-gradient(90deg, #38bdf8, #67e8f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    font-size: 32px;
    color: #cbd5e1;
    margin-top: 20px;
    font-weight: 500;
    max-width: 1300px;
  }
  .items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 48px;
  }
  .item-card {
    background: rgba(15, 23, 42, 0.6);
    border: 2px solid rgba(56, 189, 248, 0.25);
    border-radius: 28px;
    padding: 32px;
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .item-card-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  .item-card-title {
    font-size: 26px;
    font-weight: 800;
    color: white;
  }
  .item-card-desc {
    font-size: 18px;
    color: #94a3b8;
    margin-top: 8px;
    line-height: 1.4;
  }
  .item-badge {
    display: inline-block;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: #38bdf8;
    font-size: 15px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 8px;
    margin-top: 16px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    font-size: 20px;
    color: #94a3b8;
    position: relative;
    z-index: 2;
  }
</style>
</head>
<body>
  <div class="bg-circle"></div>

  <div class="header">
    <div class="store-tag">🏪 Waroeng Berkah Mart</div>
    <div class="badge-chiller">❄️ Chiller & Snacks Deals</div>
  </div>

  <div class="hero-content">
    <div class="bogo-tag">PROMO SPESIAL KASIR</div>
    <h1 class="super-title">BELI 2 <span class="highlight-cyan">GRATIS 1</span></h1>
    <p class="subtitle">Haus setelah bepergian? Ambil minuman dingin dan cemilan favorit Anda di kulkas kasir sekarang juga!</p>

    <div class="items-grid">
      <div class="item-card">
        <div class="item-card-icon">🧃</div>
        <h3 class="item-card-title">Kopi Susu & Teh Botol Dingin</h3>
        <p class="item-card-desc">Berlaku untuk aneka varian rasa kopi susu 250ml & teh kemasan dingin.</p>
        <span class="item-badge">Bebas Campur Varian Rasa</span>
      </div>

      <div class="item-card">
        <div class="item-card-icon">🥔</div>
        <h3 class="item-card-title">Keripik Kentang & Biskuit</h3>
        <p class="item-card-desc">Camilan renyah teman santai keluarga, beli 2 pack varian sama langsung dapat 3.</p>
        <span class="item-badge">Hemat s/d Rp 12.000</span>
      </div>

      <div class="item-card">
        <div class="item-card-icon">🍦</div>
        <h3 class="item-card-title">Es Krim Cone & Stick Pilihan</h3>
        <p class="item-card-desc">Segarkan harimu dengan es krim favorit keluarga harga spesial.</p>
        <span class="item-badge">Tersedia di Chiller Kasir</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>⚡ Promo Berlaku Setiap Hari • Ambil Produknya di Dekat Kasir Sekarang!</div>
    <div>S&K Berlaku</div>
  </div>
</body>
</html>"""
    },
    {
        "filename": "banner-4-member-loyalty.png",
        "title": "Program Member Berkah Loyalty Rewards",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 80% 20%, #4c1d95 0%, #2e1065 40%, #0f172a 85%, #030712 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
    overflow: hidden;
    position: relative;
  }
  .bg-glow {
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .store-tag {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge-vip {
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    color: #451a03;
    font-weight: 900;
    font-size: 22px;
    padding: 12px 32px;
    border-radius: 999px;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
  }
  .main-stage {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .super-title {
    font-size: 80px;
    font-weight: 950;
    line-height: 1.05;
    letter-spacing: -2px;
  }
  .highlight-purple {
    background: linear-gradient(90deg, #c084fc, #e879f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    font-size: 30px;
    color: #cbd5e1;
    margin-top: 24px;
    line-height: 1.45;
  }
  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 36px;
  }
  .benefit-item {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 26px;
    font-weight: 600;
    color: #f1f5f9;
  }
  .icon-star {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(245, 158, 11, 0.2);
    border: 2px solid #f59e0b;
    border-radius: 50%;
    color: #fbbf24;
    font-size: 22px;
    flex-shrink: 0;
  }
  .card-vip-mockup {
    background: linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
    border: 2px solid rgba(192, 132, 252, 0.4);
    border-radius: 36px;
    padding: 48px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }
  .card-vip-mockup::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(232, 121, 249, 0.3) 0%, transparent 70%);
  }
  .vip-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .vip-chip {
    width: 60px;
    height: 44px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.4);
  }
  .vip-badge-pill {
    background: rgba(192, 132, 252, 0.15);
    border: 1px solid #c084fc;
    color: #e9d5ff;
    padding: 6px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 16px;
  }
  .vip-number {
    font-family: monospace;
    font-size: 32px;
    letter-spacing: 4px;
    margin-top: 40px;
    color: #e2e8f0;
  }
  .vip-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 36px;
  }
  .vip-holder {
    font-size: 16px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .vip-name {
    font-size: 26px;
    font-weight: 800;
    color: white;
    margin-top: 4px;
  }
  .vip-points {
    text-align: right;
  }
  .points-val {
    font-size: 36px;
    font-weight: 900;
    color: #fbbf24;
    font-family: monospace;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    font-size: 20px;
    color: #cbd5e1;
    position: relative;
    z-index: 2;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>

  <div class="header">
    <div class="store-tag">🏪 Waroeng Berkah Mart</div>
    <div class="badge-vip">👑 Member Loyalty Club</div>
  </div>

  <div class="main-stage">
    <div>
      <h1 class="super-title">BELANJA MAKIN UNTUNG <br><span class="highlight-purple">DENGAN MEMBER</span></h1>
      <p class="subtitle">Daftar sekarang gratis di kasir! Cukup sebutkan nomor handphone dan nikmati berbagai keuntungan eksklusif.</p>

      <div class="benefits-list">
        <div class="benefit-item">
          <div class="icon-star">★</div>
          <div>Dapatkan 1 Poin Setiap Transaksi Kelipatan Rp 10.000</div>
        </div>
        <div class="benefit-item">
          <div class="icon-star">★</div>
          <div>Tukarkan Poin Langsung Jadi Potongan Belanja di Kasir</div>
        </div>
        <div class="benefit-item">
          <div class="icon-star">★</div>
          <div>Harga Spesial Member untuk Puluhan Produk Setiap Bulan</div>
        </div>
      </div>
    </div>

    <div class="card-vip-mockup">
      <div class="vip-top">
        <div class="vip-chip"></div>
        <div class="vip-badge-pill">BERKAH REWARDS</div>
      </div>
      <div class="vip-number">•••• •••• •••• 8829</div>
      <div class="vip-bottom">
        <div>
          <div class="vip-holder">Kartu Member Digital</div>
          <div class="vip-name">PELANGGAN SETIA</div>
        </div>
        <div class="vip-points">
          <div class="vip-holder">Kumpulkan Poin</div>
          <div class="points-val">POIN AKTIF</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>✨ Poin Berlaku Selamanya • Tanya Kasir Bertugas untuk Pendaftaran Instan (Gratis!)</div>
    <div>Member Berkah 2026</div>
  </div>
</body>
</html>"""
    },
    {
        "filename": "banner-5-official-store.png",
        "title": "Selamat Datang di Waroeng Berkah Mart",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: radial-gradient(circle at 50% 30%, #064e3b 0%, #022c22 45%, #0b1120 85%, #030712 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
    overflow: hidden;
    position: relative;
    text-align: center;
  }
  .bg-aura {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 2;
  }
  .welcome-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 12px 32px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 2px;
    color: #34d399;
    text-transform: uppercase;
  }
  .hero-center {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .store-icon-big {
    width: 110px;
    height: 110px;
    background: rgba(16, 185, 129, 0.15);
    border: 2px solid rgba(16, 185, 129, 0.35);
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 54px;
    margin-bottom: 28px;
    box-shadow: 0 20px 40px rgba(0, 165, 114, 0.2);
  }
  .store-title {
    font-size: 78px;
    font-weight: 950;
    letter-spacing: -2px;
    line-height: 1.1;
  }
  .store-tagline {
    font-size: 32px;
    color: #94a3b8;
    margin-top: 18px;
    max-width: 1100px;
    font-weight: 500;
  }
  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 50px;
    width: 100%;
    max-width: 1400px;
  }
  .value-box {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(12px);
    text-align: left;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .value-icon {
    font-size: 36px;
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .value-title {
    font-size: 22px;
    font-weight: 800;
    color: white;
  }
  .value-desc {
    font-size: 16px;
    color: #94a3b8;
    margin-top: 4px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    font-size: 20px;
    color: #94a3b8;
    position: relative;
    z-index: 2;
  }
</style>
</head>
<body>
  <div class="bg-aura"></div>

  <div class="header">
    <div class="welcome-pill">✨ Selamat Datang di Toko Kami</div>
  </div>

  <div class="hero-center">
    <div class="store-icon-big">🏪</div>
    <h1 class="store-title">WAROENG BERKAH MART</h1>
    <p class="store-tagline">Solusi Belanja Harian Lengkap, Nyaman, dan Hemat untuk Seluruh Keluarga</p>

    <div class="values-grid">
      <div class="value-box">
        <div class="value-icon">🛡️</div>
        <div>
          <div class="value-title">Produk 100% Asli & Segar</div>
          <div class="value-desc">Jaminan kualitas bahan pokok dan makanan pilihan</div>
        </div>
      </div>

      <div class="value-box">
        <div class="value-icon">💳</div>
        <div>
          <div class="value-title">Pembayaran Lengkap</div>
          <div class="value-desc">Mendukung Tunai, QRIS, Debit & Dompet Digital</div>
        </div>
      </div>

      <div class="value-box">
        <div class="value-icon">🤝</div>
        <div>
          <div class="value-title">Pelayanan Kasir Ramah</div>
          <div class="value-desc">Kenyamanan & kepuasan Anda adalah kebanggaan kami</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>⏰ Buka Setiap Hari: 07.00 - 22.00 WIB</div>
    <div>Terima kasih atas kunjungan Anda</div>
  </div>
</body>
</html>"""
    }
]

def main():
    print(f"Output directory: {OUTPUT_DIR}")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=EDGE_PATH, headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        for banner in BANNERS:
            dest_path = os.path.join(OUTPUT_DIR, banner["filename"])
            print(f"Generating {banner['filename']}...")
            page.set_content(banner["html"])
            page.wait_for_load_state("networkidle")
            page.screenshot(path=dest_path, full_page=False)
            print(f"Saved: {dest_path}")

        browser.close()
    print("All banners generated successfully!")

if __name__ == "__main__":
    main()
