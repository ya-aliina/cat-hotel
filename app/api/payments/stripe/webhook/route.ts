import { BookingStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/prisma/prisma-client';

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    return null;
  }

  return new Stripe(stripeSecret);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  if (!stripe || !webhookSecret || !signature) {
    console.log('[WEBHOOK] Missing config:', { hasStripe: !!stripe, hasSecret: !!webhookSecret, hasSignature: !!signature });
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.log('[WEBHOOK] Invalid signature:', error);
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const bookingIdRaw = session.metadata?.bookingId;
  const bookingId = Number(bookingIdRaw);

  console.log('[WEBHOOK] Event:', event.type, '| bookingIdRaw:', bookingIdRaw, '| bookingId:', bookingId);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.log('[WEBHOOK] Invalid bookingId, skipping');
    return NextResponse.json({ received: true });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('[WEBHOOK] Updating booking', bookingId, 'to SUCCEEDED');
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId: session.id,
        status: BookingStatus.SUCCEEDED,
      },
    });
    console.log('[WEBHOOK] Booking', bookingId, 'updated to SUCCEEDED');
  }

  if (event.type === 'checkout.session.expired') {
    console.log('[WEBHOOK] Updating booking', bookingId, 'to CANCELLED');
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId: session.id,
        status: BookingStatus.CANCELLED,
      },
    });
    console.log('[WEBHOOK] Booking', bookingId, 'updated to CANCELLED');
  }

  return NextResponse.json({ received: true });
}
