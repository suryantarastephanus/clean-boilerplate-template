import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIdleTimerOptions {
    timeoutInSeconds?: number;
    onIdle?: () => void;
    enabled?: boolean;
}

export function useIdleTimer({
    timeoutInSeconds = 180,
    onIdle,
    enabled = true,
}: UseIdleTimerOptions = {}) {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (!enabled) {
            return;
        }

        timeoutRef.current = setTimeout(() => {
            setIsIdle(true);
            onIdle?.();
        }, timeoutInSeconds * 1000);
    }, [timeoutInSeconds, onIdle, enabled]);

    const unlock = useCallback(() => {
        setIsIdle(false);
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        if (!enabled) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'touchstart',
            'scroll',
        ];

        const handleActivity = () => {
            if (!isIdle) {
                resetTimer();
            }
        };

        events.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        resetTimer();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [enabled, isIdle, resetTimer]);

    return {
        isIdle,
        setIsIdle,
        resetTimer,
        unlock,
    };
}
