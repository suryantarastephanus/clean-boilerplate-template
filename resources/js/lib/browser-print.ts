/**
 * Utility for printing HTML content reliably across all modern browsers (Chrome, Edge, Firefox, Safari).
 * Fixes:
 * 1. Chromium 0x0 iframe bug: Chromium silently drops .print() calls on zero-sized or hidden iframes.
 * 2. Focus-trap conflicts: Safely shifts focus and triggers printing.
 * 3. Fallback: Automatically falls back to dedicated popup print window if iframe printing is restricted.
 * 4. Spooler timeout: Keeps the iframe element in DOM during spooling to prevent dialog cancellation.
 */

import { toast } from 'sonner';
import { isMobileDevice } from '@/lib/bluetooth-print';

/**
 * Sanitize print HTML to prevent script execution or stored XSS payloads.
 */
function sanitizeReceiptHtml(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

export function executeBrowserPrint(
    htmlContent: string,
    title: string = 'Struk',
): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const safeHtml = sanitizeReceiptHtml(htmlContent);

    // On mobile devices (Android / iOS), hidden off-screen iframes are blocked by Chromium/WebKit.
    // Use the dedicated print preview window directly for mobile devices.
    if (isMobileDevice()) {
        openPrintFallbackWindow(safeHtml, title);
        return;
    }

    try {
        // Create an off-screen iframe with REAL dimensions (350px x 600px).
        // CRITICAL: Chromium will silently abort print() if width or height is 0!
        const iframe = document.createElement('iframe');
        iframe.id = 'receipt-print-frame-' + Date.now();
        iframe.style.position = 'fixed';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '350px';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.opacity = '0.01';
        iframe.style.pointerEvents = 'none';
        iframe.style.zIndex = '-9999';

        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            openPrintFallbackWindow(safeHtml, title);
            return;
        }

        doc.open();
        doc.write(safeHtml);
        doc.close();

        let printed = false;
        const triggerPrint = () => {
            if (printed) return;
            printed = true;

            try {
                const targetWin = iframe.contentWindow;
                if (!targetWin) {
                    openPrintFallbackWindow(safeHtml, title);
                    return;
                }

                targetWin.focus();
                targetWin.print();
            } catch (err) {
                console.warn(
                    'Iframe print failed, falling back to popup window:',
                    err,
                );
                openPrintFallbackWindow(safeHtml, title);
            } finally {
                // Keep the iframe alive for at least 2 minutes so native print dialog is not interrupted
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 120000);
            }
        };

        // Give browser 250ms to finish rendering fonts and styles inside iframe
        setTimeout(triggerPrint, 250);
    } catch (e) {
        console.warn('Error during iframe creation, using window fallback:', e);
        openPrintFallbackWindow(safeHtml, title);
    }
}

function openPrintFallbackWindow(htmlContent: string, title: string): void {
    try {
        const printWindow = window.open(
            '',
            '_blank',
            'width=420,height=650,menubar=no,toolbar=no,location=no,status=no',
        );
        if (!printWindow) {
            toast.error(
                'Dialog cetak browser diblokir. Mohon izinkan popup di browser Anda untuk mencetak.',
            );
            return;
        }

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 350);
    } catch (e) {
        console.error('Print window fallback failed:', e);
    }
}
