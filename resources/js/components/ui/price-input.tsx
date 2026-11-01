import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    /**
     * Raw numeric value as string or number (e.g. "10000", "10000.5", 10000).
     */
    value?: string | number | null;
    /**
     * Callback with standard synthetic-like change event where e.target.value is the clean unformatted numeric string ("10000", "10000.5").
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * Direct callback with raw string and parsed number.
     */
    onValueChange?: (rawValue: string, numericValue: number) => void;
    /**
     * Maximum decimal places allowed (default: 0 for standard Indonesian Rupiah prices).
     */
    maxDecimals?: number;
    /**
     * Allow negative values (default: false).
     */
    allowNegative?: boolean;
}

/**
 * Format an unformatted numeric string or number to Indonesian number format (10000 -> "10.000").
 * Strips database decimal artifacts like ".00" from MySQL DECIMAL columns so "2.00" formats as "2", not "2,00".
 */
export function formatToDisplay(
    rawVal: string | number | null | undefined,
    maxDecimals: number = 0
): string {
    if (rawVal === null || rawVal === undefined || rawVal === '') return '';

    const str = String(rawVal).trim();
    if (!str) return '';

    const isNegative = str.startsWith('-');
    const cleanStr = str.replace(/^-/, '');

    let intPartRaw = cleanStr;
    let decPartRaw: string | undefined = undefined;

    if (cleanStr.includes('.')) {
        const parts = cleanStr.split('.');
        intPartRaw = parts[0];
        decPartRaw = parts.slice(1).join('');
    } else if (cleanStr.includes(',')) {
        const parts = cleanStr.split(',');
        intPartRaw = parts[0];
        decPartRaw = parts.slice(1).join('');
    }

    // Clean any non-digits from integer part
    const intDigits = intPartRaw.replace(/\D/g, '');
    if (!intDigits && decPartRaw === undefined) {
        return isNegative ? '-' : '';
    }

    const formattedInt = intDigits
        ? new Intl.NumberFormat('id-ID').format(parseInt(intDigits, 10))
        : '0';

    // If integer only (maxDecimals === 0), never append decimal part
    if (maxDecimals <= 0) {
        return `${isNegative ? '-' : ''}${formattedInt}`;
    }

    // If decimals allowed, only show decimal if there are non-zero decimal digits
    if (decPartRaw !== undefined) {
        const decDigits = decPartRaw.replace(/\D/g, '').slice(0, maxDecimals);
        const nonZeroDec = decDigits.replace(/0+$/, '');
        if (nonZeroDec.length > 0) {
            return `${isNegative ? '-' : ''}${formattedInt},${nonZeroDec}`;
        }
    }

    return `${isNegative ? '-' : ''}${formattedInt}`;
}

/**
 * Parse any user typed or pasted string into a clean standard numeric string ("10000" or "10000.5").
 */
export function parseInputToRaw(
    input: string,
    maxDecimals: number = 0
): { raw: string; display: string } {
    if (!input) return { raw: '', display: '' };

    const isNegative = input.startsWith('-');

    if (maxDecimals <= 0) {
        // Integer-only mode (Standard for Indonesian Rupiah)
        // If input contains comma (e.g. from pasted "2.000,00" or previous "2,00"),
        // the segment before the comma is the integer value in Indonesian format
        let intCandidate = input;
        if (input.includes(',')) {
            intCandidate = input.split(',')[0];
        }

        // All dots and other non-digits are stripped as thousand separators
        const digits = intCandidate.replace(/\D/g, '');
        if (!digits) {
            return { raw: '', display: isNegative ? '-' : '' };
        }

        const numInt = parseInt(digits, 10);
        const formatted = new Intl.NumberFormat('id-ID').format(numInt);
        const raw = String(numInt);

        return {
            raw: isNegative ? `-${raw}` : raw,
            display: isNegative ? `-${formatted}` : formatted,
        };
    }

    // Decimal mode (maxDecimals > 0)
    // Strip everything except digits, comma, and period
    const cleaned = input.replace(/[^\d.,]/g, '');
    if (!cleaned) return { raw: '', display: isNegative ? '-' : '' };

    const hasComma = cleaned.includes(',');
    const hasDot = cleaned.includes('.');

    let intPart = '';
    let decPart: string | null = null;

    if (hasComma && hasDot) {
        const lastComma = cleaned.lastIndexOf(',');
        const lastDot = cleaned.lastIndexOf('.');
        if (lastDot > lastComma) {
            // US format pasted: "10,000.50"
            intPart = cleaned.slice(0, lastDot).replace(/\D/g, '');
            decPart = cleaned.slice(lastDot + 1).replace(/\D/g, '').slice(0, maxDecimals);
        } else {
            // ID format: "10.000,50"
            intPart = cleaned.slice(0, lastComma).replace(/\D/g, '');
            decPart = cleaned.slice(lastComma + 1).replace(/\D/g, '').slice(0, maxDecimals);
        }
    } else if (hasComma) {
        // Indonesian decimal: "10000," or "10.000,5"
        const parts = cleaned.split(',');
        intPart = parts[0].replace(/\D/g, '');
        decPart = parts.slice(1).join('').replace(/\D/g, '').slice(0, maxDecimals);
    } else {
        // Only digits or dots (in Indonesian locale, dots are thousand separators!)
        intPart = cleaned.replace(/\D/g, '');
        decPart = null;
    }

    const numInt = intPart ? parseInt(intPart, 10) : 0;
    const formattedInt = intPart ? new Intl.NumberFormat('id-ID').format(numInt) : '';

    let display = formattedInt;
    let raw = intPart ? String(numInt) : '';

    if (decPart !== null) {
        display = `${formattedInt || '0'},${decPart}`;
        raw = `${intPart || '0'}.${decPart}`;
    }

    if (isNegative && (display || raw)) {
        display = '-' + display;
        raw = '-' + raw;
    }

    return { raw, display };
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
    (
        {
            value,
            onChange,
            onValueChange,
            maxDecimals = 0,
            allowNegative = false,
            className,
            placeholder = '0',
            disabled,
            required,
            autoFocus,
            onFocus,
            onClick,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement>(null);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const [displayValue, setDisplayValue] = useState<string>(() => formatToDisplay(value, maxDecimals));
        const isEditingRef = useRef(false);

        // Keep displayValue in sync with external value prop when not actively typing
        useEffect(() => {
            if (!isEditingRef.current) {
                setDisplayValue(formatToDisplay(value, maxDecimals));
            }
        }, [value, maxDecimals]);

        const emitChange = (raw: string) => {
            if (onValueChange) {
                onValueChange(raw, parseFloat(raw) || 0);
            }
            if (onChange && inputRef.current) {
                // Create a synthetic-like event matching React.ChangeEvent<HTMLInputElement>
                const syntheticEvent = {
                    target: {
                        name: props.name,
                        id: props.id,
                        value: raw,
                    },
                    currentTarget: {
                        name: props.name,
                        id: props.id,
                        value: raw,
                    },
                    persist: () => {},
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            isEditingRef.current = true;
            const input = e.target;
            const rawTyped = input.value;
            const selStart = input.selectionStart || 0;

            // Count clean digits before cursor in raw input
            const charsBeforeCursor = rawTyped.slice(0, selStart);
            const digitCountBefore = charsBeforeCursor.replace(/\D/g, '').length;
            const hasCommaBefore = charsBeforeCursor.includes(',');

            // If empty
            if (!rawTyped.trim()) {
                setDisplayValue('');
                emitChange('');
                setTimeout(() => {
                    isEditingRef.current = false;
                }, 0);
                return;
            }

            // Detect trailing decimal separator (only when maxDecimals > 0)
            const endsWithDecimal = maxDecimals > 0 && /[.,]$/.test(rawTyped);

            const { raw, display } = parseInputToRaw(rawTyped, maxDecimals);

            let finalDisplay = display;
            let finalRaw = raw;

            if (endsWithDecimal && !display.includes(',')) {
                finalDisplay = (display || '0') + ',';
                finalRaw = (raw || '0') + '.';
            }

            setDisplayValue(finalDisplay);
            emitChange(finalRaw);

            // Restore cursor position smoothly
            requestAnimationFrame(() => {
                const target = inputRef.current;
                if (!target) return;

                if (digitCountBefore === 0 && !hasCommaBefore) {
                    target.setSelectionRange(0, 0);
                    return;
                }

                // If user just typed decimal separator at end
                if (endsWithDecimal && selStart >= rawTyped.length - 1) {
                    const pos = finalDisplay.length;
                    target.setSelectionRange(pos, pos);
                    return;
                }

                // Find matching cursor position in new formatted string
                let digitsCounted = 0;
                let targetPos = finalDisplay.length;

                for (let i = 0; i < finalDisplay.length; i++) {
                    const ch = finalDisplay[i];
                    if (/\d/.test(ch)) {
                        digitsCounted++;
                    }
                    if (digitsCounted === digitCountBefore) {
                        // If there was a comma separator right after, position after comma
                        if (hasCommaBefore && finalDisplay[i + 1] === ',') {
                            targetPos = i + 2;
                        } else {
                            targetPos = i + 1;
                        }
                        break;
                    }
                }

                target.setSelectionRange(targetPos, targetPos);
                isEditingRef.current = false;
            });
        };

        const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const input = e.currentTarget;
            const selStart = input.selectionStart || 0;
            const selEnd = input.selectionEnd || 0;

            // Handle Backspace when cursor is directly following a thousand separator dot (e.g. "10.|000")
            if (e.key === 'Backspace' && selStart === selEnd && selStart > 1) {
                if (input.value[selStart - 1] === '.') {
                    e.preventDefault();
                    // Delete the digit before the dot
                    const before = input.value.slice(0, selStart - 2);
                    const after = input.value.slice(selStart);
                    const newRaw = before + after;
                    const { raw, display } = parseInputToRaw(newRaw, maxDecimals);
                    setDisplayValue(display);
                    emitChange(raw);

                    requestAnimationFrame(() => {
                        const target = inputRef.current;
                        if (target) {
                            const newPos = Math.max(0, selStart - 2);
                            target.setSelectionRange(newPos, newPos);
                        }
                    });
                    return;
                }
            }

            // In integer mode (standard Indonesian Rupiah), prevent comma and dot
            // Thousand dots are formatted automatically, so manual dots are not needed
            if (maxDecimals <= 0) {
                if (e.key === ',' || e.key === '.') {
                    e.preventDefault();
                    return;
                }
            } else {
                // If decimals allowed, prevent duplicate decimal separators
                if ((e.key === '.' || e.key === ',') && selStart === selEnd) {
                    if (displayValue.includes(',')) {
                        e.preventDefault();
                        return;
                    }
                }
            }

            onKeyDown?.(e);
        };

        const handleFocusInternal = (e: React.FocusEvent<HTMLInputElement>) => {
            // Auto select all on focus for effortless overwrite
            e.currentTarget.select();
            onFocus?.(e);
        };

        const handleClickInternal = (e: React.MouseEvent<HTMLInputElement>) => {
            onClick?.(e);
        };

        return (
            <input
                ref={inputRef}
                type="text"
                inputMode={maxDecimals > 0 ? 'decimal' : 'numeric'}
                autoComplete="off"
                data-slot="input"
                placeholder={placeholder}
                value={displayValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownInternal}
                onFocus={handleFocusInternal}
                onClick={handleClickInternal}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
                className={cn(
                    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className
                )}
                {...props}
            />
        );
    }
);

PriceInput.displayName = 'PriceInput';

