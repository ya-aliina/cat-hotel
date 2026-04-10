import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import type {
  BookingItemServiceCreateInput,
  BookingItemServiceDto,
  BookingItemServiceUpdateInput,
} from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  BookingItemServiceDto,
  BookingItemServiceCreateInput,
  BookingItemServiceUpdateInput
>(ApiRoutes.BOOKING_ITEM_SERVICES);
