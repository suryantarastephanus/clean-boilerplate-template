/**
 * Client-Side ESC/POS Binary Command Builder
 * Enables converting formatted receipts to raw ESC/POS binary directly in the browser.
 */

export class EscPosBuilder {
    private buffer: number[] = [];
    private cols: number;

    public static readonly ESC = 0x1b;
    public static readonly GS = 0x1d;
    public static readonly LF = 0x0a;

    constructor(cols: 32 | 48 = 32) {
        this.cols = cols;
        this.init();
    }

    public init(): this {
        // ESC @ (Initialize printer)
        this.buffer.push(0x1b, 0x40);
        // GS L 0 0 (Set left margin to 0)
        this.buffer.push(0x1d, 0x4c, 0x00, 0x00);
        // ESC M 0 (Standard Font A)
        this.buffer.push(0x1b, 0x4d, 0x00);
        return this;
    }

    public font(font: 'A' | 'B'): this {
        this.buffer.push(0x1b, 0x4d, font === 'B' ? 0x01 : 0x00);
        return this;
    }

    public align(alignment: 'left' | 'center' | 'right'): this {
        const val =
            alignment === 'center' ? 0x01 : alignment === 'right' ? 0x02 : 0x00;
        this.buffer.push(0x1b, 0x61, val);
        return this;
    }

    public bold(enabled: boolean): this {
        this.buffer.push(0x1b, 0x45, enabled ? 0x01 : 0x00);
        // Double-strike for deeper contrast
        this.buffer.push(0x1b, 0x47, enabled ? 0x01 : 0x00);
        return this;
    }

    public doubleSize(enabled: boolean): this {
        this.buffer.push(0x1d, 0x21, enabled ? 0x11 : 0x00);
        return this;
    }

    public doubleHeight(enabled: boolean): this {
        this.buffer.push(0x1d, 0x21, enabled ? 0x01 : 0x00);
        return this;
    }

    public text(str: string): this {
        const sanitized = this.sanitizeAscii(str);
        for (let i = 0; i < sanitized.length; i++) {
            this.buffer.push(sanitized.charCodeAt(i));
        }
        return this;
    }

    public line(str: string = ''): this {
        if (str) {
            this.text(str);
        }
        this.buffer.push(0x0a);
        return this;
    }

    public wrapLines(text: string, maxCols?: number): string[] {
        const cols = maxCols || this.cols;
        const sanitized = this.sanitizeAscii(text);
        const lines: string[] = [];

        const rawLines = sanitized
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n');

        for (const raw of rawLines) {
            const trimmed = raw.trim();
            if (!trimmed) continue;

            const words = trimmed.split(/\s+/);
            let currentLine = '';

            for (const word of words) {
                if (!currentLine) {
                    currentLine = word;
                } else if ((currentLine + ' ' + word).length <= cols) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        }
        return lines;
    }

    public wrappedLine(text: string, maxCols?: number): this {
        const lines = this.wrapLines(text, maxCols);
        for (const l of lines) {
            this.line(l);
        }
        return this;
    }

    public feed(lines: number = 1): this {
        for (let i = 0; i < lines; i++) {
            this.buffer.push(0x0a);
        }
        return this;
    }

    public divider(char: string = '-'): this {
        const c = char.charAt(0) || '-';
        this.line(c.repeat(this.cols));
        return this;
    }

    public twoColumn(left: string, right: string): this {
        const sanitizedLeft = this.sanitizeAscii(left);
        const sanitizedRight = this.sanitizeAscii(right);
        const rightLen = sanitizedRight.length;
        const maxLeftLen = Math.max(1, this.cols - rightLen - 1);

        let truncatedLeft = sanitizedLeft;
        if (truncatedLeft.length > maxLeftLen) {
            truncatedLeft = truncatedLeft.substring(0, maxLeftLen);
        }

        const spaces = Math.max(0, this.cols - truncatedLeft.length - rightLen);
        this.line(truncatedLeft + ' '.repeat(spaces) + sanitizedRight);
        return this;
    }

    public cut(partial: boolean = true): this {
        this.feed(3);
        // GS V 65 3 (Partial Cut with feed)
        this.buffer.push(0x1d, 0x56, partial ? 0x41 : 0x42, 0x03);
        return this;
    }

    public kickDrawer(): this {
        // Pulse Pin 2 & Pin 5
        this.buffer.push(0x1b, 0x70, 0x00, 0x19, 0xfa);
        this.buffer.push(0x1b, 0x70, 0x01, 0x19, 0xfa);
        return this;
    }

    public toUint8Array(): Uint8Array {
        return new Uint8Array(this.buffer);
    }

    public toBase64(): string {
        const bytes = this.toUint8Array();
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    private sanitizeAscii(text: string): string {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x20-\x7E\n\r\t]/g, '');
    }
}
