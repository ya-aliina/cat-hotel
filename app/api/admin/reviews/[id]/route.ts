import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { parsePositiveIntId, requireAdminUser } from '../../_lib';

type ReviewItemRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: ReviewItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const deletedReview = await prisma.review.delete({
      where: { id },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ review: deletedReview });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id відгуку.' }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Відгук не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Не вдалося видалити відгук.' }, { status: 500 });
  }
}
