import { NextRequest } from 'next/server';

import { handleItemDelete, handleItemGet, handleItemPatch } from '@/lib/api/prisma-crud';

type ResourceItemRouteContext = {
  params: Promise<{
    id: string;
    resource: string;
  }>;
};

export async function GET(_request: NextRequest, context: ResourceItemRouteContext) {
  const { id, resource } = await context.params;

  return handleItemGet(resource, id);
}

export async function PATCH(request: NextRequest, context: ResourceItemRouteContext) {
  const { id, resource } = await context.params;

  return handleItemPatch(resource, id, request);
}

export async function DELETE(_request: NextRequest, context: ResourceItemRouteContext) {
  const { id, resource } = await context.params;

  return handleItemDelete(resource, id);
}
