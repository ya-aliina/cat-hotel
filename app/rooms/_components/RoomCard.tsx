'use client';

import Image from 'next/image';

import { PawButton } from '@/components/ui/PawButton';

export interface Room {
  id: string;
  title: string;
  image: string;
  size: string;
  area: number;
  equipment: string[];
  price: number;
}

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md">
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

        <div className="space-y-2 text-sm mb-6 grow">
          <p>Розміри (ШхГхВ) — {room.size} см</p>
          <p>Площа — {room.area.toString().replace('.', ',')} м2</p>

          <div className="flex items-center gap-2">
            <span>Оснащення номера — </span>
            <div className="flex gap-1.5 items-center">
              {room.equipment.map((item: string) => {
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
        </div>

        <PawButton variant="accent" className="w-full bg-brand-orange text-white">
          Забронювати
        </PawButton>
      </div>
    </div>
  );
}
