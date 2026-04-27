'use client';

import { BookingStatus } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';

type Booking = {
  endDate: string;
  id: number;
  petNames: string[];
  roomTitles: string[];
  startDate: string;
  status: BookingStatus;
};

type BookingsResponse = {
  activeBookings?: Booking[];
  error?: string;
};

type CurrentBookingsSectionProps = {
  onOpenHistory?: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CurrentBookingsSection({ onOpenHistory }: CurrentBookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/account/bookings');
      const responseData = (await response.json().catch(() => {
        return null;
      })) as BookingsResponse | null;

      if (!isMounted) {
        return;
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(responseData?.error ?? 'Не вдалося завантажити бронювання.');
        return;
      }

      setBookings(responseData?.activeBookings ?? []);
      setIsLoading(false);
    };

    void loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasActiveBookings = useMemo(() => {
    return bookings.length > 0;
  }, [bookings]);

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.SUCCEEDED:
        return 'Підтверджене';
      case BookingStatus.PENDING:
        return 'Очікує підтвердження';
      case BookingStatus.CANCELLED:
        return 'Скасоване';
      default:
        return status;
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm('Ви дійсно хочете скасувати бронювання?');

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/account/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Не вдалося скасувати бронювання.');
        return;
      }

      setBookings((currentBookings) => {
        return currentBookings.filter((booking) => {
          return booking.id !== bookingId;
        });
      });
    } catch {
      setError('Не вдалося скасувати бронювання.');
    }
  };

  return (
    <section
      id="bookings"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Поточні бронювання</h2>

      {isLoading ? (
        <p className="mt-6 text-[16px] text-brand-text-subtle">Завантажуємо ваші бронювання...</p>
      ) : error ? (
        <p className="mt-6 text-[16px] text-destructive">{error}</p>
      ) : !hasActiveBookings ? (
        <div className="mt-6 space-y-2">
          <p className="text-[16px] text-brand-text-subtle">У вас поки немає активних бронювань.</p>
          <p className="text-[15px] text-brand-text-subtle">
            Перегляньте{' '}
            {onOpenHistory ? (
              <button
                type="button"
                onClick={onOpenHistory}
                className="font-medium text-brand-orange hover:text-brand-text"
              >
                історію бронювань
              </button>
            ) : (
              <a
                href="#bookings-history"
                className="font-medium text-brand-orange hover:text-brand-text"
              >
                історію бронювань
              </a>
            )}
            .
          </p>
        </div>
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
                    <h3 className="text-xl font-bold text-brand-text">
                      {booking.roomTitles.join(', ') || 'Номер'}
                    </h3>
                    <p className="mt-1 text-[15px] text-brand-text-subtle">
                      Улюбленці: {booking.petNames.join(', ') || 'Не вказано'}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-brand-yellow/30 px-3 py-1 text-[13px] font-semibold text-brand-text">
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-[15px] text-brand-text sm:grid-cols-2">
                  <p>
                    <span className="text-brand-text-subtle">Заїзд:</span>{' '}
                    {formatDate(booking.startDate)}
                  </p>
                  <p>
                    <span className="text-brand-text-subtle">Виїзд:</span>{' '}
                    {formatDate(booking.endDate)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    return handleCancelBooking(booking.id);
                  }}
                  className="mt-4 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                >
                  Скасувати бронювання
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
