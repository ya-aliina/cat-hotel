'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { PawButton } from '@/components/ui/PawButton';

import type { AuthFormProps } from '../_types/types';

const loginSchema = z.object({
  email: z.string().min(1, 'Обовʼязкове поле.').email('Некоректний формат email.'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів.'),
});

type LoginData = z.infer<typeof loginSchema>;

export const LoginForm = ({ onSwitch }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    console.log('Дані логіну:', data);
    // TODO: Запит до API для авторизації
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
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
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 px-4 text-[16px]">
        <button
          type="button"
          onClick={() => {
            return onSwitch('forgot');
          }}
          className="cursor-pointer text-gray-400 hover:text-brand-orange transition-colors"
        >
          Забули пароль?
        </button>
        <button
          type="button"
          onClick={() => {
            return onSwitch('register');
          }}
          className="cursor-pointer text-gray-400 font-medium hover:text-brand-orange transition-colors"
        >
          Ще немає аккаунту?
        </button>
      </div>
      <div className="pt-8 flex justify-center">
        <PawButton type="submit" variant="accent" className="min-w-48 text-white">
          Увійти
        </PawButton>
      </div>
    </form>
  );
};
