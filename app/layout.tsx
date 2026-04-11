import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cat Hotel',
  description:
    '«Котейка» — готель для котів в Україні. Комфорт, турбота та безпека для вашого улюбленця.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ua" className={cn('font-sans', inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-20`}
        suppressHydrationWarning
      >
        <AuthSessionProvider>
          <Header />
          <main className="bg-brand-surface-alt">{children}</main>
          <Footer />
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
