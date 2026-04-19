import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

const updatePetSchema = z.object({
  birthDate: z.string().trim().nullable().optional(),
  breed: z.string().trim().max(120, 'Порода занадто довга.').nullable().optional(),
  name: z.string().trim().min(1, 'Імʼя улюбленця обовʼязкове.').max(80, 'Імʼя занадто довге.'),
  notes: z.string().trim().max(1000, 'Нотатки занадто довгі.').nullable().optional(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseBirthDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number);

    if (!year || !month || month < 1 || month > 12) {
      return null;
    }

    return new Date(Date.UTC(year, month - 1, 1));
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  const { id } = await context.params;
  const petId = Number(id);

  if (Number.isNaN(petId)) {
    return NextResponse.json({ error: 'Некоректний ідентифікатор улюбленця.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsedBody = updatePetSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані улюбленця.' },
        { status: 400 },
      );
    }

    const existingPet = await prisma.cat.findFirst({
      where: {
        id: petId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Улюбленця не знайдено.' }, { status: 404 });
    }

    const birthDate = parseBirthDate(parsedBody.data.birthDate);

    if (parsedBody.data.birthDate && !birthDate) {
      return NextResponse.json({ error: 'Некоректна дата народження.' }, { status: 400 });
    }

    const pet = await prisma.cat.update({
      where: {
        id: petId,
      },
      data: {
        birthDate,
        breed: (parsedBody.data.breed ?? '').trim() || null,
        name: parsedBody.data.name.trim(),
        notes: (parsedBody.data.notes ?? '').trim() || null,
      },
      select: {
        birthDate: true,
        breed: true,
        id: true,
        name: true,
        notes: true,
      },
    });

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Failed to update pet', error);

    return NextResponse.json({ error: 'Не вдалося оновити дані улюбленця.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  const { id } = await context.params;
  const petId = Number(id);

  if (Number.isNaN(petId)) {
    return NextResponse.json({ error: 'Некоректний ідентифікатор улюбленця.' }, { status: 400 });
  }

  try {
    const existingPet = await prisma.cat.findFirst({
      where: {
        id: petId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Улюбленця не знайдено.' }, { status: 404 });
    }

    await prisma.cat.delete({
      where: {
        id: petId,
      },
    });

    return NextResponse.json({ message: 'Улюбленця видалено.' });
  } catch (error) {
    console.error('Failed to delete pet', error);

    return NextResponse.json({ error: 'Не вдалося видалити улюбленця.' }, { status: 500 });
  }
}
