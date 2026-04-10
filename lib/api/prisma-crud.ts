import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma/prisma-client';

type ResourceConfig = {
  itemKey: string;
  listKey: string;
  list: () => Promise<unknown>;
  create: (data: unknown) => Promise<unknown>;
  getById: (id: number) => Promise<unknown | null>;
  updateById: (id: number, data: unknown) => Promise<unknown>;
  deleteById: (id: number) => Promise<unknown>;
};

const catSummarySelect = {
  id: true,
  name: true,
  breed: true,
  birthDate: true,
  notes: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CatSelect;

const userBaseSelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  phone: true,
  role: true,
  verified: true,
  provider: true,
  providerId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const ownerSelect = {
  ...userBaseSelect,
  cats: {
    select: catSummarySelect,
  },
} satisfies Prisma.UserSelect;

const userSelect = {
  ...userBaseSelect,
  bookings: true,
  cats: {
    select: catSummarySelect,
  },
  news: true,
  reports: true,
  reviews: true,
  verificationCode: true,
} satisfies Prisma.UserSelect;

const catInclude = {
  bookingItems: true,
  owner: {
    select: ownerSelect,
  },
  reports: true,
} satisfies Prisma.CatInclude;

const catReportInclude = {
  cat: true,
  employee: {
    select: userBaseSelect,
  },
  images: true,
} satisfies Prisma.CatReportInclude;

const reportImageInclude = {
  report: true,
} satisfies Prisma.ReportImageInclude;

const roomCategoryInclude = {
  area: true,
  features: true,
  rooms: true,
} satisfies Prisma.RoomCategoryInclude;

const roomInclude = {
  bookingItems: true,
  category: true,
} satisfies Prisma.RoomInclude;

const roomAreaInclude = {
  categories: true,
} satisfies Prisma.RoomAreaInclude;

const featureInclude = {
  roomCategories: true,
} satisfies Prisma.FeatureInclude;

const serviceInclude = {
  bookingItemServices: true,
} satisfies Prisma.ServiceInclude;

const reviewInclude = {
  booking: true,
  user: {
    select: userBaseSelect,
  },
} satisfies Prisma.ReviewInclude;

const bookingItemInclude = {
  booking: true,
  cat: true,
  room: true,
  services: true,
} satisfies Prisma.BookingItemInclude;

const bookingItemServiceInclude = {
  bookingItem: true,
  service: true,
} satisfies Prisma.BookingItemServiceInclude;

const bookingInclude = {
  bookingItems: true,
  review: true,
  user: {
    select: userBaseSelect,
  },
} satisfies Prisma.BookingInclude;

const newsInclude = {
  author: {
    select: userBaseSelect,
  },
} satisfies Prisma.NewsInclude;

const verificationCodeInclude = {
  user: {
    select: userBaseSelect,
  },
} satisfies Prisma.VerificationCodeInclude;

const resources: Record<string, ResourceConfig> = {
  users: {
    itemKey: 'user',
    listKey: 'users',
    list: () => {
      return prisma.user.findMany({ select: userSelect });
    },
    create: (data) => {
      return prisma.user.create({
        data: data as Prisma.UserUncheckedCreateInput,
        select: userSelect,
      });
    },
    getById: (id) => {
      return prisma.user.findUnique({ where: { id }, select: userSelect });
    },
    updateById: (id, data) => {
      return prisma.user.update({
        where: { id },
        data: data as Prisma.UserUncheckedUpdateInput,
        select: userSelect,
      });
    },
    deleteById: (id) => {
      return prisma.user.delete({ where: { id }, select: userBaseSelect });
    },
  },
  cats: {
    itemKey: 'cat',
    listKey: 'cats',
    list: () => {
      return prisma.cat.findMany({ include: catInclude });
    },
    create: (data) => {
      return prisma.cat.create({
        data: data as Prisma.CatUncheckedCreateInput,
        include: catInclude,
      });
    },
    getById: (id) => {
      return prisma.cat.findUnique({ where: { id }, include: catInclude });
    },
    updateById: (id, data) => {
      return prisma.cat.update({
        where: { id },
        data: data as Prisma.CatUncheckedUpdateInput,
        include: catInclude,
      });
    },
    deleteById: (id) => {
      return prisma.cat.delete({ where: { id } });
    },
  },
  'cat-reports': {
    itemKey: 'catReport',
    listKey: 'catReports',
    list: () => {
      return prisma.catReport.findMany({ include: catReportInclude });
    },
    create: (data) => {
      return prisma.catReport.create({
        data: data as Prisma.CatReportUncheckedCreateInput,
        include: catReportInclude,
      });
    },
    getById: (id) => {
      return prisma.catReport.findUnique({ where: { id }, include: catReportInclude });
    },
    updateById: (id, data) => {
      return prisma.catReport.update({
        where: { id },
        data: data as Prisma.CatReportUncheckedUpdateInput,
        include: catReportInclude,
      });
    },
    deleteById: (id) => {
      return prisma.catReport.delete({ where: { id } });
    },
  },
  'report-images': {
    itemKey: 'reportImage',
    listKey: 'reportImages',
    list: () => {
      return prisma.reportImage.findMany({ include: reportImageInclude });
    },
    create: (data) => {
      return prisma.reportImage.create({
        data: data as Prisma.ReportImageUncheckedCreateInput,
        include: reportImageInclude,
      });
    },
    getById: (id) => {
      return prisma.reportImage.findUnique({ where: { id }, include: reportImageInclude });
    },
    updateById: (id, data) => {
      return prisma.reportImage.update({
        where: { id },
        data: data as Prisma.ReportImageUncheckedUpdateInput,
        include: reportImageInclude,
      });
    },
    deleteById: (id) => {
      return prisma.reportImage.delete({ where: { id } });
    },
  },
  'room-categories': {
    itemKey: 'roomCategory',
    listKey: 'roomCategories',
    list: () => {
      return prisma.roomCategory.findMany({ include: roomCategoryInclude });
    },
    create: (data) => {
      return prisma.roomCategory.create({
        data: data as Prisma.RoomCategoryUncheckedCreateInput,
        include: roomCategoryInclude,
      });
    },
    getById: (id) => {
      return prisma.roomCategory.findUnique({ where: { id }, include: roomCategoryInclude });
    },
    updateById: (id, data) => {
      return prisma.roomCategory.update({
        where: { id },
        data: data as Prisma.RoomCategoryUncheckedUpdateInput,
        include: roomCategoryInclude,
      });
    },
    deleteById: (id) => {
      return prisma.roomCategory.delete({ where: { id } });
    },
  },
  rooms: {
    itemKey: 'room',
    listKey: 'rooms',
    list: () => {
      return prisma.room.findMany({ include: roomInclude });
    },
    create: (data) => {
      return prisma.room.create({
        data: data as Prisma.RoomUncheckedCreateInput,
        include: roomInclude,
      });
    },
    getById: (id) => {
      return prisma.room.findUnique({ where: { id }, include: roomInclude });
    },
    updateById: (id, data) => {
      return prisma.room.update({
        where: { id },
        data: data as Prisma.RoomUncheckedUpdateInput,
        include: roomInclude,
      });
    },
    deleteById: (id) => {
      return prisma.room.delete({ where: { id } });
    },
  },
  'room-areas': {
    itemKey: 'roomArea',
    listKey: 'roomAreas',
    list: () => {
      return prisma.roomArea.findMany({ include: roomAreaInclude });
    },
    create: (data) => {
      return prisma.roomArea.create({
        data: data as Prisma.RoomAreaUncheckedCreateInput,
        include: roomAreaInclude,
      });
    },
    getById: (id) => {
      return prisma.roomArea.findUnique({ where: { id }, include: roomAreaInclude });
    },
    updateById: (id, data) => {
      return prisma.roomArea.update({
        where: { id },
        data: data as Prisma.RoomAreaUncheckedUpdateInput,
        include: roomAreaInclude,
      });
    },
    deleteById: (id) => {
      return prisma.roomArea.delete({ where: { id } });
    },
  },
  features: {
    itemKey: 'feature',
    listKey: 'features',
    list: () => {
      return prisma.feature.findMany({ include: featureInclude });
    },
    create: (data) => {
      return prisma.feature.create({
        data: data as Prisma.FeatureUncheckedCreateInput,
        include: featureInclude,
      });
    },
    getById: (id) => {
      return prisma.feature.findUnique({ where: { id }, include: featureInclude });
    },
    updateById: (id, data) => {
      return prisma.feature.update({
        where: { id },
        data: data as Prisma.FeatureUncheckedUpdateInput,
        include: featureInclude,
      });
    },
    deleteById: (id) => {
      return prisma.feature.delete({ where: { id } });
    },
  },
  services: {
    itemKey: 'service',
    listKey: 'services',
    list: () => {
      return prisma.service.findMany({ include: serviceInclude });
    },
    create: (data) => {
      return prisma.service.create({
        data: data as Prisma.ServiceUncheckedCreateInput,
        include: serviceInclude,
      });
    },
    getById: (id) => {
      return prisma.service.findUnique({ where: { id }, include: serviceInclude });
    },
    updateById: (id, data) => {
      return prisma.service.update({
        where: { id },
        data: data as Prisma.ServiceUncheckedUpdateInput,
        include: serviceInclude,
      });
    },
    deleteById: (id) => {
      return prisma.service.delete({ where: { id } });
    },
  },
  reviews: {
    itemKey: 'review',
    listKey: 'reviews',
    list: () => {
      return prisma.review.findMany({ include: reviewInclude });
    },
    create: (data) => {
      return prisma.review.create({
        data: data as Prisma.ReviewUncheckedCreateInput,
        include: reviewInclude,
      });
    },
    getById: (id) => {
      return prisma.review.findUnique({ where: { id }, include: reviewInclude });
    },
    updateById: (id, data) => {
      return prisma.review.update({
        where: { id },
        data: data as Prisma.ReviewUncheckedUpdateInput,
        include: reviewInclude,
      });
    },
    deleteById: (id) => {
      return prisma.review.delete({ where: { id } });
    },
  },
  'booking-items': {
    itemKey: 'bookingItem',
    listKey: 'bookingItems',
    list: () => {
      return prisma.bookingItem.findMany({ include: bookingItemInclude });
    },
    create: (data) => {
      return prisma.bookingItem.create({
        data: data as Prisma.BookingItemUncheckedCreateInput,
        include: bookingItemInclude,
      });
    },
    getById: (id) => {
      return prisma.bookingItem.findUnique({ where: { id }, include: bookingItemInclude });
    },
    updateById: (id, data) => {
      return prisma.bookingItem.update({
        where: { id },
        data: data as Prisma.BookingItemUncheckedUpdateInput,
        include: bookingItemInclude,
      });
    },
    deleteById: (id) => {
      return prisma.bookingItem.delete({ where: { id } });
    },
  },
  'booking-item-services': {
    itemKey: 'bookingItemService',
    listKey: 'bookingItemServices',
    list: () => {
      return prisma.bookingItemService.findMany({ include: bookingItemServiceInclude });
    },
    create: (data) => {
      return prisma.bookingItemService.create({
        data: data as Prisma.BookingItemServiceUncheckedCreateInput,
        include: bookingItemServiceInclude,
      });
    },
    getById: (id) => {
      return prisma.bookingItemService.findUnique({
        where: { id },
        include: bookingItemServiceInclude,
      });
    },
    updateById: (id, data) => {
      return prisma.bookingItemService.update({
        where: { id },
        data: data as Prisma.BookingItemServiceUncheckedUpdateInput,
        include: bookingItemServiceInclude,
      });
    },
    deleteById: (id) => {
      return prisma.bookingItemService.delete({ where: { id } });
    },
  },
  bookings: {
    itemKey: 'booking',
    listKey: 'bookings',
    list: () => {
      return prisma.booking.findMany({ include: bookingInclude });
    },
    create: (data) => {
      return prisma.booking.create({
        data: data as Prisma.BookingUncheckedCreateInput,
        include: bookingInclude,
      });
    },
    getById: (id) => {
      return prisma.booking.findUnique({ where: { id }, include: bookingInclude });
    },
    updateById: (id, data) => {
      return prisma.booking.update({
        where: { id },
        data: data as Prisma.BookingUncheckedUpdateInput,
        include: bookingInclude,
      });
    },
    deleteById: (id) => {
      return prisma.booking.delete({ where: { id } });
    },
  },
  news: {
    itemKey: 'newsItem',
    listKey: 'news',
    list: () => {
      return prisma.news.findMany({ include: newsInclude });
    },
    create: (data) => {
      return prisma.news.create({
        data: data as Prisma.NewsUncheckedCreateInput,
        include: newsInclude,
      });
    },
    getById: (id) => {
      return prisma.news.findUnique({ where: { id }, include: newsInclude });
    },
    updateById: (id, data) => {
      return prisma.news.update({
        where: { id },
        data: data as Prisma.NewsUncheckedUpdateInput,
        include: newsInclude,
      });
    },
    deleteById: (id) => {
      return prisma.news.delete({ where: { id } });
    },
  },
  'verification-codes': {
    itemKey: 'verificationCode',
    listKey: 'verificationCodes',
    list: () => {
      return prisma.verificationCode.findMany({ include: verificationCodeInclude });
    },
    create: (data) => {
      return prisma.verificationCode.create({
        data: data as Prisma.VerificationCodeUncheckedCreateInput,
        include: verificationCodeInclude,
      });
    },
    getById: (id) => {
      return prisma.verificationCode.findUnique({
        where: { id },
        include: verificationCodeInclude,
      });
    },
    updateById: (id, data) => {
      return prisma.verificationCode.update({
        where: { id },
        data: data as Prisma.VerificationCodeUncheckedUpdateInput,
        include: verificationCodeInclude,
      });
    },
    deleteById: (id) => {
      return prisma.verificationCode.delete({ where: { id } });
    },
  },
};

function getResource(resourceName: string) {
  return resources[resourceName] ?? null;
}

function parseId(rawId: string) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  return id;
}

async function readJsonBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    throw new Error('INVALID_JSON');
  }
}

function errorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    if (error.message === 'INVALID_ID') {
      return NextResponse.json({ error: 'Invalid id parameter.' }, { status: 400 });
    }

    if (error.message === 'INVALID_JSON') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Unique constraint violation.', details: error.meta },
        { status: 409 },
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Foreign key constraint violation.', details: error.meta },
        { status: 400 },
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

function resourceNotFound(resourceName: string) {
  return NextResponse.json(
    {
      error: `Unknown resource: ${resourceName}.`,
      availableResources: Object.keys(resources),
    },
    { status: 404 },
  );
}

export async function handleCollectionGet(resourceName: string) {
  const resource = getResource(resourceName);

  if (!resource) {
    return resourceNotFound(resourceName);
  }

  try {
    const items = await resource.list();

    return NextResponse.json(items);
  } catch (error) {
    return errorResponse(error, `Failed to fetch ${resource.listKey}.`);
  }
}

export async function handleCollectionPost(resourceName: string, request: NextRequest) {
  const resource = getResource(resourceName);

  if (!resource) {
    return resourceNotFound(resourceName);
  }

  try {
    const data = await readJsonBody(request);
    const item = await resource.create(data);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return errorResponse(error, `Failed to create ${resource.itemKey}.`);
  }
}

export async function handleItemGet(resourceName: string, rawId: string) {
  const resource = getResource(resourceName);

  if (!resource) {
    return resourceNotFound(resourceName);
  }

  try {
    const id = parseId(rawId);
    const item = await resource.getById(id);

    if (!item) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return errorResponse(error, `Failed to fetch ${resource.itemKey}.`);
  }
}

export async function handleItemPatch(resourceName: string, rawId: string, request: NextRequest) {
  const resource = getResource(resourceName);

  if (!resource) {
    return resourceNotFound(resourceName);
  }

  try {
    const id = parseId(rawId);
    const data = await readJsonBody(request);
    const item = await resource.updateById(id, data);

    return NextResponse.json(item);
  } catch (error) {
    return errorResponse(error, `Failed to update ${resource.itemKey}.`);
  }
}

export async function handleItemDelete(resourceName: string, rawId: string) {
  const resource = getResource(resourceName);

  if (!resource) {
    return resourceNotFound(resourceName);
  }

  try {
    const id = parseId(rawId);
    const item = await resource.deleteById(id);

    return NextResponse.json(item);
  } catch (error) {
    return errorResponse(error, `Failed to delete ${resource.itemKey}.`);
  }
}
