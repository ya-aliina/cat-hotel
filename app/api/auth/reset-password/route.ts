import { NextResponse } from 'next/server';

import { consumePasswordResetToken } from '@/lib/auth-flow';
import { resetPasswordInputSchema } from '@/lib/auth-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = resetPasswordInputSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані для оновлення пароля.',
        },
        { status: 400 },
      );
    }

    const result = await consumePasswordResetToken(parsedBody.data.token, parsedBody.data.password);

    if (result === 'invalid') {
      return NextResponse.json({ error: 'Посилання недійсне.' }, { status: 400 });
    }

    if (result === 'expired') {
      return NextResponse.json({ error: 'Термін дії посилання минув.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Пароль успішно оновлено.' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Не вдалося оновити пароль. Спробуйте ще раз.' },
      { status: 500 },
    );
  }
}
