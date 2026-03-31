'use client';

import Image from 'next/image';
import { memo } from 'react';

interface RoomGalleryProps {
  images: string[];
  activeImage: string;
  onSelect: (img: string) => void;
  title: string;
}

export const RoomGallery = memo(function RoomGallery({
  images,
  activeImage,
  onSelect,
  title,
}: RoomGalleryProps) {
  return (
    <div>
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.slice(0, 4).map((img) => {
          return (
            <button
              key={img}
              onClick={() => {
                return onSelect(img);
              }}
              className={`relative aspect-4/3 overflow-hidden rounded-xl border transition-all ${
                activeImage === img
                  ? 'border-brand-orange ring-2 ring-brand-orange/20'
                  : 'border-gray-200 hover:border-brand-orange/50'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail`}
                fill
                className="object-cover"
                sizes="180px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
});
