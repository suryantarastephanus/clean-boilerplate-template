/**
 * Format and utilities for sharing POS digital receipts via WhatsApp (wa.me)
 * Content matches the printed physical receipt (media cetak) 100%.
 */

export function getCleanWhatsAppPhone(
    phone: string | null | undefined,
): string | null {
    if (!phone) return null;
    let clean = phone.replace(/[^0-9]/g, '');
    if (!clean) return null;

    if (clean.startsWith('0')) {
        clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
        clean = '62' + clean;
    }
    return clean;
}

export function formatPaymentMethod(method: string | null | undefined): string {
    if (!method) return 'TUNAI';
    const m = method.toLowerCase().trim();
    if (
        m === 'transfer' ||
        m === 'transfer bank' ||
        m === 'transfer_bank' ||
        m === 'tf bank' ||
        m === 'bank transfer' ||
        m === 'tf_bank'
    ) {
        return 'TF BANK';
    }
    if (m === 'cash' || m === 'tunai') return 'TUNAI';
    if (m === 'qris') return 'QRIS';
    if (m === 'card' || m === 'kartu') return 'KARTU';
    if (m === 'kasbon') return 'KASBON';
    return method.toUpperCase();
}

export function formatRupiahText(
    val: number | string | null | undefined,
): string {
    const num = typeof val === 'string' ? parseFloat(val) : val || 0;
    return (
        'Rp ' +
        new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num)
    );
}

export function formatReceiptDate(
    dateInput: string | Date | number | null | undefined,
): string {
    const d = dateInput ? new Date(dateInput) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}.${minutes}`;
}

export interface BuildWhatsAppReceiptParams {
    transaction: any;
    tenant: {
        name?: string;
        store_name?: string;
        address?: string;
        phone?: string;
        receipt_header?: string | null;
        receipt_footer?: string | null;
        settings?: any;
    };
    publicReceiptUrl?: string;
}

export function buildWhatsAppReceiptMessage({
    transaction,
    tenant,
    publicReceiptUrl,
}: BuildWhatsAppReceiptParams): string {
    if (!transaction) return '';

    const storeName = tenant.store_name || tenant.name || 'WAROENG POS';
    const address = tenant.address || '';
    const phone = tenant.phone || '';
    const receiptHeader =
        tenant.settings?.receipt_header || tenant.receipt_header || '';
    const invoiceNo = transaction.invoice_no || '-';

    const formattedDate = formatReceiptDate(transaction.created_at);
    const cashierName = transaction.cashier?.name || 'Kasir';
    const paymentMethodUpper = formatPaymentMethod(transaction.payment_method);

    const divider = '----------------------------------------';
    const lines: string[] = [];

    // 1. Header Toko (sama dengan media cetak)
    lines.push(`*${storeName.toUpperCase()}*`);
    if (address) lines.push(address);
    if (phone) lines.push(`Telp: ${phone}`);
    if (receiptHeader) {
        lines.push(receiptHeader.trim());
    }

    lines.push(divider);

    // 2. Metadata Transaksi (No & Metode satu baris, sisanya stack ke bawah)
    lines.push(`No: *${invoiceNo}*  |  *${paymentMethodUpper}*`);
    lines.push(`Tanggal: ${formattedDate}`);
    lines.push(`Kasir: ${cashierName}`);

    if (transaction.customer?.name) {
        const isTrader =
            (transaction.customer.customer_type || '').toLowerCase() ===
            'trader';
        const quickCodeTag = transaction.customer.quick_code
            ? ` [${transaction.customer.quick_code}]`
            : '';
        if (isTrader) {
            lines.push(
                `*[ TRADER / GROSIR ] ${transaction.customer.name}${quickCodeTag}*`,
            );
        } else {
            lines.push(
                `Pelanggan: ${transaction.customer.name}${quickCodeTag}`,
            );
        }
    }

    lines.push(divider);

    // 3. Rincian Item Barang (sama dengan media cetak)
    const items = transaction.items || [];
    items.forEach((item: any) => {
        const qty = parseFloat(item.quantity) || 1;
        const unit = item.unit_name ? ` ${item.unit_name}` : '';
        const price = formatRupiahText(item.unit_price);
        const subtotal = formatRupiahText(item.subtotal);
        lines.push(`*${item.product_name}*`);
        lines.push(`  ${qty}${unit} x ${price} = *${subtotal}*`);

        const itemDisc = parseFloat(item.discount_amount) || 0;
        if (itemDisc > 0) {
            lines.push(`  _(Diskon: -${formatRupiahText(itemDisc)})_`);
        }
    });

    lines.push(divider);

    // 4. Subtotal & Diskon Total
    lines.push(`Subtotal: ${formatRupiahText(transaction.subtotal)}`);

    const discountAmount = parseFloat(transaction.discount_amount) || 0;
    if (discountAmount > 0) {
        lines.push(`Diskon: -${formatRupiahText(discountAmount)}`);
    }

    // 5. PPN / Pajak (Inklusif / Eksklusif)
    const taxAmount = parseFloat(transaction.tax_amount) || 0;
    if (taxAmount > 0) {
        const isTaxInclusive =
            Math.abs(
                parseFloat(transaction.total_amount) -
                    (parseFloat(transaction.subtotal) - discountAmount),
            ) < 0.05;
        if (isTaxInclusive) {
            lines.push(
                `PPN (Inklusif): ${formatRupiahText(taxAmount)} (Tercakup)`,
            );
        } else {
            lines.push(`PPN (Eksklusif): +${formatRupiahText(taxAmount)}`);
        }
    }

    lines.push(divider);

    // 6. TOTAL & Status Pembayaran (Kasbon vs Non-Kasbon)
    const rawMethod = (transaction.payment_method || 'TUNAI').toLowerCase();
    const isKasbon = rawMethod === 'kasbon';
    const isQris = rawMethod === 'qris';
    const totalLabel = isKasbon ? 'TOTAL BELANJA' : 'TOTAL';
    lines.push(
        `*${totalLabel}: ${formatRupiahText(transaction.total_amount)}*`,
    );

    if (isKasbon) {
        const thisKasbon = parseFloat(transaction.total_amount) || 0;
        const currentTotalDebt =
            parseFloat(transaction.customer?.current_debt) || thisKasbon;
        const previousDebt = Math.max(0, currentTotalDebt - thisKasbon);

        lines.push(divider);
        lines.push(`Masuk Kasbon Baru: +${formatRupiahText(thisKasbon)}`);
        lines.push(`Kasbon Sebelumnya: ${formatRupiahText(previousDebt)}`);
        lines.push(
            `*TOTAL KASBON SAAT INI: ${formatRupiahText(currentTotalDebt)}*`,
        );
    } else {
        lines.push(
            `Bayar (${paymentMethodUpper}): ${formatRupiahText(transaction.paid_amount)}`,
        );

        const changeAmount = parseFloat(transaction.change_amount) || 0;
        if (!isQris || changeAmount > 0) {
            lines.push(`*KEMBALIAN: ${formatRupiahText(changeAmount)}*`);
        }

        if (
            transaction.customer &&
            parseFloat(transaction.customer.current_debt) > 0
        ) {
            lines.push(divider);
            lines.push(
                `*TOTAL HUTANG KASBON: ${formatRupiahText(transaction.customer.current_debt)}*`,
            );
        }
    }

    lines.push(divider);

    // 7. Footer Toko
    const footerMsg =
        tenant.settings?.receipt_footer ||
        tenant.receipt_footer ||
        'Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli tidak dapat ditukar.';
    lines.push(footerMsg.trim());

    // 8. Tautan E-Struk 24 Jam
    const receiptUrl = publicReceiptUrl || transaction.public_receipt_url;
    if (receiptUrl) {
        lines.push(divider);
        lines.push(`🌐 *Lihat & Unduh PDF Struk Resmi:*`);
        lines.push(`${receiptUrl}`);
        lines.push(`_(Tautan e-struk digital berlaku 24 jam)_`);
    }

    return lines.join('\n');
}

export function getWhatsAppShareUrl(
    phone: string | null | undefined,
    message: string,
): string {
    const cleanPhone = getCleanWhatsAppPhone(phone);
    const encoded = encodeURIComponent(message);
    if (cleanPhone) {
        return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
}

export interface BuildWhatsAppDebtPaymentParams {
    receipt: any;
    tenant: {
        name?: string;
        store_name?: string;
        address?: string;
        phone?: string;
        receipt_header?: string | null;
        receipt_footer?: string | null;
        settings?: any;
    };
    publicReceiptUrl?: string;
}

export function buildWhatsAppDebtPaymentMessage({
    receipt,
    tenant,
    publicReceiptUrl,
}: BuildWhatsAppDebtPaymentParams): string {
    if (!receipt) return '';

    const storeName = tenant.store_name || tenant.name || 'WAROENG POS';
    const address = tenant.address || '';
    const phone = tenant.phone || '';
    const receiptHeader =
        tenant.settings?.receipt_header || tenant.receipt_header || '';
    const refNo = receipt.ref_no || `PAY-${receipt.payment_id || Date.now()}`;
    const formattedDate = formatReceiptDate(
        receipt.payment_date || receipt.created_at,
    );
    const cashierName = receipt.cashier_name || 'Kasir';
    const method = formatPaymentMethod(receipt.payment_method);

    const divider = '----------------------------------------';
    const lines: string[] = [];

    // Header Toko
    lines.push(`*${storeName.toUpperCase()}*`);
    if (address) lines.push(address);
    if (phone) lines.push(`Telp: ${phone}`);
    if (receiptHeader) lines.push(receiptHeader.trim());

    lines.push(divider);
    lines.push(`🧾 *BUKTI PEMBAYARAN KASBON*`);
    lines.push(divider);

    // No & Metode tetap satu baris, sisanya stack ke bawah
    lines.push(`No: *${refNo}*  |  *${method}*`);
    lines.push(`Tanggal: ${formattedDate}`);
    lines.push(`Kasir: ${cashierName}`);

    const isTrader = (receipt.customer_type || '').toLowerCase() === 'trader';
    const quickCodeTag = receipt.quick_code ? ` [${receipt.quick_code}]` : '';
    if (isTrader) {
        lines.push(
            `*[ TRADER / GROSIR ] ${receipt.customer_name}${quickCodeTag}*`,
        );
    } else {
        lines.push(`Pelanggan: ${receipt.customer_name}${quickCodeTag}`);
    }

    lines.push(divider);

    const prevDebt =
        receipt.previous_debt !== undefined
            ? receipt.previous_debt
            : (receipt.remaining_debt || 0) + (receipt.amount_paid || 0);
    if (prevDebt > 0) {
        lines.push(`Kasbon Sebelumnya : ${formatRupiahText(prevDebt)}`);
    }
    lines.push(
        `*JUMLAH DIBAYAR   : -${formatRupiahText(receipt.amount_paid)}*`,
    );
    lines.push(divider);
    lines.push(
        `*SISA KASBON      : ${formatRupiahText(receipt.remaining_debt)}*`,
    );
    lines.push(
        `Status Tagihan    : *${receipt.remaining_debt <= 0 ? 'LUNAS' : 'BELUM LUNAS'}*`,
    );

    if (receipt.notes) {
        lines.push(`Catatan           : "${receipt.notes}"`);
    }

    lines.push(divider);
    lines.push(
        `Terima kasih atas pembayaran Anda. Simpan pesan ini sebagai bukti pembayaran sah.`,
    );

    const receiptUrl = publicReceiptUrl || receipt.public_receipt_url;
    if (receiptUrl) {
        lines.push(divider);
        lines.push(`🌐 *Lihat & Unduh Bukti Bayar Resmi (Aktif 24 Jam):*`);
        lines.push(`${receiptUrl}`);
    }

    return lines.join('\n');
}

export interface BuildWhatsAppCashFlowParams {
    receipt: any;
    tenant: {
        name?: string;
        store_name?: string;
        address?: string;
        phone?: string;
        receipt_header?: string | null;
        settings?: any;
    };
    publicReceiptUrl?: string;
}

export function buildWhatsAppCashFlowMessage({
    receipt,
    tenant,
    publicReceiptUrl,
}: BuildWhatsAppCashFlowParams): string {
    if (!receipt) return '';

    const storeName = tenant.store_name || tenant.name || 'WAROENG POS';
    const address = tenant.address || '';
    const phone = tenant.phone || '';
    const isIncome = receipt.type === 'IN';
    const title = isIncome ? 'BUKTI KAS MASUK (BKM)' : 'BUKTI KAS KELUAR (BKK)';
    const refNo =
        receipt.ref_no ||
        `${isIncome ? 'BKM' : 'BKK'}-${receipt.id || receipt.cash_flow_id || Date.now()}`;
    const formattedDate = formatReceiptDate(receipt.date || receipt.created_at);
    const cashierName = receipt.user_name || 'Petugas';
    const method = formatPaymentMethod(receipt.payment_method);

    const divider = '----------------------------------------';
    const lines: string[] = [];

    lines.push(`*${storeName.toUpperCase()}*`);
    if (address) lines.push(address);
    if (phone) lines.push(`Telp: ${phone}`);

    lines.push(divider);
    lines.push(`🧾 *${title}*`);
    lines.push(divider);

    // No & Metode tetap satu baris, sisanya stack ke bawah
    lines.push(`No: *${refNo}*  |  *${method}*`);
    lines.push(`Tanggal: ${formattedDate}`);
    lines.push(`Petugas: ${cashierName}`);
    lines.push(`Kategori: *${receipt.category}*`);
    lines.push(divider);

    lines.push(
        `*TOTAL ${isIncome ? 'MASUK' : 'KELUAR'}: ${isIncome ? '+' : '-'}${formatRupiahText(receipt.amount)}*`,
    );

    if (receipt.description) {
        lines.push(`Keterangan: ${receipt.description}`);
    }

    lines.push(divider);
    lines.push(`Dokumen sah pencatatan kas operasional toko.`);

    const receiptUrl = publicReceiptUrl || receipt.public_receipt_url;
    if (receiptUrl) {
        lines.push(divider);
        lines.push(`🌐 *Lihat & Unduh Bukti Transaksi Resmi (Aktif 24 Jam):*`);
        lines.push(`${receiptUrl}`);
    }

    return lines.join('\n');
}

export interface BuildWhatsAppEmployeeKasbonParams {
    receipt: any;
    tenant: {
        name?: string;
        store_name?: string;
        address?: string;
        phone?: string;
        settings?: any;
    };
    publicReceiptUrl?: string;
}

export function buildWhatsAppEmployeeKasbonMessage({
    receipt,
    tenant,
    publicReceiptUrl,
}: BuildWhatsAppEmployeeKasbonParams): string {
    if (!receipt) return '';

    const storeName = tenant.store_name || tenant.name || 'WAROENG POS';
    const address = tenant.address || '';
    const phone = tenant.phone || '';
    const isRepayment = receipt.type === 'REPAYMENT';
    const title = isRepayment
        ? 'BUKTI PELUNASAN KASBON KARYAWAN'
        : 'BUKTI KASBON KARYAWAN';
    const formattedDate = formatReceiptDate(receipt.date || receipt.created_at);
    const cashierName = receipt.user_name || 'Petugas';
    const method = formatPaymentMethod(receipt.payment_method || 'TUNAI');

    const divider = '----------------------------------------';
    const lines: string[] = [];

    lines.push(`*${storeName.toUpperCase()}*`);
    if (address) lines.push(address);
    if (phone) lines.push(`Telp: ${phone}`);

    lines.push(divider);
    lines.push(`🧾 *${title}*`);
    lines.push(divider);

    // Kode & Metode tetap satu baris, sisanya stack ke bawah
    lines.push(`Kode: *${receipt.kasbon_code}*  |  *${method}*`);
    lines.push(`Tanggal: ${formattedDate}`);
    lines.push(`Petugas: ${cashierName}`);
    lines.push(
        `Karyawan: *${receipt.employee_name}*${receipt.position ? ` (${receipt.position})` : ''}`,
    );
    lines.push(divider);

    if (isRepayment) {
        lines.push(
            `Total Kasbon Awal : ${formatRupiahText(receipt.total_kasbon || receipt.amount)}`,
        );
        lines.push(
            `*Jumlah Dibayar (IN): -${formatRupiahText(receipt.amount)}*`,
        );
        lines.push(divider);
        lines.push(
            `*Sisa Kasbon      : ${receipt.remaining_amount <= 0 ? 'LUNAS' : formatRupiahText(receipt.remaining_amount)}*`,
        );
    } else {
        lines.push(`*Nominal Pinjaman : ${formatRupiahText(receipt.amount)}*`);
        if (receipt.remaining_amount !== undefined) {
            lines.push(
                `Sisa Saldo Kasbon : ${formatRupiahText(receipt.remaining_amount)}`,
            );
        }
    }

    if (receipt.notes) {
        lines.push(`Catatan: "${receipt.notes}"`);
    }

    lines.push(divider);
    lines.push(`Dokumen sah pinjaman/kasbon karyawan toko.`);

    const receiptUrl = publicReceiptUrl || receipt.public_receipt_url;
    if (receiptUrl) {
        lines.push(divider);
        lines.push(`🌐 *Lihat & Unduh Bukti Kasbon Resmi (Aktif 24 Jam):*`);
        lines.push(`${receiptUrl}`);
    }

    return lines.join('\n');
}
