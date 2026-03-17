'use client';

import { useRouter } from 'next/navigation';

import { PawButton } from '@/components/ui/PawButton';
import { signOut } from '@/lib/auth';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <PawButton type="button" variant="accent" className="bg-brand-orange text-white" onClick={handleLogout}>
      Вийти
    </PawButton>
  );
}
