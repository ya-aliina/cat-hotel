'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';
import { type LoginData, loginSchema } from '@/lib/auth-schemas';

import type { AuthFormProps } from '../_types/types';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: 'Google вхід було скасовано або заблоковано.',
  Callback: 'Не вдалося завершити вхід через Google.',
  OAuthAccountNotLinked: 'Цей email уже використовується іншим способом входу.',
  OAuthCallback: 'Помилка під час повернення від Google. Спробуйте ще раз.',
  OAuthCreateAccount: 'Не вдалося створити акаунт через Google.',
  OAuthSignin: 'Не вдалося розпочати вхід через Google.',
};

export const LoginForm = ({ onSwitch, oauthError }: AuthFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(
    oauthError ? (OAUTH_ERROR_MESSAGES[oauthError] ?? `Помилка авторизації: ${oauthError}`) : null,
  );
  const [hasGoogleProvider, setHasGoogleProvider] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    void getProviders().then((providers) => {
      setHasGoogleProvider(Boolean(providers?.google));
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setFormError(null);
    setNeedsVerification(false);
    setIsSubmitting(true);

    const statusResponse = await fetch('/api/auth/login-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const statusData = (await statusResponse.json().catch(() => {
      return null;
    })) as { error?: string; status?: 'invalid' | 'ok' | 'unverified' } | null;

    if (!statusResponse.ok || statusData?.status === 'invalid') {
      setIsSubmitting(false);
      setFormError(statusData?.error ?? 'Невірний email або пароль.');
      return;
    }

    if (statusData?.status === 'unverified') {
      setIsSubmitting(false);
      setFormError('Підтвердіть email перед входом до кабінету.');
      setNeedsVerification(true);
      return;
    }

    const result = await signIn('credentials', {
      callbackUrl: '/account',
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setFormError('Невірний email або пароль.');
      return;
    }

    router.push(result.url ?? '/account');
    router.refresh();
  };

  useEffect(() => {
    if (!oauthError) {
      return;
    }

    setFormError(OAUTH_ERROR_MESSAGES[oauthError] ?? `Помилка авторизації: ${oauthError}`);
  }, [oauthError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <Input
          type="email"
          placeholder="Ваш E-mail"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="Пароль"
          {...register('password')}
          error={errors.password?.message}
        />
        {formError && <p className="px-4 text-sm text-destructive">{formError}</p>}
        {needsVerification && (
          <button
            type="button"
            onClick={() => {
              return onSwitch('verify');
            }}
            className="px-4 text-left text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
          >
            Надіслати лист підтвердження ще раз
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 px-4 text-[16px]">
        <button
          type="button"
          onClick={() => {
            return onSwitch('forgot');
          }}
          className="cursor-pointer text-gray-400 hover:text-brand-orange transition-colors"
        >
          Забули пароль?
        </button>
        <button
          type="button"
          onClick={() => {
            return onSwitch('register');
          }}
          className="cursor-pointer text-gray-400 font-medium hover:text-brand-orange transition-colors"
        >
          Ще немає аккаунту?
        </button>
      </div>
      <div className="pt-8 flex flex-col sm:flex-row gap-4">
        <PawButton
          type="submit"
          variant="accent"
          className="w-full text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Входимо...' : 'Увійти'}
        </PawButton>
        {hasGoogleProvider && (
          <PawButton
            type="button"
            className="w-full border border-gray-200 bg-white text-brand-text"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
            onClick={() => {
              void signIn('google', { callbackUrl: '/account' });
            }}
          >
            Увійти через Google
          </PawButton>
        )}
      </div>
    </form>
  );
};
