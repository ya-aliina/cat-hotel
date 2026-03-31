'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

export function SecuritySection() {
  const [passwordSaved, setPasswordSaved] = useState(false);

  return (
    <section
      id="security"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Безпека</h2>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPasswordSaved(true);
        }}
      >
        <Input type="password" placeholder="Поточний пароль" />
        <Input type="password" placeholder="Новий пароль" />
        <Input type="password" placeholder="Підтвердіть новий пароль" />

        <div className="flex items-center gap-4 pt-2">
          <PawButton type="submit" variant="accent" className="bg-brand-orange text-white">
            Оновити пароль
          </PawButton>
          {passwordSaved && <p className="text-sm text-brand-success">Пароль успішно оновлено</p>}
        </div>
      </form>
    </section>
  );
}
