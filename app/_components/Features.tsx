import Image from 'next/image';
import { memo } from 'react';

import { FEATURES_DATA } from '../_data/features';

const Features = memo(() => {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute top-5 right-0 z-0 pointer-events-none rotate-25 ">
        <Image
          src="/paw.svg"
          alt=""
          width={400}
          height={400}
          className="w-91.75 h-auto"
          priority={false}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Чому ми?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature) => {
            return (
              <div
                key={feature.title}
                className="p-8 rounded-[8px] bg-white border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center mb-8">
                  <div className="relative w-8 h-8">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-contain invert brightness-0"
                    />
                  </div>
                </div>

                <h3 className="text-[22px] font-bold mb-4">{feature.title}</h3>

                <p className="text-gray-500 leading-relaxed text-[15px]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';

export default Features;
