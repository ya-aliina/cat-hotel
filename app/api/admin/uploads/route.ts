import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

import { deleteBlobIfUnused } from '@/lib/blob-cleanup';

import { requireAdminUser } from '../_lib';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: Request) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const formData = await request.formData();
    const fileCandidate = formData.get('file');

    if (!(fileCandidate instanceof File)) {
      return NextResponse.json({ error: 'Файл не передано.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(fileCandidate.type)) {
      return NextResponse.json(
        { error: 'Підтримуються лише JPG, PNG, WEBP або AVIF.' },
        { status: 400 },
      );
    }

    if (fileCandidate.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Максимальний розмір файлу: 8MB.' }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileCandidate.name || 'image');
    const extension = safeName.includes('.') ? '' : '.jpg';
    const pathname = `room-categories/${Date.now()}-${safeName}${extension}`;

    const blob = await put(pathname, fileCandidate, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      url: blob.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[uploads] blob error:', message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || url.trim().length === 0) {
    return NextResponse.json({ error: 'Потрібно передати url файлу.' }, { status: 400 });
  }

  await deleteBlobIfUnused(url);

  return NextResponse.json({ ok: true });
}
