import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { parsePositiveIntId, requireAdminUser } from '../../_lib';

type RoomItemRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const roomInclude = {
  bookingItems: true,
  category: true,
} satisfies Prisma.RoomInclude;

export async function PATCH(request: NextRequest, context: RoomItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const payload = (await request.json()) as Prisma.RoomUncheckedUpdateInput;

    const room = await prisma.room.update({
      where: { id },
      data: payload,
      include: roomInclude,
    });

    return NextResponse.json({ room });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id номера.' }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Номер не знайдено.' }, { status: 404 });
      }

      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Вказано неіснуючу категорію.' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Не вдалося оновити номер.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RoomItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const room = await prisma.room.delete({
      where: { id },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ room });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id номера.' }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Номер не знайдено.' }, { status: 404 });
      }

      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Неможливо видалити номер: є пов\'язані бронювання.' },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ error: 'Не вдалося видалити номер.' }, { status: 500 });
  }
}
