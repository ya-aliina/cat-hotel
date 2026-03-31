import { useCallback, useMemo, useState } from 'react';

import { ROOMS } from '../../_data/rooms';

export function useRoomDetails(roomIdentifier: string) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const room = useMemo(() => {
    return ROOMS.find((r) => {
      return r.slug === roomIdentifier || r.id === roomIdentifier;
    });
  }, [roomIdentifier]);

  const otherRooms = useMemo(() => {
    return room
      ? ROOMS.filter((r) => {
          return r.id !== room.id;
        }).slice(0, 3)
      : [];
  }, [room]);

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
    isBookingOpen,
    bookingSuccess,
    setSelectedImage,
    setIsBookingOpen,
    closeBookingModal,
    handleBookingSubmit,
  };
}
