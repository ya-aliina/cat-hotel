'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PawButton } from '@/components/ui/PawButton';

export interface Room {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  size: string;
  area: number;
  equipment: string[];
  price: number;
  availableRooms: number;
}

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
}

export function RoomCard({ room, onBook }: RoomCardProps) {
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
        <Image
          src={room.image}
          alt={room.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 350px"
        />
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-xl font-bold mb-3">{room.title}</h3>
        <p className="text-sm text-brand-text-soft mb-4">{room.description}</p>

        <div className="space-y-2 text-sm mb-6 grow">
          <p>Розміри (Ш×Г×В): {room.size} см</p>
          <p>Площа: {room.area.toString().replace('.', ',')} м2</p>

          <div className="flex items-center gap-2">
            <span>Оснащення номера:</span>
            <div className="flex gap-1.5 items-center">
              {room.equipment.map((item) => {
                return (
                  <div key={item} className="relative w-5 h-5 opacity-50">
                    <Image
                      src={`/amenities/${item}.svg`}
                      alt={item}
                      fill
                      className="object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-lg font-bold mt-4">Ціна за добу: {room.price}₴</p>
          <p className="text-sm text-brand-text-subtle mt-1">
            Вільних номерів: {room.availableRooms}
          </p>
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
