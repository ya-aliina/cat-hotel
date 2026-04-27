import { BookingStatus, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getAppBaseUrl } from '@/lib/app-url';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/prisma/prisma-client';

type BookingCheckoutItem = {
  catId?: number;
  catIds?: number[];
  petName?: string;
  petNames?: string[];
  roomId?: number;
  serviceIds?: number[];
};

type BookingCheckoutRequest = {
  bookingItems?: BookingCheckoutItem[];
  customer?: {
    email?: string;
    name?: string;
    phone?: string;
    surname?: string;
  };
  endDate?: string;
  startDate?: string;
};

type Allocation = {
  categoryPrice: number;
  pets: Array<{
    catId?: number;
    petName?: string;
  }>;
  roomId: number;
  serviceIds: number[];
};

const MS_IN_DAY = 1000 * 60 * 60 * 24;

function toMoney(value: number) {
  return value.toFixed(2);
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseDate(value: unknown) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function parsePositiveInt(value: unknown) {
  if (!Number.isInteger(value)) {
    return null;
  }

  const numeric = Number(value);

  if (numeric <= 0) {
    return null;
  }

  return numeric;
}

function parseServiceIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as number[];
  }

  const ids = value
    .map((item) => {
      return parsePositiveInt(item);
    })
    .filter((item): item is number => {
      return typeof item === 'number';
    });

  return Array.from(new Set(ids));
}

function parseBody(body: unknown) {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as BookingCheckoutRequest;
  const startDate = parseDate(payload.startDate);
  const endDate = parseDate(payload.endDate);

  if (!startDate || !endDate) {
    return null;
  }

  if (startDate >= endDate) {
    return 'DATES_INVALID' as const;
  }

  if (!Array.isArray(payload.bookingItems) || payload.bookingItems.length === 0) {
    return null;
  }

  const bookingItems = payload.bookingItems
    .map((item) => {
      const parsedCatId = parsePositiveInt(item?.catId);
      const parsedCatIds = Array.isArray(item?.catIds)
        ? Array.from(
            new Set(
              item.catIds
                .map((catId) => {
                  return parsePositiveInt(catId);
                })
                .filter((catId): catId is number => {
                  return typeof catId === 'number';
                }),
            ),
          )
        : [];
      const parsedRoomId = parsePositiveInt(item?.roomId);
      const petName = normalizeText(item?.petName);
      const parsedPetNames = Array.isArray(item?.petNames)
        ? item.petNames
            .map((candidate) => {
              return normalizeText(candidate);
            })
            .filter((candidate) => {
              return candidate.length > 0;
            })
        : [];
      const pets = [
        ...(typeof parsedCatId === 'number' ? [{ catId: parsedCatId }] : []),
        ...(petName.length > 0 ? [{ petName }] : []),
        ...parsedCatIds.map((catId) => {
          return { catId };
        }),
        ...parsedPetNames.map((name) => {
          return { petName: name };
        }),
      ];
      const uniqueCatIds = new Set(
        pets
          .map((pet) => {
            return pet.catId;
          })
          .filter((catId): catId is number => {
            return typeof catId === 'number';
          }),
      );

      return {
        pets,
        roomId: parsedRoomId,
        serviceIds: parseServiceIds(item?.serviceIds),
        uniqueCatIdsCount: uniqueCatIds.size,
      };
    })
    .flatMap((item) => {
      if (!item.roomId) {
        return [] as Array<{
          pets: Array<{
            catId?: number;
            petName?: string;
          }>;
          roomId: number;
          serviceIds: number[];
        }>;
      }

      if (item.pets.length < 1 || item.pets.length > 2) {
        return [] as Array<{
          pets: Array<{
            catId?: number;
            petName?: string;
          }>;
          roomId: number;
          serviceIds: number[];
        }>;
      }

      const parsedCatIdsCount = item.pets.filter((pet) => {
        return typeof pet.catId === 'number';
      }).length;

      if (parsedCatIdsCount !== item.uniqueCatIdsCount) {
        return [] as Array<{
          pets: Array<{
            catId?: number;
            petName?: string;
          }>;
          roomId: number;
          serviceIds: number[];
        }>;
      }

      return [
        {
          pets: item.pets,
          roomId: item.roomId,
          serviceIds: item.serviceIds,
        },
      ];
    });

  if (bookingItems.length !== payload.bookingItems.length) {
    return null;
  }

  return {
    bookingItems,
    customer: {
      email: normalizeText(payload.customer?.email),
      name: normalizeText(payload.customer?.name),
      phone: normalizeText(payload.customer?.phone),
      surname: normalizeText(payload.customer?.surname),
    },
    endDate,
    startDate,
  };
}

function getNights(startDate: Date, endDate: Date) {
  const diff = endDate.getTime() - startDate.getTime();

  return Math.max(1, Math.ceil(diff / MS_IN_DAY));
}

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    return null;
  }

  return new Stripe(stripeSecret);
}

async function createStripeCheckout(params: {
  bookingId: number;
  customerEmail: string;
  nights: number;
  totalAmount: number;
}) {
  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  const appUrl = getAppBaseUrl();
  const currency = (process.env.STRIPE_CURRENCY ?? 'usd').toLowerCase();
  const unitAmount = Math.max(50, Math.round(params.totalAmount * 100));

  const checkout = await stripe.checkout.sessions.create({
    cancel_url: `${appUrl}/rooms?payment=cancelled&bookingId=${params.bookingId}`,
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            description: `Бронювання котоготелю на ${params.nights} діб`,
            name: `Cat Hotel booking #${params.bookingId}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: String(params.bookingId),
    },
    mode: 'payment',
    success_url: `${appUrl}/rooms?payment=success&bookingId=${params.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
  });

  return checkout;
}

export async function POST(request: NextRequest) {
  let parsedBody: ReturnType<typeof parseBody>;

  try {
    parsedBody = parseBody(await request.json());
  } catch {
    return NextResponse.json({ error: 'Невірний формат JSON.' }, { status: 400 });
  }

  if (!parsedBody) {
    return NextResponse.json({ error: 'Некоректні дані бронювання.' }, { status: 400 });
  }

  if (parsedBody === 'DATES_INVALID') {
    return NextResponse.json(
      { error: 'Дата виїзду має бути пізніше (не той самий день) за дату заїзду.' },
      { status: 400 },
    );
  }

  const { bookingItems, customer, endDate, startDate } = parsedBody;
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
  }

  try {
    const bookingResult = await prisma.$transaction(
      async (tx) => {
        const categoryIds = Array.from(
          new Set(
            bookingItems.map((item) => {
              return item.roomId;
            }),
          ),
        );

        const overlapWhere = {
          booking: {
            endDate: { gt: startDate },
            startDate: { lt: endDate },
            status: { not: BookingStatus.CANCELLED },
          },
        } satisfies Prisma.BookingItemWhereInput;

        const categories = await tx.roomCategory.findMany({
          where: {
            id: { in: categoryIds },
          },
          select: {
            id: true,
            name: true,
            price: true,
            rooms: {
              orderBy: {
                id: 'asc',
              },
              select: {
                id: true,
                bookingItems: {
                  where: overlapWhere,
                  select: { id: true },
                },
              },
            },
          },
        });

        if (categories.length !== categoryIds.length) {
          throw new Error('MISSING_CATEGORY');
        }

        const categoryMap = new Map(
          categories.map((category) => {
            return [category.id, category] as const;
          }),
        );

        const usedRoomIds = new Set<number>();
        const allocations: Allocation[] = [];
        const unavailableCategoryNames = new Set<string>();

        for (const item of bookingItems) {
          const category = categoryMap.get(item.roomId);

          if (!category) {
            throw new Error('MISSING_CATEGORY');
          }

          const freeRoom = category.rooms.find((room) => {
            return room.bookingItems.length === 0 && !usedRoomIds.has(room.id);
          });

          if (!freeRoom) {
            unavailableCategoryNames.add(category.name);
            continue;
          }

          usedRoomIds.add(freeRoom.id);
          allocations.push({
            categoryPrice: Number(category.price),
            pets: item.pets,
            roomId: freeRoom.id,
            serviceIds: item.serviceIds,
          });
        }

        if (unavailableCategoryNames.size > 0 || allocations.length !== bookingItems.length) {
          throw new Error(`NO_AVAILABILITY:${Array.from(unavailableCategoryNames).join(', ')}`);
        }

        const allServiceIds = Array.from(
          new Set(
            allocations.flatMap((item) => {
              return item.serviceIds;
            }),
          ),
        );

        const services =
          allServiceIds.length > 0
            ? await tx.service.findMany({
                where: {
                  id: { in: allServiceIds },
                },
                select: {
                  id: true,
                  price: true,
                },
              })
            : [];

        if (allServiceIds.length !== services.length) {
          throw new Error('MISSING_SERVICE');
        }

        const servicePriceMap = new Map(
          services.map((service) => {
            return [service.id, Number(service.price)] as const;
          }),
        );

        const nights = getNights(startDate, endDate);
        let totalAmount = 0;

        for (const item of allocations) {
          const roomAmount = item.categoryPrice * nights;
          const servicesAmount = item.serviceIds.reduce((sum, serviceId) => {
            return sum + (servicePriceMap.get(serviceId) ?? 0);
          }, 0);

          totalAmount += roomAmount + servicesAmount;
        }

        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: {
            email: true,
            id: true,
            name: true,
            phone: true,
            surname: true,
          },
        });

        if (!user) {
          throw new Error('UNAUTHORIZED');
        }

        const bookingEmail =
          normalizeText(user.email) || normalizeText(session.user.email) || customer.email;
        const customerName =
          normalizeText(user.name) || normalizeText(session.user.name) || customer.name;
        const customerSurname =
          normalizeText(user.surname) || normalizeText(session.user.surname) || customer.surname;
        const customerPhone =
          normalizeText(user.phone) || normalizeText(session.user.phone) || customer.phone;

        if (!bookingEmail || !customerName || !customerSurname) {
          throw new Error('PROFILE_INCOMPLETE');
        }

        await tx.user.update({
          where: { id: user.id },
          data: {
            name: customerName,
            phone: customerPhone || null,
            surname: customerSurname,
          },
        });

        const explicitCatIds = Array.from(
          new Set(
            allocations
              .flatMap((item) => {
                return item.pets.map((pet) => {
                  return pet.catId;
                });
              })
              .filter((catId): catId is number => {
                return typeof catId === 'number';
              }),
          ),
        );

        const ownedCats =
          explicitCatIds.length > 0
            ? await tx.cat.findMany({
                where: {
                  id: { in: explicitCatIds },
                  ownerId: user.id,
                },
                select: { id: true },
              })
            : [];

        if (ownedCats.length !== explicitCatIds.length) {
          throw new Error('INVALID_CAT');
        }

        const allocationPetIds: number[][] = [];

        for (const item of allocations) {
          const petsForAllocation: number[] = [];

          for (const pet of item.pets) {
            if (typeof pet.catId === 'number') {
              petsForAllocation.push(pet.catId);
              continue;
            }

            const cat = await tx.cat.create({
              data: {
                name: pet.petName ?? 'Улюбленець',
                ownerId: user.id,
              },
              select: {
                id: true,
              },
            });

            petsForAllocation.push(cat.id);
          }

          allocationPetIds.push(petsForAllocation);
        }

        const booking = await tx.booking.create({
          data: {
            endDate,
            startDate,
            status: BookingStatus.PENDING,
            totalPrice: toMoney(totalAmount),
            userId: user.id,
            bookingItems: {
              create: allocations.flatMap((item, index) => {
                const roomAmount = item.categoryPrice * nights;
                const petIds = allocationPetIds[index] ?? [];

                return petIds.map((catId, petIndex) => {
                  return {
                    catId,
                    priceAtBooking: toMoney(petIndex === 0 ? roomAmount : 0),
                    roomId: item.roomId,
                    services:
                      petIndex === 0 && item.serviceIds.length > 0
                        ? {
                            create: item.serviceIds.map((serviceId) => {
                              return {
                                price: toMoney(servicePriceMap.get(serviceId) ?? 0),
                                quantity: 1,
                                serviceId,
                              };
                            }),
                          }
                        : undefined,
                  };
                });
              }),
            },
          },
          select: {
            id: true,
            status: true,
            totalPrice: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        });

        return {
          booking,
          nights,
          totalAmount,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    try {
      const checkout = await createStripeCheckout({
        bookingId: bookingResult.booking.id,
        customerEmail: bookingResult.booking.user.email,
        nights: bookingResult.nights,
        totalAmount: bookingResult.totalAmount,
      });

      if (checkout?.id) {
        await prisma.booking.update({
          where: {
            id: bookingResult.booking.id,
          },
          data: {
            paymentId: checkout.id,
          },
        });
      }

      if (checkout?.url) {
        return NextResponse.json(
          {
            bookingId: bookingResult.booking.id,
            checkoutUrl: checkout.url,
            status: bookingResult.booking.status,
            totalPrice: bookingResult.booking.totalPrice,
          },
          { status: 201 },
        );
      }
    } catch {
      return NextResponse.json(
        {
          bookingId: bookingResult.booking.id,
          checkoutUrl: null,
          message:
            'Бронювання створено, але checkout оплати тимчасово недоступний. Зверніться до адміністратора.',
          status: bookingResult.booking.status,
          totalPrice: bookingResult.booking.totalPrice,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        bookingId: bookingResult.booking.id,
        checkoutUrl: null,
        message:
          'Бронювання створено. Щоб увімкнути онлайн-оплату, додайте STRIPE_SECRET_KEY та webhook.',
        status: bookingResult.booking.status,
        totalPrice: bookingResult.booking.totalPrice,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'MISSING_CATEGORY') {
      return NextResponse.json(
        { error: 'Одна або кілька категорій номерів більше не існують.' },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === 'MISSING_SERVICE') {
      return NextResponse.json(
        { error: 'Одна або кілька додаткових послуг більше недоступні.' },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Потрібно увійти в акаунт.' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'PROFILE_INCOMPLETE') {
      return NextResponse.json(
        { error: 'Заповніть імʼя, прізвище та email у профілі.' },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === 'INVALID_CAT') {
      return NextResponse.json({ error: 'Оберіть улюбленця зі свого профілю.' }, { status: 400 });
    }

    if (error instanceof Error && error.message.startsWith('NO_AVAILABILITY:')) {
      const unavailableCategories = error.message.replace('NO_AVAILABILITY:', '') || 'обраних';

      return NextResponse.json(
        {
          error: `Немає вільних номерів у категоріях: ${unavailableCategories}. Оберіть інші категорії або дати.`,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Не вдалося створити бронювання. Спробуйте ще раз пізніше.' },
      { status: 500 },
    );
  }
}
