'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import GoogleIcon from '@/components/ui/icons/GoogleIcon';
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
              <div className="bg-white p-1 rounded-full rotate-12">
                <GoogleIcon />
              </div>
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
