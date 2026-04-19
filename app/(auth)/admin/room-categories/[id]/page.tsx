import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/lib/auth';

import { RoomCategoryEditorPage } from '../../_components/RoomCategoryEditorPage';

type AdminRoomCategoryEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminRoomCategoryEditPage({
  params,
}: AdminRoomCategoryEditPageProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/account');
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    redirect('/admin');
  }

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <RoomCategoryEditorPage mode="edit" categoryId={categoryId} />
      </div>
    </main>
  );
}
