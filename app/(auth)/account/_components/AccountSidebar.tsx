 'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';

export function AccountSidebar() {
  const { data: session } = useSession();
  const fullName = [session?.user?.name, session?.user?.surname].filter(Boolean).join(' ');
  const avatarSrc = session?.user?.image;
  const email = session?.user?.email ?? '';
  const phone = session?.user?.phone?.trim() ?? '';

  return (
    <aside className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full bg-brand-yellow/30 overflow-hidden">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={fullName || 'Avatar'} fill className="object-cover" sizes="64px" />
          ) : (
            <Image src="/paw.svg" alt="Avatar" fill className="object-contain p-3" sizes="64px" />
          )}
        </div>

        <div>
          <p className="text-[20px] font-bold text-brand-text">{fullName || 'Користувач'}</p>
          <p className="text-[14px] text-brand-text-subtle">{email || 'Email не вказано'}</p>
          {phone && <p className="text-[14px] text-brand-text-subtle">{phone}</p>}
        </div>
      </div>

      <div className="mt-8 space-y-2 text-[15px] text-brand-text">
        <p className="font-semibold">Швидка навігація</p>
        <a href="#bookings" className="block hover:text-brand-orange transition-colors">
          Поточні бронювання
        </a>
        <a href="#profile" className="block hover:text-brand-orange transition-colors">
          Профіль
        </a>
        <a href="#security" className="block hover:text-brand-orange transition-colors">
          Безпека
        </a>
        <a href="#notifications" className="block hover:text-brand-orange transition-colors">
          Сповіщення
        </a>
      </div>
    </aside>
  );
}
