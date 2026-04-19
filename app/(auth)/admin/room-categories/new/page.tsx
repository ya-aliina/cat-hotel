import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/lib/auth';

import { RoomCategoryEditorPage } from '../../_components/RoomCategoryEditorPage';

export default async function AdminRoomCategoryCreatePage() {
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
        <RoomCategoryEditorPage mode="create" />
      </div>
    </main>
  );
}
