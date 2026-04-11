import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

import { registerInputSchema } from '@/lib/auth-schemas';
import { prisma } from '@/prisma/prisma-client';

const publicUserSelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  phone: true,
  role: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = registerInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані реєстрації.',
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedBody.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Користувач з таким email вже існує.' }, { status: 409 });
    }

    const passwordHash = await hash(parsedBody.data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        name: parsedBody.data.name,
        password: passwordHash,
        phone: parsedBody.data.phone || null,
        surname: parsedBody.data.surname,
        verified: new Date(),
      },
      select: publicUserSelect,
    });

    return NextResponse.json(
      {
        message: 'Акаунт створено. Тепер ви можете увійти до кабінету.',
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration failed', error);

    return NextResponse.json(
      { error: 'Не вдалося завершити реєстрацію. Спробуйте ще раз.' },
      { status: 500 },
    );
  }
}
