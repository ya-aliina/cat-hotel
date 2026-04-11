import { BookingStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

type BookingDto = {
  endDate: string;
  id: number;
  petNames: string[];
  roomTitles: string[];
  startDate: string;
  status: BookingStatus;
};

function toBookingDto(booking: {
  bookingItems: Array<{
    cat: { name: string };
    room: { name: string };
  }>;
  endDate: Date;
  id: number;
  startDate: Date;
  status: BookingStatus;
}): BookingDto {
  const roomTitles = Array.from(
    new Set(
      booking.bookingItems.map((item) => {
        return item.room.name;
      }),
    ),
  );

  const petNames = Array.from(
    new Set(
      booking.bookingItems.map((item) => {
        return item.cat.name;
      }),
    ),
  );

  return {
    endDate: booking.endDate.toISOString(),
    id: booking.id,
    petNames,
    roomTitles,
    startDate: booking.startDate.toISOString(),
    status: booking.status,
  };
}

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        bookingItems: {
          include: {
            cat: {
              select: {
                name: true,
              },
            },
            room: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = bookings
      .filter((booking) => {
        if (booking.status === BookingStatus.CANCELLED) {
          return false;
        }

        return booking.endDate >= today;
      })
      .map(toBookingDto);

    const historyBookings = bookings
      .filter((booking) => {
        return booking.status === BookingStatus.CANCELLED || booking.endDate < today;
      })
      .map(toBookingDto);

    return NextResponse.json({
      activeBookings,
      historyBookings,
    });
  } catch (error) {
    console.error('Failed to load account bookings', error);

    return NextResponse.json({ error: 'Не вдалося завантажити бронювання.' }, { status: 500 });
  }
}
