'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PawButton } from '@/components/ui/PawButton';
import { PawLink } from '@/components/ui/PawLink';

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute left-[-5%] bottom-0 w-[70%] h-[90%] pointer-events-none z-0">
        <Image
          src="/login-page-cat2.webp"
          alt="Cat background"
          fill
          className="object-contain object-bottom select-none"
          priority
        />
      </div>

      <div className="max-w-7xl w-full flex justify-end relative z-10 ">
        <div className="w-full max-w-140 bg-white rounded-[30px] shadow-xl p-8 md:p-12 border border-gray-50 relative overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none">
            <Image
              src="/paw.svg"
              alt=""
              width={128}
              height={128}
              className="object-contain rotate-135"
            />
          </div>

          <Link
            href="/"
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </Link>

          <div className="mb-10 text-center">
            <h1 className="text-[28px] font-bold text-[#1A202C]">Увійти в кабінет</h1>
          </div>

          <form className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Ваш E-mail"
                className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[16px] placeholder:text-gray-400"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Пароль"
                className="w-full h-13 px-8 rounded-full border border-gray-200 focus:border-brand-yellow focus:outline-none transition-all text-[16px] placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 px-4 text-[16px]">
              <Link href="#" className="text-gray-400 hover:text-brand-orange transition-colors">
                Забули пароль?
              </Link>
              <PawLink href="/register">Ще немає аккаунту?</PawLink>
            </div>

            <div className="pt-8 flex justify-center">
              <PawButton variant="accent" className="w-full max-w-40 bg-brand-orange text-white">
                Увійти
              </PawButton>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 right-12 hidden lg:block text-gray-400 text-sm">
        © 2026 Котейка. Всі права захищені.
      </div>
    </main>
  );
}
