'use client';

import React from 'react';

export type FiltersState = {
  priceMin: string;
  priceMax: string;
  areas: number[];
  amenities: string[];
};

export type FiltersConfig = {
  areas: readonly string[];
  amenities: readonly { id: string; label: string }[];
};

interface FiltersPanelProps {
  config: FiltersConfig;
  draftFilters: FiltersState;
  onDraftFiltersChange: (value: FiltersState) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section>
      <h4 className="font-bold mb-4 text-[#1A202C]">{title}</h4>
      {children}
    </section>
  );
};

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  config,
  draftFilters,
  onDraftFiltersChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="space-y-10">
      <FilterSection title="Ціна за добу, ₴">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="від 100"
            value={draftFilters.priceMin}
            onChange={(event) => {
              onDraftFiltersChange({ ...draftFilters, priceMin: event.target.value });
            }}
            className="flex-1 min-w-30 h-13 px-4 rounded-xl border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[15px] placeholder:text-gray-400"
          />
          <input
            type="text"
            placeholder="до 600"
            value={draftFilters.priceMax}
            onChange={(event) => {
              onDraftFiltersChange({ ...draftFilters, priceMax: event.target.value });
            }}
            className="flex-1 min-w-30 h-13 px-4 rounded-xl border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[15px] placeholder:text-gray-400"
          />
        </div>
      </FilterSection>

      <FilterSection title="Площа">
        <div className="space-y-3">
          {config.areas.map((area, index) => {
            return (
              <label
                key={area}
                className="flex items-center gap-3 cursor-pointer text-[16px] text-[#1A202C] hover:text-brand-orange transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-brand-yellow rounded cursor-pointer"
                  checked={draftFilters.areas.includes(index)}
                  onChange={(event) => {
                    onDraftFiltersChange({
                      ...draftFilters,
                      areas: event.target.checked
                        ? [...draftFilters.areas, index]
                        : draftFilters.areas.filter((value) => {
                            return value !== index;
                          }),
                    });
                  }}
                />
                {area}
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Оснащення номера">
        <div className="space-y-3">
          {config.amenities.map((item) => {
            return (
              <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer text-[16px] text-[#1A202C] hover:text-brand-orange transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[#FAC663] rounded cursor-pointer"
                  checked={draftFilters.amenities.includes(item.id)}
                  onChange={(event) => {
                    onDraftFiltersChange({
                      ...draftFilters,
                      amenities: event.target.checked
                        ? [...draftFilters.amenities, item.id]
                        : draftFilters.amenities.filter((value) => {
                            return value !== item.id;
                          }),
                    });
                  }}
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </FilterSection>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          className="cursor-pointer w-full py-4 rounded-xl text-[16px] font-semibold bg-[#FAC663] text-white hover:bg-[#f7b949] transition-all"
          onClick={onApply}
        >
          Застосувати
        </button>
        <button
          type="button"
          className="cursor-pointer w-full py-4 border border-[#FAC663] rounded-xl text-[16px] font-semibold hover:bg-[#FAC663] hover:text-white transition-all text-[#1A202C]"
          onClick={onReset}
        >
          Скинути фільтр
        </button>
      </div>
    </div>
  );
};
