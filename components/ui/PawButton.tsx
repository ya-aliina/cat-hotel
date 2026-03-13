import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import PawIcon from './icons/PawIcon';

interface PawButtonProps {
  className?: string;
  children: ReactNode;
  variant?: 'accent' | 'default';
  onClick?: () => void;
}

export const PawButton = ({
  className,
  children,
  onClick,
  variant = 'default',
}: PawButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 rounded-full p-2 pl-4  font-medium shadow cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300 ease-out hover:scale-[1.03]',
        variant === 'accent' ? 'bg-red-500' : 'bg-white',
        className,
      )}
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 rotate-[-10deg] translate-x-[1px] translate-y-[1px]">
        <PawIcon className="h-5 w-5 text-white " />
      </span>
    </button>
  );
};
