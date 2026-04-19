import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { ReportImageCreateInput, ReportImageDto, ReportImageUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  ReportImageDto,
  ReportImageCreateInput,
  ReportImageUpdateInput
>(ApiRoutes.REPORT_IMAGES);
