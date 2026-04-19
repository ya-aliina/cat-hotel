import { ApiRoutes } from './constants';
import { createCrudService } from './create-crud-service';
import { axiosInstance } from './instance';
import type { BookingCreateInput, BookingDto, BookingUpdateInput } from './types';

export const { getAll, getById, create, update, remove } = createCrudService<
  BookingDto,
  BookingCreateInput,
  BookingUpdateInput
>(ApiRoutes.BOOKINGS);

export type BookingCheckoutPayload = {
  bookingItems: Array<{
    catId?: number;
    petName?: string;
    roomId: number;
    serviceIds: number[];
  }>;
  customer: {
    email: string;
    name: string;
    phone: string;
    surname: string;
  };
  endDate: string;
  startDate: string;
};

export type BookingCheckoutResponse = {
  bookingId: number;
  checkoutUrl: string | null;
  message?: string;
  status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED';
  totalPrice: string;
};

export async function createCheckout(payload: BookingCheckoutPayload) {
  return (await axiosInstance.post<BookingCheckoutResponse>(ApiRoutes.BOOKINGS, payload)).data;
}
