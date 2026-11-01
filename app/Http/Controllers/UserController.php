<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $role = $request->query('role');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role && in_array($role, [UserRole::Admin->value, UserRole::User->value], true)) {
            $query->where('role', $role);
        }

        $users = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users->through(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role?->value ?? 'user',
                'role_label' => $u->role?->label() ?? 'User',
                'is_current_user' => $u->id === $request->user()?->id,
                'created_at' => $u->created_at?->format('d M Y, H:i') ?? '-',
            ]),
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? 'all',
            ],
            'allowed_roles' => [
                ['value' => UserRole::Admin->value, 'label' => 'Administrator'],
                ['value' => UserRole::User->value, 'label' => 'User'],
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in([UserRole::Admin->value, UserRole::User->value])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => UserRole::from($validated['role']),
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', "User '{$validated['name']}' created successfully.");
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in([UserRole::Admin->value, UserRole::User->value])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => UserRole::from($validated['role']),
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', "User '{$user->name}' updated successfully.");
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()?->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "User '{$name}' deleted successfully.");
    }
}
