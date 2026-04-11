export type FiltersState = {
  featureIds: string[];
  priceMin: string;
  priceMax: string;
  areaIds: string[];
  areas: string[];
  features: string[];
};

export type FiltersConfig = {
  features: readonly { id: string; label: string }[];
};

export type CheckboxFilterOption = {
  id: string;
  text: string;
  value: string;
};
