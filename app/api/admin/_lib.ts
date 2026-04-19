import { type Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import { getServerAuthSession } from '@/lib/auth';

export type AdminSessionUser = {
  id: number;
  role: Role;
};

export async function requireAdminUser() {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!user?.id) {
    return {
      errorResponse: NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 }),
      user: null,
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      errorResponse: NextResponse.json({ error: 'Недостатньо прав доступу.' }, { status: 403 }),
      user: null,
    };
  }

  return {
    errorResponse: null,
    user: {
      id: user.id,
      role: user.role,
    } satisfies AdminSessionUser,
  };
}

export function parsePositiveIntId(rawId: string) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  return id;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
