import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { badRequest, requireAdminUser } from '../_lib';

type RoomCreateBody = {
  categoryId: number;
  name: string;
};

function mapCreateBody(body: unknown): RoomCreateBody | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const data = body as Partial<RoomCreateBody>;

  const categoryId = data.categoryId;
  const name = data.name;

  if (!Number.isInteger(categoryId) || typeof name !== 'string') {
    return null;
  }

  return {
    categoryId: Number(categoryId),
    name: name.trim(),
  };
}

const roomInclude = {
  bookingItems: true,
  category: true,
} satisfies Prisma.RoomInclude;

export async function GET() {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const rooms = await prisma.room.findMany({
    include: roomInclude,
    orderBy: {
      id: 'asc',
    },
  });

  return NextResponse.json({ rooms });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest('Невірний формат JSON.');
  }

  const payload = mapCreateBody(body);

  if (!payload || !payload.name) {
    return badRequest('Некоректні поля room.');
  }

  try {
    const room = await prisma.room.create({
      data: payload as Prisma.RoomUncheckedCreateInput,
      include: roomInclude,
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'Вказано неіснуючу категорію.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Не вдалося створити номер.' }, { status: 500 });
  }
}
