import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { ReviewCreateInput, ReviewDto, ReviewUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  ReviewDto,
  ReviewCreateInput,
  ReviewUpdateInput
>(ApiRoutes.REVIEWS);
