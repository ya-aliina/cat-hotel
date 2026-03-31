'use client';

import { useMemo, useState } from 'react';

type BookingStatus = 'active' | 'cancelled';

type Booking = {
  id: string;
  roomTitle: string;
  petName: string;
  dateFrom: string;
  dateTo: string;
  status: BookingStatus;
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-101',
    roomTitle: 'Комфорт',
    petName: 'Мурчик',
    dateFrom: '2026-03-22',
    dateTo: '2026-03-27',
    status: 'active',
  },
  {
    id: 'b-102',
    roomTitle: 'Люкс',
    petName: 'Сімба',
    dateFrom: '2026-04-04',
    dateTo: '2026-04-09',
    status: 'active',
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CurrentBookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const hasActiveBookings = useMemo(() => {
    return bookings.some((booking) => {
      return booking.status === 'active';
    });
  }, [bookings]);

  const handleCancel = (id: string) => {
    setBookings((prev) => {
      return prev.map((booking) => {
        if (booking.id !== id) return booking;
        return { ...booking, status: 'cancelled' };
      });
    });
  };

  return (
    <section
      id="bookings"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Поточні бронювання</h2>

      {!hasActiveBookings ? (
        <p className="mt-6 text-[16px] text-brand-text-subtle">У вас немає активних бронювань.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => {
            return (
              <article
                key={booking.id}
                className="rounded-2xl border border-gray-100 bg-brand-surface-card p-5 md:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-brand-text">{booking.roomTitle}</h3>
                    <p className="mt-1 text-[15px] text-brand-text-subtle">
                      Улюбленець: {booking.petName}
                    </p>
                  </div>

                  <span
                    className={
                      booking.status === 'active'
                        ? 'inline-flex w-fit rounded-full bg-brand-yellow/30 px-3 py-1 text-[13px] font-semibold text-brand-text'
                        : 'inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-[13px] font-semibold text-brand-text-subtle'
                    }
                  >
                    {booking.status === 'active' ? 'Активне' : 'Скасовано'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-[15px] text-brand-text sm:grid-cols-2">
                  <p>
                    <span className="text-brand-text-subtle">Заїзд:</span>{' '}
                    {formatDate(booking.dateFrom)}
                  </p>
                  <p>
                    <span className="text-brand-text-subtle">Виїзд:</span>{' '}
                    {formatDate(booking.dateTo)}
                  </p>
                </div>

                {booking.status === 'active' && (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        handleCancel(booking.id);
                      }}
                      className="cursor-pointer rounded-full border border-brand-orange px-5 py-2.5 text-[15px] font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                    >
                      Скасувати бронь
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
