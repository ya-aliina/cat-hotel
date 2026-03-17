'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

const nameField = z
  .string()
  .trim()
  .min(2, 'Введіть щонайменше 2 символи')
  .regex(/^[^\d]+$/, 'Використовуйте лише літери');

export const bookingSchema = z
  .object({
    name: nameField,

    surname: nameField,

    pet: z
      .string()
      .trim()
      .min(2, 'Введіть щонайменше 2 символи')
      .regex(/^[^\d]+$/, 'Імʼя улюбленця має містити лише літери'),

    phone: z
      .string()
      .trim()
      .regex(/^\+?\d{10,15}$/, 'Введіть коректний номер телефону'),

    email: z.string().trim().min(1, 'Введіть email').email('Введіть коректну email-адресу'),

    dateFrom: z.string().min(1, 'Оберіть дату заїзду'),

    dateTo: z.string().min(1, 'Оберіть дату виїзду'),
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

export type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookingFormState) => void;
  success?: boolean;
  onSuccessClose?: () => void;
};

function SuccessView({ onClose }: { onClose?: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-[28px] font-bold text-[#1A202C]">Дякуємо за заявку!</h1>
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
  success = false,
  onSuccessClose,
}: BookingModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormState>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      surname: '',
      pet: '',
      phone: '',
      email: '',
      dateFrom: '',
      dateTo: '',
    },
  });

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
              />
            </div>

            {success ? (
              <SuccessView onClose={onSuccessClose} />
            ) : (
              <>
                <div className="mb-6 text-center">
                  <h1 className="text-[28px] font-bold text-[#1A202C]">Забронювати номер</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    type="text"
                    placeholder="Ім'я улюбленця"
                    {...register('pet')}
                    error={errors.pet?.message}
                  />

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
