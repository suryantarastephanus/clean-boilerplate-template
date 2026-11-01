import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage<any>().props;
    const appName = name || 'Starter Kit';

    return (
        <>
            <div className="bg-primary/10 flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <AppLogoIcon className="size-8" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span
                    className="text-foreground mb-0.5 truncate leading-tight font-bold"
                    title={appName}
                >
                    {appName}
                </span>
                <span className="text-muted-foreground truncate font-mono text-[10px] leading-none">
                    Boilerplate
                </span>
            </div>
        </>
    );
}
