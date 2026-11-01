import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavSubItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    feature?: string;
    roles?: string[];
    isActive?: boolean;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    feature?: string;
    roles?: string[];
    items?: NavSubItem[];
};

export type NavGroup = {
    label: string;
    items: NavItem[];
};
