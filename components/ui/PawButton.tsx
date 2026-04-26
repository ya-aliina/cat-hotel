import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import PawIcon from './icons/PawIcon';

interface ButtonStyle {
  button: string;
  circle: string;
  icon: string;
}

const variants: Record<'default' | 'accent', ButtonStyle> = {
  default: {
    button: 'bg-white text-brand-text',
    circle: 'bg-orange-500',
    icon: 'text-white',
  },
  accent: {
    button: 'bg-brand-orange text-white',
    circle: 'bg-white',
    icon: 'text-brand-orange',
  },
};

type PawVariant = keyof typeof variants;

interface PawButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  variant?: PawVariant;
  icon?: ReactNode;
}

export const PawButton = ({
  className,
  children,
  onClick,
  disabled,
  variant = 'default',
  type = 'button',
  icon,
  ...props
}: PawButtonProps) => {
  const style = variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-between gap-4 rounded-full p-2 pl-6 font-medium shadow cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100',
        style.button,
        className,
      )}
      {...props}
    >
      <span className="text-[16px] whitespace-nowrap">{children}</span>

      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full rotate-[-10deg] translate-x-px translate-y-px',
          style.circle,
        )}
      >
        {icon ?? <PawIcon className={cn('h-5 w-5', style.icon)} />}
      </span>
    </button>
  );
};
