<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case User = 'user';

    /**
     * Get human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::User => 'User',
        };
    }

    /**
     * Check if user is administrator.
     */
    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }
}
