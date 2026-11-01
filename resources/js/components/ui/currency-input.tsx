import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, AlertCircle } from 'lucide-react';

/**
 * Konversi angka integer ke teks Terbilang bahasa Indonesia.
 */
export function terbilang(n: number): string {
    if (isNaN(n) || n <= 0) return '';
    const angka = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    if (n < 12) return angka[n];
    if (n < 20) return terbilang(n - 10) + ' Belas';
    if (n < 100) return terbilang(Math.floor(n / 10)) + ' Puluh' + (n % 10 !== 0 ? ' ' + terbilang(n % 10) : '');
    if (n < 200) return 'Seratus' + (n - 100 !== 0 ? ' ' + terbilang(n - 100) : '');
    if (n < 1000) return terbilang(Math.floor(n / 100)) + ' Ratus' + (n % 100 !== 0 ? ' ' + terbilang(n % 100) : '');
    if (n < 2000) return 'Seribu' + (n - 1000 !== 0 ? ' ' + terbilang(n - 1000) : '');
    if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 !== 0 ? ' ' + terbilang(n % 1000) : '');
    if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' Juta' + (n % 1000000 !== 0 ? ' ' + terbilang(n % 1000000) : '');
    if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + ' Miliar' + (n % 1000000000 !== 0 ? ' ' + terbilang(n % 1000000000) : '');
    return terbilang(Math.floor(n / 1000000000000)) + ' Triliun' + (n % 1000000000000 !== 0 ? ' ' + terbilang(n % 1000000000000) : '');
}

/**
 * Format angka ke string berpemisah titik (contoh: 620000 -> "620.000").
 */
export function formatRupiahNumber(val: number | string | null | undefined): string {
    if (val === null || val === undefined || val === '') return '';
    const cleanDigits = String(val).replace(/\D/g, '');
    if (!cleanDigits) return '';
    const num = parseInt(cleanDigits, 10);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('id-ID').format(num);
}

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'min' | 'max'> {
    value: number | string;
    onValueChange: (numericValue: number, formattedValue: string) => void;
    min?: number;
    max?: number;
    showTerbilang?: boolean;
    showQuickButtons?: boolean;
    quickPresets?: number[];
    maxButtonLabel?: string;
    error?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    (
        {
            value,
            onValueChange,
            min = 0,
            max,
            showTerbilang = true,
            showQuickButtons = false,
            quickPresets = [10000, 50000, 100000],
            maxButtonLabel,
            error,
            className,
            placeholder = '0',
            disabled,
            required,
            autoFocus,
            id,
            name,
            ...props
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [displayValue, setDisplayValue] = useState<string>('');
        const [isFocused, setIsFocused] = useState<boolean>(false);

        // Sync internal formatted display value when external `value` prop changes
        useEffect(() => {
            if (value === '' || value === null || value === undefined) {
                setDisplayValue('');
            } else {
                setDisplayValue(formatRupiahNumber(value));
            }
        }, [value]);

        const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, ''), 10) || 0;
        const isOverMax = max !== undefined && numericValue > max;
        const isUnderMin = min !== undefined && numericValue > 0 && numericValue < min;

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target;
            const rawVal = input.value;
            const selStart = input.selectionStart || 0;

            // Hitung berapa digit murni sebelum letak kursor
            const digitsBeforeCursor = rawVal.slice(0, selStart).replace(/\D/g, '').length;

            // Ambil semua digit
            const cleanDigits = rawVal.replace(/\D/g, '');

            if (!cleanDigits) {
                setDisplayValue('');
                onValueChange(0, '');
                return;
            }

            const num = parseInt(cleanDigits, 10);
            const formatted = new Intl.NumberFormat('id-ID').format(num);

            setDisplayValue(formatted);
            onValueChange(num, formatted);

            // Hitung dan pulihkan posisi kursor dengan presisi
            requestAnimationFrame(() => {
                const targetInput = inputRef.current;
                if (!targetInput) return;

                if (digitsBeforeCursor === 0) {
                    targetInput.setSelectionRange(0, 0);
                    return;
                }

                let counted = 0;
                let newPos = formatted.length;
                for (let i = 0; i < formatted.length; i++) {
                    if (/\d/.test(formatted[i])) {
                        counted++;
                    }
                    if (counted === digitsBeforeCursor) {
                        newPos = i + 1;
                        break;
                    }
                }
                targetInput.setSelectionRange(newPos, newPos);
            });
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Ketika menekan Backspace tepat setelah titik pemisah (contoh: "620.|000"),
            // otomatis hapus digit sebelum titik agar tidak tersangkut di titik.
            if (e.key === 'Backspace') {
                const input = e.currentTarget;
                const selStart = input.selectionStart || 0;
                const selEnd = input.selectionEnd || 0;

                if (selStart === selEnd && selStart > 0 && input.value[selStart - 1] === '.') {
                    e.preventDefault();
                    const cleanDigits = input.value.replace(/\D/g, '');
                    const digitsBefore = input.value.slice(0, selStart - 1).replace(/\D/g, '').length;

                    if (digitsBefore > 0) {
                        const newDigits = cleanDigits.slice(0, digitsBefore - 1) + cleanDigits.slice(digitsBefore);
                        const num = newDigits ? parseInt(newDigits, 10) : 0;
                        const formatted = num > 0 ? new Intl.NumberFormat('id-ID').format(num) : '';

                        setDisplayValue(formatted);
                        onValueChange(num, formatted);

                        requestAnimationFrame(() => {
                            const targetInput = inputRef.current;
                            if (!targetInput) return;
                            let counted = 0;
                            let targetPos = 0;
                            const targetDigits = Math.max(0, digitsBefore - 1);
                            for (let i = 0; i < formatted.length; i++) {
                                if (/\d/.test(formatted[i])) counted++;
                                if (counted === targetDigits) {
                                    targetPos = i + 1;
                                    break;
                                }
                            }
                            targetInput.setSelectionRange(targetPos, targetPos);
                        });
                    }
                }
            }
        };

        const handleClear = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDisplayValue('');
            onValueChange(0, '');
            inputRef.current?.focus();
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            // Select all on initial focus agar mudah diganti jika diperlukan
            e.currentTarget.select();
        };

        const handleBlur = () => {
            setIsFocused(false);
        };

        // Terbilang text
        const terbilangText = numericValue > 0 ? terbilang(numericValue) + ' Rupiah' : '';

        return (
            <div className="w-full space-y-1.5">
                <div className="relative flex items-center">
                    {/* Fixed Prefix "Rp" */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="font-mono text-sm font-bold text-muted-foreground">Rp</span>
                    </div>

                    <input
                        ref={(node) => {
                            inputRef.current = node;
                            if (typeof ref === 'function') ref(node);
                            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                        }}
                        id={id}
                        name={name}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        required={required}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        value={displayValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            'flex h-10 w-full rounded-md border bg-background py-2 pl-11 pr-9 text-base font-bold font-mono shadow-xs transition-colors',
                            'placeholder:text-muted-foreground placeholder:font-normal placeholder:font-sans',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            isOverMax || isUnderMin || error
                                ? 'border-destructive focus-visible:ring-destructive/30 text-destructive'
                                : 'border-input hover:border-accent-foreground/30',
                            className
                        )}
                        {...props}
                    />

                    {/* Clear Button (X) */}
                    {displayValue && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            tabIndex={-1}
                            aria-label="Hapus nominal"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Over Max Warning */}
                {isOverMax && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Nominal melebihi batas maksimal ({formatRupiahNumber(max)})</span>
                    </div>
                )}

                {/* Under Min Warning */}
                {isUnderMin && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium animate-in fade-in duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Nominal minimal adalah {formatRupiahNumber(min)}</span>
                    </div>
                )}

                {/* Custom error prop */}
                {error && (
                    <div className="text-xs text-destructive font-medium">
                        {error}
                    </div>
                )}

                {/* Terbilang Live Indonesian Pronunciation */}
                {showTerbilang && terbilangText && !isOverMax && (
                    <div className="rounded-md bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground leading-relaxed flex items-center gap-1.5 border border-border/50">
                        <span className="font-semibold text-foreground/80 shrink-0">Terbilang:</span>
                        <span className="italic truncate">{terbilangText}</span>
                    </div>
                )}

                {/* Optional Quick Buttons */}
                {showQuickButtons && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {max !== undefined && (
                            <button
                                type="button"
                                onClick={() => {
                                    const formatted = formatRupiahNumber(max);
                                    setDisplayValue(formatted);
                                    onValueChange(max, formatted);
                                }}
                                className="rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 text-xs font-semibold font-mono transition-colors"
                            >
                                {maxButtonLabel || `Lunas (Rp ${formatRupiahNumber(max)})`}
                            </button>
                        )}
                        {quickPresets.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                    const nextVal = numericValue + preset;
                                    const finalVal = max !== undefined ? Math.min(nextVal, max) : nextVal;
                                    const formatted = formatRupiahNumber(finalVal);
                                    setDisplayValue(formatted);
                                    onValueChange(finalVal, formatted);
                                }}
                                className="rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-2 py-1 text-xs font-mono transition-colors"
                            >
                                +{formatRupiahNumber(preset)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';
