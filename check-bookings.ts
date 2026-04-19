import { prisma } from '@/prisma/prisma-client';

async function main() {
  const bookings = await prisma.booking.findMany({
    where: { status: 'PENDING' },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      createdAt: true,
    },
    take: 5,
  });

  console.log('PENDING bookings:', JSON.stringify(bookings, null, 2));
}

main().catch(console.error);
