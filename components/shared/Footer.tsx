'use client';

import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PawLink } from '@/components/ui/PawLink';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { title: 'Про нас', href: '/' },
  { title: 'Номери', href: '/rooms' },
  { title: 'Вхід', href: '/login' },
];

const CONTACT_INFO = [
  { id: 'phone', icon: Phone, text: '+38 (099) 123-45-67', href: 'tel:+380991234567' },
  { id: 'email', icon: Mail, text: 'hello@cathotel.com', href: 'mailto:hello@cathotel.com' },
];

const SOCIAL_LINKS = [
  { id: 'instagram', icon: Instagram, href: '#', label: 'Instagram' },
  { id: 'facebook', icon: Facebook, href: '#', label: 'Facebook' },
];

const Footer = ({ className }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-white border-t border-gray-100 pt-16 font-sans', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-6">
              <Image src="/logo.svg" alt="Logo" width={60} height={50} className="object-contain" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-50">
              Найкращий відпочинок для вашого котика. Комфорт, турбота та безпека у кожному номері.
            </p>
          </div>

          {/* Навігація */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-widest">
              Навігація
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => {
                return (
                  <li key={link.title}>
                    <PawLink href={link.href} className="text-gray-500 hover:text-brand-orange">
                      {link.title}
                    </PawLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Контакти з лапкою */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-widest">
              Контакти
            </h4>
            <ul className="space-y-3">
              {CONTACT_INFO.map((item) => {
                return (
                  <li key={item.id}>
                    <PawLink href={item.href} className="text-gray-500 hover:text-brand-orange">
                      <div className="flex items-center">
                        <item.icon size={16} className="mr-3 text-brand-orange shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    </PawLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Соцмережі */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-widest">
              Ми у соцмережах
            </h4>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => {
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all"
                  >
                    <social.icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row justify-between text-[13px] text-gray-400">
          <p>© {currentYear} Cat Hotel. Всі права захищені.</p>
          <div className="flex space-x-8 mt-4 md:mt-0 justify-center">
            <Link href="/privacy" className="hover:text-brand-orange transition-colors">
              Політика конфіденційності
            </Link>
            <Link href="/terms" className="hover:text-brand-orange transition-colors">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
