<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Administrator Account
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'role' => UserRole::Admin,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Demo User Account
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Demo User',
                'role' => UserRole::User,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
