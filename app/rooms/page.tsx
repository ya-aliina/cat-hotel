'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { useCallback, useState } from 'react';

import { BookingModal } from '@/components/shared/BookingModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { ContactSection } from '../_components/ContactSection';
import { type FiltersConfig, FiltersPanel } from './_components/FiltersPanel';
import { RoomCard } from './_components/RoomCard';
import { AMENITIES, AREAS } from './_data/rooms';
import { type SortOption, useRoomFilters } from './_hooks/useRoomFilters';

const SORT_LABELS: Record<SortOption, string> = {
  'area-asc': '↑ По площі',
  'area-desc': '↓ По площі',
  'price-asc': '↑ По ціні',
  'price-desc': '↓ По ціні',
};

const FILTERS_CONFIG: FiltersConfig = {
  areas: AREAS,
  amenities: AMENITIES,
};

// --- Головний UI компонент ---

export default function RoomsPage() {
  const {
    sort,
    setSort,
    draftFilters,
    setDraftFilters,
    handleApply,
    handleReset,
    sortedAndFilteredRooms,
  } = useRoomFilters();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const openBookingModal = () => {
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

  const handleBookingSubmit = useCallback(() => {
    setBookingSuccess(true);
  }, []);

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-4xl font-bold text-brand-text">Наші номери</h1>

          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Мобільний фільтр */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger
                  nativeButton={false}
                  render={(props) => {
                    return (
                      <div
                        {...props}
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-center gap-2 bg-white h-12 px-6 rounded-full border border-gray-100 text-[16px] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-brand-text"
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
                      config={FILTERS_CONFIG}
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
          <aside className="hidden md:block w-64 shrink-0">
            <FiltersPanel
              config={FILTERS_CONFIG}
              draftFilters={draftFilters}
              onDraftFiltersChange={setDraftFilters}
              onApply={handleApply}
              onReset={handleReset}
            />
          </aside>

          {/* Сітка кімнат */}
          {sortedAndFilteredRooms.length === 0 ? (
            <div className="grow flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-text">
                  За вашим запитом нічого не знайдено
                </p>
                <p className="mt-2 text-sm text-brand-text-subtle">Спробуйте змінити фільтри</p>
              </div>
            </div>
          ) : (
            <div className="grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {sortedAndFilteredRooms.map((room) => {
                return (
                  <div key={room.id} className="h-full  md:max-w-90 w-full">
                    <RoomCard room={room} onBook={openBookingModal} />
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
        success={bookingSuccess}
        onSuccessClose={handleSuccessClose}
      />

      <ContactSection />
    </main>
  );
}
