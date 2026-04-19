'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  wrapperClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, className, label, onChange, wrapperClassName, ...props }, ref) => {
    return (
      <label
        className={cn(
          'flex items-center gap-3 cursor-pointer text-[16px] text-brand-text hover:text-brand-orange transition-colors',
          wrapperClassName,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn('w-5 h-5 accent-brand-yellow rounded cursor-pointer', className)}
          {...props}
        />
        {label}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
