import Link from 'next/link';

import { getPasswordResetTokenState } from '@/lib/auth-flow';

import { ResetPasswordForm } from './_components/ResetPasswordForm';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const tokenState = token ? await getPasswordResetTokenState(token) : 'invalid';

  return (
    <main className="min-h-[calc(100vh-80px)] bg-brand-surface flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-[30px] border border-gray-100 bg-white p-8 shadow-xl md:p-12">
        <h1 className="text-center text-[28px] font-bold text-brand-text">Новий пароль</h1>

        {tokenState === 'valid' && token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="mt-8 space-y-4 text-center">
            <p className="text-[16px] text-brand-text">
              {tokenState === 'expired'
                ? 'Термін дії посилання для зміни пароля минув.'
                : 'Посилання для зміни пароля недійсне.'}
            </p>
            <p className="text-sm text-gray-400">
              Поверніться до відновлення пароля та запросіть новий лист.
            </p>
            <p className="text-sm text-gray-400">
              Якщо ви відкрили старий лист, використайте самое нове посилання зі скриньки.
            </p>
            <Link
              href="/login"
              className="inline-block text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
            >
              Повернутися до входу
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
