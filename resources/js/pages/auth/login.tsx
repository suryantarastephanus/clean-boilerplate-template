import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';
import Turnstile from '@/components/turnstile';

type Props = {
    status?: string;
    canResetPassword: boolean;
    turnstileSiteKey?: string;
};

export default function Login({
    status,
    canResetPassword,
    turnstileSiteKey,
}: Props) {
    const isTurnstileRequired = Boolean(turnstileSiteKey);
    const [isTurnstileVerified, setIsTurnstileVerified] = useState(
        !isTurnstileRequired,
    );
    const [resetCounter, setResetCounter] = useState(0);

    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                onError={() => {
                    if (isTurnstileRequired) {
                        setIsTurnstileVerified(false);
                        setResetCounter((c) => c + 1);
                    }
                }}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            {isTurnstileRequired && (
                                <Turnstile
                                    siteKey={turnstileSiteKey}
                                    action="login"
                                    error={
                                        errors.turnstile ||
                                        errors['cf-turnstile-response']
                                    }
                                    resetTrigger={resetCounter}
                                    onVerify={(token) =>
                                        setIsTurnstileVerified(Boolean(token))
                                    }
                                    onExpire={() =>
                                        setIsTurnstileVerified(false)
                                    }
                                />
                            )}

                            {!isTurnstileRequired &&
                                (errors.turnstile ||
                                    errors['cf-turnstile-response']) && (
                                    <InputError
                                        message={
                                            errors.turnstile ||
                                            errors['cf-turnstile-response']
                                        }
                                    />
                                )}

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={4}
                                disabled={
                                    processing ||
                                    (isTurnstileRequired && !isTurnstileVerified)
                                }
                                data-test="login-button"
                                title={
                                    isTurnstileRequired && !isTurnstileVerified
                                        ? 'Menunggu verifikasi pemeriksaan keamanan Cloudflare...'
                                        : undefined
                                }
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Belum punya akun?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Daftar Toko
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
