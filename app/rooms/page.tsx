'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

import { PawButton } from '@/components/ui/PawButton';

import { ContactSection } from '../_components/ContactSection';

const ROOMS = [
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

function RoomCard({ room }: { room: (typeof ROOMS)[0] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300">
      <div className="relative h-[220px] w-full">
        <Image src={room.image} alt={room.title} fill className="object-cover" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4">{room.title}</h3>

        <div className="space-y-1.5 mb-6 text-sm flex-grow">
          <p className="opacity-80">Розміри (ШхГхВ) — {room.size} см</p>
          <p className="opacity-80">Площа — {room.area.toFixed(2).replace('.', ',')} м2</p>

          <div className="flex items-center gap-2">
            <span className="opacity-80">Оснащення номера</span>
            <div className="flex gap-1.5">
              {room.equipment.map((item) => {
                return (
                  <img
                    key={item}
                    src={`/amenities/${item}.svg`}
                    alt={item}
                    className="w-4 h-4 opacity-50"
                  />
                );
              })}
            </div>
          </div>

          <p className="pt-2 text-[16px]">
            Ціна за добу: <span className="font-bold">{room.price}₴</span>
          </p>
        </div>

        <PawButton variant="accent">Забронювати</PawButton>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 pt-32 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-4xl font-bold">Наші номери</h1>
          <div className="relative">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 text-sm shadow-sm hover:bg-gray-50 transition-colors">
              ↑ По площі <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-[250px] shrink-0 space-y-10">
            <div>
              <h4 className="font-bold mb-4">Ціна за добу, ₴</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="від 100"
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FAC663]"
                />
                <input
                  type="text"
                  placeholder="до 600"
                  className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FAC663]"
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Площа</h4>
              <div className="space-y-2">
                {['0,63 м2', '0,90 м2', '1,13 м2', '1,56 м2', '2,56 м2', '2,88 м2'].map((area) => {
                  return (
                    <label key={area} className="flex items-center gap-3 cursor-pointer text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#FAC663]" defaultChecked />
                      {area}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Оснащення номера</h4>
              <div className="space-y-2">
                {[
                  { label: 'Пустий номер', id: 'none' },
                  { label: 'Лежак', id: 'bed' },
                  { label: 'Кігтеточка', id: 'scratcher' },
                  { label: 'Ігровий комплекс', id: 'toy' },
                  { label: 'Будиночок', id: 'house' },
                ].map((item) => {
                  return (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer text-sm">
                      <input type="checkbox" className="w-4 h-4 accent-[#FAC663]" defaultChecked />
                      {item.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <button className="w-full py-3 border border-[#FAC663] rounded-md text-sm font-semibold hover:bg-[#FAC663] hover:text-white transition-all">
              Скинути фільтр
            </button>
          </aside>

          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.map((room) => {
              return <RoomCard key={room.id} room={room} />;
            })}
          </div>
        </div>
      </div>

      <ContactSection />
    </main>
  );
}
