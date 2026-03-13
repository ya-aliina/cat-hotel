import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

interface FooterProps {
  className?: string;
}

/**
 * Data for the navigation column
 */
const NAV_LINKS = [
  { title: 'Про нас', href: '/' },
  { title: 'Номери', href: '/rooms' },
  { title: 'Галерея', href: '/gallery' },
  { title: 'Вхід', href: '/login' },
];

/**
 * Contact information data
 */
const CONTACT_INFO = [
  { id: 'phone', icon: Phone, text: '+38 (099) 123-45-67', href: 'tel:+380991234567' },
  { id: 'email', icon: Mail, text: 'hello@cathotel.com', href: 'mailto:hello@cathotel.com' },
];

/**
 * Social media links data
 */
const SOCIAL_LINKS = [
  { id: 'instagram', icon: Instagram, href: '#', label: 'Instagram' },
  { id: 'facebook', icon: Facebook, href: '#', label: 'Facebook' },
];

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-white border-t border-gray-100 pt-16 font-sans", className)}>
      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Column 1: Brand Logo & Description */}
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-6">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
              Найкращий відпочинок для вашого котика. Комфорт, турбота та безпека у кожному номері.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-[0.1em]">Навігація</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#FF7236] transition-colors text-[15px]"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-[0.1em]">Контакти</h4>
            <ul className="space-y-4">
              {CONTACT_INFO.map((item) => (
                <li key={item.id} className="flex items-center">
                  <item.icon size={16} className="mr-3 text-[#FF7236]" />
                  <a
                    href={item.href}
                    className="text-gray-500 hover:text-[#FF7236] transition-colors text-[15px]"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Media Icons */}
          <div>
            <h4 className="text-[#1A202C] font-bold mb-6 text-xs uppercase tracking-[0.1em]">Ми у соцмережах</h4>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF7236] hover:border-[#FF7236] transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-400">
            <p>© {currentYear} Cat Hotel. Всі права захищені.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-gray-600 transition-colors">
                Політика конфіденційності
              </Link>
              <Link href="/terms" className="hover:text-gray-600 transition-colors">
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
