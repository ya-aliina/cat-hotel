'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

import type { AuthFormProps } from '../_types/types';

const forgotSchema = z.object({
  email: z.string().min(1, 'Обовʼязкове поле.').email('Некоректний формат email.'),
});

type ForgotData = z.infer<typeof forgotSchema>;

export const ForgotForm = ({ onSwitch }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: ForgotData) => {
    console.log('Запит на відновлення пароля для:', data);
    // TODO: Запит до API для скидання пароля
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <p className="text-gray-400 text-sm text-center italic mb-4">
          Ми надішлемо інструкцію на ваш E-mail
        </p>
        <Input
          type="email"
          placeholder="Ваш E-mail"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton type="submit" variant="accent" className="min-w-48 bg-brand-orange text-white">
          Надіслати
        </PawButton>
        <button
          type="button"
          onClick={() => {
            return onSwitch('login');
          }}
          className="cursor-pointer text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors"
        >
          Повернутися до входу
        </button>
      </div>
    </form>
  );
};
