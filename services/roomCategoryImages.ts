import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type {
  RoomCategoryImageCreateInput,
  RoomCategoryImageDto,
  RoomCategoryImageUpdateInput,
} from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  RoomCategoryImageDto,
  RoomCategoryImageCreateInput,
  RoomCategoryImageUpdateInput
>(ApiRoutes.ROOM_CATEGORY_IMAGES);
