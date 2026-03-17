'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

export function ProfileSection() {
  const [profileSaved, setProfileSaved] = useState(false);

  return (
    <section
      id="profile"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-[#1A202C]">Профіль</h2>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setProfileSaved(true);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input type="text" placeholder="Ім'я" defaultValue="Марія" />
          <Input type="text" placeholder="Прізвище" defaultValue="Котенко" />
        </div>

        <Input type="email" placeholder="E-mail" defaultValue="maria@example.com" />
        <Input type="tel" placeholder="Телефон" defaultValue="+380501234567" />

        <div className="flex items-center gap-4 pt-2">
          <PawButton type="submit" variant="accent" className="bg-brand-orange text-white">
            Зберегти зміни
          </PawButton>
          {profileSaved && <p className="text-sm text-[#16A34A]">Дані профілю оновлено</p>}
        </div>
      </form>
    </section>
  );
}
