import { useCallback, useMemo, useState } from 'react';

import { useRoomCatalog } from '../../_hooks/useRoomCatalog';

export function useRoomDetails(roomIdentifier: string) {
  const { rooms, bookingRooms, isLoading, error } = useRoomCatalog();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const room = useMemo(() => {
    return rooms.find((r) => {
      return r.slug === roomIdentifier || r.id === roomIdentifier;
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

  const handleBookingSubmit = useCallback(() => {
    setBookingSuccess(true);
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
