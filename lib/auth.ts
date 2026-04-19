import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getAppBaseUrl } from '@/lib/app-url';
import { validateUserCredentials } from '@/lib/auth-flow';
import { loginSchema } from '@/lib/auth-schemas';
import { prisma } from '@/prisma/prisma-client';

const developmentSecret = 'cat-hotel-dev-secret-change-me';

const authSecret = process.env.NEXTAUTH_SECRET;
const authBaseUrl = getAppBaseUrl();
const userSessionSelect = {
  email: true,
  id: true,
  name: true,
  phone: true,
  provider: true,
  role: true,
  surname: true,
} as const;

function hasConfiguredValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  return !/^(fake-|your-|replace-)/i.test(value);
}

function splitGoogleProfileName(fullName: string | null | undefined, fallbackEmail: string) {
  const normalizedName = fullName?.trim();

  if (!normalizedName) {
    return {
      name: fallbackEmail.split('@')[0] ?? 'Google',
      surname: '',
    };
  }

  const [name, ...surnameParts] = normalizedName.split(/\s+/);

  return {
    name,
    surname: surnameParts.join(' '),
  };
}

async function createOauthPassword() {
  return hash(randomBytes(32).toString('hex'), 12);
}

async function syncGoogleUser(params: {
  email: string | null | undefined;
  name: string | null | undefined;
  providerId: string | null | undefined;
}) {
  const email = params.email?.trim();
  const providerId = params.providerId?.trim();

  if (!email || !providerId) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      surname: true,
    },
  });

  const fallbackName = splitGoogleProfileName(params.name, email);

  if (existingUser) {
    return prisma.user.update({
      where: { email },
      data: {
        name: existingUser.name || fallbackName.name,
        provider: 'google',
        providerId,
        surname: existingUser.surname || fallbackName.surname,
        verified: new Date(),
      },
      select: userSessionSelect,
    });
  }

  return prisma.user.create({
    data: {
      email,
      name: fallbackName.name,
      password: await createOauthPassword(),
      phone: null,
      provider: 'google',
      providerId,
      surname: fallbackName.surname,
      verified: new Date(),
    },
    select: userSessionSelect,
  });
}

async function getUserSessionPayload(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email },
    select: userSessionSelect,
  });
}

function applyUserToToken(
  token: {
    email?: string | null;
    id?: number;
    name?: string | null;
    picture?: string | null;
    phone?: string;
    provider?: string | null;
    role?: 'USER' | 'EMPLOYEE' | 'ADMIN';
    surname?: string;
  },
  user: {
    email: string;
    id: number;
    image?: string | null;
    name: string;
    phone: string | null;
    provider?: string | null;
    role: 'USER' | 'EMPLOYEE' | 'ADMIN';
    surname: string;
  },
) {
  token.email = user.email;
  token.id = user.id;
  token.picture = user.image ?? token.picture ?? null;
  token.name = user.name;
  token.phone = user.phone ?? '';
  token.provider = user.provider ?? null;
  token.role = user.role;
  token.surname = user.surname;

  return token;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleProvider =
  hasConfiguredValue(googleClientId) && hasConfiguredValue(googleClientSecret)
    ? GoogleProvider({
        clientId: googleClientId!,
        clientSecret: googleClientSecret!,
      })
    : null;

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    debug(code, metadata) {
      console.info('[next-auth][debug]', code, metadata ?? '');
    },
    error(code, metadata) {
      console.error('[next-auth][error]', code, metadata ?? '');
    },
    warn(code) {
      console.warn('[next-auth][warn]', code);
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    ...(googleProvider ? [googleProvider] : []),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const result = await validateUserCredentials(
          parsedCredentials.data.email,
          parsedCredentials.data.password,
        );

        if (result.status !== 'ok') {
          return null;
        }

        return result.user;
      },
    }),
  ],
  secret: authSecret ?? (process.env.NODE_ENV === 'development' ? developmentSecret : undefined),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    redirect({ url }) {
      if (url.startsWith('/')) {
        return `${authBaseUrl}${url}`;
      }

      try {
        if (new URL(url).origin === new URL(authBaseUrl).origin) {
          return url;
        }
      } catch {
        return authBaseUrl;
      }

      return authBaseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') {
        return true;
      }

      try {
        const syncedUser = await syncGoogleUser({
          email: user.email ?? (typeof profile?.email === 'string' ? profile.email : undefined),
          name: user.name ?? (typeof profile?.name === 'string' ? profile.name : undefined),
          providerId: account.providerAccountId,
        });

        if (!syncedUser) {
          console.error('Google sign-in sync skipped: missing email or provider id', {
            email: user.email ?? (typeof profile?.email === 'string' ? profile.email : null),
            provider: account.provider,
            providerId: account.providerAccountId,
          });
        }

        return Boolean(syncedUser);
      } catch (error) {
        console.error('Google sign-in sync failed', error);

        return false;
      }
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session) {
        const sessionUpdate = session as {
          email?: string | null;
          image?: string | null;
          name?: string | null;
          phone?: string | null;
          provider?: string | null;
          surname?: string | null;
        };

        if (typeof sessionUpdate.email === 'string') {
          token.email = sessionUpdate.email;
        }

        if (typeof sessionUpdate.image === 'string' || sessionUpdate.image === null) {
          token.picture = sessionUpdate.image;
        }

        if (typeof sessionUpdate.name === 'string') {
          token.name = sessionUpdate.name;
        }

        if (typeof sessionUpdate.phone === 'string' || sessionUpdate.phone === null) {
          token.phone = sessionUpdate.phone ?? '';
        }

        if (typeof sessionUpdate.provider === 'string' || sessionUpdate.provider === null) {
          token.provider = sessionUpdate.provider;
        }

        if (typeof sessionUpdate.surname === 'string') {
          token.surname = sessionUpdate.surname;
        }
      }

      if (account?.provider === 'google') {
        const syncedUser = await getUserSessionPayload(user.email);

        if (syncedUser) {
          return applyUserToToken(token, {
            ...syncedUser,
            image: typeof user.image === 'string' ? user.image : token.picture ?? null,
          });
        }
      }

      if (user) {
        return applyUserToToken(token, {
          email: user.email ?? '',
          id: Number(user.id),
          image: typeof user.image === 'string' ? user.image : token.picture ?? null,
          name: user.name ?? '',
          phone: typeof user.phone === 'string' ? user.phone : '',
          role: user.role ?? 'USER',
          surname: typeof user.surname === 'string' ? user.surname : '',
        });
      }

      if (typeof token.id !== 'number' && token.email) {
        const dbUser = await getUserSessionPayload(token.email);

        if (dbUser) {
          return applyUserToToken(token, dbUser);
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? null;
        session.user.id = Number(token.id);
        session.user.image = typeof token.picture === 'string' ? token.picture : null;
        session.user.name = token.name ?? null;
        session.user.phone = typeof token.phone === 'string' ? token.phone : '';
        session.user.provider = typeof token.provider === 'string' ? token.provider : null;
        session.user.role = token.role ?? 'USER';
        session.user.surname = typeof token.surname === 'string' ? token.surname : '';
      }

      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
