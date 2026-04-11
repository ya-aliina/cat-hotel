'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import type { HomePageReview } from './reviews-types';

const ReviewCard = memo(({ review }: { review: HomePageReview }) => {
  return (
    <div className="bg-white rounded-[8px] p-6 lg:p-7.5 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 h-full md:h-51.5 flex flex-col justify-between">
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

      <div className="flex justify-between items-center text-[13px] lg:text-[14px] text-gray-400 pl-12 lg:pl-14 font-light">
        <span>{review.author}</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
});
ReviewCard.displayName = 'ReviewCard';

const Dots = memo(
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
                current === i ? 'bg-brand-yellow' : 'bg-brand-border-soft',
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

type ReviewsCarouselProps = {
  reviews: HomePageReview[];
};

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
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

  const hasReviews = reviews.length > 0;

  if (!hasReviews) {
    return null;
  }

  return (
    <section id="reviews" className="w-full relative overflow-hidden py-16 md:py-24 scroll-mt-24">
      <div className="absolute top-3 -right-10 md:top-3 md:right-0 lg:-right-5 z-0 pointer-events-none rotate-[-15deg]">
        <Image
          src="/paw.svg"
          alt=""
          width={400}
          height={400}
          className="w-91.75 h-auto"
          priority={false}
        />
      </div>

      <div className="max-w-300 mx-auto px-4 relative z-10 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Відгуки</h2>
      </div>

      <div className="relative z-10 w-full">
        <Carousel setApi={setApi} opts={carouselOpts} className="w-full">
          <CarouselContent className="-ml-4 pl-4 xl:pl-[calc((100vw-1200px)/2+1rem)]">
            {reviews.map((review) => {
              return (
                <CarouselItem key={review.id} className="pl-4 basis-[90%] md:basis-117.5 py-4">
                  <ReviewCard review={review} />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="max-w-300 mx-auto px-4 mt-8">
            <div className="flex items-center justify-between relative min-h-12">
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
