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
import { cn } from '@/lib/utils';

export type Review = {
  id: string;
  text: string;
  author: string;
  date: string;
};

const REVIEWS: Review[] = [
  {
    id: '1',
    text: 'Перший раз довелося залишити нашого котика в готелі, дуже хвилювалися. Адміністратор Марія щодня надсилала нам фото нашого улюбленця, розповідала, як він почувається. І ми, і котик залишилися дуже задоволені!',
    author: 'Валерія Гришаєва',
    date: '15 березня 2026',
  },
  {
    id: '2',
    text: 'Готель для тварин нам порадили друзі. Вони завжди залишають тут свого кота, коли їдуть. У «Котейці» дуже добре піклуються про улюбленців, у готелі дуже чисто. Всім рекомендую! Будемо звертатися ще.',
    author: 'Катерина Мінаєва',
    date: '10 березня 2026',
  },
  {
    id: '3',
    text: 'Мій кіт — справжній вереда, догодити йому складно. У мене були особливі вимоги щодо догляду за ним, і «Котейка» чудово впоралася. Часто спостерігав по відео за ним прямо зі свого телефону, це дуже зручно.',
    author: 'Павло Нечаєв',
    date: '1 березня 2026',
  },
  {
    id: '4',
    text: 'Прекрасне місце! Залишали собаку на два тижні, повернувся щасливим та доглянутим. Будемо рекомендувати всім знайомим.',
    author: 'Олексій Смирнов',
    date: '25 лютого 2026',
  },
  {
    id: '5',
    text: 'Сподобалось індивідуальне ставлення. Годували чітко за нашим графіком. Величезне дякую адміністраторам!',
    author: 'Марина Коваленко',
    date: '20 лютого 2026',
  },
  {
    id: '6',
    text: 'Завжди переживаю, коли їду у відрядження. Але тут мій кіт у надійних руках. Відеозвіти дуже заспокоюють.',
    author: 'Ігор Ткачук',
    date: '14 лютого 2026',
  },
  {
    id: '7',
    text: 'Просторі номери, багато іграшок. Кіт виглядав дуже задоволеним на відео. Обовʼязково звернемося ще.',
    author: 'Олена Бойко',
    date: '10 лютого 2026',
  },
  {
    id: '8',
    text: 'Дуже зручно, що є відеоспостереження. Дивилася за своєю кішкою щовечора. Чудовий сервіс!',
    author: 'Світлана Лисенко',
    date: '5 лютого 2026',
  },
  {
    id: '9',
    text: 'Чудові умови проживання для тварин. Одразу видно, що тут дійсно люблять котів.',
    author: 'Андрій Мельник',
    date: '1 лютого 2026',
  },
  {
    id: '10',
    text: 'Залишали кішку вперше. Адміністратор відповіла на всі мої сто питань і розвіяла всі страхи. Дуже вдячна!',
    author: 'Наталія Шевченко',
    date: '28 січня 2026',
  },
  {
    id: '11',
    text: 'Чистота ідеальна, ніяких неприємних запахів. Наш пухнастик оцінив свої апартаменти.',
    author: 'Дмитро Кравченко',
    date: '25 січня 2026',
  },
  {
    id: '12',
    text: 'Супер сервіс! Котика навіть вичісували, повернувся красивішим, ніж був до відпустки.',
    author: 'Юлія Поліщук',
    date: '20 січня 2026',
  },
  {
    id: '13',
    text: 'Зручне бронювання і дуже привітні адміністратори. Жодних проблем не виникло. Дякуємо за вашу роботу!',
    author: 'Олександр Мороз',
    date: '15 січня 2026',
  },
  {
    id: '14',
    text: 'Кіт зазвичай дуже стресує без нас, але тут адаптувався за один день. Дуже турботливий персонал.',
    author: 'Вікторія Савченко',
    date: '10 січня 2026',
  },
  {
    id: '15',
    text: 'Все на найвищому рівні. Дякуємо за спокій під час нашої відпустки. Ви — найкращі!',
    author: 'Роман Гаврилюк',
    date: '5 січня 2026',
  },
];

const ReviewCard = React.memo(({ review }: { review: Review }) => {
  return (
    <div className="bg-white rounded-[8px] p-6 lg:p-[30px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 h-full md:h-[206px] flex flex-col justify-between">
      <div className="flex gap-4 lg:gap-6">
        <div className="shrink-0 pt-1">
          <svg
            width="32"
            height="26"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 20V9.52381L7.11111 0H10.6667L5.33333 9.52381H10.6667V20H0ZM13.3333 20V9.52381L20.4444 0H24L18.6667 9.52381H24V20H13.3333Z"
              fill="var(--brand-yellow)"
            />
          </svg>
        </div>

        <p className="text-gray-700 text-[15px] lg:text-[16px] font-normal leading-relaxed line-clamp-4">
          {review.text}
        </p>
      </div>

      <div className="flex justify-between items-center text-[13px] lg:text-[14px] text-gray-400 pl-[48px] lg:pl-[56px] font-light">
        <span>{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
});
ReviewCard.displayName = 'ReviewCard';

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
    if (count <= 1) return null;

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
                current === i ? 'bg-brand-yellow' : 'bg-[#D9D9D9]',
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

export function ReviewsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;

    const onInit = () => {
      setScrollSnaps(api.scrollSnapList());
    };

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onInit();
    onSelect();

    api.on('reInit', onInit);
    api.on('select', onSelect);

    return () => {
      api.off('reInit', onInit);
      api.off('select', onSelect);
    };
  }, [api]);

  const carouselOpts = useMemo(() => {
    return {
      align: 'start' as const,
      loop: false,
    };
  }, []);

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24">
      <div className="absolute top-[-20px] -right-[40px] md:top-3 md:right-0 lg:right-[-20px] z-0 pointer-events-none rotate-[-15deg]">
        <Image
          src="/paw.svg"
          alt=""
          width={400}
          height={400}
          className="w-[367px] h-auto"
          priority={false}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-10 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Відгуки</h2>
      </div>

      <div className="relative z-10 w-full">
        <Carousel setApi={setApi} opts={carouselOpts} className="w-full">
          <CarouselContent className="-ml-4 pl-4 xl:pl-[calc((100vw-1200px)/2+1rem)]">
            {REVIEWS.map((review) => {
              return (
                <CarouselItem key={review.id} className="pl-4 basis-[90%] md:basis-[470px] py-4">
                  <ReviewCard review={review} />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="max-w-[1200px] mx-auto px-4 mt-8">
            <div className="flex items-center justify-between relative min-h-[48px]">
              <Dots count={scrollSnaps.length} current={current} onDotClick={handleDotClick} />

              <div className="hidden md:flex gap-4 ml-auto">
                <CarouselPrevious className="static h-12 w-12 translate-y-0 border-none bg-white shadow-sm hover:bg-brand-yellow hover:text-white transition-all" />
                <CarouselNext className="static h-12 w-12 translate-y-0 border-none bg-white shadow-sm hover:bg-brand-yellow hover:text-white transition-all" />
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
