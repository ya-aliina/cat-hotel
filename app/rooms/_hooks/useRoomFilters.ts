'use client';

import { useMemo, useState } from 'react';

import type { FiltersState } from '../_components/filters.types';
import type { Room } from '../_types/room';
import { useRoomCatalog } from './useRoomCatalog';

export type SortOption = 'area-asc' | 'area-desc' | 'price-asc' | 'price-desc';

const DEFAULT_FILTERS: FiltersState = {
  featureIds: [],
  priceMin: '',
  priceMax: '',
  areaIds: [],
  areas: [],
  features: [],
};

function applyFilters(rooms: Room[], filters: FiltersState, sort: SortOption) {
  const min = Number(filters.priceMin);
  const max = Number(filters.priceMax);

  const filtered = rooms.filter((room) => {
    if (!Number.isNaN(min) && filters.priceMin.trim() !== '' && room.price < min) return false;
    if (!Number.isNaN(max) && filters.priceMax.trim() !== '' && room.price > max) return false;
    if (filters.areas.length > 0 && !filters.areas.includes(String(room.area))) return false;
    if (
      filters.features.length > 0 &&
      !filters.features.every((id) => {
        return room.equipment.includes(id);
      })
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
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
}

export function useRoomFilters() {
  const { rooms, bookingRooms, isLoading, error } = useRoomCatalog();
  const [sort, setSort] = useState<SortOption>('area-asc');
  const [draftFilters, setDraftFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const handleApply = () => {
    setAppliedFilters(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const sortedAndFilteredRooms = useMemo(() => {
    return applyFilters(rooms, appliedFilters, sort);
  }, [rooms, appliedFilters, sort]);

  return {
    sort,
    setSort,
    draftFilters,
    setDraftFilters,
    handleApply,
    handleReset,
    sortedAndFilteredRooms,
    bookingRooms,
    isLoading,
    error,
  };
}
