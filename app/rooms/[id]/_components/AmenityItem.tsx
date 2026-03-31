'use client';

import Image from 'next/image';
import { memo } from 'react';

interface AmenityItemProps {
  id: string;
  label: string;
}

export const AmenityItem = memo(function AmenityItem({ id, label }: AmenityItemProps) {
  return (
    <li className="flex items-center gap-2 text-brand-text-muted">
      <div className="relative h-4 w-4 shrink-0 opacity-70">
        <Image src={`/amenities/${id}.svg`} alt="" fill className="object-contain" />
      </div>
      <span className="text-sm">{label}</span>
    </li>
  );
});
