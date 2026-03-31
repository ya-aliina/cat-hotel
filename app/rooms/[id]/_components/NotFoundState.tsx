'use client';

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export function NotFoundState() {
  return (
    <section className="min-h-[50vh] bg-brand-surface flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">
        <h1 className="text-3xl font-bold text-brand-text">Номер не знайдено</h1>
        <Link
          href="/rooms"
          className="mt-6 inline-flex items-center gap-2 text-brand-orange font-semibold"
        >
          <MoveLeft size={18} /> Повернутись до списку
        </Link>
      </div>
    </section>
  );
}
