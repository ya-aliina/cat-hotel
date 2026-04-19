'use client';

import React from 'react';

import { Api } from '@/services/api-clients';
import type { FeatureDto } from '@/services/types';

interface ReturnProps {
  features: FeatureDto[];
  isLoading: boolean;
}

export const useFilterFeatures = (): ReturnProps => {
  const [features, setFeatures] = React.useState<FeatureDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchFeatures() {
      try {
        const fetchedFeatures = await Api.features.getAll();

        setFeatures(fetchedFeatures);
      } catch (caughtError) {
        console.log(caughtError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeatures();
  }, []);

  return {
    features,
    isLoading,
  };
};
