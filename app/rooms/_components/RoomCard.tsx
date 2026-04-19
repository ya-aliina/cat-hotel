'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PawButton } from '@/components/ui/PawButton';

import type { Room } from '../_types/room';

interface RoomCardProps {
  imagePriority?: boolean;
  room: Room;
  onBook?: (room: Room) => void;
}

export function RoomCard({ imagePriority = false, room, onBook }: RoomCardProps) {
  const router = useRouter();

  const handleNavigateToDetails = () => {
    router.push(`/rooms/${room.slug}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigateToDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigateToDetails();
        }
      }}
      className="bg-white rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      <div className="relative h-50 w-full">
        {room.image ? (
          <Image
            src={room.image}
            alt={room.title}
            fill
            className="object-cover"
            loading={imagePriority ? 'eager' : 'lazy'}
            fetchPriority={imagePriority ? 'high' : 'auto'}
            sizes="(max-width: 768px) 100vw, 350px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-surface text-sm text-brand-text-soft">
            Фото відсутнє
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold mb-3">{room.title}</h3>
        <p className="text-sm text-brand-text-soft mb-4">{room.description}</p>

        <div className="space-y-2 text-sm mb-6 grow">
          <p>Розміри (Ш×Г×В): {room.size ? `${room.size} см` : 'Не вказано'}</p>
          <p>Площа: {room.area.toString().replace('.', ',')} м2</p>

          <div className="flex items-center gap-2">
            <span>Оснащення номера:</span>
            <div className="flex gap-1.5 items-center">
              {room.equipmentDetails.map((feature) => {
                return (
                  <div key={feature.id} className="relative w-5 h-5 opacity-50">
                    {feature.icon ? (
                      <Image
                        src={feature.icon}
                        alt={feature.label}
                        fill
                        className="object-contain"
                        sizes="20px"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-lg font-bold mt-4">Ціна за добу: {room.price}₴</p>
        </div>

        <div
          className="pt-8 flex justify-center"
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <PawButton
            variant="accent"
            className=""
            onClick={() => {
              if (onBook) onBook(room);
            }}
          >
            Забронювати
          </PawButton>
        </div>
      </div>
    </div>
  );
}
