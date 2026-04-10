import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { RoomAreaCreateInput, RoomAreaDto, RoomAreaUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  RoomAreaDto,
  RoomAreaCreateInput,
  RoomAreaUpdateInput
>(ApiRoutes.ROOM_AREAS);
