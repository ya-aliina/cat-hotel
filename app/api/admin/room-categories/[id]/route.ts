import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { deleteBlobIfUnused } from '@/lib/blob-cleanup';
import { prisma } from '@/prisma/prisma-client';

import { parsePositiveIntId, requireAdminUser } from '../../_lib';
import { syncRoomsWithCount } from '../_room-sync';

type RoomCategoryItemRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RoomCategoryUpdateBody = {
  areaId?: number;
  coverImageUrl?: string | null;
  depthCm?: number;
  description?: string | null;
  heightCm?: number;
  imageUrls?: string[];
  name?: string;
  price?: string;
  roomCount?: number;
  widthCm?: number;
};

function normalizeAreaValue(widthCm: number, depthCm: number) {
  return Math.round((widthCm * depthCm) / 100) / 10000;
}

function buildImageCreateInput(payload: RoomCategoryUpdateBody) {
  const additional = Array.isArray(payload.imageUrls)
    ? payload.imageUrls.filter((item): item is string => {
        return typeof item === 'string' && item.trim().length > 0;
      })
    : [];

  const coverImageUrl =
    typeof payload.coverImageUrl === 'string' && payload.coverImageUrl.trim().length > 0
      ? payload.coverImageUrl.trim()
      : null;

  const dedupedAdditionalImages = additional.filter((url, index, array) => {
    return array.indexOf(url) === index && url !== coverImageUrl;
  });

  const coverImage = coverImageUrl
    ? [
        {
          url: coverImageUrl,
          isCover: true,
          sortOrder: 0,
        },
      ]
    : [];

  const additionalImages = dedupedAdditionalImages.map((url, index) => {
    return {
      url,
      isCover: false,
      sortOrder: coverImage.length + index,
    };
  });

  return [...coverImage, ...additionalImages];
}

async function resolveAreaId(payload: RoomCategoryUpdateBody) {
  if (typeof payload.areaId === 'number' && Number.isInteger(payload.areaId)) {
    return payload.areaId;
  }

  const hasDimensions =
    Number.isInteger(payload.widthCm) &&
    Number.isInteger(payload.depthCm) &&
    Number.isInteger(payload.heightCm);

  if (!hasDimensions) {
    return undefined;
  }

  const widthCm = Number(payload.widthCm);
  const depthCm = Number(payload.depthCm);
  const heightCm = Number(payload.heightCm);
  const areaValue = normalizeAreaValue(widthCm, depthCm);
  const existingArea = await prisma.roomArea.findUnique({
    where: { value: areaValue },
    select: { id: true },
  });

  if (existingArea) {
    return existingArea.id;
  }

  const createdArea = await prisma.roomArea.create({
    data: {
      value: areaValue,
      widthCm,
      depthCm,
      heightCm,
    },
    select: { id: true },
  });

  return createdArea.id;
}

const roomCategoryInclude = {
  area: true,
  features: true,
  images: {
    orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
  },
  perfectFor: {
    orderBy: { id: 'asc' },
  },
  rooms: true,
} satisfies Prisma.RoomCategoryInclude;

export async function GET(_request: Request, context: RoomCategoryItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const roomCategory = await prisma.roomCategory.findUnique({
      where: { id },
      include: roomCategoryInclude,
    });

    if (!roomCategory) {
      return NextResponse.json({ error: 'Категорію не знайдено.' }, { status: 404 });
    }

    return NextResponse.json({ roomCategory });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id категорії.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Не вдалося завантажити категорію номера.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RoomCategoryItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const payload = (await request.json()) as RoomCategoryUpdateBody;
    const resolvedAreaId = await resolveAreaId(payload);
    const hasImagePayload =
      Object.prototype.hasOwnProperty.call(payload, 'coverImageUrl') ||
      Object.prototype.hasOwnProperty.call(payload, 'imageUrls');
    const previousImageUrls = hasImagePayload
      ? (
          await prisma.roomCategoryImage.findMany({
            where: { roomCategoryId: id },
            select: { url: true },
          })
        ).map((item) => {
          return item.url;
        })
      : [];

    const roomCategory = await prisma.$transaction(async (tx) => {
      const updatedRoomCategory = await tx.roomCategory.update({
        where: { id },
        data: {
          ...(typeof resolvedAreaId === 'number' ? { areaId: resolvedAreaId } : {}),
          ...(typeof payload.description === 'string' || payload.description === null
            ? { description: payload.description }
            : {}),
          ...(typeof payload.name === 'string' ? { name: payload.name.trim() } : {}),
          ...(typeof payload.price === 'string' ? { price: payload.price.trim() } : {}),
          ...(typeof payload.roomCount === 'number' && Number.isInteger(payload.roomCount) && payload.roomCount > 0
            ? { roomCount: payload.roomCount }
            : {}),
        },
        include: roomCategoryInclude,
      });

      await syncRoomsWithCount(tx, {
        categoryId: updatedRoomCategory.id,
        categoryName: updatedRoomCategory.name,
        roomCount: updatedRoomCategory.roomCount,
      });

      if (!hasImagePayload) {
        return tx.roomCategory.findUniqueOrThrow({
          where: { id },
          include: roomCategoryInclude,
        });
      }

      const imageCreateInput = buildImageCreateInput(payload);

      await tx.roomCategoryImage.deleteMany({
        where: { roomCategoryId: id },
      });

      if (imageCreateInput.length > 0) {
        await tx.roomCategoryImage.createMany({
          data: imageCreateInput.map((image) => {
            return {
              roomCategoryId: id,
              ...image,
            };
          }),
        });
      }

      return tx.roomCategory.findUniqueOrThrow({
        where: { id },
        include: roomCategoryInclude,
      });
    });

    if (hasImagePayload) {
      const nextImageUrls = new Set(
        (roomCategory.images ?? []).map((image) => {
          return image.url;
        }),
      );
      const removedUrls = previousImageUrls.filter((url) => {
        return !nextImageUrls.has(url);
      });

      await Promise.all(
        removedUrls.map((url) => {
          return deleteBlobIfUnused(url);
        }),
      );
    }

    return NextResponse.json({ roomCategory });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id категорії.' }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Категорію не знайдено.' }, { status: 404 });
      }

      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Категорія з такою назвою вже існує.' }, { status: 409 });
      }
    }

    if (error instanceof Error && error.message === 'ROOM_COUNT_REDUCTION_BLOCKED') {
      return NextResponse.json(
        { error: 'Неможливо зменшити кількість кімнат: частина кімнат уже має бронювання.' },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Не вдалося оновити категорію номера.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RoomCategoryItemRouteContext) {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parsePositiveIntId(rawId);
    const previousImageUrls = (
      await prisma.roomCategoryImage.findMany({
        where: { roomCategoryId: id },
        select: { url: true },
      })
    ).map((item) => {
      return item.url;
    });
    const roomCategory = await prisma.roomCategory.delete({
      where: { id },
      select: {
        id: true,
      },
    });

    await Promise.all(
      previousImageUrls.map((url) => {
        return deleteBlobIfUnused(url);
      }),
    );

    return NextResponse.json({ roomCategory });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Некоректний id категорії.' }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Категорію не знайдено.' }, { status: 404 });
      }

      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Неможливо видалити категорію: є пов\'язані номери або дані.' },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ error: 'Не вдалося видалити категорію номера.' }, { status: 500 });
  }
}
