import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const isError = !!error;

    return (
      <div className={cn('w-full', className)}>
        <input
          type={type}
          className={cn(
            'w-full h-13 px-8 rounded-full border focus:outline-none text-[16px] transition-colors',
            isError
              ? 'border-destructive/70 focus:border-destructive'
              : 'border-gray-200 focus:border-brand-yellow',
            type === 'date' && 'px-4',
          )}
          ref={ref}
          {...props}
        />
        {isError && <p className="mt-1 ml-4 text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
