'use client';

import { Clock3, MoveLeft, Ruler, ShieldCheck, Square } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ContactSection } from '@/app/_components/ContactSection';
import { BookingModal } from '@/components/shared/BookingModal';
import { PawButton } from '@/components/ui/PawButton';

import { AMENITIES } from '../_data/rooms';
import { useRoomDetails } from './_ hooks/useRoomDetails';
import { AmenityItem, InfoItem, NotFoundState, RelatedRooms, RoomGallery } from './_components';
import { formatArea, formatRoomCode } from './_utils/roomUtils';

const amenityLabelById = AMENITIES.reduce<Record<string, string>>((acc, amenity) => {
  acc[amenity.id] = amenity.label;

  return acc;
}, {});

export default function RoomDetailsPage() {
  const params = useParams<{ id: string }>();
  const {
    room,
    otherRooms,
    gallery,
    activeImage,
    isBookingOpen,
    bookingSuccess,
    setSelectedImage,
    setIsBookingOpen,
    closeBookingModal,
    handleBookingSubmit,
  } = useRoomDetails(params.id);

  if (!room) return <NotFoundState />;

  return (
    <>
      <section className="bg-brand-surface pb-12 pt-8 md:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-brand-text hover:text-brand-orange transition-colors"
          >
            <MoveLeft size={18} />
            До всіх номерів
          </Link>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <RoomGallery
              images={gallery}
              activeImage={activeImage}
              onSelect={setSelectedImage}
              title={room.title}
            />

            <article className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-text">{room.title}</h1>
              <p className="mt-3 text-brand-text-soft">{room.description}</p>

              <div className="mt-6 space-y-3 text-brand-text">
                <InfoItem icon={<Ruler size={18} />} label={`Розміри (Ш×Г×В): ${room.size} см`} />
                <InfoItem
                  icon={<Square size={18} />}
                  label={`Площа: ${formatArea(room.area)} м2`}
                />

                <div className="pt-2">
                  <p className="font-semibold mb-2">Оснащення номера:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5">
                    {room.equipment.map((id) => {
                      return <AmenityItem key={id} id={id} label={amenityLabelById[id] || id} />;
                    })}
                  </ul>
                </div>

                <div className="mt-2 rounded-2xl border border-gray-100 bg-brand-surface p-4">
                  <p className="font-semibold mb-3">Додаткова інформація:</p>
                  <ul className="space-y-2 text-sm text-brand-text-muted">
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-brand-orange" />
                      Код номера: {formatRoomCode(room.slug)}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock3 size={16} className="text-brand-orange" />
                      Заїзд з 12:00, виїзд до 12:00
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-brand-orange" />
                      Щоденний фотозвіт та базовий догляд включено
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-gray-50">
                <p className="text-2xl font-bold text-brand-text">Ціна за добу: {room.price}₴</p>
                <p className="mt-2 text-sm text-brand-text-soft">
                  Вільних номерів: {room.availableRooms}
                </p>
                <div className="mt-6">
                  <PawButton
                    variant="accent"
                    onClick={() => {
                      setIsBookingOpen(true);
                    }}
                    className="w-full md:w-auto"
                  >
                    Забронювати
                  </PawButton>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {otherRooms.length > 0 && <RelatedRooms rooms={otherRooms} />}

      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        onSubmit={handleBookingSubmit}
        success={bookingSuccess}
        onSuccessClose={closeBookingModal}
      />
      <ContactSection />
    </>
  );
}
