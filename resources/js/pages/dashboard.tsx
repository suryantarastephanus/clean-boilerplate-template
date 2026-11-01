import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    CheckCircle2,
    Database,
    Layers,
    Server,
    Shield,
    Sparkles,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Props {
    stats: {
        total_users: number;
        php_version: string;
        laravel_version: string;
        environment: string;
    };
}

export default function Dashboard({ stats }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
    ];

    const techStack = [
        { name: 'Laravel', version: stats.laravel_version, icon: Server, color: 'text-red-500 bg-red-500/10' },
        { name: 'PHP Runtime', version: stats.php_version, icon: Activity, color: 'text-indigo-500 bg-indigo-500/10' },
        { name: 'Database', version: 'PostgreSQL 16', icon: Database, color: 'text-blue-500 bg-blue-500/10' },
        { name: 'Frontend', version: 'React 19 + Inertia v3', icon: Layers, color: 'text-cyan-500 bg-cyan-500/10' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex w-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 shadow-xs sm:p-8">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
                                <Sparkles className="size-3.5" />
                                Master Boilerplate Ready
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Welcome to Your New Project
                            </h1>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                Clean, scalable architecture powered by Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4, and 62 Global AI Skills.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild className="gap-2">
                                <Link href="/users">
                                    <Users className="size-4" />
                                    Manage Users
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="gap-2">
                                <Link href="/settings/profile">
                                    <Shield className="size-4" />
                                    Account Settings
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* System & Tech Stack Status Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {techStack.map((tech) => {
                        const Icon = tech.icon;
                        return (
                            <div key={tech.name} className="rounded-xl border bg-card p-5 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        {tech.name}
                                    </span>
                                    <div className={`rounded-lg p-2 ${tech.color}`}>
                                        <Icon className="size-4" />
                                    </div>
                                </div>
                                <div className="mt-3 font-mono text-xl font-bold tracking-tight text-foreground">
                                    {tech.version}
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="size-3.5" />
                                    <span>Configured & Healthy</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Start Guide Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border bg-card p-6 shadow-xs lg:col-span-2">
                        <Heading
                            title="Boilerplate Architecture"
                            description="Production-grade foundations pre-configured out-of-the-box"
                        />

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="font-semibold text-foreground">⚡ Modern Inertia v3</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Client-side SPA experience with React 19, server routing, and auto-generated typed Wayfinder routes.
                                </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="font-semibold text-foreground">🔒 Fortify & Passkeys</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Headless authentication with 2FA/TOTP confirmation and WebAuthn / Passkeys biometric support.
                                </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="font-semibold text-foreground">🐳 1-Click Docker Deploy</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Multi-stage container with PHP 8.4-FPM, Nginx, PostgreSQL 16, and Redis Supervisor queue.
                                </p>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <div className="font-semibold text-foreground">🤖 62 Global AI Skills</div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Global skill repository connected via NTFS junction / symlink for instantaneous agent mastery.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                    <BookOpen className="size-4" />
                                </div>
                                <h3 className="font-bold text-foreground">Quick Reference</h3>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Useful CLI commands for day-to-day development in this template.
                            </p>

                            <div className="mt-4 space-y-2 font-mono text-xs">
                                <div className="rounded-md bg-muted p-2.5">
                                    <span className="text-muted-foreground"># Run dev server</span>
                                    <div className="text-primary font-semibold">composer run dev</div>
                                </div>
                                <div className="rounded-md bg-muted p-2.5">
                                    <span className="text-muted-foreground"># Format code (Pint)</span>
                                    <div className="text-primary font-semibold">vendor/bin/pint</div>
                                </div>
                                <div className="rounded-md bg-muted p-2.5">
                                    <span className="text-muted-foreground"># Run Pest tests</span>
                                    <div className="text-primary font-semibold">php artisan test</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <span className="text-xs text-muted-foreground">
                                Registered Users: <strong className="text-foreground">{stats.total_users}</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
