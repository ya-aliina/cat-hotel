'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';
import { type EmailRequestData, emailRequestSchema } from '@/lib/auth-schemas';

import type { AuthFormProps } from '../_types/types';

export const ResendVerificationForm = ({ onSwitch }: AuthFormProps) => {
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailRequestData>({
    resolver: zodResolver(emailRequestSchema),
  });

  const onSubmit = async (data: EmailRequestData) => {
    setFormError(null);
    setCooldownSeconds(null);
    setPreviewUrl(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const response = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = (await response.json().catch(() => {
      return null;
    })) as {
      error?: string;
      message?: string;
      previewUrl?: string;
      retryAfterSeconds?: number;
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setCooldownSeconds(responseData?.retryAfterSeconds ?? null);
      setFormError(responseData?.error ?? 'Не вдалося надіслати лист підтвердження.');
      return;
    }

    setPreviewUrl(responseData?.previewUrl ?? null);
    setSuccessMessage(responseData?.message ?? 'Лист підтвердження надіслано.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <p className="text-gray-400 text-sm text-center italic mb-4">
          Вкажіть email, і ми повторно надішлемо лист для підтвердження акаунта
        </p>
        <Input
          type="email"
          placeholder="Ваш E-mail"
          {...register('email')}
          error={errors.email?.message}
        />
        {formError && <p className="px-4 text-sm text-destructive">{formError}</p>}
        {successMessage && <p className="px-4 text-sm text-brand-success">{successMessage}</p>}
        {previewUrl && (
          <a
            href={previewUrl}
            className="block px-4 text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
          >
            Відкрити посилання для підтвердження email
          </a>
        )}
        {cooldownSeconds && (
          <p className="px-4 text-sm text-gray-400">
            Новий запит можна зробити приблизно через {cooldownSeconds} сек.
          </p>
        )}
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton
          type="submit"
          variant="accent"
          className="min-w-48 bg-brand-orange text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Надсилаємо...' : 'Надіслати лист'}
        </PawButton>
        <button
          type="button"
          onClick={() => {
            return onSwitch('login');
          }}
          className="cursor-pointer text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors"
        >
          Повернутися до входу
        </button>
      </div>
    </form>
  );
};
