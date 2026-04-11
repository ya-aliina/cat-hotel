import Link from 'next/link';

import { consumeEmailVerificationToken } from '@/lib/auth-flow';

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const result = token ? await consumeEmailVerificationToken(token) : 'invalid';

  const message = {
    'already-verified': 'Цей email уже підтверджено.',
    expired: 'Термін дії посилання підтвердження минув.',
    invalid: 'Посилання підтвердження недійсне.',
    success: 'Email успішно підтверджено.',
  }[result];

  const helperText = {
    'already-verified': 'Ви можете увійти до особистого кабінету.',
    expired: 'Поверніться на сторінку входу і запросіть новий лист підтвердження.',
    invalid: 'Перевірте посилання або запросіть новий лист підтвердження.',
    success: 'Тепер ви можете увійти до особистого кабінету.',
  }[result];

  return (
    <main className="min-h-[calc(100vh-80px)] bg-brand-surface flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-[30px] border border-gray-100 bg-white p-8 text-center shadow-xl md:p-12">
        <h1 className="text-[28px] font-bold text-brand-text">Підтвердження email</h1>
        <div className="mt-8 space-y-4">
          <p className="text-[16px] text-brand-text">{message}</p>
          <p className="text-sm text-gray-400">{helperText}</p>
          {(result === 'expired' || result === 'invalid') && (
            <p className="text-sm text-gray-400">
              На сторінці входу відкрийте форму підтвердження email і запросіть новий лист.
            </p>
          )}
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-brand-orange transition-colors hover:text-brand-text"
          >
            Перейти до входу
          </Link>
        </div>
      </div>
    </main>
  );
}
