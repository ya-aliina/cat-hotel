'use client';
import { ChangeEvent, FC } from 'react';

interface PriceFiltersSectionProps {
  isLoading?: boolean;
  onPriceToChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPriceFromChange: (event: ChangeEvent<HTMLInputElement>) => void;
  priceTo: string;
  priceFrom: string;
}

export const PriceFiltersSection: FC<PriceFiltersSectionProps> = ({
  isLoading = false,
  onPriceToChange,
  onPriceFromChange,
  priceTo,
  priceFrom,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-30 h-13 rounded-xl bg-gray-200 animate-pulse" />
        <div className="flex-1 min-w-30 h-13 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="від 100"
        value={priceFrom}
        onChange={onPriceFromChange}
        className="flex-1 min-w-30 h-13 px-4 rounded-xl border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[15px] placeholder:text-gray-400"
      />
      <input
        type="text"
        placeholder="до 600"
        value={priceTo}
        onChange={onPriceToChange}
        className="flex-1 min-w-30 h-13 px-4 rounded-xl border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[15px] placeholder:text-gray-400"
      />
    </div>
  );
};
