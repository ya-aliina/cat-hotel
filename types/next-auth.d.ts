import type { Role } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: number;
      phone: string;
      provider: string | null;
      role: Role;
      surname: string;
    };
  }

  interface User {
    id: number;
    image?: string | null;
    phone: string;
    provider?: string | null;
    role: Role;
    surname: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    picture?: string | null;
    phone?: string;
    provider?: string | null;
    role?: Role;
    surname?: string;
  }
}
