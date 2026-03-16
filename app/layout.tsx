import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

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
        <Header />
        <main className="bg-[#FFFDFB]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
