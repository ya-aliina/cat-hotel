'use client';

import { useState } from 'react';

import { PawButton } from '@/components/ui/PawButton';

type NotificationSettings = {
  bookingUpdates: boolean;
  promo: boolean;
  reminders: boolean;
};

export function NotificationsSection() {
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    bookingUpdates: true,
    promo: false,
    reminders: true,
  });

  return (
    <section
      id="notifications"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Сповіщення</h2>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setNotificationSaved(true);
        }}
      >
        <label className="flex items-center gap-3 text-[16px] text-brand-text cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-brand-yellow rounded"
            checked={notifications.bookingUpdates}
            onChange={(event) => {
              setNotifications((prev) => {
                return { ...prev, bookingUpdates: event.target.checked };
              });
            }}
          />
          Сповіщення про статус бронювання
        </label>

        <label className="flex items-center gap-3 text-[16px] text-brand-text cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-brand-yellow rounded"
            checked={notifications.reminders}
            onChange={(event) => {
              setNotifications((prev) => {
                return { ...prev, reminders: event.target.checked };
              });
            }}
          />
          Нагадування перед заїздом
        </label>

        <label className="flex items-center gap-3 text-[16px] text-brand-text cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-brand-yellow rounded"
            checked={notifications.promo}
            onChange={(event) => {
              setNotifications((prev) => {
                return { ...prev, promo: event.target.checked };
              });
            }}
          />
          Акції та спеціальні пропозиції
        </label>

        <div className="flex items-center gap-4 pt-2">
          <PawButton type="submit" variant="accent" className="bg-brand-orange text-white">
            Зберегти налаштування
          </PawButton>
          {notificationSaved && (
            <p className="text-sm text-brand-success">Налаштування сповіщень збережено</p>
          )}
        </div>
      </form>
    </section>
  );
}
