import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type {
  PerfectForItemCreateInput,
  PerfectForItemDto,
  PerfectForItemUpdateInput,
} from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  PerfectForItemDto,
  PerfectForItemCreateInput,
  PerfectForItemUpdateInput
>(ApiRoutes.PERFECT_FOR_ITEMS);
