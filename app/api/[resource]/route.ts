import { NextRequest } from 'next/server';

import { handleCollectionGet, handleCollectionPost } from '@/lib/api/prisma-crud';

type ResourceRouteContext = {
  params: Promise<{
    resource: string;
  }>;
};

export async function GET(_request: NextRequest, context: ResourceRouteContext) {
  const { resource } = await context.params;

  return handleCollectionGet(resource);
}

export async function POST(request: NextRequest, context: ResourceRouteContext) {
  const { resource } = await context.params;

  return handleCollectionPost(resource, request);
}
