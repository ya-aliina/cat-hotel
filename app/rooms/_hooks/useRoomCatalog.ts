'use client';

import { useEffect, useMemo, useState } from 'react';

import { Api } from '@/services/api-clients';

import { mapRoomCategoryToRoom } from '../_utils/roomCatalog';

export function useRoomCatalog() {
  const [rooms, setRooms] = useState<ReturnType<typeof mapRoomCategoryToRoom>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoomCategories() {
      try {
        const roomCategories = await Api.roomCategories.getAll();

        if (!isMounted) {
          return;
        }

        setRooms(roomCategories.map(mapRoomCategoryToRoom));
        setError(null);
      } catch (caughtError) {
        console.error(caughtError);

        if (!isMounted) {
          return;
        }

        setError('Не вдалося завантажити номери. Спробуйте пізніше.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRoomCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const bookingRooms = useMemo(() => {
    return rooms.map((room) => {
      return {
        id: room.id,
        title: room.title,
        price: room.price,
      };
    });
  }, [rooms]);

  return {
    rooms,
    bookingRooms,
    isLoading,
    error,
  };
}
