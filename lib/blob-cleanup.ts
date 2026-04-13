import { del } from '@vercel/blob';

import { prisma } from '@/prisma/prisma-client';

function isVercelBlobUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);

    return parsed.protocol === 'https:' && parsed.hostname.includes('.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export async function deleteBlobIfUnused(rawUrl: string) {
  const url = rawUrl.trim();

  if (!url || !isVercelBlobUrl(url)) {
    return;
  }

  try {
    const [roomCategoryImageCount, reportImageCount, featureCount, perfectForCount, newsCount] =
      await prisma.$transaction([
        prisma.roomCategoryImage.count({ where: { url } }),
        prisma.reportImage.count({ where: { url } }),
        prisma.feature.count({ where: { imageUrl: url } }),
        prisma.perfectForItem.count({ where: { imageUrl: url } }),
        prisma.news.count({ where: { imageUrl: url } }),
      ]);

    const totalReferences =
      roomCategoryImageCount + reportImageCount + featureCount + perfectForCount + newsCount;

    if (totalReferences > 0) {
      return;
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return;
    }

    await del(url, { token });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[blob-cleanup] failed to cleanup url:', url, message);
  }
}
