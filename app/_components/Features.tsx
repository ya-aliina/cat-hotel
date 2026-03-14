import Image from 'next/image';
import { memo } from 'react';

const FEATURES_DATA = [
  {
    title: 'Комфортна температура',
    description:
      'У всіх номерах підтримується комфортна температура в межах 23 - 25 градусів. В кожному номері можна додатково відрегулювати температуру.',
    icon: '/thermometer.svg',
  },
  {
    title: 'Відеоспостереження',
    description:
      "Ми надаємо доступ до нашої системи. Ви зможете стежити за своїм вихованцем зі свого смартфона або комп'ютера.",
    icon: '/video-camera.svg',
  },
  {
    title: 'Послуги Зоотаксі',
    description: 'Ми приїдемо за вашим вихованцем у будь-який район міста Київ.',
    icon: '/taxi.svg',
  },
  {
    title: 'Збалансоване харчування',
    description:
      'Ви можете привезти свій корм або довірити раціон свого вихованця нашим професіоналам.',
    icon: '/food.svg',
  },
  {
    title: 'Щоденні прогулянки',
    description:
      'За вашим бажанням ми вигулюємо вашого вихованця два рази в день на спеціалізованій закритій території.',
    icon: '/walking.svg',
  },
  {
    title: 'Найкращі ветеринари',
    description:
      'В готелі 24 години чергує ветеринарний лікар, який надасть будь-яку допомогу в разі необхідності.',
    icon: '/vet.svg',
  },
];

const Features = memo(() => {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute top-5 right-0 z-0 pointer-events-none rotate-[25deg] ">
        <Image
          src="/paw.svg"
          alt=""
          width={400}
          height={400}
          className="w-[367px] h-auto"
          priority={false}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A202C] mb-16">
          Чому ми?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature) => {
            return (
              <div
                key={feature.title}
                className="p-8 rounded-[8px] bg-white border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAC663] flex items-center justify-center mb-8">
                  <div className="relative w-8 h-8">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-contain invert brightness-0"
                    />
                  </div>
                </div>

                <h3 className="text-[22px] font-bold text-[#1A202C] mb-4">{feature.title}</h3>

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
