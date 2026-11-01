<?php

namespace App\Actions\Fortify;

use App\Services\TurnstileService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EnsureValidCaptcha
{
    public function __construct(
        protected TurnstileService $turnstileService
    ) {}

    /**
     * Handle the incoming request.
     *
     * @return mixed
     */
    public function handle(Request $request, callable $next)
    {
        // If turnstile secret is not configured, skip
        if (empty(config('services.turnstile.secret'))) {
            return $next($request);
        }

        // Check whitelisted bypass IPs
        $bypassIps = array_filter(array_map('trim', explode(',', (string) config('services.turnstile.bypass_ips', ''))));
        $clientIps = array_filter([
            $request->ip(),
            $request->header('cf-connecting-ip'),
            $request->header('x-real-ip'),
        ]);
        if (! empty($bypassIps) && ! empty(array_intersect($clientIps, $bypassIps))) {
            return $next($request);
        }

        // Check header/input bypass secret
        $bypassSecret = config('services.turnstile.bypass_secret');
        if (! empty($bypassSecret)) {
            if ($request->header('X-Bypass-Captcha') === $bypassSecret ||
                $request->input('cf-turnstile-response') === $bypassSecret ||
                $request->input('turnstile_token') === $bypassSecret) {
                return $next($request);
            }
        }

        // In testing environment, allow requests without token unless test explicitly provides one
        if (app()->environment('testing') && ! $request->has('cf-turnstile-response') && ! $request->has('turnstile_token')) {
            return $next($request);
        }

        $token = $request->input('cf-turnstile-response')
            ?: $request->input('turnstile_token');

        if (! $this->turnstileService->verify($token, $request->ip())) {
            throw ValidationException::withMessages([
                'turnstile' => 'Verifikasi keamanan (Captcha) tidak valid atau telah kadaluarsa. Silakan coba lagi.',
            ]);
        }

        return $next($request);
    }
}
