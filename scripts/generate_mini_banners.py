import os
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(BASE_DIR, "public", "images", "banners")
STORAGE_DIR = os.path.join(BASE_DIR, "storage", "app", "public", "tenants", "1", "banners")

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(STORAGE_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

MINI_BANNERS = [
    {
        "filename": "banner-mini-member.png",
        "title": "Member Loyalty Strip",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 240px;
    background: linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 70%, #0f172a 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
    background-size: 24px 24px;
    opacity: 0.5;
    pointer-events: none;
  }
  .glow {
    position: absolute;
    right: -60px;
    top: -60px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .left-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 2;
    max-width: 780px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    background: #10b981;
    color: #022c22;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  .spec-tag {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(8px);
    color: #a7f3d0;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 9999px;
    font-family: monospace;
  }
  h1 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1.2;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  h1 span {
    color: #34d399;
  }
  p {
    font-size: 16px;
    color: #d1fae5;
    font-weight: 500;
  }
  .right-cta {
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .reward-pill {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #78350f;
    padding: 16px 28px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35);
    border: 2px solid #fef3c7;
    transform: rotate(-2deg);
  }
  .reward-title {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .reward-val {
    font-size: 26px;
    font-weight: 900;
    line-height: 1;
    margin-top: 2px;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow"></div>
  
  <div class="left-content">
    <div class="badge-row">
      <span class="badge">MEMBER KHUSUS</span>
      <span class="spec-tag">Ukuran Display: 600 x 120 px (5:1)</span>
    </div>
    <h1>Gabung Member <span>Berkah Rewards</span></h1>
    <p>Dapatkan cashback poin belanja & harga promo eksklusif setiap transaksi kasir!</p>
  </div>

  <div class="right-cta">
    <div class="reward-pill">
      <div class="reward-title">CASHBACK</div>
      <div class="reward-val">HINGGA 10%</div>
    </div>
  </div>
</body>
</html>"""
    },
    {
        "filename": "banner-mini-qris.png",
        "title": "QRIS Cashless Strip",
        "html": """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 240px;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 75%, #0f172a 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    overflow: hidden;
    position: relative;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
    background-size: 24px 24px;
    opacity: 0.5;
    pointer-events: none;
  }
  .glow {
    position: absolute;
    right: -40px;
    top: -40px;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .left-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 2;
    max-width: 780px;
  }
  .badge-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    background: #6366f1;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  .spec-tag {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(8px);
    color: #c7d2fe;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 9999px;
    font-family: monospace;
  }
  h1 {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1.2;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  h1 span {
    color: #38bdf8;
  }
  p {
    font-size: 16px;
    color: #c7d2fe;
    font-weight: 500;
  }
  .right-cta {
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .qris-pill {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    padding: 16px 28px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(2, 132, 199, 0.35);
    border: 2px solid #38bdf8;
  }
  .qris-title {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #bae6fd;
  }
  .qris-val {
    font-size: 26px;
    font-weight: 900;
    line-height: 1;
    margin-top: 2px;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow"></div>
  
  <div class="left-content">
    <div class="badge-row">
      <span class="badge">BAYAR CEPAT</span>
      <span class="spec-tag">Ukuran Display: 600 x 120 px (5:1)</span>
    </div>
    <h1>Scan Bebas Ribet <span>QRIS All Payment</span></h1>
    <p>Dukung BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay & Dana tanpa biaya admin.</p>
  </div>

  <div class="right-cta">
    <div class="qris-pill">
      <div class="qris-title">TRANSAKSI INSTAN</div>
      <div class="qris-val">0 BIAYA</div>
    </div>
  </div>
</body>
</html>"""
    }
]

def main():
    print("Launching browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=EDGE_PATH if os.path.exists(EDGE_PATH) else None,
            headless=True
        )
        page = browser.new_page(viewport={"width": 1200, "height": 240})
        
        for item in MINI_BANNERS:
            print(f"Generating {item['filename']}...")
            page.set_content(item["html"])
            page.wait_for_timeout(300)
            
            pub_path = os.path.join(PUBLIC_DIR, item["filename"])
            storage_path = os.path.join(STORAGE_DIR, item["filename"])
            
            page.screenshot(path=pub_path, type="png")
            page.screenshot(path=storage_path, type="png")
            print(f"  -> Saved to {pub_path}")
            print(f"  -> Saved to {storage_path}")
            
        browser.close()
    print("Done generating mini banners!")

if __name__ == "__main__":
    main()
