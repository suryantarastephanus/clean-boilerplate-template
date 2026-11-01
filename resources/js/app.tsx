import { createInertiaApp, router } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('pos/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Track Inertia SPA page views with Google Analytics
if (typeof window !== 'undefined') {
    // Automatically reload the page when a dynamic import/chunk fails due to fresh deployment
    window.addEventListener('vite:preloadError', () => {
        window.location.reload();
    });

    window.addEventListener('unhandledrejection', (event) => {
        const errorMsg = event.reason?.message || '';
        if (
            errorMsg.includes('Failed to fetch dynamically imported module') ||
            errorMsg.includes('Importing a module script failed') ||
            event.reason?.name === 'ChunkLoadError'
        ) {
            window.location.reload();
        }
    });

    router.on('navigate', (event) => {
        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-PTR6ZQ3W60', {
                page_path: event.detail.page.url,
            });
        }
    });
}
