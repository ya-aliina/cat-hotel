import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { BookingCartSubmission } from '@/components/shared/BookingPaymentModal';
import { Api } from '@/services/api-clients';

import { mapRoomCategoryToRoom } from '../../_utils/roomCatalog';

export function useRoomDetails(roomIdentifier: string) {
  const [room, setRoom] = useState<ReturnType<typeof mapRoomCategoryToRoom> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoomDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const roomCategory = await Api.roomCategories.getById(roomIdentifier);

        if (!isMounted) {
          return;
        }

        setRoom(mapRoomCategoryToRoom(roomCategory));
      } catch (caughtError) {
        console.error(caughtError);

        if (!isMounted) {
          return;
        }

        setRoom(null);
        setError('Не вдалося завантажити номер. Спробуйте пізніше.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (!roomIdentifier) {
      setRoom(null);
      setError('Невірний ідентифікатор номера.');
      setIsLoading(false);

      return;
    }

    fetchRoomDetails();

    return () => {
      isMounted = false;
    };
  }, [roomIdentifier]);

  const otherRooms = useMemo(() => {
    return [];
  }, []);

  const bookingRooms = useMemo(() => {
    if (!room) {
      return [];
    }

    return [
      {
        id: room.id,
        price: room.price,
        title: room.title,
      },
    ];
  }, [room]);

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
          const catIds = item.pets
            .map((pet) => {
              return pet.catId;
            })
            .filter((catId): catId is number => {
              return typeof catId === 'number';
            });
          const petNames = item.pets
            .map((pet) => {
              return pet.petName;
            })
            .filter((petName): petName is string => {
              return typeof petName === 'string' && petName.trim().length > 0;
            });

          return {
            ...(catIds.length > 0 ? { catIds } : {}),
            ...(petNames.length > 0 ? { petNames } : {}),
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
        error instanceof Error
          ? error.message
          : 'Не вдалося створити бронювання. Спробуйте ще раз.';
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
