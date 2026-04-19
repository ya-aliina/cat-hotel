'use client';

import React from 'react';

import { Checkbox } from '../../../components/ui/checkbox';
import type { CheckboxFilterOption } from './filters.types';

interface CheckboxFiltersSectionProps {
  isLoading?: boolean;
  onClickCheckbox: (id: string) => void;
  options: CheckboxFilterOption[];
  selectedValues: string[];
}

export const CheckboxFiltersSection: React.FC<CheckboxFiltersSectionProps> = ({
  isLoading = false,
  onClickCheckbox,
  options,
  selectedValues,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        return (
          <Checkbox
            key={option.id}
            label={option.text}
            checked={selectedValues.includes(option.value)}
            onChange={() => {
              onClickCheckbox(option.id);
            }}
          />
        );
      })}
    </div>
  );
};
