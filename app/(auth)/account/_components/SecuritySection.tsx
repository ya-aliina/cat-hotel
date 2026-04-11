'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

type PasswordFormState = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
};

const emptyPasswordForm: PasswordFormState = {
  confirmPassword: '',
  currentPassword: '',
  newPassword: '',
};

export function SecuritySection() {
  const [formData, setFormData] = useState<PasswordFormState>(emptyPasswordForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  return (
    <section
      id="security"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Безпека</h2>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          setFormError(null);
          setIsSubmitting(true);
          setPasswordSaved(false);

          const response = await fetch('/api/account/password', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const responseData = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;

          if (!response.ok) {
            setIsSubmitting(false);
            setFormError(responseData?.error ?? 'Не вдалося оновити пароль.');
            return;
          }

          setFormData(emptyPasswordForm);
          setIsSubmitting(false);
          setPasswordSaved(true);
        }}
      >
        <Input
          type="password"
          placeholder="Поточний пароль"
          value={formData.currentPassword}
          onChange={(event) => {
            setFormData((current) => ({ ...current, currentPassword: event.target.value }));
          }}
        />
        <Input
          type="password"
          placeholder="Новий пароль"
          value={formData.newPassword}
          onChange={(event) => {
            setFormData((current) => ({ ...current, newPassword: event.target.value }));
          }}
        />
        <Input
          type="password"
          placeholder="Підтвердіть новий пароль"
          value={formData.confirmPassword}
          onChange={(event) => {
            setFormData((current) => ({ ...current, confirmPassword: event.target.value }));
          }}
        />

        <div className="flex items-center gap-4 pt-2">
          <PawButton
            type="submit"
            variant="accent"
            className="bg-brand-orange text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Оновлюємо...' : 'Оновити пароль'}
          </PawButton>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {passwordSaved && <p className="text-sm text-brand-success">Пароль успішно оновлено</p>}
        </div>
      </form>
    </section>
  );
}
