import { BookingStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

type AccountBookingRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: AccountBookingRouteContext) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  const { id } = await context.params;
  const bookingId = Number(id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return NextResponse.json({ error: 'Некоректний ID бронювання.' }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Бронювання не знайдено.' }, { status: 404 });
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return NextResponse.json({ success: true });
    }

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel booking', error);

    return NextResponse.json({ error: 'Не вдалося скасувати бронювання.' }, { status: 500 });
  }
}
