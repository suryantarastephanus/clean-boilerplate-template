import type { CSSProperties } from 'react';

export interface ReceiptLayoutSettings {
    printer_paper_width?: number | 58 | 80;
    receipt_margin_left?: number;
    receipt_margin_right?: number;
    receipt_margin_top?: number;
    receipt_margin_bottom?: number;
    receipt_font_weight?: 'normal' | 'medium' | 'bold' | 'extrabold' | string;
    receipt_font_size?: 'compact' | 'normal' | 'large' | string;
}

export interface ReceiptPrintStyles {
    paperWidth: 58 | 80;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
    fontWeightKey: 'normal' | 'medium' | 'bold' | 'extrabold';
    fontWeight: number;
    fontWeightBold: number;
    fontSizeKey: 'compact' | 'normal' | 'large';
    baseFontSize: string;
    paperSize: string;
    printableWidth: string;
    generatePrintCss: () => string;
    getPreviewStyle: () => CSSProperties;
}

export const FONT_WEIGHT_MAP: Record<
    string,
    { weight: number; boldWeight: number; label: string; description: string }
> = {
    normal: {
        weight: 400,
        boldWeight: 700,
        label: 'Normal (400)',
        description: 'Standar ringan, bersih',
    },
    medium: {
        weight: 600,
        boldWeight: 700,
        label: 'Sedang (600)',
        description: 'Rekomendasi kasir seimbang',
    },
    bold: {
        weight: 700,
        boldWeight: 800,
        label: 'Tebal (700)',
        description: 'Tulisan tegas, mudah dibaca',
    },
    extrabold: {
        weight: 800,
        boldWeight: 900,
        label: 'Ekstra Tebal (800)',
        description: 'Hitam pekat untuk printer pudar',
    },
};

export const FONT_SIZE_MAP: Record<
    58 | 80,
    Record<'compact' | 'normal' | 'large', string>
> = {
    58: {
        compact: '10px',
        normal: '11px',
        large: '12px',
    },
    80: {
        compact: '11px',
        normal: '12.5px',
        large: '14px',
    },
};

/**
 * Resolves comprehensive receipt styling configuration from tenant settings.
 */
export function getReceiptPrintStyles(
    settings?: any,
    paperWidthOverride?: 58 | 80,
): ReceiptPrintStyles {
    const rawWidth = paperWidthOverride || settings?.printer_paper_width || 58;
    const paperWidth: 58 | 80 = Number(rawWidth) === 80 ? 80 : 58;

    const marginLeft =
        typeof settings?.receipt_margin_left === 'number'
            ? Math.max(0, Math.min(20, settings.receipt_margin_left))
            : 0;

    const marginRight =
        typeof settings?.receipt_margin_right === 'number'
            ? Math.max(0, Math.min(20, settings.receipt_margin_right))
            : 1;

    const marginTop =
        typeof settings?.receipt_margin_top === 'number'
            ? Math.max(0, Math.min(20, settings.receipt_margin_top))
            : 1;

    const marginBottom =
        typeof settings?.receipt_margin_bottom === 'number'
            ? Math.max(0, Math.min(30, settings.receipt_margin_bottom))
            : 3;

    const rawFontWeight = String(
        settings?.receipt_font_weight || 'medium',
    ).toLowerCase();
    const fontWeightKey = (
        rawFontWeight in FONT_WEIGHT_MAP ? rawFontWeight : 'medium'
    ) as 'normal' | 'medium' | 'bold' | 'extrabold';
    const { weight: fontWeight, boldWeight: fontWeightBold } =
        FONT_WEIGHT_MAP[fontWeightKey];

    const rawFontSize = String(
        settings?.receipt_font_size || 'normal',
    ).toLowerCase();
    const fontSizeKey = (
        ['compact', 'normal', 'large'].includes(rawFontSize)
            ? rawFontSize
            : 'normal'
    ) as 'compact' | 'normal' | 'large';
    const baseFontSize = FONT_SIZE_MAP[paperWidth][fontSizeKey];

    // 58mm: roll physical printable width ~48mm
    // 80mm: roll physical printable width ~72mm
    const basePrintableMm = paperWidth === 58 ? 48 : 72;
    const effectivePrintableWidthMm = Math.max(
        34,
        basePrintableMm - marginLeft - marginRight,
    );
    const printableWidth = `${effectivePrintableWidthMm}mm`;
    const paperSize = paperWidth === 58 ? '58mm' : '80mm';

    const generatePrintCss = () => `
        @page {
            size: ${paperSize} auto;
            margin: 0mm !important;
        }
        *, html, body {
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            width: ${printableWidth} !important;
            max-width: ${printableWidth} !important;
            margin: 0 !important;
            margin-left: 0 !important;
            padding-left: ${marginLeft}mm !important;
            padding-right: ${marginRight}mm !important;
            padding-top: ${marginTop}mm !important;
            padding-bottom: ${marginBottom}mm !important;
            font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", sans-serif !important;
            font-size: ${baseFontSize} !important;
            font-weight: ${fontWeight} !important;
            line-height: 1.3 !important;
            color: #000000 !important;
            background: #ffffff !important;
            text-rendering: optimizeLegibility !important;
        }
        b, strong, .font-bold {
            font-weight: ${fontWeightBold} !important;
        }
    `;

    const getPreviewStyle = (): CSSProperties => ({
        fontFamily:
            'Arial, "Helvetica Neue", Helvetica, "Segoe UI", sans-serif',
        fontSize: baseFontSize,
        fontWeight: fontWeight,
        lineHeight: 1.3,
        paddingLeft: `${marginLeft * 3.78}px`, // 1mm ~ 3.78px for screen preview
        paddingRight: `${marginRight * 3.78}px`,
        paddingTop: `${marginTop * 3.78}px`,
        paddingBottom: `${marginBottom * 3.78}px`,
        color: '#000000',
        backgroundColor: '#ffffff',
    });

    return {
        paperWidth,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        fontWeightKey,
        fontWeight,
        fontWeightBold,
        fontSizeKey,
        baseFontSize,
        paperSize,
        printableWidth,
        generatePrintCss,
        getPreviewStyle,
    };
}
