import { NextResponse } from 'next/server';

import { validateUserCredentials } from '@/lib/auth-flow';
import { loginSchema } from '@/lib/auth-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = loginSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { status: 'invalid', error: parsedBody.error.issues[0]?.message ?? 'Некоректні дані.' },
        { status: 400 },
      );
    }

    const result = await validateUserCredentials(parsedBody.data.email, parsedBody.data.password);

    if (result.status === 'invalid') {
      return NextResponse.json({ status: 'invalid' }, { status: 200 });
    }

    if (result.status === 'unverified') {
      return NextResponse.json(
        {
          email: result.email,
          error: 'Email ще не підтверджено. Підтвердіть адресу перед входом.',
          status: 'unverified',
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { status: 'invalid', error: 'Не вдалося перевірити дані входу.' },
      { status: 500 },
    );
  }
}
