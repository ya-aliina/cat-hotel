import { compare, hash } from 'bcrypt';
import { NextResponse } from 'next/server';

import { getServerAuthSession } from '@/lib/auth';
import { accountPasswordInputSchema } from '@/lib/auth-schemas';
import { prisma } from '@/prisma/prisma-client';

export async function PATCH(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = accountPasswordInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error:
            parsedBody.error.issues[0]?.message ?? 'Некоректні дані для зміни пароля.',
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
        provider: true,
        providerId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Користувача не знайдено.' }, { status: 404 });
    }

    const isOauthOnlyUser = user.provider === 'google' && Boolean(user.providerId);

    if (isOauthOnlyUser) {
      return NextResponse.json(
        {
          error:
            'Для акаунта, створеного через сторонній сервіс, зміна пароля недоступна. Керуйте паролем у вашому провайдері входу.',
        },
        { status: 403 },
      );
    }

    const currentPassword = parsedBody.data.currentPassword?.trim() ?? '';

    if (!currentPassword) {
      return NextResponse.json({ error: 'Вкажіть поточний пароль.' }, { status: 400 });
    }

    const isCurrentPasswordValid = await compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Поточний пароль невірний.' }, { status: 400 });
    }

    if (currentPassword && currentPassword === parsedBody.data.newPassword) {
      return NextResponse.json(
        { error: 'Новий пароль має відрізнятися від поточного.' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: await hash(parsedBody.data.newPassword, 12),
      },
    });

    return NextResponse.json({ message: 'Пароль успішно оновлено.' });
  } catch (error) {
    console.error('Password update failed', error);

    return NextResponse.json({ error: 'Не вдалося оновити пароль.' }, { status: 500 });
  }
}