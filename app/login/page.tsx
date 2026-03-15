'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PawButton } from '@/components/ui/PawButton';

type AuthMode = 'login' | 'register' | 'forgot';

// --- Окремі компоненти форм ---
const LoginForm = ({ onSwitch }: { onSwitch: (mode: AuthMode) => void }) => {
  return (
    <>
      <div className="space-y-5">
        <input
          type="email"
          placeholder="Ваш E-mail"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
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
        <PawButton variant="accent" className="min-w-48 bg-brand-orange text-white">
          Увійти
        </PawButton>
      </div>
    </>
  );
};

const RegisterForm = ({ onSwitch }: { onSwitch: (mode: AuthMode) => void }) => {
  return (
    <>
      <div className="space-y-5">
        <input
          type="text"
          placeholder="Ваше ім'я"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
        <input
          type="email"
          placeholder="Ваш E-mail"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
        <input
          type="password"
          placeholder="Підтвердіть пароль"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton variant="accent" className="min-w-48 bg-brand-orange text-white">
          Створити аккаунт
        </PawButton>
        <button
          type="button"
          onClick={() => {
            return onSwitch('login');
          }}
          className="text-gray-400 hover:text-brand-orange text-sm font-medium transition-colors"
        >
          Повернутися до входу
        </button>
      </div>
    </>
  );
};

const ForgotForm = ({ onSwitch }: { onSwitch: (mode: AuthMode) => void }) => {
  return (
    <>
      <div className="space-y-5">
        <p className="text-gray-400 text-sm text-center italic mb-4">
          Ми надішлемо інструкцію на ваш E-mail
        </p>
        <input
          type="email"
          placeholder="Ваш E-mail"
          className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none text-[16px]"
        />
      </div>
      <div className="pt-8 flex flex-col items-center gap-4">
        <PawButton variant="accent" className="min-w-48 bg-brand-orange text-white">
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
    </>
  );
};

// --- Основний компонент сторінки ---
export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  const titles = {
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

          <form
            onSubmit={(e) => {
              return e.preventDefault();
            }}
          >
            {mode === 'login' && <LoginForm onSwitch={setMode} />}
            {mode === 'register' && <RegisterForm onSwitch={setMode} />}
            {mode === 'forgot' && <ForgotForm onSwitch={setMode} />}
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 right-12 hidden lg:block text-gray-400 text-sm">
        © 2026 Котейка. Всі права захищені.
      </div>
    </main>
  );
}
