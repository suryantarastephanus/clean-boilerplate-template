import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationLinksProps {
    links: PaginationLinkItem[];
    className?: string;
    activeClass?: string;
    onNavigate?: (url: string) => void;
}

export function PaginationLinks({
    links,
    className = '',
    activeClass = 'bg-blue-600 text-white border-blue-600 font-bold',
    onNavigate,
}: PaginationLinksProps) {
    if (!links || links.length <= 1) return null;

    const handleNavigate = (url: string | null) => {
        if (!url) return;
        if (onNavigate) {
            onNavigate(url);
        } else {
            router.get(url, {}, { preserveState: true });
        }
    };

    return (
        <nav
            aria-label="Navigasi Halaman"
            className={`flex items-center gap-1 ${className}`}
        >
            {links.map((link, idx) => {
                const isPrevious =
                    idx === 0 ||
                    link.label.toLowerCase().includes('prev') ||
                    link.label.toLowerCase().includes('sebelum') ||
                    link.label.includes('&laquo;');
                const isNext =
                    idx === links.length - 1 ||
                    link.label.toLowerCase().includes('next') ||
                    link.label.toLowerCase().includes('berikut') ||
                    link.label.includes('&raquo;');

                return (
                    <button
                        key={idx}
                        type="button"
                        disabled={!link.url}
                        onClick={() => handleNavigate(link.url)}
                        title={
                            isPrevious
                                ? 'Halaman Sebelumnya'
                                : isNext
                                  ? 'Halaman Berikutnya'
                                  : undefined
                        }
                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2.5 font-mono text-xs transition-colors ${
                            link.active
                                ? activeClass
                                : 'border-border hover:bg-muted text-muted-foreground disabled:opacity-30'
                        }`}
                    >
                        {isPrevious ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : isNext ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}

export default PaginationLinks;
