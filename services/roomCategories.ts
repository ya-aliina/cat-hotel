import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { RoomCategoryCreateInput, RoomCategoryDto, RoomCategoryUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  RoomCategoryDto,
  RoomCategoryCreateInput,
  RoomCategoryUpdateInput
>(ApiRoutes.ROOM_CATEGORIES);
