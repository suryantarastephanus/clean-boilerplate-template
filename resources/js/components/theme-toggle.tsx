import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ThemeToggle({
    className = '',
    showLabel = false,
    size = 'icon',
}: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const handleToggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    const labelText = isDark
        ? 'Tema: Gelap (Klik untuk Terang)'
        : 'Tema: Terang (Klik untuk Gelap)';

    const buttonElement = (
        <Button
            type="button"
            variant="ghost"
            size={showLabel ? 'sm' : size}
            onClick={handleToggle}
            className={cn(
                'relative cursor-pointer rounded-lg transition-all duration-200 active:scale-95',
                isDark
                    ? 'text-amber-400 hover:bg-neutral-800 hover:text-amber-300'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                showLabel &&
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium',
                className,
            )}
            aria-label={labelText}
            data-test="theme-toggle-btn"
        >
            <div className="relative flex size-4 shrink-0 items-center justify-center">
                <Sun
                    className={cn(
                        'absolute size-4 transition-all duration-300',
                        isDark
                            ? 'scale-0 rotate-90 opacity-0'
                            : 'scale-100 rotate-0 text-amber-500 opacity-100',
                    )}
                />
                <Moon
                    className={cn(
                        'absolute size-4 transition-all duration-300',
                        isDark
                            ? 'scale-100 rotate-0 text-blue-400 opacity-100'
                            : 'scale-0 -rotate-90 opacity-0',
                    )}
                />
            </div>
            {showLabel && (
                <span className="text-xs font-medium select-none">
                    {isDark ? 'Mode Gelap' : 'Mode Terang'}
                </span>
            )}
            <span className="sr-only">{labelText}</span>
        </Button>
    );

    if (showLabel) {
        return buttonElement;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
            <TooltipContent side="bottom" align="end">
                <p>{isDark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default ThemeToggle;
