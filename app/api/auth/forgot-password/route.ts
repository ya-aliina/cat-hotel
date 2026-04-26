import { NextResponse } from 'next/server';

import { createPasswordReset } from '@/lib/auth-flow';
import { emailRequestSchema } from '@/lib/auth-schemas';
import { prisma } from '@/prisma/prisma-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = emailRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? 'Некоректний email.' },
        { status: 400 },
      );
    }

    const normalizedEmail = parsedBody.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        email: true,
        id: true,
      },
    });

    if (!user) {
      if (process.env.EMAIL_DEBUG === 'true') {
        console.info('[forgot-password] no user found, skipping email delivery', {
          email: normalizedEmail,
        });
      }

      return NextResponse.json(
        { message: 'Якщо акаунт існує, ми надіслали інструкцію для відновлення пароля.' },
        { status: 200 },
      );
    }

    const result = await createPasswordReset(user.id, user.email);

    if (result.status === 'rate_limited') {
      return NextResponse.json(
        {
          error: `Спробуйте ще раз через ${result.retryAfterSeconds} сек.`,
          retryAfterSeconds: result.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        message:
          result.delivery === 'smtp'
            ? 'Інструкцію для відновлення пароля надіслано на вашу пошту.'
            : 'SMTP не налаштовано, тому показуємо тестове посилання для зміни пароля.',
        previewUrl: result.previewUrl,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Не вдалося запустити відновлення пароля.' },
      { status: 500 },
    );
  }
}
