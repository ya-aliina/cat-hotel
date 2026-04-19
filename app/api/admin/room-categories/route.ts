import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

import { badRequest, requireAdminUser } from '../_lib';
import { syncRoomsWithCount } from './_room-sync';

type RoomCategoryCreateBody = {
  areaId?: number;
  coverImageUrl?: string | null;
  depthCm?: number;
  description?: string | null;
  featureIds?: number[];
  heightCm?: number;
  imageUrls?: string[];
  name: string;
  newFeatureNames?: string[];
  newPerfectForDescriptions?: string[];
  perfectForIds?: number[];
  price: string;
  roomCount?: number;
  widthCm?: number;
};

function parseIntegerArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as number[];
  }

  const numbers = value.filter((item): item is number => {
    return Number.isInteger(item) && Number(item) > 0;
  });

  return Array.from(new Set(numbers));
}

function parseTextArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const normalized = value
    .filter((item): item is string => {
      return typeof item === 'string';
    })
    .map((item) => {
      return item.trim();
    })
    .filter((item) => {
      return item.length > 0;
    });

  const uniqueMap = new Map<string, string>();

  for (const item of normalized) {
    const key = item.toLowerCase();

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  }

  return Array.from(uniqueMap.values());
}

function mapCreateBody(body: unknown): RoomCategoryCreateBody | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const data = body as Partial<RoomCategoryCreateBody>;

  const areaId = data.areaId;
  const depthCm = data.depthCm;
  const heightCm = data.heightCm;
  const widthCm = data.widthCm;
  const name = data.name;
  const price = data.price;
  const roomCount = data.roomCount;

  const hasAreaId = Number.isInteger(areaId);
  const hasDimensions =
    Number.isInteger(widthCm) && Number.isInteger(depthCm) && Number.isInteger(heightCm);

  if (
    typeof name !== 'string' ||
    typeof price !== 'string' ||
    (!hasAreaId && !hasDimensions)
  ) {
    return null;
  }

  const imageUrls = Array.isArray(data.imageUrls)
    ? data.imageUrls.filter((item): item is string => {
        return typeof item === 'string' && item.trim().length > 0;
      })
    : [];

  const featureIds = parseIntegerArray(data.featureIds);
  const perfectForIds = parseIntegerArray(data.perfectForIds);
  const newFeatureNames = parseTextArray(data.newFeatureNames);
  const newPerfectForDescriptions = parseTextArray(data.newPerfectForDescriptions);

  const coverImageUrl =
    typeof data.coverImageUrl === 'string' && data.coverImageUrl.trim().length > 0
      ? data.coverImageUrl.trim()
      : null;

  if (typeof roomCount !== 'undefined' && (!Number.isInteger(roomCount) || roomCount <= 0)) {
    return null;
  }

  return {
    areaId: hasAreaId ? Number(areaId) : undefined,
    coverImageUrl,
    depthCm: hasDimensions ? Number(depthCm) : undefined,
    description: typeof data.description === 'string' ? data.description : null,
    heightCm: hasDimensions ? Number(heightCm) : undefined,
    imageUrls,
    name: name.trim(),
    newFeatureNames,
    newPerfectForDescriptions,
    perfectForIds,
    price: price.trim(),
    roomCount: typeof roomCount === 'number' ? roomCount : 1,
    featureIds,
    widthCm: hasDimensions ? Number(widthCm) : undefined,
  };
}

function normalizeAreaValue(widthCm: number, depthCm: number) {
  return Math.round((widthCm * depthCm) / 100) / 10000;
}

async function resolveAreaId(payload: RoomCategoryCreateBody) {
  if (typeof payload.areaId === 'number') {
    return payload.areaId;
  }

  if (
    typeof payload.widthCm !== 'number' ||
    typeof payload.depthCm !== 'number' ||
    typeof payload.heightCm !== 'number'
  ) {
    throw new Error('INVALID_AREA_INPUT');
  }

  const areaValue = normalizeAreaValue(payload.widthCm, payload.depthCm);
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
      widthCm: payload.widthCm,
      depthCm: payload.depthCm,
      heightCm: payload.heightCm,
    },
    select: { id: true },
  });

  return createdArea.id;
}

async function resolveFeatureIds(payload: RoomCategoryCreateBody) {
  const selectedIds = Array.from(new Set(payload.featureIds ?? []));
  const selected =
    selectedIds.length > 0
      ? await prisma.feature.findMany({
          where: { id: { in: selectedIds } },
          select: { id: true },
        })
      : [];

  const ids = selected.map((item) => {
    return item.id;
  });

  for (const name of payload.newFeatureNames ?? []) {
    const existing = await prisma.feature.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    try {
      const created = await prisma.feature.create({
        data: {
          imageUrl: '',
          name,
          price: '0',
        },
        select: { id: true },
      });

      ids.push(created.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const duplicated = await prisma.feature.findFirst({
          where: {
            name: {
              equals: name,
              mode: 'insensitive',
            },
          },
          select: { id: true },
        });

        if (duplicated) {
          ids.push(duplicated.id);
        }

        continue;
      }

      throw error;
    }
  }

  return Array.from(new Set(ids));
}

async function resolvePerfectForIds(payload: RoomCategoryCreateBody) {
  const selectedIds = Array.from(new Set(payload.perfectForIds ?? []));
  const selected =
    selectedIds.length > 0
      ? await prisma.perfectForItem.findMany({
          where: { id: { in: selectedIds } },
          select: { id: true },
        })
      : [];

  const ids = selected.map((item) => {
    return item.id;
  });

  for (const description of payload.newPerfectForDescriptions ?? []) {
    const existing = await prisma.perfectForItem.findFirst({
      where: {
        description: {
          equals: description,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    try {
      const created = await prisma.perfectForItem.create({
        data: {
          description,
          imageUrl: '',
        },
        select: { id: true },
      });

      ids.push(created.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const duplicated = await prisma.perfectForItem.findFirst({
          where: {
            description: {
              equals: description,
              mode: 'insensitive',
            },
          },
          select: { id: true },
        });

        if (duplicated) {
          ids.push(duplicated.id);
        }

        continue;
      }

      throw error;
    }
  }

  return Array.from(new Set(ids));
}

function buildImageCreateInput(payload: RoomCategoryCreateBody) {
  const dedupedAdditionalImages = (payload.imageUrls ?? []).filter((url, index, array) => {
    return array.indexOf(url) === index && url !== payload.coverImageUrl;
  });

  const coverImage = payload.coverImageUrl
    ? [
        {
          url: payload.coverImageUrl,
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

export async function GET() {
  const guard = await requireAdminUser();

  if (guard.errorResponse) {
    return guard.errorResponse;
  }

  const roomCategories = await prisma.roomCategory.findMany({
    include: roomCategoryInclude,
    orderBy: {
      id: 'asc',
    },
  });

  return NextResponse.json({ roomCategories });
}

export async function POST(request: NextRequest) {
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

  const payload = mapCreateBody(body);

  if (!payload || !payload.name || !payload.price) {
    return badRequest('Некоректні поля room category.');
  }

  try {
    const resolvedAreaId = await resolveAreaId(payload);
    const resolvedFeatureIds = await resolveFeatureIds(payload);
    const resolvedPerfectForIds = await resolvePerfectForIds(payload);
    const imageCreateInput = buildImageCreateInput(payload);

    const roomCategory = await prisma.$transaction(async (tx) => {
      const createdRoomCategory = await tx.roomCategory.create({
        data: {
          areaId: resolvedAreaId,
          description: payload.description,
          ...(resolvedFeatureIds.length > 0
            ? {
                features: {
                  connect: resolvedFeatureIds.map((id) => ({ id })),
                },
              }
            : {}),
          ...(resolvedPerfectForIds.length > 0
            ? {
                perfectFor: {
                  connect: resolvedPerfectForIds.map((id) => ({ id })),
                },
              }
            : {}),
          name: payload.name,
          price: payload.price,
          roomCount: payload.roomCount ?? 1,
          ...(imageCreateInput.length > 0
            ? {
                images: {
                  create: imageCreateInput,
                },
              }
            : {}),
        },
        include: roomCategoryInclude,
      });

      await syncRoomsWithCount(tx, {
        categoryId: createdRoomCategory.id,
        categoryName: createdRoomCategory.name,
        roomCount: createdRoomCategory.roomCount,
      });

      return tx.roomCategory.findUniqueOrThrow({
        where: { id: createdRoomCategory.id },
        include: roomCategoryInclude,
      });
    });

    return NextResponse.json({ roomCategory }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_AREA_INPUT') {
      return badRequest('Потрібно обрати існуючу площу або вказати габарити (Ш/Г/В).');
    }

    if (error instanceof Error && error.message === 'ROOM_COUNT_REDUCTION_BLOCKED') {
      return badRequest('Неможливо зменшити кількість кімнат: частина кімнат уже має бронювання.');
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Категорія з такою назвою вже існує.' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Не вдалося створити категорію номера.' }, { status: 500 });
  }
}
