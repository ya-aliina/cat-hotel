import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { ServiceCreateInput, ServiceDto, ServiceUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  ServiceDto,
  ServiceCreateInput,
  ServiceUpdateInput
>(ApiRoutes.SERVICES);
