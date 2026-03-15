'use client';

import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const contactItems = [
  {
    id: 'address',
    Icon: MapPin,
    title: 'Адреса',
    text: 'Київ, вул. Костянтинівська, 19',
  },
  {
    id: 'hours',
    Icon: Clock,
    title: 'Режим роботи',
    text: 'Щодня, з 9:00 до 20:00',
  },
  {
    id: 'phone',
    Icon: Phone,
    title: 'Телефон',
    text: '+38 (099) 123-45-67',
    href: 'tel:+380991234567',
  },
  {
    id: 'email',
    Icon: Mail,
    title: 'E-mail',
    text: 'hello@cathotel.com',
    href: 'mailto:hello@cathotel.com',
  },
];

const socialLinks = [
  { id: 'facebook', Icon: Facebook, href: '#' },
  { id: 'instagram', Icon: Instagram, href: '#' },
];

export function ContactSection() {
  return (
    <section className="w-full bg-[#E5E3DF] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,500px)_minmax(0,780px)_1fr] h-auto md:h-[500px]">
        <div className="hidden md:block col-start-1 col-end-3 row-start-1 bg-brand-yellow" />

        <div className="col-start-1 md:col-start-2 md:col-end-3 row-start-1 bg-brand-yellow md:bg-transparent z-10 flex flex-col justify-center px-4 sm:px-6 lg:pl-8 lg:pr-12 py-10 md:py-0">
          <h2 className="text-3xl md:text-[36px] font-bold mb-8">Як нас знайти</h2>

          <div className="space-y-6">
            {contactItems.map(({ id, Icon, title, text, href }) => {
              return (
                <div key={id} className="flex gap-4 items-start">
                  <Icon className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[18px]">{title}</h4>
                    {href ? (
                      <a href={href} className="text-[16px] hover:underline transition-all">
                        {text}
                      </a>
                    ) : (
                      <p className="text-[16px] leading-relaxed">{text}</p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <h4 className="font-bold text-[18px] mb-4">Соціальні мережі</h4>
              <div className="flex gap-4">
                {socialLinks.map(({ id, Icon, href }) => {
                  return (
                    <a key={id} href={href} className="hover:opacity-70 transition-opacity">
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-start-1 md:col-start-3 md:col-end-5 row-start-2 md:row-start-1 relative h-[350px] md:h-full overflow-hidden">
          <div className="absolute top-0 left-0 right-0 -bottom-[60px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.88045330335!2d30.5121453!3d50.468233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce4281f629ab%3A0x6313cd2edb6bc566!2z0LLRg9C7LiDQmtC-0YHRgtGP0L3RgtC40L3RltCy0YHRjNC60LAsIDE5LCDQmtC40ZfQsiwgMDIwMDA!5e0!3m2!1sru!2sua!4v1700000000000!5m2!1sru!2sua"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: 'contrast(1.2) opacity(0.8)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
