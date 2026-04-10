import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { CatReportCreateInput, CatReportDto, CatReportUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  CatReportDto,
  CatReportCreateInput,
  CatReportUpdateInput
>(ApiRoutes.CAT_REPORTS);
