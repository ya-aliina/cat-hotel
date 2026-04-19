'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { memo, useEffect, useMemo, useRef } from 'react';

import { cn } from '@/lib/utils';

interface RoomGalleryProps {
  images: string[];
  activeImage?: string;
  onSelect: (img: string) => void;
  title: string;
}

export const RoomGallery = memo(function RoomGallery({
  images,
  activeImage,
  onSelect,
  title,
}: RoomGalleryProps) {
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const currentImage = activeImage ?? images[0];
  const activeImageIndex = useMemo(() => {
    if (!currentImage) {
      return 0;
    }

    const index = images.findIndex((image) => {
      return image === currentImage;
    });

    return index >= 0 ? index : 0;
  }, [currentImage, images]);

  useEffect(() => {
    if (!thumbnailsRef.current) {
      return;
    }

    const activeThumbnail = thumbnailsRef.current.children[activeImageIndex] as
      | HTMLElement
      | undefined;

    activeThumbnail?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeImageIndex]);

  const handleNext = () => {
    if (images.length === 0) {
      return;
    }

    const nextIndex = (activeImageIndex + 1) % images.length;

    onSelect(images[nextIndex]);
  };

  const handlePrev = () => {
    if (images.length === 0) {
      return;
    }

    const previousIndex = activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1;

    onSelect(images[previousIndex]);
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden w-full">
      <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 group">
        {currentImage ? (
          <>
            <Image
              src={currentImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 58vw, 760px"
            />

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  aria-label="Наступне фото"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-text-soft">
            Фото відсутнє
          </div>
        )}
      </div>

      <div
        ref={thumbnailsRef}
        className="flex justify-center gap-3 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {images.map((img, index) => {
          return (
            <button
              key={img}
              type="button"
              onClick={() => {
                return onSelect(img);
              }}
              className={cn(
                'relative w-30 h-22.5 shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start',
                activeImage === img
                  ? 'border-brand-orange p-0.5'
                  : 'border-transparent hover:opacity-80',
              )}
              aria-label={`Мініатюра ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 640px) 120px, 112px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
