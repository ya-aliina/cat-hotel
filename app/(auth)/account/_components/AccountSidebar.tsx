 'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';

export type AccountSidebarSection =
  | 'bookings'
  | 'history'
  | 'pets'
  | 'profile'
  | 'security';

type AccountSidebarProps = {
  activeSection: AccountSidebarSection;
  onSelectSection: (section: AccountSidebarSection) => void;
  showSecurity: boolean;
};

export function AccountSidebar({
  activeSection,
  onSelectSection,
  showSecurity,
}: AccountSidebarProps) {
  const { data: session } = useSession();
  const fullName = [session?.user?.name, session?.user?.surname].filter(Boolean).join(' ');
  const avatarSrc = session?.user?.image;
  const email = session?.user?.email ?? '';
  const phone = session?.user?.phone?.trim() ?? '';
  const navItems: Array<{ id: AccountSidebarSection; label: string }> = [
    { id: 'bookings', label: 'Поточні бронювання' },
    { id: 'history', label: 'Історія бронювань' },
    { id: 'pets', label: 'Мої улюбленці' },
    { id: 'profile', label: 'Профіль' },
    ...(showSecurity ? [{ id: 'security' as const, label: 'Безпека' }] : []),
  ];

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
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSection(item.id);
              }}
              className={
                isActive
                  ? 'block w-full rounded-full bg-brand-yellow/30 px-4 py-2 text-left font-semibold text-brand-text'
                  : 'block w-full rounded-full px-4 py-2 text-left transition-colors hover:bg-brand-surface hover:text-brand-orange'
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
