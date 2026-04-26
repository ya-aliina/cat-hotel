'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';
import { cn } from '@/lib/utils';

type BookingRoomOption = {
  id: string;
  title: string;
  price: number;
};

type ServiceOption = {
  id: string;
  name: string;
  price: number;
};

type AccountPet = {
  id: number;
  name: string;
};

const NEW_PET_OPTION = '__new__';

const BOOKING_SERVICES: ServiceOption[] = [
  { id: '1', name: 'Грумінг', price: 300 },
  { id: '2', name: 'Фото-звіт', price: 100 },
  { id: '3', name: 'Індивідуальна гра', price: 180 },
  { id: '4', name: 'Контроль ліків', price: 250 },
];

const petNameField = z
  .string()
  .trim()
  .min(2, 'Введіть щонайменше 2 символи')
  .regex(/^[^\d]+$/, 'Імʼя улюбленця має містити лише літери');

export const bookingSchema = z
  .object({
    dateFrom: z.string().min(1, 'Оберіть дату заїзду'),
    dateTo: z.string().min(1, 'Оберіть дату виїзду'),
    items: z
      .array(
        z.object({
          catId: z.string().min(1, 'Оберіть улюбленця'),
          newPetName: z.string().default(''),
          secondCatId: z.string().default(''),
          secondNewPetName: z.string().default(''),
          roomId: z.string().min(1, 'Оберіть номер'),
          serviceIds: z.array(z.string()),
        }),
      )
      .min(1, 'Додайте хоча б один номер до бронювання'),
  })
  .superRefine((data, context) => {
    const selectedCatIds = new Map<string, number>();

    data.items.forEach((item, index) => {
      if (item.catId === NEW_PET_OPTION) {
        const parsed = petNameField.safeParse(item.newPetName ?? '');

        if (!parsed.success) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: parsed.error.issues[0]?.message ?? "Введіть ім'я улюбленця",
            path: ['items', index, 'newPetName'],
          });
        }

        return;
      }

      if (
        item.catId !== NEW_PET_OPTION &&
        (!Number.isInteger(Number(item.catId)) || Number(item.catId) <= 0)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Оберіть улюбленця',
          path: ['items', index, 'catId'],
        });
      }

      if (item.secondCatId === NEW_PET_OPTION) {
        const parsedSecond = petNameField.safeParse(item.secondNewPetName ?? '');

        if (!parsedSecond.success) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: parsedSecond.error.issues[0]?.message ?? "Введіть ім'я улюбленця",
            path: ['items', index, 'secondNewPetName'],
          });
        }
      }

      if (
        item.secondCatId &&
        item.secondCatId !== NEW_PET_OPTION &&
        (!Number.isInteger(Number(item.secondCatId)) || Number(item.secondCatId) <= 0)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Оберіть улюбленця',
          path: ['items', index, 'secondCatId'],
        });
      }

      if (
        item.secondCatId &&
        item.secondCatId !== NEW_PET_OPTION &&
        item.catId !== NEW_PET_OPTION &&
        item.secondCatId === item.catId
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Оберіть іншого улюбленця для другої позиції',
          path: ['items', index, 'secondCatId'],
        });
      }

      [
        { path: ['items', index, 'catId'], value: item.catId },
        { path: ['items', index, 'secondCatId'], value: item.secondCatId },
      ].forEach(({ path, value }) => {
        if (!value || value === NEW_PET_OPTION) {
          return;
        }

        if (selectedCatIds.has(value)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Цього улюбленця вже додано в іншу позицію бронювання',
            path,
          });
        }

        selectedCatIds.set(value, index);
      });
    });
  })
  .refine(
    (data) => {
      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);

      return !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from < to;
    },
    {
      message: 'Дата виїзду має бути пізніше (не той самий день) за дату заїзду',
      path: ['dateTo'],
    },
  );

export type BookingFormState = z.input<typeof bookingSchema>;

export type BookingCartSubmission = {
  customer: {
    email: string;
    name: string;
    phone: string;
    surname: string;
  };
  endDate: string;
  startDate: string;
  totalPrice: number;
  bookingItems: Array<{
    pets: Array<{
      catId?: number;
      petName?: string;
    }>;
    priceAtBooking: number;
    roomId: number;
    services: Array<{
      name: string;
      price: number;
      quantity: number;
      serviceId: number;
    }>;
  }>;
};

export type BookingModalProps = {
  initialRoomId?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookingCartSubmission) => Promise<void> | void;
  onSuccessClose?: () => void;
  open: boolean;
  rooms: BookingRoomOption[];
  success?: boolean;
};

function createDefaultValues(initialRoomId?: string): BookingFormState {
  return {
    dateFrom: '',
    dateTo: '',
    items: [
      {
        catId: '',
        newPetName: '',
        secondCatId: '',
        secondNewPetName: '',
        roomId: initialRoomId ?? '',
        serviceIds: [],
      },
    ],
  };
}

function getSessionCustomer(session: ReturnType<typeof useSession>['data']) {
  const user = session?.user;

  return {
    email: typeof user?.email === 'string' ? user.email.trim() : '',
    name: typeof user?.name === 'string' ? user.name.trim() : '',
    phone: typeof user?.phone === 'string' ? user.phone.trim() : '',
    surname: typeof user?.surname === 'string' ? user.surname.trim() : '',
  };
}

function getNightsCount(dateFrom: string, dateTo: string) {
  if (!dateFrom || !dateTo) return 1;

  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff <= 0) return 1;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function buildBookingSubmission(
  data: BookingFormState,
  rooms: BookingRoomOption[],
  customer: BookingCartSubmission['customer'],
): BookingCartSubmission {
  const nights = getNightsCount(data.dateFrom, data.dateTo);

  const bookingItems = data.items.map((item) => {
    const room = rooms.find((candidate) => {
      return candidate.id === item.roomId;
    });

    const roomPrice = room?.price ?? 0;
    const services = item.serviceIds
      .map((serviceId) => {
        return BOOKING_SERVICES.find((service) => {
          return service.id === serviceId;
        });
      })
      .filter((service): service is ServiceOption => {
        return Boolean(service);
      })
      .map((service) => {
        return {
          name: service.name,
          price: service.price,
          quantity: 1,
          serviceId: Number(service.id),
        };
      });

    const pets = [
      {
        ...(item.catId === NEW_PET_OPTION
          ? { petName: (item.newPetName ?? '').trim() }
          : { catId: Number(item.catId) }),
      },
      ...(item.secondCatId
        ? [
            {
              ...(item.secondCatId === NEW_PET_OPTION
                ? { petName: (item.secondNewPetName ?? '').trim() }
                : { catId: Number(item.secondCatId) }),
            },
          ]
        : []),
    ];

    return {
      pets,
      priceAtBooking: roomPrice * nights,
      roomId: Number(item.roomId),
      services,
    };
  });

  const totalPrice = bookingItems.reduce((sum, item) => {
    const servicesTotal = item.services.reduce((servicesSum, service) => {
      return servicesSum + service.price * service.quantity;
    }, 0);

    return sum + item.priceAtBooking + servicesTotal;
  }, 0);

  return {
    bookingItems,
    customer,
    endDate: data.dateTo,
    startDate: data.dateFrom,
    totalPrice,
  };
}

function SuccessView({ onClose }: { onClose?: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-[28px] font-bold text-brand-text">Дякуємо за заявку!</h1>
      <p className="text-base text-muted-foreground mt-2">Ми зв’яжемося з вами найближчим часом</p>
      <div className="mt-10 flex justify-center">
        <PawButton
          variant="accent"
          className="min-w-48 bg-brand-orange text-white"
          onClick={onClose}
        >
          Ок
        </PawButton>
      </div>
    </div>
  );
}

export function BookingModal({
  open,
  onOpenChange,
  onSubmit,
  rooms,
  initialRoomId,
  success = false,
  onSuccessClose,
}: BookingModalProps) {
  const { data: session, status } = useSession();
  const sessionCustomer = getSessionCustomer(session);
  const isAuthenticated = status === 'authenticated';
  const hasCompleteSessionCustomer =
    sessionCustomer.name.length >= 2 &&
    sessionCustomer.surname.length >= 2 &&
    /.+@.+\..+/.test(sessionCustomer.email);
  const [pets, setPets] = useState<AccountPet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormState>({
    resolver: zodResolver(bookingSchema),
    defaultValues: createDefaultValues(initialRoomId),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedValues = useWatch({ control });
  const values: BookingFormState = {
    dateFrom: watchedValues?.dateFrom ?? '',
    dateTo: watchedValues?.dateTo ?? '',
    items:
      watchedValues?.items?.map((item) => {
        return {
          catId: item.catId ?? '',
          newPetName: item.newPetName ?? '',
          secondCatId: item.secondCatId ?? '',
          secondNewPetName: item.secondNewPetName ?? '',
          roomId: item.roomId ?? '',
          serviceIds: item.serviceIds ?? [],
        };
      }) ?? createDefaultValues(initialRoomId).items,
  };
  const nights = getNightsCount(values.dateFrom, values.dateTo);

  useEffect(() => {
    if (!open || success) return;

    reset(createDefaultValues(initialRoomId));
  }, [initialRoomId, open, reset, success]);

  useEffect(() => {
    if (!open || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function loadPets() {
      setPetsLoading(true);

      try {
        const response = await fetch('/api/account/pets');

        if (!response.ok) {
          if (!cancelled) {
            setPets([]);
          }

          return;
        }

        const payload = (await response.json().catch(() => {
          return null;
        })) as {
          pets?: Array<{ id: number; name: string }>;
        } | null;

        if (cancelled) {
          return;
        }

        const nextPets = Array.isArray(payload?.pets)
          ? payload.pets.filter((pet): pet is AccountPet => {
              return Number.isInteger(pet?.id) && typeof pet?.name === 'string';
            })
          : [];

        setPets(nextPets);

        if (nextPets.length > 0) {
          const currentItems = getValues('items');

          currentItems.forEach((item, index) => {
            if (!item.catId) {
              setValue(`items.${index}.catId`, String(nextPets[0].id), {
                shouldDirty: false,
              });
            }
          });
        }
      } finally {
        if (!cancelled) {
          setPetsLoading(false);
        }
      }
    }

    loadPets();

    return () => {
      cancelled = true;
    };
  }, [getValues, isAuthenticated, open, setValue]);

  const roomSummaries = values.items.map((item) => {
    const room = rooms.find((candidate) => {
      return candidate.id === item.roomId;
    });

    const servicesTotal = item.serviceIds.reduce((sum, serviceId) => {
      const service = BOOKING_SERVICES.find((candidate) => {
        return candidate.id === serviceId;
      });

      return sum + (service?.price ?? 0);
    }, 0);

    return {
      roomPrice: (room?.price ?? 0) * nights,
      roomTitle: room?.title ?? 'Номер не обрано',
      servicesTotal,
    };
  });

  const totalPrice = roomSummaries.reduce((sum, item) => {
    return sum + item.roomPrice + item.servicesTotal;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-140 p-0 bg-transparent shadow-none ring-0">
        <div className="w-full flex justify-center relative z-10">
          <div className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-[24px] sm:rounded-[30px] shadow-xl p-5 sm:p-8 relative overflow-x-hidden transition-all duration-500 space-y-8">
            <button
              type="button"
              onClick={() => {
                return onOpenChange(false);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-white/70 text-gray-500 hover:bg-white hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none">
              <Image
                src="/paw.svg"
                alt="paw decorative"
                width={128}
                height={128}
                className="object-contain rotate-135"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            {success ? (
              <SuccessView onClose={onSuccessClose} />
            ) : (
              <>
                <div className="mb-6 px-12 text-center">
                  <h1 className="text-[28px] font-bold text-brand-text">Забронювати номер</h1>
                </div>

                <form
                  onSubmit={handleSubmit((data) => {
                    return onSubmit(buildBookingSubmission(data, rooms, sessionCustomer));
                  })}
                  className="space-y-5"
                >
                  {isAuthenticated ? null : (
                    <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Для оплати потрібно увійти в акаунт.
                    </div>
                  )}

                  {!hasCompleteSessionCustomer && isAuthenticated ? (
                    <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      У профілі не вистачає імені, прізвища або email. Заповніть їх у розділі Мій
                      акаунт.
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 w-full">
                      <label className="flex flex-col gap-2 text-sm text-gray-600 ml-4 mb-1">
                        Дата заїзду
                      </label>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('dateFrom')}
                        error={errors.dateFrom?.message}
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="flex flex-col gap-2 text-sm text-gray-600 ml-4 mb-1">
                        Дата виїзду
                      </label>
                      <Input
                        type="date"
                        min={values.dateFrom || new Date().toISOString().split('T')[0]}
                        {...register('dateTo')}
                        error={errors.dateTo?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 ">
                      <div>
                        <h2 className="text-lg font-bold text-brand-text">Позиції бронювання</h2>
                        <p className="text-sm text-brand-text-soft">
                          Для кожної кімнати можна окремо вибрати улюбленця та додаткові послуги.
                        </p>
                      </div>
                    </div>

                    {typeof errors.items?.message === 'string' ? (
                      <p className="text-sm text-destructive">{errors.items.message}</p>
                    ) : null}

                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const selectedServiceIds = values.items[index]?.serviceIds ?? [];
                        const selectedCatId = values.items[index]?.catId ?? '';
                        const selectedSecondCatId = values.items[index]?.secondCatId ?? '';
                        const showNewPetField = selectedCatId === NEW_PET_OPTION;
                        const showSecondNewPetField = selectedSecondCatId === NEW_PET_OPTION;
                        const summary = roomSummaries[index] ?? {
                          roomTitle: 'Номер не обрано',

                          roomPrice: 0,

                          servicesTotal: 0,
                        };

                        return (
                          <div
                            key={field.id}
                            className="rounded-[20px] border border-gray-200 bg-white p-4 shadow-sm"
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <h3 className="text-base font-semibold text-brand-text">
                                Позиція #{index + 1}
                              </h3>

                              {fields.length > 1 ? (
                                <button
                                  type="button"
                                  className="text-sm font-medium text-brand-orange"
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  Видалити
                                </button>
                              ) : null}
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="mb-1 ml-4 block text-sm text-gray-600">
                                  Мої улюбленці
                                </label>
                                <div className="relative w-full">
                                  <select
                                    {...register(`items.${index}.catId` as const)}
                                    className={cn(
                                      'h-13 w-full appearance-none rounded-full border bg-white pl-6 pr-10 text-[16px] focus:outline-none',
                                      errors.items?.[index]?.catId
                                        ? 'border-destructive/70 focus:border-destructive'
                                        : 'border-gray-200 focus:border-brand-yellow',
                                    )}
                                  >
                                    <option value="">Оберіть улюбленця</option>
                                    {pets.map((pet) => {
                                      return (
                                        <option key={pet.id} value={String(pet.id)}>
                                          {pet.name}
                                        </option>
                                      );
                                    })}
                                    <option value={NEW_PET_OPTION}>
                                      + Додати нового улюбленця
                                    </option>
                                  </select>
                                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  {errors.items?.[index]?.catId?.message ? (
                                    <p className="mt-1 ml-4 text-sm text-destructive">
                                      {errors.items[index]?.catId?.message}
                                    </p>
                                  ) : null}
                                </div>
                                {petsLoading ? (
                                  <p className="mt-1 ml-4 text-xs text-brand-text-soft">
                                    Завантажуємо улюбленців...
                                  </p>
                                ) : null}
                              </div>

                              {showNewPetField ? (
                                <Input
                                  type="text"
                                  placeholder="Ім'я нового улюбленця"
                                  {...register(`items.${index}.newPetName` as const)}
                                  error={errors.items?.[index]?.newPetName?.message}
                                />
                              ) : null}

                              <div>
                                <label className="mb-1 ml-4 block text-sm text-gray-600">
                                  Другий улюбленець (необов&apos;язково)
                                </label>
                                <div className="relative w-full">
                                  <select
                                    {...register(`items.${index}.secondCatId` as const)}
                                    className={cn(
                                      'h-13 w-full appearance-none rounded-full border bg-white pl-6 pr-10 text-[16px] focus:outline-none',
                                      errors.items?.[index]?.secondCatId
                                        ? 'border-destructive/70 focus:border-destructive'
                                        : 'border-gray-200 focus:border-brand-yellow',
                                    )}
                                  >
                                    <option value="">Без другого улюбленця</option>
                                    {pets.map((pet) => {
                                      return (
                                        <option key={pet.id} value={String(pet.id)}>
                                          {pet.name}
                                        </option>
                                      );
                                    })}
                                    <option value={NEW_PET_OPTION}>
                                      + Додати нового улюбленця
                                    </option>
                                  </select>
                                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  {errors.items?.[index]?.secondCatId?.message ? (
                                    <p className="mt-1 ml-4 text-sm text-destructive">
                                      {errors.items[index]?.secondCatId?.message}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              {showSecondNewPetField ? (
                                <Input
                                  type="text"
                                  placeholder="Ім'я другого нового улюбленця"
                                  {...register(`items.${index}.secondNewPetName` as const)}
                                  error={errors.items?.[index]?.secondNewPetName?.message}
                                />
                              ) : null}

                              <div>
                                <label className="mb-1 ml-4 block text-sm text-gray-600">
                                  Номер
                                </label>
                                <div className="relative w-full">
                                  <select
                                    {...register(`items.${index}.roomId` as const)}
                                    className={cn(
                                      'h-13 w-full appearance-none rounded-full border bg-white pl-6 pr-10 text-[16px] focus:outline-none',
                                      errors.items?.[index]?.roomId
                                        ? 'border-destructive/70 focus:border-destructive'
                                        : 'border-gray-200 focus:border-brand-yellow',
                                    )}
                                  >
                                    <option value="">Оберіть номер</option>
                                    {rooms.map((room) => {
                                      return (
                                        <option key={room.id} value={room.id}>
                                          {room.title} · {room.price}₴ / доба
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  {errors.items?.[index]?.roomId?.message ? (
                                    <p className="mt-1 ml-4 text-sm text-destructive">
                                      {errors.items[index]?.roomId?.message}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              <div>
                                <p className="mb-3 ml-1 text-sm font-medium text-brand-text">
                                  Додаткові послуги
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {BOOKING_SERVICES.map((service) => {
                                    const isSelected = selectedServiceIds.includes(service.id);

                                    return (
                                      <button
                                        key={service.id}
                                        type="button"
                                        className={cn(
                                          'rounded-[18px] border px-4 py-3 text-left transition-colors',
                                          isSelected
                                            ? 'border-brand-orange bg-orange-50'
                                            : 'border-gray-200 bg-white hover:border-brand-yellow',
                                        )}
                                        onClick={() => {
                                          const nextValue = isSelected
                                            ? selectedServiceIds.filter((id) => {
                                                return id !== service.id;
                                              })
                                            : [...selectedServiceIds, service.id];

                                          setValue(`items.${index}.serviceIds`, nextValue, {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                          });
                                        }}
                                      >
                                        <span className="block text-sm font-semibold text-brand-text">
                                          {service.name}
                                        </span>
                                        <span className="mt-1 block text-sm text-brand-text-soft">
                                          {service.price}₴
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="rounded-[18px] bg-brand-surface px-4 py-3 text-sm text-brand-text-soft">
                                <p>
                                  {summary.roomTitle}: {summary.roomPrice}₴ за {nights} діб
                                </p>
                                <p>Послуги: {summary.servicesTotal}₴</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <PawButton
                    type="button"
                    className="min-w-40 border border-brand-orange bg-white text-brand-orange m-auto mb-5"
                    onClick={() => {
                      append({
                        catId: pets[0] ? String(pets[0].id) : NEW_PET_OPTION,
                        newPetName: '',
                        secondCatId: '',
                        secondNewPetName: '',
                        roomId: '',
                        serviceIds: [],
                      });
                    }}
                  >
                    Додати номер
                  </PawButton>

                  <div className="rounded-[24px] bg-brand-surface px-5 py-4 text-center">
                    <p className="text-sm text-brand-text-soft">Загальна сума бронювання</p>
                    <p className="mt-1 text-2xl font-bold text-brand-text">{totalPrice}₴</p>
                  </div>

                  <DialogFooter className="flex-col items-center justify-center pt-4 sm:flex-row sm:justify-center">
                    <PawButton
                      type="submit"
                      variant="accent"
                      className="min-w-48 bg-brand-orange text-white"
                      disabled={isSubmitting || !isAuthenticated || !hasCompleteSessionCustomer}
                    >
                      {isSubmitting ? 'Переходимо до оплати...' : 'Оплатити'}
                    </PawButton>
                  </DialogFooter>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
