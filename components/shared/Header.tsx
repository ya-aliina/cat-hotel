'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { PawLink } from '@/components/ui/PawLink';
import { isAuthenticated, onAuthChange } from '@/lib/auth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  const aboutLinks = [
    { title: 'Чому ми', href: '/#why-us' },
    { title: 'Номери', href: '/#rooms' },
    { title: 'Як нас знайти', href: '/#contacts' },
    { title: 'Відгуки', href: '/#reviews' },
  ];

  const navLinks = useMemo(() => {
    return [
      { title: 'Про нас', href: '/' },
      { title: 'Номери', href: '/rooms' },
      authed ? { title: 'Акаунт', href: '/account' } : { title: 'Вхід', href: '/login' },
    ];
  }, [authed]);

  useEffect(() => {
    const sync = () => {
      setAuthed(isAuthenticated());
    };

    sync();
    const unsubscribe = onAuthChange(sync);

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <div className="shrink-0 flex items-center cursor-pointer group">
            <Link href="/" className="w-12 h-10 relative flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="logo"
                width={48}
                height={40}
                className="w-full h-full object-contain"
              />
            </Link>
          </div>

          {/* Desktop навігація */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <div className="relative group/about-menu">
              <PawLink href={navLinks[0].href}>{navLinks[0].title}</PawLink>

              <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover/about-menu:opacity-100 group-hover/about-menu:visible group-hover/about-menu:translate-y-0">
                <div className="min-w-52 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
                  <div className="flex flex-col gap-1">
                    {aboutLinks.map((link) => {
                      return (
                        <Link
                          key={link.title}
                          href={link.href}
                          className="rounded-lg px-3 py-2 text-[15px] font-medium text-brand-text transition-colors hover:text-brand-orange hover:bg-gray-50"
                        >
                          {link.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => {
              return (
                <PawLink key={link.title} href={link.href}>
                  {link.title}
                </PawLink>
              );
            })}
          </nav>

          {/* Мобільна кнопка */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-brand-text hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col space-y-4">
          {navLinks.map((link) => {
            return (
              <PawLink
                key={link.title}
                href={link.href}
                onClick={() => {
                  return setIsOpen(false);
                }}
                className="w-fit"
              >
                <span className="text-lg font-semibold">{link.title}</span>
              </PawLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
