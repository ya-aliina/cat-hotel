'use client';

import { useCallback, useMemo, useState } from 'react';

import type { FiltersState } from '../_components/filters.types';
import { ROOMS } from '../_data/rooms';

export type SortOption = 'area-asc' | 'area-desc' | 'price-asc' | 'price-desc';

const DEFAULT_FILTERS: FiltersState = {
  featureIds: [],
  priceMin: '',
  priceMax: '',
  areaIds: [],
  areas: [],
  features: [],
};

export function useRoomFilters() {
  const [sort, setSort] = useState<SortOption>('area-asc');
  const [draftFilters, setDraftFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const handleApply = useCallback(() => {
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  const handleReset = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  const sortedAndFilteredRooms = useMemo(() => {
    const filteredRooms = ROOMS.filter((room) => {
      const min = Number(appliedFilters.priceMin);
      const max = Number(appliedFilters.priceMax);

      if (!Number.isNaN(min) && appliedFilters.priceMin.trim() !== '' && room.price < min)
        return false;
      if (!Number.isNaN(max) && appliedFilters.priceMax.trim() !== '' && room.price > max)
        return false;
      if (appliedFilters.areas.length > 0 && !appliedFilters.areas.includes(String(room.area)))
        return false;

      if (appliedFilters.features.length > 0) {
        if (
          !appliedFilters.features.every((featureId) => {
            return room.equipment.includes(featureId);
          })
        ) {
          return false;
        }
      }

      return true;
    });

    return filteredRooms.sort((a, b) => {
      switch (sort) {
        case 'area-asc':
          return a.area - b.area;
        case 'area-desc':
          return b.area - a.area;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [appliedFilters, sort]);

  return {
    sort,
    setSort,
    draftFilters,
    setDraftFilters,
    handleApply,
    handleReset,
    sortedAndFilteredRooms,
  };
}
