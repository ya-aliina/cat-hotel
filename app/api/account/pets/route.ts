import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

const createPetSchema = z.object({
  birthDate: z.string().trim().nullable().optional(),
  breed: z.string().trim().max(120, 'Порода занадто довга.').nullable().optional(),
  name: z.string().trim().min(1, 'Імʼя улюбленця обовʼязкове.').max(80, 'Імʼя занадто довге.'),
  notes: z.string().trim().max(1000, 'Нотатки занадто довгі.').nullable().optional(),
});

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

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const pets = await prisma.cat.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        birthDate: true,
        breed: true,
        id: true,
        name: true,
        notes: true,
      },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error('Failed to load user pets', error);

    return NextResponse.json({ error: 'Не вдалося завантажити улюбленців.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = createPetSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані улюбленця.' },
        { status: 400 },
      );
    }

    const birthDate = parseBirthDate(parsedBody.data.birthDate);

    if (parsedBody.data.birthDate && !birthDate) {
      return NextResponse.json({ error: 'Некоректна дата народження.' }, { status: 400 });
    }

    const pet = await prisma.cat.create({
      data: {
        birthDate,
        breed: (parsedBody.data.breed ?? '').trim() || null,
        name: parsedBody.data.name.trim(),
        notes: (parsedBody.data.notes ?? '').trim() || null,
        ownerId: session.user.id,
      },
      select: {
        birthDate: true,
        breed: true,
        id: true,
        name: true,
        notes: true,
      },
    });

    return NextResponse.json({ pet }, { status: 201 });
  } catch (error) {
    console.error('Failed to create pet', error);

    return NextResponse.json({ error: 'Не вдалося додати улюбленця.' }, { status: 500 });
  }
}
