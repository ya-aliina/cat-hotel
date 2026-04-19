import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { RoomCreateInput, RoomDto, RoomUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  RoomDto,
  RoomCreateInput,
  RoomUpdateInput
>(ApiRoutes.ROOMS);
