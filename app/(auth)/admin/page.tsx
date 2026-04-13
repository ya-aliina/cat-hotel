import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/lib/auth';

import { AdminDashboard } from './_components/AdminDashboard';

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/account');
  }

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-brand-text">Адмін-кабінет</h1>
          <p className="mt-3 text-[16px] text-brand-text-subtle">
            Керування ролями, відгуками, категоріями номерів, номерами та активними бронюваннями.
          </p>
        </div>

        <AdminDashboard />
      </div>
    </main>
  );
}
