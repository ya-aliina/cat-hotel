'use client';

import React from 'react';

import { Api } from '@/services/api-clients';
import type { RoomAreaDto } from '@/services/types';

interface ReturnProps {
  areas: RoomAreaDto[];
  isLoading: boolean;
}

export const useFilterRoomArea = (): ReturnProps => {
  const [areas, setAreas] = React.useState<RoomAreaDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchRoomAreas() {
      try {
        const roomAreas = await Api.roomAreas.getAll();
        setAreas(roomAreas);
      } catch (caughtError) {
        console.log(caughtError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomAreas();
  }, []);

  return {
    areas,
    isLoading,
  };
};
