'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PawButton } from '@/components/ui/PawButton';
import { cn } from '@/lib/utils';

export type Room = {
  title: string;
  image: string;
  features: string[];
};

const ROOMS: Room[] = [
  {
    title: 'Економ плюс',
    image: '/room1.jpg',
    features: ['Площа — 0,90 м²', 'Розміри (ШхГхВ) — 90х100х180 см', 'Ціна за добу: 200₽'],
  },
  {
    title: 'Комфорт',
    image: '/room2.jpg',
    features: ['Площа — 1,50 м²', 'Розміри (ШхГхВ) — 120x100x180 см', 'Ціна за добу: 500₽'],
  },
  {
    title: 'Люкс',
    image: '/room3.jpg',
    features: ['Площа — 2,50 м²', 'Розміри (ШхГхВ) — 150x120x180 см', 'Ціна за добу: 800₽'],
  },
];

const RoomCard = React.memo(({ room, isPriority }: { room: Room; isPriority: boolean }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <div className="relative w-full max-w-[600px] h-[300px] md:h-[404px] rounded-[10px] overflow-hidden shadow-sm z-0 shrink-0">
        <Image
          src={room.image}
          alt={`Фото номеру ${room.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
          priority={isPriority}
        />
      </div>

      <div className="relative z-10 bg-white p-6 md:p-10 rounded-[8px] border border-gray-50 mt-[-60px] md:mt-0 md:-ml-[100px] w-[95%] md:w-[500px] md:h-[284px] flex flex-col justify-center">
        <div className="md:max-w-[283px]">
          <h3 className="text-xl md:text-2xl font-bold text-[#1A202C] mb-4">{room.title}</h3>

          <ul className="space-y-2 mb-6">
            {room.features.map((feature) => {
              return (
                <li key={feature} className="flex items-center gap-3 text-gray-600 text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#FAC663] shrink-0" />
                  {feature}
                </li>
              );
            })}
          </ul>

          <PawButton variant="accent" className="bg-[#FF7236] text-white py-2 shadow-lg">
            Забронювати
          </PawButton>
        </div>
      </div>
    </div>
  );
});

RoomCard.displayName = 'RoomCard';

const Dots = React.memo(
  ({
    count,
    current,
    onDotClick,
  }: {
    count: number;
    current: number;
    onDotClick: (index: number) => void;
  }) => {
    return (
      <div className="flex justify-center gap-3 absolute left-1/2 -translate-x-1/2">
        {Array.from({ length: count }).map((_, i) => {
          return (
            <button
              key={i}
              onClick={() => {
                return onDotClick(i);
              }}
              className={cn(
                'h-3 w-3 rounded-full transition-all duration-300',
                current === i ? 'bg-[#FAC663]' : 'bg-[#D9D9D9]',
              )}
              aria-label={`Перейти до слайду ${i + 1}`}
              aria-current={current === i}
            />
          );
        })}
      </div>
    );
  },
);

Dots.displayName = 'Dots';

export function RoomsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const carouselOpts = useMemo(() => {
    return {
      align: 'start' as const,
      loop: true,
    };
  }, []);

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section className="w-full relative overflow-hidden py-10 md:pt-20">
      <div className="max-w-[1000px] mx-auto px-4 relative z-0">
        <div className="absolute top-[30px] -left-0 md:top-0 md:-left-[260px] z-[-1] w-[350px] md:w-[500px] pointer-events-none opacity-30">
          <svg
            viewBox="0 0 483 151"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M369.831 52.0516C379.073 63.084 377.014 91.5917 366.639 99.4824C360.869 83.1801 362.896 67.7079 369.831 52.0516ZM328.211 117.213C319.711 99.2421 323.462 47.9706 330.414 34.8633C344.093 53.0594 343.063 96.5651 328.211 117.213ZM90.0075 43.8584C101.532 43.8334 109.64 52.1171 109.648 63.9077C109.656 75.5205 101.165 84.2347 89.9676 84.0974C78.7465 83.9695 70.7896 75.6952 70.7178 64.1136C70.6379 52.1015 78.4753 43.8834 90.0075 43.8584ZM284.58 19.65C307.461 50.4073 302.593 109.338 281.555 131.509C282.569 94.25 283.558 57.5397 284.58 19.65ZM153.112 12.2275C180.989 52.6195 173.271 111.669 150.159 136.358C156.168 94.3218 154.676 53.2996 153.112 12.2275ZM233.343 138.451C240.869 96.2001 241.316 54.3698 241.212 11.2541C264.005 43.0753 261.834 110.87 233.343 138.451ZM193.112 139.64C197.046 96.5651 204.181 53.5461 196.041 10.1745C224.724 42.108 220.829 102.74 193.112 139.64ZM449.216 78.1319C462.464 69.9918 472.496 59.4242 479.192 45.9738C488.011 28.2177 481.267 16.8139 461.499 15.073C450.916 14.137 441.044 16.5019 432.193 21.8934C424.061 26.8386 416.575 32.8603 408.857 38.4826C406.798 39.9833 404.955 41.7648 402.967 43.3779C394.971 49.8177 386.631 50.7037 377.142 46.2452C359.863 38.13 342.64 29.6966 324.779 23.0446C287.014 8.98583 247.637 2.25902 207.421 0.415076C146.456 -2.39645 88.1638 9.11994 32.4018 33.5935C23.599 37.4592 15.6023 43.2188 7.37408 48.3388C5.39482 49.5618 3.81464 51.5586 2.38606 53.4431C-2.41042 59.7051 -2.22696 66.1666 3.67887 71.3896C48.8264 111.376 98.8742 141.743 160.247 148.554C219.736 155.144 277.693 148.788 333.055 124.97C348.235 118.452 362.8 110.465 377.62 103.098C382.329 100.758 387.014 98.356 391.571 95.7508C394.34 94.1627 395.585 95.0082 397.213 97.526C401.722 104.465 406.104 111.591 411.451 117.853C422.066 130.28 435.713 135.041 451.834 131.294C463.246 128.651 468.29 120.798 466.399 109.307C464.364 97.0144 457.748 87.1956 449.216 78.1319Z"
              fill="#FAB751"
              fillOpacity={0.5}
            />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A202C] mb-16 relative z-10">
          Номери
        </h2>

        <div className="relative z-10">
          <Carousel setApi={setApi} opts={carouselOpts} className="w-full">
            <CarouselContent>
              {ROOMS.map((room, index) => {
                return (
                  <CarouselItem key={room.title} className="basis-full">
                    <RoomCard room={room} isPriority={index === 0} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="flex items-center justify-between mt-8 relative min-h-[48px]">
              <Dots count={ROOMS.length} current={current} onDotClick={handleDotClick} />

              <div className="hidden md:flex gap-4 ml-auto">
                <CarouselPrevious className="static h-12 w-12 translate-y-0 border-none bg-white shadow-sm hover:bg-[#FAC663] hover:text-white transition-all" />
                <CarouselNext className="static h-12 w-12 translate-y-0 border-none bg-white shadow-sm hover:bg-[#FAC663] hover:text-white transition-all" />
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
