'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { isAuthenticated, onAuthChange } from '@/lib/auth';

export function AccountGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const authed = isAuthenticated();

      if (!authed) {
        router.replace('/login');
        return;
      }

      setIsAllowed(true);
    };

    sync();
    const unsubscribe = onAuthChange(sync);

    return () => {
      unsubscribe();
    };
  }, [router]);

  if (!isAllowed) return null;

  return <>{children}</>;
}
