import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('CATHOTEL_PRISMA_DATABASE_URL'),
  },
  engine: 'classic',
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
