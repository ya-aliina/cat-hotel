import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type { BookingItemCreateInput, BookingItemDto, BookingItemUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  BookingItemDto,
  BookingItemCreateInput,
  BookingItemUpdateInput
>(ApiRoutes.BOOKING_ITEMS);
