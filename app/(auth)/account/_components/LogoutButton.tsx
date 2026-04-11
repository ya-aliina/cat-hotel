'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { PawButton } from '@/components/ui/PawButton';

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);

    const result = await signOut({
      callbackUrl: '/',
      redirect: false,
    });

    router.push(result.url ?? '/');
    router.refresh();
  };

  return (
    <PawButton
      type="button"
      variant="accent"
      className="bg-brand-orange text-white"
      onClick={handleLogout}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Виходимо...' : 'Вийти'}
    </PawButton>
  );
}
