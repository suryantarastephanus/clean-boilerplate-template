import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

interface NavMainProps {
    items?: NavItem[];
    groups?: NavGroup[];
}

export function NavMain({ items, groups }: NavMainProps) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const normalizedGroups: NavGroup[] =
        groups ?? (items ? [{ label: 'Platform', items }] : []);

    return (
        <div className="flex flex-col gap-1.5 py-1">
            {normalizedGroups.map((group) => {
                if (!group.items || group.items.length === 0) {
                    return null;
                }

                return (
                    <SidebarGroup key={group.label} className="px-2 py-0.5">
                        {group.label && (
                            <SidebarGroupLabel className="text-muted-foreground/70 text-[10px] font-bold tracking-wider uppercase select-none">
                                {group.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarMenu>
                            {group.items.map((item) => {
                                if (item.items && item.items.length > 0) {
                                    const hasActiveChild = item.items.some(
                                        (sub) =>
                                            isCurrentUrl(sub.href) ||
                                            isCurrentOrParentUrl(sub.href),
                                    );

                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={hasActiveChild}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={{
                                                            children:
                                                                item.title,
                                                        }}
                                                        isActive={
                                                            hasActiveChild
                                                        }
                                                    >
                                                        {item.icon && (
                                                            <item.icon />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map(
                                                            (subItem) => {
                                                                const isSubActive =
                                                                    isCurrentUrl(
                                                                        subItem.href,
                                                                    ) ||
                                                                    isCurrentOrParentUrl(
                                                                        subItem.href,
                                                                    );

                                                                return (
                                                                    <SidebarMenuSubItem
                                                                        key={
                                                                            subItem.title
                                                                        }
                                                                    >
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={
                                                                                isSubActive
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    subItem.href
                                                                                }
                                                                                prefetch
                                                                            >
                                                                                {subItem.icon && (
                                                                                    <subItem.icon className="size-3.5" />
                                                                                )}
                                                                                <span>
                                                                                    {
                                                                                        subItem.title
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                );
                                                            },
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                if (!item.href) {
                                    return null;
                                }

                                const isItemActive = isCurrentUrl(item.href);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isItemActive}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </div>
    );
}
