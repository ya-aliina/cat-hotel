import {
  BookingItems,
  BookingItemServices,
  Bookings,
  CatReports,
  Cats,
  Features,
  News,
  PerfectForItems,
  ReportImages,
  Reviews,
  RoomAreas,
  RoomCategories,
  RoomCategoryFeatures,
  RoomCategoryImages,
  RoomCategoryPerfectForItems,
  Rooms,
  Services,
  Users,
  VerificationCodes,
} from './constants';
import { prisma } from './prisma-client';

async function up() {
  await prisma.user.createMany({
    data: Users,
  });

  await prisma.roomArea.createMany({
    data: RoomAreas,
  });

  await prisma.feature.createMany({
    data: Features,
  });

  await prisma.perfectForItem.createMany({
    data: PerfectForItems,
  });

  await prisma.service.createMany({
    data: Services,
  });

  await prisma.roomCategory.createMany({
    data: RoomCategories,
  });

  await Promise.all(
    RoomCategoryFeatures.map(({ roomCategoryId, featureIds }) => {
      return prisma.roomCategory.update({
        where: { id: roomCategoryId },
        data: {
          features: {
            connect: featureIds.map((id) => {
              return { id };
            }),
          },
        },
      });
    }),
  );

  await prisma.roomCategoryImage.createMany({
    data: RoomCategoryImages,
  });

  await Promise.all(
    RoomCategoryPerfectForItems.map(({ roomCategoryId, perfectForIds }) => {
      return prisma.roomCategory.update({
        where: { id: roomCategoryId },
        data: {
          perfectFor: {
            connect: perfectForIds.map((id) => {
              return { id };
            }),
          },
        },
      });
    }),
  );

  await prisma.room.createMany({
    data: Rooms,
  });

  await prisma.cat.createMany({
    data: Cats,
  });

  await prisma.booking.createMany({
    data: Bookings,
  });

  await prisma.bookingItem.createMany({
    data: BookingItems,
  });

  await prisma.bookingItemService.createMany({
    data: BookingItemServices,
  });

  await prisma.review.createMany({
    data: Reviews,
  });

  await prisma.news.createMany({
    data: News,
  });

  await prisma.catReport.createMany({
    data: CatReports,
  });

  await prisma.reportImage.createMany({
    data: ReportImages,
  });

  await prisma.verificationCode.createMany({
    data: VerificationCodes,
  });
}

async function down() {
  try {
    await prisma.$executeRaw`
      TRUNCATE TABLE "ReportImage", "CatReport", "Review", "BookingItemService", "BookingItem", "Booking", "VerificationCode", "News", "Cat", "Room", "PerfectForItem", "RoomCategoryImage", "RoomCategory", "Feature", "Service", "RoomArea", "User"
      RESTART IDENTITY CASCADE;
    `;
  } catch (error) {
    console.warn(
      'Skipping cleanup before seed because schema is not fully initialized yet.',
      error,
    );
  }
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
