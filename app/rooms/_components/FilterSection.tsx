import type { ReactNode } from 'react';

type FilterSectionProps = {
  title: string;
  children: ReactNode;
};

export const FilterSection = ({ title, children }: FilterSectionProps) => {
  return (
    <section>
      <h4 className="font-bold mb-4 text-brand-text">{title}</h4>
      {children}
    </section>
  );
};
