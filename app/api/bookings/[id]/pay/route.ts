import { BookingStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

type PayRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PayRequestBody = {
  sessionId?: string;
};

function parseBookingId(value: string) {
  const bookingId = Number(value);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return null;
  }

  return bookingId;
}

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    return null;
  }

  return new Stripe(stripeSecret);
}

export async function PATCH(request: NextRequest, context: PayRouteContext) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  const { id } = await context.params;
  const bookingId = parseBookingId(id);

  if (!bookingId) {
    return NextResponse.json({ error: 'Некоректний ідентифікатор бронювання.' }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId: session.user.id,
    },
    select: {
      id: true,
      paymentId: true,
      status: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Бронювання не знайдено.' }, { status: 404 });
  }

  if (booking.status === BookingStatus.SUCCEEDED) {
    return NextResponse.json({ status: booking.status, success: true });
  }

  let sessionId = '';

  try {
    const body = (await request.json()) as PayRequestBody;
    sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
  } catch {
    sessionId = '';
  }

  const stripeSessionId = sessionId || booking.paymentId;
  const stripe = getStripeClient();

  if (!stripe || !stripeSessionId) {
    return NextResponse.json(
      { error: 'Підтвердження оплати тимчасово недоступне. Спробуйте ще раз за кілька секунд.' },
      { status: 409 },
    );
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

    if (
      stripeSession.metadata?.bookingId &&
      Number(stripeSession.metadata.bookingId) !== booking.id
    ) {
      return NextResponse.json({ error: 'Некоректні параметри оплати.' }, { status: 400 });
    }

    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Платіж ще не підтверджено. Спробуйте оновити сторінку за кілька секунд.' },
        { status: 409 },
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentId: stripeSession.id,
        status: BookingStatus.SUCCEEDED,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      bookingId: updatedBooking.id,
      status: updatedBooking.status,
      success: true,
    });
  } catch (error) {
    console.error('Failed to confirm booking payment', error);

    return NextResponse.json(
      { error: 'Не вдалося підтвердити оплату. Спробуйте ще раз пізніше.' },
      { status: 500 },
    );
  }
}
