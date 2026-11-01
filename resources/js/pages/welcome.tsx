import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Database,
    Github,
    Layers,
    Lock,
    Server,
    Shield,
    Sparkles,
    Terminal,
    Zap,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth, name } = usePage().props as {
        auth?: { user?: any };
        name?: string;
    };
    const appName = name || 'Laravel Starter';

    const features = [
        {
            title: 'Laravel 13 & PHP 8.4',
            description: 'Cutting-edge PHP framework foundation with constructor property promotion, strict typing, and Pint code formatting.',
            icon: Server,
            badge: 'Backend Core',
        },
        {
            title: 'React 19 & Inertia.js v3',
            description: 'True SPA reactivity with instant visits, optimistic updates, and automatic TypeScript route typing via Wayfinder.',
            icon: Layers,
            badge: 'Frontend',
        },
        {
            title: 'PostgreSQL & Docker Ready',
            description: 'Robust PostgreSQL database support with multi-stage production Dockerfile and Docker Compose orchestration.',
            icon: Database,
            badge: 'Database & DevOps',
        },
        {
            title: 'Fortify Auth & Passkeys',
            description: 'Complete authentication system with two-factor verification (TOTP), reset password, and biometric WebAuthn passkeys.',
            icon: Shield,
            badge: 'Security',
        },
        {
            title: 'Tailwind CSS v4 & Radix UI',
            description: 'Modern CSS-first styling powered by Tailwind v4 engine paired with accessible, customizable Radix primitives.',
            icon: Zap,
            badge: 'Design System',
        },
        {
            title: '62 Global AI Skills',
            description: 'Pre-configured AI agent skills library connected globally across all your projects via NTFS junction links.',
            icon: Sparkles,
            badge: 'AI Superpowers',
        },
    ];

    return (
        <>
            <Head title={`Master Boilerplate - ${appName}`} />

            <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
                {/* Ambient glow background */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[128px]" />
                    <div className="absolute top-[40%] -right-20 h-[450px] w-[450px] rounded-full bg-blue-500/[0.05] blur-[140px]" />
                </div>

                {/* Navbar */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <AppLogoIcon className="size-8" />
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold tracking-tight text-foreground">
                                    {appName}
                                </span>
                                <Badge variant="secondary" className="font-mono text-[10px]">
                                    BOILERPLATE
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            {auth?.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        Dashboard
                                        <ArrowRight className="ml-1.5 size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Sign In</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={register()}>Get Started</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs">
                            <Sparkles className="size-3.5 text-primary" />
                            <span>Master Starter Kit &bull; Ready for Production</span>
                        </div>

                        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-tight">
                            Build Modern Apps Faster with{' '}
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Full-Stack Mastery
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
                            An opinionated, battle-tested starter template combining <strong>Laravel 13</strong>, <strong>React 19</strong>, <strong>Inertia v3</strong>, and <strong>Tailwind v4</strong> with seamless PostgreSQL deployment and 62 global AI agent skills.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            {auth?.user ? (
                                <Button asChild size="lg" className="h-11 px-8 gap-2">
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="h-11 px-8 gap-2">
                                        <Link href={register()}>
                                            Create Account
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-11 px-8">
                                        <Link href={login()}>Sign In to Platform</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Quick terminal box */}
                        <div className="mt-12 w-full max-w-md rounded-xl border bg-card p-3 shadow-lg">
                            <div className="flex items-center gap-2 border-b pb-2 text-xs text-muted-foreground">
                                <Terminal className="size-3.5" />
                                <span className="font-mono">Quick Start Command</span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between font-mono text-xs">
                                <span className="text-primary font-semibold">composer run dev</span>
                                <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Server + Queue + Vite</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-24">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Everything You Need Included
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No repetitive plumbing. Start building your domain features from minute one.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feat) => {
                                const Icon = feat.icon;
                                return (
                                    <div
                                        key={feat.title}
                                        className="group relative rounded-2xl border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                                <Icon className="size-5" />
                                            </div>
                                            <span className="font-mono text-[10px] font-semibold text-muted-foreground uppercase">
                                                {feat.badge}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-base font-bold text-foreground">
                                            {feat.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                            {feat.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t bg-card/50 py-8 text-center text-xs text-muted-foreground">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>&copy; {new Date().getFullYear()} {appName}. Master Clean Boilerplate.</p>
                        <p className="font-mono text-[11px]">PHP 8.4 &bull; Laravel 13 &bull; React 19 &bull; PostgreSQL 16</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
