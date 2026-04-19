import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith('/admin')) {
        return token?.role === 'ADMIN';
      }

      return Boolean(token);
    },
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
