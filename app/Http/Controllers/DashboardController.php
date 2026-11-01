<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the starter dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => app()->environment(),
            ],
        ]);
    }
}
