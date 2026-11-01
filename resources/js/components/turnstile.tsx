import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement | string,
                options: {
                    sitekey: string;
                    action?: string;
                    cData?: string;
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: (errorCode: string) => void;
                    theme?: 'auto' | 'light' | 'dark';
                    size?: 'normal' | 'compact' | 'flexible';
                },
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

interface TurnstileProps {
    siteKey?: string;
    action?: string;
    error?: string;
    className?: string;
    onVerify?: (token: string) => void;
    onExpire?: () => void;
    resetTrigger?: unknown;
}

export default function Turnstile({
    siteKey = '0x4AAAAAAFFzzbW4rFeDFFgM',
    action,
    error,
    className = '',
    onVerify,
    onExpire,
    resetTrigger,
}: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [token, setToken] = useState<string>('');

    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onVerifyRef.current = onVerify;
        onExpireRef.current = onExpire;
    }, [onVerify, onExpire]);

    useEffect(() => {
        let isMounted = true;

        const renderWidget = () => {
            if (!containerRef.current || !window.turnstile || !siteKey) {
                return;
            }

            if (widgetIdRef.current) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // ignore
                }
                widgetIdRef.current = null;
            }

            containerRef.current.innerHTML = '';

            const isDark = document.documentElement.classList.contains('dark');

            try {
                const widgetId = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    action: action,
                    theme: isDark ? 'dark' : 'light',
                    size: 'flexible',
                    callback: (newToken: string) => {
                        if (isMounted) {
                            setToken(newToken);
                            onVerifyRef.current?.(newToken);
                        }
                    },
                    'expired-callback': () => {
                        if (isMounted) {
                            setToken('');
                            onExpireRef.current?.();
                        }
                    },
                    'error-callback': () => {
                        if (isMounted) {
                            setToken('');
                            onExpireRef.current?.();
                        }
                    },
                });

                widgetIdRef.current = widgetId;
            } catch (err) {
                console.error('Failed to render Turnstile widget:', err);
            }
        };

        if (!window.turnstile) {
            const existingScript = document.getElementById(
                'cf-turnstile-script',
            ) as HTMLScriptElement | null;
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'cf-turnstile-script';
                script.src =
                    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    renderWidget();
                };
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener('load', renderWidget);
            }
        } else {
            renderWidget();
        }

        return () => {
            isMounted = false;
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // ignore
                }
            }
        };
    }, [siteKey, action]);

    const prevResetTrigger = useRef(resetTrigger);

    useEffect(() => {
        if (
            resetTrigger !== undefined &&
            resetTrigger !== prevResetTrigger.current
        ) {
            prevResetTrigger.current = resetTrigger;
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.reset(widgetIdRef.current);
                    setToken('');
                    onExpireRef.current?.();
                } catch {
                    // ignore
                }
            }
        }
    }, [resetTrigger]);

    useEffect(() => {
        if (error && widgetIdRef.current && window.turnstile) {
            try {
                window.turnstile.reset(widgetIdRef.current);
                setToken('');
                onExpireRef.current?.();
            } catch {
                // ignore
            }
        }
    }, [error]);

    return (
        <div className={`space-y-1.5 ${className}`}>
            <input
                type="hidden"
                name="cf-turnstile-response"
                value={token}
                readOnly
            />
            <div
                ref={containerRef}
                className="my-1 flex min-h-[65px] w-full items-center justify-center"
            />
            <InputError message={error} />
        </div>
    );
}
