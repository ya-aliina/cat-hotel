'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { type ReactNode, useEffect } from 'react';

export function AccountGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [router, status]);

  if (status !== 'authenticated') return null;

  return <>{children}</>;
}
