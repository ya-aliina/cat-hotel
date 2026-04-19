'use client';

import { MoveLeft, Ruler, Square } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ContactSection } from '@/app/_components/ContactSection';
import { BookingModal } from '@/components/shared/BookingPaymentModal';
import { PawButton } from '@/components/ui/PawButton';

import type { RoomFeature } from '../_types/room';
import { useRoomDetails } from './_ hooks/useRoomDetails';
import {
  FeatureItem,
  InfoItem,
  NotFoundState,
  RelatedRooms,
  RoomDetailsSkeleton,
  RoomGallery,
} from './_components';
import { formatArea } from './_utils/roomUtils';

export default function RoomDetailsPage() {
  const params = useParams<{ id: string }>();
  const {
    room,
    otherRooms,
    gallery,
    activeImage,
    bookingRooms,
    isLoading,
    error,
    isBookingOpen,
    bookingSuccess,
    setSelectedImage,
    setIsBookingOpen,
    closeBookingModal,
    handleBookingSubmit,
  } = useRoomDetails(params.id);

  if (isLoading) {
    return <RoomDetailsSkeleton />;
  }

  if (error) {
    return (
      <section className="min-h-[50vh] bg-brand-surface flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl font-bold text-brand-text">{error}</h1>
        </div>
      </section>
    );
  }

  if (!room) return <NotFoundState />;

  return (
    <>
      <section className="bg-brand-surface pb-12 pt-8 md:pt-10 space-y-5">
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

            <article className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-text">{room.title}</h1>
              <p className="mt-3 text-brand-text-soft">{room.description}</p>

              <div className="mt-6 space-y-3 text-brand-text">
                <InfoItem
                  icon={<Ruler size={18} />}
                  label={`Розміри (Ш×Г×В): ${room.size ? `${room.size} см` : 'Не вказано'}`}
                />
                <InfoItem
                  icon={<Square size={18} />}
                  label={`Площа: ${formatArea(room.area)} м2`}
                />

                <div className="pt-2">
                  <p className="text-lg font-semibold mb-2">Оснащення номера:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5">
                    {room.equipmentDetails.map((feature: RoomFeature) => {
                      return (
                        <FeatureItem
                          key={feature.id}
                          iconSrc={feature.icon}
                          label={feature.label}
                        />
                      );
                    })}
                  </ul>
                </div>

                {room.perfectFor.length > 0 ? (
                  <div className="mt-5 rounded-2xl border border-gray-100 bg-brand-surface p-5">
                    <p className="mb-4 text-lg font-bold leading-none text-brand-text">
                      Ідеально для:
                    </p>
                    <ul className="space-y-3 text-brand-text-muted md:text-[15px]">
                      {room.perfectFor.map((item) => {
                        return (
                          <li
                            key={`${room.id}-${item.imageUrl}-${item.description}`}
                            className="flex items-start gap-3"
                          >
                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                              <Image
                                src={item.imageUrl}
                                alt=""
                                width={20}
                                height={20}
                                unoptimized
                              />
                            </span>
                            <span className="leading-7 text-brand-text">{item.description}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col mt-8">
                <p className="text-2xl font-bold text-brand-text text-center">
                  Ціна за добу: {room.price}₴
                </p>
                <div className="mt-6 mx-auto">
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
        onOpenChange={(open) => {
          if (!open) {
            closeBookingModal();
          } else {
            setIsBookingOpen(open);
          }
        }}
        onSubmit={handleBookingSubmit}
        rooms={bookingRooms}
        initialRoomId={room.id}
        success={bookingSuccess}
        onSuccessClose={closeBookingModal}
      />
      <ContactSection />
    </>
  );
}
