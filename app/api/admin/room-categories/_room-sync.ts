import { Prisma } from '@prisma/client';

function buildRoomName(categoryName: string, number: number) {
  return `${categoryName} #${number}`;
}

function getNextRoomNumber(existingNames: string[], categoryName: string) {
  const regex = new RegExp(
    `^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} #(?<number>\\d+)$`,
  );
  let maxNumber = 0;

  for (const name of existingNames) {
    const match = name.match(regex);
    const parsedNumber = match?.groups?.number ? Number(match.groups.number) : NaN;

    if (Number.isInteger(parsedNumber) && parsedNumber > maxNumber) {
      maxNumber = parsedNumber;
    }
  }

  return maxNumber + 1;
}

export async function syncRoomsWithCount(
  tx: Prisma.TransactionClient,
  params: {
    categoryId: number;
    categoryName: string;
    roomCount: number;
  },
) {
  const rooms = await tx.room.findMany({
    where: {
      categoryId: params.categoryId,
    },
    select: {
      bookingItems: {
        select: {
          id: true,
        },
        take: 1,
      },
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (rooms.length < params.roomCount) {
    const missingCount = params.roomCount - rooms.length;
    const existingNames = rooms.map((room) => {
      return room.name;
    });
    let nextNumber = getNextRoomNumber(existingNames, params.categoryName);

    await tx.room.createMany({
      data: Array.from({ length: missingCount }).map(() => {
        const roomName = buildRoomName(params.categoryName, nextNumber);
        nextNumber += 1;

        return {
          categoryId: params.categoryId,
          name: roomName,
        };
      }),
    });
  }

  if (rooms.length > params.roomCount) {
    const toDeleteCount = rooms.length - params.roomCount;
    const deletableRooms = rooms
      .filter((room) => {
        return room.bookingItems.length === 0;
      })
      .toSorted((a, b) => {
        return b.id - a.id;
      });

    if (deletableRooms.length < toDeleteCount) {
      throw new Error('ROOM_COUNT_REDUCTION_BLOCKED');
    }

    const idsToDelete = deletableRooms.slice(0, toDeleteCount).map((room) => {
      return room.id;
    });

    await tx.room.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  }
}
