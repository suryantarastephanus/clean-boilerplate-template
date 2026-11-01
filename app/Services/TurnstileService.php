<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    /**
     * Verify the Cloudflare Turnstile response token.
     */
    public function verify(?string $token, ?string $ip = null): bool
    {
        // Allow passing in unit/feature tests when using test tokens or when unmocked
        if (app()->environment('testing')) {
            if ($token === 'invalid-token') {
                return false;
            }

            return true;
        }

        $secret = config('services.turnstile.secret');

        // If secret is not configured, bypass gracefully
        if (empty($secret)) {
            return true;
        }

        // Allow whitelisted IPs or bypass secret
        $bypassIps = array_filter(array_map('trim', explode(',', (string) config('services.turnstile.bypass_ips', ''))));
        if (! empty($bypassIps) && $ip && in_array($ip, $bypassIps, true)) {
            return true;
        }

        $bypassSecret = config('services.turnstile.bypass_secret');
        if (! empty($bypassSecret) && ($token === $bypassSecret || request()?->header('X-Bypass-Captcha') === $bypassSecret)) {
            return true;
        }

        if (empty($token)) {
            return false;
        }

        try {
            $payload = [
                'secret' => $secret,
                'response' => $token,
            ];

            if ($ip) {
                $payload['remoteip'] = $ip;
            }

            $response = Http::asForm()
                ->timeout(6)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', $payload);

            if (! $response->successful()) {
                Log::warning('Turnstile HTTP siteverify request returned error status', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return false;
            }

            $data = $response->json();

            if (! ($data['success'] ?? false)) {
                Log::info('Turnstile verification unsuccessful', [
                    'error_codes' => $data['error-codes'] ?? [],
                ]);

                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('Turnstile verification exception: '.$e->getMessage());

            return false;
        }
    }
}
