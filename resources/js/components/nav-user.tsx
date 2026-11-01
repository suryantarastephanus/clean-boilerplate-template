import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const cleanup = useMobileNavigation();

    if (!auth.user) {
        return null;
    }

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    if (state === 'collapsed') {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        size="lg"
                        tooltip={`Keluar (${auth.user.name})`}
                        className="text-sidebar-accent-foreground hover:text-destructive hover:bg-destructive/10"
                        data-test="sidebar-menu-button"
                    >
                        <Link
                            href={logout()}
                            as="button"
                            onClick={handleLogout}
                            aria-label="Keluar (Logout)"
                            data-test="logout-button"
                        >
                            <LogOut className="size-4" />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="group text-sidebar-accent-foreground cursor-default select-none hover:bg-transparent"
                    data-test="sidebar-menu-button"
                >
                    <UserInfo user={auth.user} />
                </SidebarMenuButton>
                <SidebarMenuAction
                    asChild
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 top-2 right-1.5 size-8 rounded-lg transition-colors"
                >
                    <Link
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        title="Keluar (Logout)"
                        aria-label="Keluar (Logout)"
                        data-test="logout-button"
                    >
                        <LogOut className="size-4" />
                    </Link>
                </SidebarMenuAction>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
