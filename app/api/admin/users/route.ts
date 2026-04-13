import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { badRequest, requireAdminUser } from '../_lib';

const allowedRoles = new Set<Role>([Role.USER, Role.EMPLOYEE, Role.ADMIN]);

export async function GET() {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const users = await prisma.user.findMany({
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      role: true,
      surname: true,
      updatedAt: true,
      verified: true,
    },
    orderBy: [{ role: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest('Невірний формат JSON.');
  }

  if (!body || typeof body !== 'object') {
    return badRequest('Некоректне тіло запиту.');
  }

  const candidateId = (body as { id?: unknown }).id;
  const candidateRole = (body as { role?: unknown }).role;

  if (!Number.isInteger(candidateId) || typeof candidateRole !== 'string') {
    return badRequest('Потрібно передати числовий id та валідну role.');
  }

  if (!allowedRoles.has(candidateRole as Role)) {
    return badRequest('Невідома роль. Дозволено USER, EMPLOYEE або ADMIN.');
  }

  const user = await prisma.user.update({
    where: { id: candidateId as number },
    data: { role: candidateRole as Role },
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      role: true,
      surname: true,
      updatedAt: true,
      verified: true,
    },
  });

  return NextResponse.json({ user });
}
