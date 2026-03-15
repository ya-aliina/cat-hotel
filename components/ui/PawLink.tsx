import Link from 'next/link';
import { ReactNode } from 'react';

import PawIcon from '@/components/ui/icons/PawIcon';
import { cn } from '@/lib/utils';

interface PawLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const PawLink = ({ href, children, className, onClick }: PawLinkProps) => {
  return (
    <div className={cn('relative group flex items-center w-fit', className)}>
      <Link
        href={href}
        onClick={onClick}
        className="relative z-10 block py-2 group-hover:text-brand-orange text-[15px] font-medium transition-colors duration-300"
      >
        {children}
      </Link>

      <div className="absolute z-0 pointer-events-none w-5.75 h-5.75 -right-4.5 top-0.5">
        <PawIcon
          className="w-full h-full text-brand-orange opacity-0 transform -rotate-12 scale-90 
                     group-hover:opacity-30 group-hover:rotate-0 group-hover:scale-110 
                     transition-all duration-600 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
        />
      </div>
    </div>
  );
};
