import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { CatCreateInput, CatDto, CatUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  CatDto,
  CatCreateInput,
  CatUpdateInput
>(ApiRoutes.CATS);
