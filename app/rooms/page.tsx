'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { type BookingCartSubmission, BookingModal } from '@/components/shared/BookingPaymentModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Api } from '@/services/api-clients';

import { ContactSection } from '../_components/ContactSection';
import { FiltersPanel } from './_components/FiltersPanel';
import { RoomCard } from './_components/RoomCard';
import { RoomCardSkeleton } from './_components/RoomCardSkeleton';
import { type SortOption, useRoomFilters } from './_hooks/useRoomFilters';

const SORT_LABELS: Record<SortOption, string> = {
  'area-asc': '↑ По площі',
  'area-desc': '↓ По площі',
  'price-asc': '↑ По ціні',
  'price-desc': '↓ По ціні',
};

type PaymentNoticeTone = 'info' | 'success' | 'warning';

type PaymentNotice = {
  description: string;
  title: string;
  tone: PaymentNoticeTone;
};

const paymentNoticeStyles: Record<PaymentNoticeTone, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};

export default function RoomsPage() {
  const router = useRouter();
  const {
    sort,
    setSort,
    draftFilters,
    setDraftFilters,
    handleApply,
    handleReset,
    sortedAndFilteredRooms,
    bookingRooms,
    isLoading,
    error,
  } = useRoomFilters();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [initialRoomId, setInitialRoomId] = useState<string>();
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const paymentParam = queryParams.get('payment');
    const bookingIdParam = queryParams.get('bookingId');

    if (!paymentParam || !bookingIdParam) {
      return;
    }

    if (paymentParam !== 'success' && paymentParam !== 'cancelled') {
      return;
    }

    const bookingId = Number(bookingIdParam);

    let cancelled = false;

    async function resolveBookingStatus() {
      if (!Number.isInteger(bookingId) || bookingId <= 0) {
        setPaymentNotice({
          description: 'Не вдалося визначити номер бронювання у відповіді платіжної системи.',
          title: 'Некоректні параметри оплати',
          tone: 'warning',
        });

        return;
      }

      try {
        const booking = await Api.bookings.getById(bookingId);

        if (cancelled) {
          return;
        }

        if (paymentParam === 'cancelled') {
          setPaymentNotice({
            description: `Бронювання #${bookingId} залишилося зі статусом ${booking.status}. Ви можете повторити оплату пізніше.`,
            title: 'Оплату скасовано',
            tone: 'warning',
          });

          return;
        }

        if (booking.status === 'SUCCEEDED') {
          setPaymentNotice({
            description: `Бронювання #${bookingId} успішно оплачене. Дякуємо!`,
            title: 'Оплату підтверджено',
            tone: 'success',
          });

          return;
        }

        if (booking.status === 'PENDING') {
          setPaymentNotice({
            description:
              'Платіж отримано, але підтвердження ще обробляється. Оновіть сторінку за кілька секунд.',
            title: `Бронювання #${bookingId} очікує підтвердження`,
            tone: 'info',
          });

          return;
        }

        setPaymentNotice({
          description: `Бронювання #${bookingId} має статус ${booking.status}. За потреби зверніться до адміністратора.`,
          title: 'Статус оплати змінено',
          tone: 'warning',
        });
      } catch {
        if (cancelled) {
          return;
        }

        setPaymentNotice({
          description: `Не вдалося завантажити статус бронювання #${bookingId}. Спробуйте оновити сторінку.`,
          title: 'Помилка перевірки оплати',
          tone: 'warning',
        });
      }
    }

    resolveBookingStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearPaymentNotice = useCallback(() => {
    setPaymentNotice(null);
    router.replace('/rooms', { scroll: false });
  }, [router]);

  const openBookingModal = (roomId?: string) => {
    setInitialRoomId(roomId);
    setBookingSuccess(false);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
  };

  const handleSuccessClose = () => {
    closeBookingModal();
  };

  const handleBookingSubmit = useCallback(async (data: BookingCartSubmission) => {
    try {
      const response = await Api.bookings.createCheckout({
        bookingItems: data.bookingItems.map((item) => {
          const catIds = item.pets
            .map((pet) => {
              return pet.catId;
            })
            .filter((catId): catId is number => {
              return typeof catId === 'number';
            });
          const petNames = item.pets
            .map((pet) => {
              return pet.petName;
            })
            .filter((petName): petName is string => {
              return typeof petName === 'string' && petName.trim().length > 0;
            });

          return {
            ...(catIds.length > 0 ? { catIds } : {}),
            ...(petNames.length > 0 ? { petNames } : {}),
            roomId: item.roomId,
            serviceIds: item.services.map((service) => {
              return service.serviceId;
            }),
          };
        }),
        customer: data.customer,
        endDate: data.endDate,
        startDate: data.startDate,
      });

      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }

      setBookingSuccess(true);

      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const message =
        typeof axiosError?.response?.data?.error === 'string'
          ? axiosError.response.data.error
          : error instanceof Error
            ? error.message
            : 'Не вдалося створити бронювання. Спробуйте ще раз.';
      toast.error(message);
    }
  }, []);

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {paymentNotice ? (
          <div
            className={`mb-8 rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${paymentNoticeStyles[paymentNotice.tone]}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-bold">{paymentNotice.title}</p>
                <p className="mt-1 text-sm opacity-90">{paymentNotice.description}</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-current px-5 text-sm font-semibold"
                onClick={clearPaymentNotice}
              >
                Закрити
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-4xl font-bold text-brand-text">Наші номери</h1>

          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Мобільний фільтр */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  nativeButton={false}
                  render={(props) => {
                    return (
                      <div
                        {...props}
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-center mr-4 gap-2 bg-white h-12 px-6 rounded-full border border-gray-100 text-[16px] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-brand-text"
                      >
                        <Filter size={18} className="text-brand-orange" />
                        <span>Фільтри</span>
                      </div>
                    );
                  }}
                />
                <SheetContent
                  side="left"
                  className="w-[92%] sm:max-w-105 p-8 overflow-y-auto border-none shadow-2xl"
                >
                  <SheetHeader className="text-left mb-10">
                    <SheetTitle className="text-2xl font-bold text-brand-text">
                      Параметри
                    </SheetTitle>
                  </SheetHeader>
                  <div className="pb-10">
                    <FiltersPanel
                      draftFilters={draftFilters}
                      onDraftFiltersChange={setDraftFilters}
                      onApply={handleApply}
                      onReset={handleReset}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Дропдаун сортування */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center gap-2 bg-white h-12 px-6 rounded-full border border-gray-100 text-[16px] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-brand-text focus:outline-none">
                <span>{SORT_LABELS[sort]}</span>
                <ChevronDown size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-2"
              >
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => {
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => {
                        return setSort(key);
                      }}
                      className="cursor-pointer text-[15px] hover:bg-gray-50 rounded-lg"
                    >
                      {label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Десктопний сайдбар */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersPanel
              draftFilters={draftFilters}
              onDraftFiltersChange={setDraftFilters}
              onApply={handleApply}
              onReset={handleReset}
            />
          </aside>

          {/* Сітка кімнат */}
          {isLoading ? (
            <div className="grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
              {' '}
              {Array.from({ length: 6 }).map((_, index) => {
                return (
                  <div key={index} className="h-full md:max-w-90 w-full">
                    <RoomCardSkeleton />
                  </div>
                );
              })}
            </div>
          ) : error ? (
            <div className="grow flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-text">{error}</p>
              </div>
            </div>
          ) : sortedAndFilteredRooms.length === 0 ? (
            <div className="grow flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-text">
                  За вашим запитом нічого не знайдено
                </p>
                <p className="mt-2 text-sm text-brand-text-subtle">Спробуйте змінити фільтри</p>
              </div>
            </div>
          ) : (
            <div className="grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
              {' '}
              {sortedAndFilteredRooms.map((room, index) => {
                return (
                  <div key={room.id} className="h-full w-full">
                    <RoomCard
                      imagePriority={index < 3}
                      room={room}
                      onBook={(selectedRoom) => {
                        openBookingModal(selectedRoom.id);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        open={isBookingOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeBookingModal();
          } else {
            setIsBookingOpen(open);
          }
        }}
        onSubmit={handleBookingSubmit}
        rooms={bookingRooms}
        initialRoomId={initialRoomId}
        success={bookingSuccess}
        onSuccessClose={handleSuccessClose}
      />

      <ContactSection />
    </main>
  );
}
