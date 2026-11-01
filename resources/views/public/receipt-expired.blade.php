<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tautan Kedaluwarsa - {{ $tenant?->store_name ?? 'Waroeng POS' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            color: #0f172a;
            padding: 30px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            width: 100%;
            max-width: 440px;
            background: #ffffff;
            border-radius: 20px;
            padding: 36px 28px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
        }

        .icon-box {
            width: 64px;
            height: 64px;
            background: #fef2f2;
            color: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            border: 2px solid #fee2e2;
        }

        h1 {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
        }

        p {
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px;
            font-size: 12px;
            text-align: left;
            margin-bottom: 24px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }

        .info-row:last-child {
            margin-bottom: 0;
        }

        .btn-wa {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #10b981;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            width: 100%;
            transition: all 0.2s ease;
        }

        .btn-wa:hover {
            background: #059669;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        </div>

        <h1>Tautan E-Struk Kedaluwarsa</h1>
        <p>
            Demi privasi belanja dan keamanan data, tautan e-struk digital ini telah kedaluwarsa setelah <strong>24 jam</strong> dari waktu transaksi.
        </p>

        <div class="info-box">
            <div class="info-row">
                <span style="color: #64748b;">Toko:</span>
                <span style="font-weight: 700;">{{ $tenant?->store_name ?? 'Waroeng POS' }}</span>
            </div>
            @if(isset($transaction->invoice_no))
                <div class="info-row">
                    <span style="color: #64748b;">No. Invoice:</span>
                    <span style="font-family: monospace; font-weight: 700;">{{ $transaction->invoice_no }}</span>
                </div>
            @endif
        </div>

        @if(!empty($tenant?->phone))
            @php
                $cleanPhone = preg_replace('/[^0-9]/', '', $tenant->phone);
                if (str_starts_with($cleanPhone, '0')) {
                    $cleanPhone = '62' . substr($cleanPhone, 1);
                }
            @endphp
            <a class="btn-wa" href="https://wa.me/{{ $cleanPhone }}?text=Halo%20{{ urlencode($tenant->store_name ?? 'Toko') }},%20saya%20membutuhkan%20informasi%20struk%20transaksi%20{{ urlencode($transaction->invoice_no ?? '') }}" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Hubungi Kasir / Toko via WhatsApp
            </a>
        @endif
    </div>

</body>
</html>
