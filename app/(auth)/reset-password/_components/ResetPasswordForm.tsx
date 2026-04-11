'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';
import { type ResetPasswordData, resetPasswordFormSchema } from '@/lib/auth-schemas';

export function ResetPasswordForm({ token }: { token: string }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setFormError(null);
    setIsSubmitting(true);

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: data.password,
        token,
      }),
    });

    const responseData = (await response.json().catch(() => {
      return null;
    })) as { error?: string } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setFormError(responseData?.error ?? 'Не вдалося оновити пароль.');
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="mt-8 space-y-4 text-center">
        <p className="text-[16px] text-brand-text">Пароль успішно оновлено.</p>
        <p className="text-sm text-gray-400">Тепер ви можете увійти з новим паролем.</p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
        >
          Перейти до входу
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <Input
        type="password"
        placeholder="Новий пароль"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        type="password"
        placeholder="Підтвердіть новий пароль"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      {formError && <p className="px-4 text-sm text-destructive">{formError}</p>}
      {formError && (
        <p className="px-4 text-sm text-gray-400">
          Якщо термін дії посилання минув, запросіть новий лист через форму відновлення пароля.
        </p>
      )}
      <div className="pt-4 flex justify-center">
        <PawButton
          type="submit"
          variant="accent"
          className="min-w-48 bg-brand-orange text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оновлюємо...' : 'Оновити пароль'}
        </PawButton>
      </div>
    </form>
  );
}
