'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

type ProfileFormState = {
  email: string;
  name: string;
  phone: string;
  surname: string;
};

const emptyProfileForm: ProfileFormState = {
  email: '',
  name: '',
  phone: '',
  surname: '',
};

export function ProfileSection() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [formData, setFormData] = useState<ProfileFormState>(emptyProfileForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    setFormData({
      email: session.user.email ?? '',
      name: session.user.name ?? '',
      phone: session.user.phone ?? '',
      surname: session.user.surname ?? '',
    });
  }, [session?.user?.email, session?.user?.name, session?.user?.phone, session?.user?.surname]);

  const avatarSrc = session?.user?.image;
  const fullName = [formData.name, formData.surname].filter(Boolean).join(' ');

  return (
    <section
      id="profile"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Профіль</h2>

      <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-brand-surface px-5 py-4">
        <div className="relative h-18 w-18 overflow-hidden rounded-full bg-brand-yellow/30">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={fullName || 'Avatar'} fill className="object-cover" sizes="72px" />
          ) : (
            <Image src="/paw.svg" alt="Avatar" fill className="object-contain p-3" sizes="72px" />
          )}
        </div>

        <div>
          <p className="text-lg font-semibold text-brand-text">{fullName || 'Ваш профіль'}</p>
          <p className="text-sm text-brand-text-subtle">
            {session?.user?.image ? 'Фото підтягнуто з акаунта Google.' : 'Фото профілю поки відсутнє.'}
          </p>
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!session?.user?.id) {
            setFormError('Не вдалося визначити користувача для оновлення профілю.');
            return;
          }

          setFormError(null);
          setIsSubmitting(true);
          setProfileSaved(false);

          const payload = {
            email: formData.email.trim(),
            name: formData.name.trim(),
            phone: formData.phone.trim() || null,
            surname: formData.surname.trim(),
          };

          const response = await fetch(`/api/users/${session.user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const responseData = (await response.json().catch(() => null)) as { error?: string } | null;

            setIsSubmitting(false);
            setFormError(responseData?.error ?? 'Не вдалося оновити дані профілю.');
            return;
          }

          await update({
            email: payload.email,
            image: session.user.image ?? null,
            name: payload.name,
            phone: payload.phone,
            surname: payload.surname,
          });

          setIsSubmitting(false);
          setProfileSaved(true);
          router.refresh();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Ім'я"
            value={formData.name}
            onChange={(event) => {
              setFormData((current) => ({ ...current, name: event.target.value }));
            }}
          />
          <Input
            type="text"
            placeholder="Прізвище"
            value={formData.surname}
            onChange={(event) => {
              setFormData((current) => ({ ...current, surname: event.target.value }));
            }}
          />
        </div>

        <Input
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={(event) => {
            setFormData((current) => ({ ...current, email: event.target.value }));
          }}
        />
        <Input
          type="tel"
          placeholder="Телефон"
          value={formData.phone}
          onChange={(event) => {
            setFormData((current) => ({ ...current, phone: event.target.value }));
          }}
        />

        <div className="flex items-center gap-4 pt-2">
          <PawButton
            type="submit"
            variant="accent"
            className="bg-brand-orange text-white"
            disabled={isSubmitting || status === 'loading'}
          >
            {isSubmitting ? 'Зберігаємо...' : 'Зберегти зміни'}
          </PawButton>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {profileSaved && <p className="text-sm text-brand-success">Дані профілю оновлено</p>}
        </div>
      </form>
    </section>
  );
}
