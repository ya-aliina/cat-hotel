'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
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

const BOOKING_SERVICES: ServiceOption[] = [
  { id: '1', name: 'Грумінг', price: 300 },
  { id: '2', name: 'Фото-звіт', price: 100 },
  { id: '3', name: 'Індивідуальна гра', price: 180 },
  { id: '4', name: 'Контроль ліків', price: 250 },
];

const nameField = z
  .string()
  .trim()
  .min(2, 'Введіть щонайменше 2 символи')
  .regex(/^[^\d]+$/, 'Використовуйте лише літери');

export const bookingSchema = z
  .object({
    name: nameField,

    surname: nameField,

    phone: z
      .string()
      .trim()
      .regex(/^\+?\d{10,15}$/, 'Введіть коректний номер телефону'),

    email: z.string().trim().min(1, 'Введіть email').email('Введіть коректну email-адресу'),

    dateFrom: z.string().min(1, 'Оберіть дату заїзду'),

    dateTo: z.string().min(1, 'Оберіть дату виїзду'),

    items: z
      .array(
        z.object({
          roomId: z.string().min(1, 'Оберіть номер'),
          petName: z
            .string()
            .trim()
            .min(2, 'Введіть щонайменше 2 символи')
            .regex(/^[^\d]+$/, 'Імʼя улюбленця має містити лише літери'),
          serviceIds: z.array(z.string()),
        }),
      )
      .min(1, 'Додайте хоча б один номер до бронювання'),
  })
  .refine(
    (data) => {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    },
    {
      message: 'Дата виїзду має бути пізніше за дату заїзду',
      path: ['dateTo'],
    },
  );

export type BookingFormState = z.infer<typeof bookingSchema>;

export type BookingCartSubmission = {
  customer: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  bookingItems: Array<{
    roomId: number;
    petName: string;
    priceAtBooking: number;
    services: Array<{
      serviceId: number;
      name: string;
      price: number;
      quantity: number;
    }>;
  }>;
};

export type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookingCartSubmission) => void;
  rooms: BookingRoomOption[];
  initialRoomId?: string;
  success?: boolean;
  onSuccessClose?: () => void;
};

function createDefaultValues(initialRoomId?: string): BookingFormState {
  return {
    name: '',
    surname: '',
    phone: '',
    email: '',
    dateFrom: '',
    dateTo: '',
    items: [{ roomId: initialRoomId ?? '', petName: '', serviceIds: [] }],
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
          serviceId: Number(service.id),
          name: service.name,
          price: service.price,
          quantity: 1,
        };
      });

    return {
      roomId: Number(item.roomId),
      petName: item.petName,
      priceAtBooking: roomPrice * nights,
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
    customer: {
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: data.email,
    },
    startDate: data.dateFrom,
    endDate: data.dateTo,
    totalPrice,
    bookingItems,
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
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
    name: watchedValues?.name ?? '',
    surname: watchedValues?.surname ?? '',
    phone: watchedValues?.phone ?? '',
    email: watchedValues?.email ?? '',
    dateFrom: watchedValues?.dateFrom ?? '',
    dateTo: watchedValues?.dateTo ?? '',
    items:
      watchedValues?.items?.map((item) => {
        return {
          roomId: item.roomId ?? '',
          petName: item.petName ?? '',
          serviceIds: item.serviceIds ?? [],
        };
      }) ?? createDefaultValues(initialRoomId).items,
  };
  const nights = getNightsCount(values.dateFrom, values.dateTo);

  useEffect(() => {
    if (!open || success) return;

    reset(createDefaultValues(initialRoomId));
  }, [initialRoomId, open, reset, success]);

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
      roomTitle: room?.title ?? 'Номер не обрано',
      roomPrice: (room?.price ?? 0) * nights,
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
          <div className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-[24px] sm:rounded-[30px] shadow-xl p-5 sm:p-8 md:p-12 relative overflow-x-hidden transition-all duration-500">
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
                <div className="mb-6 text-center">
                  <h1 className="text-[28px] font-bold text-brand-text">Забронювати номер</h1>
                </div>

                <form
                  onSubmit={handleSubmit((data) => {
                    return onSubmit(buildBookingSubmission(data, rooms));
                  })}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="Ім'я"
                      {...register('name')}
                      error={errors.name?.message}
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      placeholder="Прізвище"
                      {...register('surname')}
                      error={errors.surname?.message}
                      className="flex-1"
                    />
                  </div>

                  <Input
                    type="tel"
                    placeholder="Телефон"
                    {...register('phone', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                      },
                    })}
                    error={errors.phone?.message}
                  />

                  <Input
                    type="email"
                    placeholder="E-mail"
                    {...register('email')}
                    error={errors.email?.message}
                  />

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 w-full">
                      <label className="flex flex-col gap-2 text-sm text-gray-600 ml-4 mb-1">
                        Дата заїзду
                      </label>
                      <Input
                        type="date"
                        {...register('dateFrom')}
                        error={errors.dateFrom?.message}
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="flex flex-col gap-2 text-sm text-gray-600 ml-4 mb-1">
                        Дата виїзду
                      </label>
                      <Input type="date" {...register('dateTo')} error={errors.dateTo?.message} />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-[24px] border border-gray-100 bg-[#FFF9F2] p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-brand-text">Позиції бронювання</h2>
                        <p className="text-sm text-brand-text-soft">
                          Для кожної кімнати можна окремо вибрати котика та додаткові послуги.
                        </p>
                      </div>

                      <PawButton
                        type="button"
                        className="min-w-40 border border-brand-orange bg-white text-brand-orange"
                        onClick={() => {
                          append({ roomId: '', petName: '', serviceIds: [] });
                        }}
                      >
                        Додати номер
                      </PawButton>
                    </div>

                    {typeof errors.items?.message === 'string' ? (
                      <p className="text-sm text-destructive">{errors.items.message}</p>
                    ) : null}

                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const selectedServiceIds = values.items[index]?.serviceIds ?? [];
                        const summary = roomSummaries[index];

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
                                  Номер
                                </label>
                                <div className="w-full">
                                  <select
                                    {...register(`items.${index}.roomId` as const)}
                                    className={cn(
                                      'h-13 w-full rounded-full border bg-white px-6 text-[16px] focus:outline-none',
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
                                  {errors.items?.[index]?.roomId?.message ? (
                                    <p className="mt-1 ml-4 text-sm text-destructive">
                                      {errors.items[index]?.roomId?.message}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              <Input
                                type="text"
                                placeholder="Ім'я улюбленця"
                                {...register(`items.${index}.petName` as const)}
                                error={errors.items?.[index]?.petName?.message}
                              />

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

                  <div className="rounded-[24px] bg-brand-surface px-5 py-4 text-center">
                    <p className="text-sm text-brand-text-soft">Загальна сума бронювання</p>
                    <p className="mt-1 text-2xl font-bold text-brand-text">{totalPrice}₴</p>
                  </div>

                  <DialogFooter className="flex-col items-center justify-center pt-4 sm:flex-row sm:justify-center">
                    <PawButton
                      type="submit"
                      variant="accent"
                      className="min-w-48 bg-brand-orange text-white"
                    >
                      Відправити заявку
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
