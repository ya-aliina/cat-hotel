'use client';

import { ChevronDown, Filter } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { type BookingFormState, BookingModal } from '@/components/shared/BookingModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { ContactSection } from '../_components/ContactSection';
import { type FiltersConfig, FiltersPanel, type FiltersState } from './_components/FiltersPanel';
import { type Room, RoomCard } from './_components/RoomCard';

// --- Строго типізовані константи ---

export const ROOMS: Room[] = [
  {
    id: '1',
    title: 'Економ',
    image: '/rooms/economy.jpg',
    size: '90x70x180',
    area: 0.63,
    equipment: ['none'],
    price: 100,
  },
  {
    id: '2',
    title: 'Економ плюс',
    image: '/rooms/economy-plus.jpg',
    size: '90x100x180',
    area: 0.9,
    equipment: ['bed', 'scratcher'],
    price: 200,
  },
  {
    id: '3',
    title: 'Комфорт',
    image: '/rooms/comfort.jpg',
    size: '100x125x180',
    area: 1.13,
    equipment: ['bed', 'scratcher', 'toy'],
    price: 250,
  },
  {
    id: '4',
    title: 'Сьют',
    image: '/rooms/suite.jpg',
    size: '125x125x180',
    area: 1.56,
    equipment: ['bed', 'scratcher', 'toy'],
    price: 350,
  },
  {
    id: '5',
    title: 'Люкс',
    image: '/rooms/lux.jpg',
    size: '160x160x180',
    area: 2.56,
    equipment: ['bed', 'scratcher', 'toy', 'house'],
    price: 500,
  },
  {
    id: '6',
    title: 'Супер-Люкс',
    image: '/rooms/super-lux.jpg',
    size: '180x160x180',
    area: 2.88,
    equipment: ['bed', 'scratcher', 'toy', 'house'],
    price: 600,
  },
];

export const AMENITIES = [
  { label: 'Пустий номер', id: 'none' },
  { label: 'Лежак', id: 'bed' },
  { label: 'Кігтеточка', id: 'scratcher' },
  { label: 'Ігровий комплекс', id: 'toy' },
  { label: 'Будиночок', id: 'house' },
] as const;

export const AREAS = ['0,63 м2', '0,90 м2', '1,13 м2', '1,56 м2', '2,56 м2', '2,88 м2'] as const;

type SortOption = 'area-asc' | 'area-desc' | 'price-asc' | 'price-desc';

const DEFAULT_FILTERS: FiltersState = {
  priceMin: '',
  priceMax: '',
  areas: [],
  amenities: [],
};

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

// --- Хук бізнес-логіки ---

function useRoomFilters() {
  const [sort, setSort] = useState<SortOption>('area-asc');
  const [draftFilters, setDraftFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const handleApply = useCallback(() => {
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  const handleReset = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  const sortedAndFilteredRooms = useMemo(() => {
    const filteredRooms = ROOMS.filter((room, index) => {
      const min = Number(appliedFilters.priceMin);
      const max = Number(appliedFilters.priceMax);

      if (!Number.isNaN(min) && appliedFilters.priceMin.trim() !== '' && room.price < min)
        return false;
      if (!Number.isNaN(max) && appliedFilters.priceMax.trim() !== '' && room.price > max)
        return false;
      if (appliedFilters.areas.length > 0 && !appliedFilters.areas.includes(index)) return false;

      if (appliedFilters.amenities.length > 0) {
        if (
          !appliedFilters.amenities.every((amenityId) => {
            return room.equipment.includes(amenityId);
          })
        ) {
          return false;
        }
      }

      return true;
    });

    return filteredRooms.sort((a, b) => {
      switch (sort) {
        case 'area-asc':
          return a.area - b.area;
        case 'area-desc':
          return b.area - a.area;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [appliedFilters, sort]);

  return {
    sort,
    setSort,
    draftFilters,
    setDraftFilters,
    handleApply,
    handleReset,
    sortedAndFilteredRooms,
  };
}

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

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    name: '',
    pet: '',
    phone: '',
    email: '',
    dateFrom: '',
    dateTo: '',
  });

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setBookingSuccess(false);
    setBookingForm({
      name: '',
      pet: '',
      phone: '',
      email: '',
      dateFrom: '',
      dateTo: '',
    });
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
    setSelectedRoom(null);
  };

  const handleSuccessClose = () => {
    closeBookingModal();
  };

  const handleBookingChange = (field: keyof typeof bookingForm, value: string) => {
    setBookingForm((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const handleBookingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-4xl font-bold text-[#1A202C]">Наші номери</h1>

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
                        className="flex items-center justify-center gap-2 bg-white h-12 px-6 rounded-full border border-gray-100 text-[16px] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-[#1A202C]"
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
                    <SheetTitle className="text-2xl font-bold text-[#1A202C]">Параметри</SheetTitle>
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
              <DropdownMenuTrigger className="flex items-center justify-center gap-2 bg-white h-12 px-6 rounded-full border border-gray-100 text-[16px] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-[#1A202C] focus:outline-none">
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
          <div className="grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {sortedAndFilteredRooms.map((room) => {
              return (
                <div key={room.id} className="h-full  md:max-w-90 w-full">
                  <RoomCard room={room} onBook={openBookingModal} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        bookingForm={bookingForm}
        onBookingChange={handleBookingChange}
        onSubmit={handleBookingSubmit}
        success={bookingSuccess}
        onSuccessClose={handleSuccessClose}
      />

      <ContactSection />
    </main>
  );
}
