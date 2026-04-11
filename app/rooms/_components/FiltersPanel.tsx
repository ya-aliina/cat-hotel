'use client';

import React from 'react';
import { useSet } from 'react-use';

import { useFilterFeatures } from '@/hooks/useFilterFeatures';
import { useFilterRoomArea } from '@/hooks/useFilterRoomArea';

import { formatArea } from '../[id]/_utils/roomUtils';
import { CheckboxFiltersSection } from './CheckboxFiltersSection';
import type { CheckboxFilterOption, FiltersConfig, FiltersState } from './filters.types';
import { FilterSection } from './FilterSection';
import { PriceFiltersSection } from './PriceFiltersSection';

interface FiltersPanelProps {
  config: FiltersConfig;
  draftFilters: FiltersState;
  onDraftFiltersChange: (value: FiltersState) => void;
  onApply: () => void;
  onReset: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  config,
  draftFilters,
  onDraftFiltersChange,
  onApply,
  onReset,
}) => {
  const { features, isLoading: isFeaturesLoading } = useFilterFeatures();
  const { areas, isLoading: isAreasLoading } = useFilterRoomArea();
  const isLoading = isAreasLoading || isFeaturesLoading;
  const currentDraftFiltersRef = React.useRef(draftFilters);
  const [prices, setPrice] = React.useState({
    priceFrom: draftFilters.priceMin,
    priceTo: draftFilters.priceMax,
  });
  const [selectedAreaIds, { add: addAreaId, clear: clearAreaIds, toggle: toggleAreaIds }] = useSet(
    new Set(draftFilters.areaIds),
  );
  const [
    selectedFeatureIds,
    { add: addFeatureId, clear: clearFeatureIds, toggle: toggleFeatureIds },
  ] = useSet(new Set(draftFilters.featureIds));

  const areaItems = React.useMemo<CheckboxFilterOption[]>(() => {
    return areas.map((item) => {
      return {
        id: String(item.id),
        text: `${formatArea(item.value)} м2`,
        value: String(item.id),
      };
    });
  }, [areas]);

  const featureItems = React.useMemo<CheckboxFilterOption[]>(() => {
    return features
      .map((feature) => {
        const matchedFeature = config.features.find((item) => {
          return item.label === feature.name;
        });

        if (!matchedFeature) {
          return null;
        }

        return {
          id: String(feature.id),
          text: feature.name,
          value: String(feature.id),
        };
      })
      .filter((item): item is CheckboxFilterOption => {
        return item !== null;
      });
  }, [config.features, features]);

  const areaValueById = React.useMemo<Record<string, string>>(() => {
    return Object.fromEntries(
      areas.map((item) => {
        return [String(item.id), String(item.value)];
      }),
    );
  }, [areas]);

  const featureValueById = React.useMemo<Record<string, string>>(() => {
    return Object.fromEntries(
      features
        .map((feature) => {
          const matchedFeature = config.features.find((item) => {
            return item.label === feature.name;
          });

          if (!matchedFeature) {
            return null;
          }

          return [String(feature.id), matchedFeature.id] as const;
        })
        .filter((item): item is readonly [string, string] => {
          return item !== null;
        }),
    );
  }, [config.features, features]);

  const updatePrice = React.useCallback((name: 'priceFrom' | 'priceTo', value: string) => {
    setPrice((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }, []);

  const handlePriceChange = React.useCallback(
    (key: 'priceFrom' | 'priceTo') => {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        updatePrice(key, event.target.value);
      };
    },
    [updatePrice],
  );

  const selectedAreaIdValues = React.useMemo(() => {
    return Array.from(selectedAreaIds);
  }, [selectedAreaIds]);

  const selectedFeatureIdValues = React.useMemo(() => {
    return Array.from(selectedFeatureIds);
  }, [selectedFeatureIds]);

  const selectedAreaValues = React.useMemo(() => {
    return selectedAreaIdValues
      .map((id) => {
        return areaValueById[id];
      })
      .filter((value): value is string => {
        return Boolean(value);
      });
  }, [areaValueById, selectedAreaIdValues]);

  const selectedFeatureValues = React.useMemo(() => {
    return selectedFeatureIdValues
      .map((id) => {
        return featureValueById[id];
      })
      .filter((value): value is string => {
        return Boolean(value);
      });
  }, [featureValueById, selectedFeatureIdValues]);

  const areSameStringArrays = React.useCallback((first: string[], second: string[]) => {
    if (first.length !== second.length) {
      return false;
    }

    const normalizedFirst = [...first].sort();
    const normalizedSecond = [...second].sort();

    return normalizedFirst.every((value, index) => {
      return value === normalizedSecond[index];
    });
  }, []);

  React.useEffect(() => {
    currentDraftFiltersRef.current = draftFilters;
  }, [draftFilters]);

  React.useEffect(() => {
    setPrice((prev) => {
      const nextPriceFrom = draftFilters.priceMin;
      const nextPriceTo = draftFilters.priceMax;

      if (prev.priceFrom === nextPriceFrom && prev.priceTo === nextPriceTo) {
        return prev;
      }

      return {
        priceFrom: nextPriceFrom,
        priceTo: nextPriceTo,
      };
    });

    clearAreaIds();
    draftFilters.areaIds.forEach((id) => {
      addAreaId(id);
    });

    clearFeatureIds();
    draftFilters.featureIds.forEach((id) => {
      addFeatureId(id);
    });
  }, [
    addAreaId,
    addFeatureId,
    clearAreaIds,
    clearFeatureIds,
    draftFilters.areaIds,
    draftFilters.featureIds,
    draftFilters.priceMax,
    draftFilters.priceMin,
  ]);

  React.useEffect(() => {
    const nextDraftFilters: FiltersState = {
      ...currentDraftFiltersRef.current,
      priceMin: prices.priceFrom,
      priceMax: prices.priceTo,
      areaIds: selectedAreaIdValues,
      featureIds: selectedFeatureIdValues,
      areas: selectedAreaValues,
      features: selectedFeatureValues,
    };

    const currentDraftFilters = currentDraftFiltersRef.current;

    const isEqual =
      currentDraftFilters.priceMin === nextDraftFilters.priceMin &&
      currentDraftFilters.priceMax === nextDraftFilters.priceMax &&
      areSameStringArrays(currentDraftFilters.areaIds, nextDraftFilters.areaIds) &&
      areSameStringArrays(currentDraftFilters.featureIds, nextDraftFilters.featureIds) &&
      areSameStringArrays(currentDraftFilters.areas, nextDraftFilters.areas) &&
      areSameStringArrays(currentDraftFilters.features, nextDraftFilters.features);

    if (isEqual) {
      return;
    }

    onDraftFiltersChange(nextDraftFilters);
  }, [
    onDraftFiltersChange,
    prices.priceFrom,
    prices.priceTo,
    areSameStringArrays,
    selectedAreaIdValues,
    selectedAreaValues,
    selectedFeatureIdValues,
    selectedFeatureValues,
  ]);

  return (
    <div className="space-y-10">
      <FilterSection title="Ціна за добу, ₴">
        <PriceFiltersSection
          isLoading={isLoading}
          priceFrom={prices.priceFrom}
          priceTo={prices.priceTo}
          onPriceFromChange={handlePriceChange('priceFrom')}
          onPriceToChange={handlePriceChange('priceTo')}
        />
      </FilterSection>

      <FilterSection title="Площа">
        <CheckboxFiltersSection
          isLoading={isLoading}
          options={areaItems}
          selectedValues={selectedAreaIdValues}
          onClickCheckbox={toggleAreaIds}
        />
      </FilterSection>

      <FilterSection title="Оснащення номера">
        <CheckboxFiltersSection
          isLoading={isLoading}
          options={featureItems}
          selectedValues={selectedFeatureIdValues}
          onClickCheckbox={toggleFeatureIds}
        />
      </FilterSection>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          className="cursor-pointer w-full py-4 rounded-xl text-[16px] font-semibold bg-brand-yellow text-white hover:bg-brand-yellow/90 transition-all"
          onClick={onApply}
        >
          Застосувати
        </button>
        <button
          type="button"
          className="cursor-pointer w-full py-4 border border-brand-yellow rounded-xl text-[16px] font-semibold hover:bg-brand-yellow hover:text-white transition-all text-brand-text"
          onClick={onReset}
        >
          Скинути фільтр
        </button>
      </div>
    </div>
  );
};
