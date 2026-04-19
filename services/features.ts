import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { FeatureCreateInput, FeatureDto, FeatureUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  FeatureDto,
  FeatureCreateInput,
  FeatureUpdateInput
>(ApiRoutes.FEATURES);
