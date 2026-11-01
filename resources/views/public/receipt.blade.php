<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Struk Digital #{{ $transaction->invoice_no }} - {{ $tenant?->store_name ?? 'Waroeng POS' }}</title>
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

        /* Top Action Bar */
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

        /* Authentic Thermal Receipt Paper Slip */
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

        /* Perforated bottom edge styling */
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
            line-height: 1.2;
            margin-bottom: 3px;
        }

        .store-meta {
            font-size: 11px;
            color: var(--text-muted);
        }

        .store-header-note {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 4px;
            font-style: italic;
            white-space: pre-line;
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

        .item-row {
            margin-bottom: 6px;
        }

        .item-row:last-child {
            margin-bottom: 0;
        }

        .item-name {
            font-weight: 700;
            color: #000000;
            word-break: break-word;
        }

        .item-detail {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding-left: 6px;
            color: #1e293b;
        }

        .item-discount {
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            padding-left: 12px;
            color: #dc2626;
            font-style: italic;
        }

        .summary-section {
            display: flex;
            flex-direction: column;
            gap: 3px;
            font-size: 12px;
        }

        .summary-total {
            font-size: 15px;
            font-weight: 800;
            color: #000000;
            padding: 3px 0;
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

    <!-- Action Bar (Hanya tampil di layar) -->
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
            <a class="btn btn-wa" href="https://wa.me/{{ $cleanPhone }}?text=Halo%20{{ urlencode($tenant->store_name ?? 'Toko') }},%20saya%20ingin%20bertanya%20mengenai%20transaksi%20{{ urlencode($transaction->invoice_no) }}" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                WhatsApp Toko
            </a>
        @endif
    </div>

    <!-- 24H Validity Notice -->
    <div style="text-align: center;">
        <span class="badge-24h">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            E-Struk Digital Aktif (24 Jam)
        </span>
    </div>

    <!-- Authentic Physical Receipt Media (Sama Persis dengan Media Cetak Kasir) -->
    <div class="receipt-card">

        <!-- 1. Header Toko -->
        <div class="store-header">
            <div class="store-name">{{ strtoupper($tenant?->store_name ?? 'WAROENG POS') }}</div>
            <div class="store-meta">{{ $tenant?->address ?? 'Minimarket & Ritel Indonesia' }}</div>
            @if(!empty($tenant?->phone))
                <div class="store-meta">Telp: {{ $tenant->phone }}</div>
            @endif
            @if(!empty($tenant?->settings_json['receipt_header']))
                <div class="store-header-note">{!! nl2br(e($tenant->settings_json['receipt_header'])) !!}</div>
            @endif
        </div>

        <div class="dashed-line"></div>

        <!-- 2. Metadata Transaksi -->
        <div class="meta-section">
            <div class="flex-row">
                <span>No: {{ $transaction->invoice_no }}</span>
                <span style="font-weight: 800; text-transform: uppercase;">
                    @php
                        $methodRaw = strtolower((string) $transaction->payment_method);
                        $methodMap = ['qris' => 'QRIS', 'cash' => 'TUNAI', 'transfer' => 'TF BANK', 'transfer bank' => 'TF BANK', 'tf bank' => 'TF BANK', 'card' => 'KARTU', 'kasbon' => 'KASBON'];
                        $displayMethod = $methodMap[$methodRaw] ?? strtoupper($transaction->payment_method ?? 'TUNAI');
                    @endphp
                    {{ $displayMethod }}
                </span>
            </div>
            <div>Tanggal: {{ !empty($transaction->created_at) ? (is_string($transaction->created_at) ? date('d/m/Y H.i', strtotime($transaction->created_at)) : $transaction->created_at->format('d/m/Y H.i')) : now()->format('d/m/Y H.i') }}</div>
            <div>Kasir: {{ $transaction->cashier?->name ?? 'Kasir' }}</div>
            @if($transaction->customer)
                @php
                    $isTrader = in_array(strtolower((string) $transaction->customer->customer_type), ['trader', 'grosir', 'trader / grosir']);
                    $code = $transaction->customer->quick_code ?? $transaction->customer->code ?? null;
                @endphp
                <div style="font-weight: 700; padding-top: 2px;">
                    @if($isTrader)
                        [ TRADER / GROSIR ] {{ $transaction->customer->name }}
                    @else
                        Pelanggan: {{ $transaction->customer->name }}
                    @endif
                    @if(!empty($code))
                        [{{ $code }}]
                    @endif
                </div>
            @endif
        </div>

        <div class="dashed-line"></div>

        <!-- 3. Rincian Item Belanja -->
        <div class="items-section">
            @foreach($transaction->items as $item)
                @php
                    $qty = (float) $item->quantity == (int) $item->quantity ? (int) $item->quantity : number_format((float) $item->quantity, 2, ',', '.');
                    $unitStr = !empty($item->unit_name) ? ' ' . $item->unit_name : '';
                    $pName = $item->product_name ?? $item->product?->name ?? 'Produk';
                @endphp
                <div class="item-row">
                    <div class="item-name">{{ $pName }}</div>
                    <div class="item-detail">
                        <span>{{ $qty }}{{ $unitStr }} &times; Rp {{ number_format($item->unit_price, 0, ',', '.') }}</span>
                        <span style="font-weight: 700;">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</span>
                    </div>
                    @if((float) $item->discount_amount > 0)
                        <div class="item-discount">
                            <span>(Diskon)</span>
                            <span>-Rp {{ number_format($item->discount_amount, 0, ',', '.') }}</span>
                        </div>
                    @endif
                </div>
            @endforeach
        </div>

        <div class="dashed-line"></div>

        <!-- 4. Subtotal, Pajak, Total, dan Rincian Pembayaran -->
        <div class="summary-section">
            <div class="flex-row">
                <span>Subtotal:</span>
                <span>Rp {{ number_format($transaction->subtotal, 0, ',', '.') }}</span>
            </div>

            @if((float) $transaction->discount_amount > 0)
                <div class="flex-row" style="color: #dc2626;">
                    <span>Diskon:</span>
                    <span>-Rp {{ number_format($transaction->discount_amount, 0, ',', '.') }}</span>
                </div>
            @endif

            @if((float) $transaction->tax_amount > 0)
                @php
                    $isTaxInclusive = abs(((float) $transaction->total_amount) - (((float) $transaction->subtotal) - ((float) $transaction->discount_amount))) < 0.05;
                    $taxLabel = $isTaxInclusive ? 'PPN (Inklusif):' : 'PPN (Eksklusif):';
                    $taxSign = $isTaxInclusive ? '' : '+';
                @endphp
                <div class="flex-row">
                    <span>{{ $taxLabel }}</span>
                    <span>{{ $taxSign }}Rp {{ number_format($transaction->tax_amount, 0, ',', '.') }}{{ $isTaxInclusive ? ' (Tercakup)' : '' }}</span>
                </div>
            @endif

            <div class="solid-line"></div>

            <div class="flex-row summary-total">
                <span>{{ $methodRaw === 'kasbon' ? 'TOTAL BELANJA:' : 'TOTAL:' }}</span>
                <span>Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</span>
            </div>

            @if($methodRaw === 'kasbon')
                @php
                    $thisKasbon = (float) $transaction->total_amount;
                    $currentTotalDebt = (float) ($transaction->customer?->current_debt ?? $thisKasbon);
                    $previousDebt = max(0, $currentTotalDebt - $thisKasbon);
                @endphp
                <div class="dashed-line"></div>
                <div class="flex-row">
                    <span>Masuk Kasbon Baru:</span>
                    <span style="font-weight: 700;">+Rp {{ number_format($thisKasbon, 0, ',', '.') }}</span>
                </div>
                <div class="flex-row">
                    <span>Kasbon Sebelumnya:</span>
                    <span>Rp {{ number_format($previousDebt, 0, ',', '.') }}</span>
                </div>
                <div class="flex-row" style="font-weight: 800; padding-top: 2px;">
                    <span>TOTAL KASBON SAAT INI:</span>
                    <span>Rp {{ number_format($currentTotalDebt, 0, ',', '.') }}</span>
                </div>
            @else
                @php
                    $isQris = $methodRaw === 'qris';
                    $changeAmt = (float) $transaction->change_amount;
                    $labelBayar = match($methodRaw) {
                        'cash' => 'Tunai',
                        'qris' => 'QRIS',
                        'transfer' => 'Transfer',
                        'card' => 'Kartu',
                        default => strtoupper($transaction->payment_method ?? 'Tunai'),
                    };
                @endphp
                <div class="flex-row">
                    <span>Bayar ({{ $labelBayar }}):</span>
                    <span>Rp {{ number_format($transaction->paid_amount, 0, ',', '.') }}</span>
                </div>

                @if(!$isQris || $changeAmt > 0)
                    <div class="flex-row" style="font-weight: 800;">
                        <span>KEMBALIAN:</span>
                        <span>Rp {{ number_format($changeAmt, 0, ',', '.') }}</span>
                    </div>
                @endif

                @if(!empty($transaction->customer?->current_debt) && (float) $transaction->customer->current_debt > 0)
                    <div class="dashed-line"></div>
                    <div class="flex-row" style="font-weight: 800;">
                        <span>TOTAL HUTANG KASBON:</span>
                        <span>Rp {{ number_format($transaction->customer->current_debt, 0, ',', '.') }}</span>
                    </div>
                @endif
            @endif
        </div>

        <div class="dashed-line"></div>

        <!-- 5. Footer Catatan Toko -->
        <div class="footer-note">
            {!! nl2br(e($tenant?->settings_json['receipt_footer'] ?? "Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli tidak dapat ditukar.")) !!}
        </div>
    </div>

</body>
</html>
