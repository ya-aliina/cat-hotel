import Image from 'next/image';

export function AccountSidebar() {
  return (
    <aside className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full bg-brand-yellow/30 overflow-hidden">
          <Image src="/paw.svg" alt="Avatar" fill className="object-contain p-3" />
        </div>

        <div>
          <p className="text-[20px] font-bold text-brand-text">Марія Котенко</p>
          <p className="text-[14px] text-brand-text-subtle">maria@example.com</p>
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
