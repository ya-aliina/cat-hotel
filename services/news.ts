import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { NewsCreateInput, NewsDto, NewsUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  NewsDto,
  NewsCreateInput,
  NewsUpdateInput
>(ApiRoutes.NEWS);
