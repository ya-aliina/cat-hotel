'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

import type { AuthFormProps } from '../_types/types';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Мінімум 2 символи.').regex(/^\D*$/, 'Не повинно містити цифр.'),
    email: z.string().min(1, 'Обовʼязкове поле.').email('Некоректний формат email.'),
    password: z.string().min(6, 'Пароль має містити мінімум 6 символів.'),
    confirmPassword: z.string().min(1, 'Обовʼязкове поле.'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Паролі не співпадають.',
      path: ['confirmPassword'],
    },
  );

type RegisterData = z.infer<typeof registerSchema>;

export const RegisterForm = ({ onSwitch }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    console.log('Дані реєстрації:', data);
    // TODO: Запит до API для створення акаунту
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <Input
          type="text"
          placeholder="Ваше ім'я"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          type="email"
          placeholder="Ваш E-mail"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="Пароль"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          type="password"
          placeholder="Підтвердіть пароль"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton type="submit" variant="accent" className="min-w-48 bg-brand-orange text-white">
          Створити аккаунт
        </PawButton>
        <button
          type="button"
          onClick={() => {
            return onSwitch('login');
          }}
          className="text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors cursor-pointer"
        >
          Повернутися до входу
        </button>
      </div>
    </form>
  );
};
