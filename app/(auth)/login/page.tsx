'use client';

import Image from 'next/image';
import { useState } from 'react';

import { AuthMode } from '@/app/(auth)/login/_types/types';

import { ForgotForm } from './_components/ForgotForm';
import { LoginForm } from './_components/LoginForm';
import { RegisterForm } from './_components/RegisterForm';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  const titles: Record<AuthMode, string> = {
    login: 'Увійти в кабінет',
    register: 'Реєстрація',
    forgot: 'Відновлення пароля',
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Кот */}
      <div className="hidden min-[1000px]:block absolute left-[-5%] bottom-0 w-[70%] h-[90%] pointer-events-none z-0">
        <Image
          src="/login-page-cat2.webp"
          alt="Cat"
          fill
          className="object-contain object-bottom select-none"
          priority
        />
      </div>

      <div className="max-w-7xl w-full flex justify-center min-[1000px]:justify-end relative z-10">
        <div className="w-full max-w-140 bg-white rounded-[30px] shadow-xl p-8 md:p-12 border border-gray-50 relative overflow-hidden transition-all duration-500">
          <div className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none">
            <Image
              src="/paw.svg"
              alt=""
              width={128}
              height={128}
              className="object-contain rotate-135"
            />
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-[28px] font-bold text-[#1A202C]">{titles[mode]}</h1>
          </div>

          {mode === 'login' && <LoginForm onSwitch={setMode} />}
          {mode === 'register' && <RegisterForm onSwitch={setMode} />}
          {mode === 'forgot' && <ForgotForm onSwitch={setMode} />}
        </div>
      </div>

      <div className="absolute bottom-6 right-12 hidden lg:block text-gray-400 text-sm">
        © 2026 Котейка. Всі права захищені.
      </div>
    </main>
  );
}
