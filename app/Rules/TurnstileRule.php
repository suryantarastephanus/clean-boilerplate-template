<?php

namespace App\Rules;

use App\Services\TurnstileService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class TurnstileRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $turnstileService = app(TurnstileService::class);
        $clientIp = request()->ip();

        if (! is_string($value) || ! $turnstileService->verify($value, $clientIp)) {
            $fail('Verifikasi keamanan (Captcha) tidak valid atau telah kadaluarsa. Silakan coba lagi.');
        }
    }
}
