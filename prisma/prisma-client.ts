// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DEFAULT_CONNECTION_LIMIT = '5';
const DEFAULT_POOL_TIMEOUT_SECONDS = '20';

function getPrismaDatasourceUrl() {
  const datasourceUrl = process.env.CATHOTEL_PRISMA_DATABASE_URL;

  if (!datasourceUrl) {
    return undefined;
  }

  try {
    const url = new URL(datasourceUrl);

    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', DEFAULT_CONNECTION_LIMIT);
    }

    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', DEFAULT_POOL_TIMEOUT_SECONDS);
    }

    return url.toString();
  } catch {
    return datasourceUrl;
  }
}

function createPrismaClient() {
  const datasourceUrl = getPrismaDatasourceUrl();

  return datasourceUrl
    ? new PrismaClient({
        datasourceUrl,
      })
    : new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
