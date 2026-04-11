import { NextResponse } from 'next/server';

import { createEmailVerification } from '@/lib/auth-flow';
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

    const user = await prisma.user.findUnique({
      where: { email: parsedBody.data.email },
      select: {
        email: true,
        id: true,
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Якщо акаунт існує, ми повторно надіслали лист підтвердження.' },
        { status: 200 },
      );
    }

    if (user.verified) {
      return NextResponse.json({ error: 'Цей email вже підтверджено.' }, { status: 409 });
    }

    const result = await createEmailVerification(user.id, user.email);

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
            ? 'Лист підтвердження надіслано на вашу пошту.'
            : 'SMTP не налаштовано, тому показуємо тестове посилання для підтвердження.',
        previewUrl: result.previewUrl,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Не вдалося надіслати лист підтвердження.' },
      { status: 500 },
    );
  }
}
