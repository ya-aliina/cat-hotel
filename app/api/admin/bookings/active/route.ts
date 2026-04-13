import { BookingStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { requireAdminUser } from '../../_lib';

export async function GET() {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      endDate: {
        gte: today,
      },
      status: {
        not: BookingStatus.CANCELLED,
      },
    },
    include: {
      bookingItems: {
        include: {
          cat: {
            select: {
              id: true,
              name: true,
            },
          },
          room: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          name: true,
          phone: true,
          surname: true,
        },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  return NextResponse.json({ bookings });
}
