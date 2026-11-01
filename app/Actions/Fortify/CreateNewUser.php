<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Rules\TurnstileRule;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $rules = [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ];

        // In production/local, if turnstile is configured, require captcha
        if (! empty(config('services.turnstile.secret')) && ! app()->environment('testing')) {
            $input['cf-turnstile-response'] = $input['cf-turnstile-response'] ?? $input['turnstile_token'] ?? null;
            $rules['cf-turnstile-response'] = ['required', new TurnstileRule];
        } elseif (isset($input['cf-turnstile-response']) || isset($input['turnstile_token'])) {
            $input['cf-turnstile-response'] = $input['cf-turnstile-response'] ?? $input['turnstile_token'] ?? null;
            $rules['cf-turnstile-response'] = [new TurnstileRule];
        }

        Validator::make($input, $rules, [
            'cf-turnstile-response.required' => 'Mohon selesaikan verifikasi captcha terlebih dahulu.',
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);
    }
}
