'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';
import { type RegisterData, registerFormSchema } from '@/lib/auth-schemas';

import type { AuthFormProps } from '../_types/types';

export const RegisterForm = ({ onSwitch }: AuthFormProps) => {
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setDeliveryMessage(null);
    setFormError(null);
    setPreviewUrl(null);
    setIsSubmitting(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        surname: data.surname,
      }),
    });

    const responseData = (await response.json().catch(() => {
      return null;
    })) as { error?: string; message?: string; previewUrl?: string } | null;

    if (!response.ok) {
      setIsSubmitting(false);
      setFormError(responseData?.error ?? 'Не вдалося створити акаунт.');
      return;
    }

    setIsSubmitting(false);
    setDeliveryMessage(
      responseData?.message ?? 'Ми створили акаунт і надіслали лист для підтвердження.',
    );
    setPreviewUrl(responseData?.previewUrl ?? null);
    setRegisteredEmail(data.email);
  };

  if (registeredEmail) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-[16px] text-brand-text">
          {deliveryMessage ??
            `Ми створили акаунт і надіслали лист для підтвердження на ${registeredEmail}.`}
        </p>
        <p className="text-sm text-gray-400">
          Після підтвердження email ви зможете увійти до особистого кабінету.
        </p>
        {previewUrl && (
          <a
            href={previewUrl}
            className="block text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
          >
            Відкрити лист-посилання для підтвердження
          </a>
        )}
        <div className="pt-4 flex flex-col items-center gap-4">
          <PawButton
            type="button"
            variant="accent"
            className="min-w-48 bg-brand-orange text-white"
            onClick={() => {
              onSwitch('login');
            }}
          >
            До входу
          </PawButton>
          <button
            type="button"
            onClick={() => {
              onSwitch('verify');
            }}
            className="text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors cursor-pointer"
          >
            Надіслати лист ще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <Input
          type="text"
          placeholder="Ваше ім'я"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          type="text"
          placeholder="Ваше прізвище"
          {...register('surname')}
          error={errors.surname?.message}
        />
        <Input
          type="tel"
          placeholder="Ваш телефон (необов'язково)"
          {...register('phone')}
          error={errors.phone?.message}
        />
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
        <Input
          type="password"
          placeholder="Підтвердіть пароль"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        {formError && <p className="px-4 text-sm text-destructive">{formError}</p>}
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton
          type="submit"
          variant="accent"
          className="min-w-48 bg-brand-orange text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Створюємо...' : 'Створити аккаунт'}
        </PawButton>
        <button
          type="button"
          onClick={() => {
            return onSwitch('login');
          }}
          className="text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors cursor-pointer"
        >
          Повернутися до входу
        </button>
      </div>
    </form>
  );
};
