import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { BookingCartSubmission } from '@/components/shared/BookingPaymentModal';
import { Api } from '@/services/api-clients';
import { useRoomCatalog } from '../../_hooks/useRoomCatalog';

export function useRoomDetails(roomIdentifier: string) {
  const { rooms, bookingRooms, isLoading, error } = useRoomCatalog();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const room = useMemo(() => {
    return rooms.find((r) => {
      return r.id === roomIdentifier;
    });
  }, [roomIdentifier, rooms]);

  const otherRooms = useMemo(() => {
    return room
      ? rooms
          .filter((r) => {
            return r.id !== room.id;
          })
          .slice(0, 3)
      : [];
  }, [room, rooms]);

  const gallery = useMemo(() => {
    return room && room.gallery?.length ? room.gallery : room ? [room.image] : [];
  }, [room]);

  const activeImage = selectedImage && gallery.includes(selectedImage) ? selectedImage : gallery[0];

  const closeBookingModal = useCallback(() => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
  }, []);

  const handleBookingSubmit = useCallback(async (data: BookingCartSubmission) => {
    try {
      const response = await Api.bookings.createCheckout({
        bookingItems: data.bookingItems.map((item) => {
          return {
            ...(typeof item.catId === 'number' ? { catId: item.catId } : {}),
            ...(typeof item.petName === 'string' ? { petName: item.petName } : {}),
            roomId: item.roomId,
            serviceIds: item.services.map((service) => {
              return service.serviceId;
            }),
          };
        }),
        customer: data.customer,
        endDate: data.endDate,
        startDate: data.startDate,
      });

      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }

      setBookingSuccess(true);

      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не вдалося створити бронювання. Спробуйте ще раз.';
      toast.error(message);
    }
  }, []);

  return {
    room,
    otherRooms,
    gallery,
    activeImage,
    bookingRooms,
    isLoading,
    error,
    isBookingOpen,
    bookingSuccess,
    setSelectedImage,
    setIsBookingOpen,
    closeBookingModal,
    handleBookingSubmit,
  };
}
