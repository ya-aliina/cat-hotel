import { NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { requireAdminUser } from '../_lib';

export async function GET() {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const reviews = await prisma.review.findMany({
    include: {
      booking: {
        select: {
          endDate: true,
          id: true,
          startDate: true,
          status: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          name: true,
          surname: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({ reviews });
}
