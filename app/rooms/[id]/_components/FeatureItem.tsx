'use client';

import Image from 'next/image';
import { memo } from 'react';

interface FeatureItemProps {
  iconSrc?: string;
  label: string;
}

export const FeatureItem = memo(function FeatureItem({ iconSrc, label }: FeatureItemProps) {
  return (
    <li className="flex items-center gap-2 text-brand-text-muted">
      {iconSrc ? (
        <div className="relative h-4 w-4 shrink-0 opacity-70">
          <Image src={iconSrc} alt="" fill className="object-contain" sizes="16px" />
        </div>
      ) : null}
      <span>{label}</span>
    </li>
  );
});
