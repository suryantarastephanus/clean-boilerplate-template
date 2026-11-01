import { useState, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    Search,
    ShieldCheck,
    Mail,
    Edit,
    Trash2,
    Lock,
} from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
    is_current_user: boolean;
    created_at: string;
}

interface Props {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
        role?: string;
    };
    allowed_roles: Array<{
        value: string;
        label: string;
    }>;
}

export default function UsersIndex({ users, filters, allowed_roles }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/users' },
    ];

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/users',
            {
                search: search || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
            },
            { preserveState: true },
        );
    };

    const handleRoleChange = (val: string) => {
        setRoleFilter(val);
        router.get(
            '/users',
            {
                search: search || undefined,
                role: val !== 'all' ? val : undefined,
            },
            { preserveState: true },
        );
    };

    const handleCreateSubmit = (e: FormEvent) => {
        e.preventDefault();
        createForm.post('/users', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEditOpen = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
        });
    };

    const handleEditSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
            },
        });
    };

    const handleDeleteSubmit = () => {
        if (!deletingUser) return;
        router.delete(`/users/${deletingUser.id}`, {
            onSuccess: () => setDeletingUser(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="flex w-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="User Management"
                        description="Manage registered users, assign roles, and administer platform access."
                    />

                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <UserPlus className="size-4" />
                        Add New User
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="sm">
                            Filter
                        </Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Role:</span>
                        <Select value={roleFilter} onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-[150px] h-9">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {allowed_roles.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3.5">User</th>
                                    <th className="px-6 py-3.5">Role</th>
                                    <th className="px-6 py-3.5">Created</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                                            <Users className="mx-auto size-8 opacity-40" />
                                            <p className="mt-2 text-sm">No users found matching your criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">
                                                    {user.name}
                                                    {user.is_current_user && (
                                                        <span className="ml-2 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Mail className="size-3" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                                                    className="gap-1 font-mono text-xs capitalize"
                                                >
                                                    <ShieldCheck className="size-3" />
                                                    {user.role_label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                                {user.created_at}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditOpen(user)}
                                                        className="size-8"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    {!user.is_current_user && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeletingUser(user)}
                                                            className="size-8 text-destructive hover:bg-destructive/10"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users.total > 0 && (
                        <div className="border-t p-4">
                            <PaginationLinks links={users.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Create User Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create an account with role permissions for the platform.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Full Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email Address</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="user@example.com"
                                required
                            />
                            <InputError message={createForm.errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-role">Role</Label>
                            <Select
                                value={createForm.data.role}
                                onValueChange={(val) => createForm.setData('role', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowed_roles.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                required
                            />
                            <InputError message={createForm.errors.password} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user profile details and role assignment.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(val) => editForm.setData('role', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowed_roles.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="New password"
                            />
                            <InputError message={editForm.errors.password} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Account Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete user <strong>{deletingUser?.name}</strong> ({deletingUser?.email})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                        >
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
