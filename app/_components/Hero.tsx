'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PawButton } from '@/components/ui/PawButton';

const Hero = () => {
  const router = useRouter();

  const handleBookClick = () => {
    router.push('/rooms');
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full min-h-137.5 sm:h-128">
        {/* Background image */}
        <picture>
          <source media="(min-width: 640px)" srcSet="/hero.png" />
          <Image
            src="/hero-mobile.png"
            alt="Котейка"
            fill
            priority
            className="object-cover object-center sm:object-[center_20%]"
          />
        </picture>

        {/* Content area */}
        <div className="absolute inset-0 flex items-start sm:items-center">
          <div className="container mx-auto px-4 md:px-10 lg:px-33.75">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-12 sm:pt-0">
              <p className="text-sm md:text-base font-medium mb-2 opacity-90">м. Київ</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                Котейка
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-65 sm:max-w-md leading-relaxed">
                Затишний готель для котів і кішок
              </p>
              <div className="w-full sm:w-auto">
                <PawButton className="mx-auto sm:mx-0" onClick={handleBookClick}>
                  Забронювати
                </PawButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
