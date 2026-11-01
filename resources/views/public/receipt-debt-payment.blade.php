<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bukti Pembayaran Kasbon #{{ $refNo }} - {{ $tenant?->store_name ?? 'Waroeng POS' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-page: #0f172a;
            --receipt-bg: #ffffff;
            --text-main: #000000;
            --text-muted: #334155;
            --border-dash: #94a3b8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            color: var(--text-main);
            padding: 24px 12px 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .action-bar {
            width: 100%;
            max-width: 380px;
            display: flex;
            gap: 10px;
            margin-bottom: 14px;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }

        .btn-print {
            background: #2563eb;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }

        .btn-print:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }

        .btn-wa {
            background: #10b981;
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }

        .btn-wa:hover {
            background: #059669;
            transform: translateY(-1px);
        }

        .badge-24h {
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 14px;
            border: 1px solid #fde68a;
        }

        .receipt-card {
            width: 100%;
            max-width: 380px;
            background: var(--receipt-bg);
            border-radius: 4px;
            padding: 24px 20px 28px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
            position: relative;
            font-size: 12px;
            line-height: 1.35;
        }

        .receipt-card::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 8px;
            right: 8px;
            height: 16px;
            background: radial-gradient(circle, transparent, transparent 50%, var(--receipt-bg) 50%, var(--receipt-bg) 100%);
            background-size: 16px 16px;
            background-repeat: repeat-x;
        }

        .dashed-line {
            border-top: 1px dashed var(--border-dash);
            margin: 8px 0;
            width: 100%;
        }

        .solid-line {
            border-top: 1.5px solid #000000;
            margin: 6px 0;
            width: 100%;
        }

        .store-header {
            text-align: center;
            line-height: 1.3;
        }

        .store-name {
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            color: #000000;
            margin-bottom: 3px;
        }

        .store-meta {
            font-size: 11px;
            color: var(--text-muted);
        }

        .doc-title {
            text-align: center;
            font-weight: 800;
            font-size: 12px;
            padding: 4px 0;
            color: #000000;
            letter-spacing: 0.03em;
        }

        .flex-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;
        }

        .meta-section {
            font-size: 11.5px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .footer-note {
            text-align: center;
            font-size: 11px;
            color: #334155;
            white-space: pre-line;
            line-height: 1.4;
            padding-top: 4px;
        }

        @media print {
            body {
                background: #ffffff !important;
                padding: 0 !important;
                color: #000000 !important;
            }

            .action-bar,
            .badge-24h {
                display: none !important;
            }

            .receipt-card {
                box-shadow: none !important;
                max-width: 100% !important;
                width: 100% !important;
                padding: 4px 0 !important;
                border-radius: 0 !important;
            }

            .receipt-card::after {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <div class="action-bar">
        <button class="btn btn-print" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Cetak / Simpan PDF
        </button>

        @if(!empty($tenant?->phone))
            @php
                $cleanPhone = preg_replace('/[^0-9]/', '', $tenant->phone);
                if (str_starts_with($cleanPhone, '0')) {
                    $cleanPhone = '62' . substr($cleanPhone, 1);
                }
            @endphp
            <a class="btn btn-wa" href="https://wa.me/{{ $cleanPhone }}?text=Halo%20{{ urlencode($tenant->store_name ?? 'Toko') }},%20konfirmasi%20pembayaran%20kasbon%20{{ urlencode($refNo) }}" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                WhatsApp Toko
            </a>
        @endif
    </div>

    <div style="text-align: center;">
        <span class="badge-24h">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            E-Struk Digital Aktif (24 Jam)
        </span>
    </div>

    <div class="receipt-card">
        <div class="store-header">
            <div class="store-name">{{ strtoupper($tenant?->store_name ?? 'WAROENG POS') }}</div>
            <div class="store-meta">{{ $tenant?->address ?? 'Minimarket & Ritel Indonesia' }}</div>
            @if(!empty($tenant?->phone))
                <div class="store-meta">Telp: {{ $tenant->phone }}</div>
            @endif
        </div>

        <div class="dashed-line"></div>
        <div class="doc-title">BUKTI PEMBAYARAN KASBON</div>
        <div class="dashed-line"></div>

        @php
            $rawMethod = strtolower((string) ($payment->payment_method ?? 'TUNAI'));
            $methodDisplay = in_array($rawMethod, ['transfer', 'transfer bank', 'transfer_bank', 'tf bank', 'bank transfer']) ? 'TF BANK' : strtoupper($payment->payment_method ?? 'TUNAI');
        @endphp
        <div class="meta-section">
            <div class="flex-row">
                <span>No: {{ $refNo }}</span>
                <span style="font-weight: 800; text-transform: uppercase;">{{ $methodDisplay }}</span>
            </div>
            <div>Tanggal: {{ !empty($payment->payment_date) ? (is_string($payment->payment_date) ? date('d/m/Y H.i', strtotime($payment->payment_date)) : $payment->payment_date->format('d/m/Y H.i')) : (!empty($payment->created_at) ? (is_string($payment->created_at) ? date('d/m/Y H.i', strtotime($payment->created_at)) : $payment->created_at->format('d/m/Y H.i')) : now()->format('d/m/Y H.i')) }}</div>
            <div>Kasir: {{ $payment->cashier?->name ?? 'Kasir' }}</div>
            @if($customer)
                @php
                    $isTrader = in_array(strtolower((string) $customer->customer_type), ['trader', 'grosir', 'trader / grosir']);
                    $code = $customer->quick_code ?? $customer->code ?? null;
                @endphp
                <div style="font-weight: 700; padding-top: 2px;">
                    @if($isTrader)
                        [ TRADER / GROSIR ] {{ $customer->name }}
                    @else
                        Pelanggan: {{ $customer->name }}
                    @endif
                    @if(!empty($code))
                        [{{ $code }}]
                    @endif
                </div>
            @endif
        </div>

        <div class="dashed-line"></div>

        <div class="meta-section" style="gap: 4px;">
            @if($previousDebt > 0)
                <div class="flex-row">
                    <span>Kasbon Sebelumnya:</span>
                    <span>Rp {{ number_format($previousDebt, 0, ',', '.') }}</span>
                </div>
            @endif

            <div class="flex-row" style="font-weight: 800; color: #059669; padding-top: 2px;">
                <span>JUMLAH DIBAYAR:</span>
                <span>-Rp {{ number_format($amountPaid, 0, ',', '.') }}</span>
            </div>

            <div class="solid-line"></div>

            <div class="flex-row" style="font-size: 14px; font-weight: 800;">
                <span>SISA KASBON:</span>
                <span>Rp {{ number_format($remainingDebt, 0, ',', '.') }}</span>
            </div>

            <div class="flex-row" style="font-size: 11px; padding-top: 2px;">
                <span>Status Tagihan:</span>
                <span style="font-weight: 800; text-transform: uppercase;">{{ $remainingDebt <= 0 ? 'LUNAS' : 'BELUM LUNAS' }}</span>
            </div>

            @if(!empty($payment->notes))
                <div class="dashed-line"></div>
                <div style="font-size: 10.5px; font-style: italic; color: #334155;">
                    Catatan: "{{ $payment->notes }}"
                </div>
            @endif
        </div>

        <div class="dashed-line"></div>

        <div class="footer-note">
            <p>Terima kasih atas pembayaran Anda.<br>Simpan struk ini sebagai bukti pembayaran sah.</p>
        </div>
    </div>

</body>
</html>
