'use client';

import Image from 'next/image';
import { memo } from 'react';

interface FeatureItemProps {
  id: string;
  label: string;
}

export const FeatureItem = memo(function FeatureItem({ id, label }: FeatureItemProps) {
  return (
    <li className="flex items-center gap-2 text-brand-text-muted">
      <div className="relative h-4 w-4 shrink-0 opacity-70">
        <Image src={`/amenities/${id}.svg`} alt="" fill className="object-contain" />
      </div>
      <span className="text-sm">{label}</span>
    </li>
  );
});