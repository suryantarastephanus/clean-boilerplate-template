<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\EnsureValidCaptcha;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\CanonicalizeUsername;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\RedirectsIfTwoFactorAuthenticatable as RedirectsIfTwoFactorAuthenticatableContract;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\LoginRateLimiter;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureResponses();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify responses to guarantee Inertia redirect compatibility.
     */
    private function configureResponses(): void
    {
        $this->app->singleton(LoginResponseContract::class, function () {
            return new class implements LoginResponseContract
            {
                public function toResponse($request)
                {
                    return $request->wantsJson() && ! $request->header('X-Inertia')
                        ? response()->json(['two_factor' => false])
                        : redirect()->intended(Fortify::redirects('login'));
                }
            };
        });

        $this->app->singleton(TwoFactorLoginResponseContract::class, function () {
            return new class implements TwoFactorLoginResponseContract
            {
                public function toResponse($request)
                {
                    return $request->wantsJson() && ! $request->header('X-Inertia')
                        ? response()->noContent()
                        : redirect()->intended(Fortify::redirects('login'));
                }
            };
        });

        $this->app->singleton(LogoutResponseContract::class, function () {
            return new class implements LogoutResponseContract
            {
                public function toResponse($request)
                {
                    return $request->wantsJson() && ! $request->header('X-Inertia')
                        ? response()->noContent()
                        : redirect(Fortify::redirects('logout', '/'));
                }
            };
        });

        $this->app->singleton(RedirectsIfTwoFactorAuthenticatableContract::class, function ($app) {
            return new class($app->make(StatefulGuard::class), $app->make(LoginRateLimiter::class)) extends RedirectIfTwoFactorAuthenticatable
            {
                protected function twoFactorChallengeResponse($request, $user)
                {
                    $request->session()->put([
                        'login.id' => $user->getKey(),
                        'login.remember' => $request->boolean('remember'),
                    ]);

                    TwoFactorAuthenticationChallenged::dispatch($user);

                    return $request->wantsJson() && ! $request->header('X-Inertia')
                        ? response()->json(['two_factor' => true])
                        : redirect()->route('two-factor.login');
                }
            };
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);

        Fortify::authenticateThrough(function (Request $request) {
            return array_filter([
                config('fortify.limiters.login') ? null : EnsureLoginIsNotThrottled::class,
                EnsureValidCaptcha::class,
                config('fortify.lowercase_usernames') ? CanonicalizeUsername::class : null,
                Features::enabled(Features::twoFactorAuthentication()) ? RedirectIfTwoFactorAuthenticatable::class : null,
                AttemptToAuthenticate::class,
                PrepareAuthenticatedSession::class,
            ]);
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
            'turnstileSiteKey' => config('services.turnstile.key'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn (Request $request) => Inertia::render('auth/register', [
            'turnstileSiteKey' => config('services.turnstile.key'),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
