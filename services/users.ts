import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { UserCreateInput, UserDto, UserUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  UserDto,
  UserCreateInput,
  UserUpdateInput
>(ApiRoutes.USERS);
