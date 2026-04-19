import { NextResponse } from 'next/server';

import { getServerAuthSession } from '@/lib/auth';
import { accountProfileInputSchema } from '@/lib/auth-schemas';
import { prisma } from '@/prisma/prisma-client';

export async function PATCH(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = accountProfileInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані профілю.' },
        { status: 400 },
      );
    }

    const normalizedEmail = parsedBody.data.email.trim().toLowerCase();
    const emailOwner = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Користувач з таким email вже існує.' },
        { status: 409 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: normalizedEmail,
        name: parsedBody.data.name.trim(),
        phone: (parsedBody.data.phone ?? '').trim() || null,
        surname: parsedBody.data.surname.trim(),
      },
      select: {
        email: true,
        id: true,
        name: true,
        phone: true,
        surname: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile update failed', error);

    return NextResponse.json({ error: 'Не вдалося оновити профіль.' }, { status: 500 });
  }
}