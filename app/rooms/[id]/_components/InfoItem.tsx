'use client';

import { memo } from 'react';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
}

export const InfoItem = memo(function InfoItem({ icon, label }: InfoItemProps) {
  return (
    <p className="flex items-start gap-2 text-brand-text-muted">
      <span className="text-brand-orange mt-0.5">{icon}</span>
      <span>{label}</span>
    </p>
  );
});
