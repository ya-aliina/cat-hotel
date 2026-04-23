'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import type { Room } from '../../_types/room';

interface RelatedRoomsProps {
  rooms: Room[];
}

export const RelatedRooms = memo(function RelatedRooms({ rooms }: RelatedRoomsProps) {
  return (
    <section className="bg-brand-surface pb-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-brand-text">Інші номери</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((r) => {
            return (
              <Link
                key={r.id}
                href={`/rooms/${r.id}`}
                className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-16/10">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-brand-text">{r.title}</h3>
                  <p className="mt-2 text-sm text-brand-text-soft line-clamp-2">{r.description}</p>
                  <p className="mt-4 text-lg font-bold text-brand-orange">{r.price}₴ / доба</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});
