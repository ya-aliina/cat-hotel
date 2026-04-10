import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { BookingCreateInput, BookingDto, BookingUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  BookingDto,
  BookingCreateInput,
  BookingUpdateInput
>(ApiRoutes.BOOKINGS);
