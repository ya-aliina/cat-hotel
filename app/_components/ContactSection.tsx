'use client';

import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export function ContactSection() {
  const address = 'Київ, вул. Костянтинівська, 19';
  const phone = '+38 (099) 123-45-67';
  const email = 'hello@cathotel.com';

  return (
    <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px] overflow-hidden">
      <div className="bg-[#FAC663] w-full md:w-[41.6%] p-10 md:p-12 lg:p-16 flex flex-col justify-center">
        <h2 className="text-3xl md:text-[36px] font-bold text-[#1A202C] mb-8">Як нас знайти</h2>

        <div className="space-y-5 text-[#1A202C]">
          <div className="flex gap-4 items-start">
            <MapPin className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[18px]">Адреса</h4>
              <p className="text-[16px] leading-relaxed">{address}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <Clock className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[18px]">Режим роботи</h4>
              <p className="text-[16px]">Щодня, з 9:00 до 20:00</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <Phone className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[18px]">Телефон</h4>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="text-[16px] hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <Mail className="w-6 h-6 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[18px]">E-mail</h4>
              <a href={`mailto:${email}`} className="text-[16px] hover:underline">
                {email}
              </a>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-[18px] mb-4">Соціальні мережі</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70 transition-opacity">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[58.4%] h-[350px] md:h-full relative bg-[#E5E3DF]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.516584281781!2d30.510343276901967!3d50.46872588636402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce157796d119%3A0xc023c080353c7c7a!2z0YPQuy4g0JrQvtC90YHRgtCw0L3RgtC40L3QvtCy0YHQutCw0Y8sIDE5LCDQmtC40LXQsiwgMDIwMDA!5e0!3m2!1sru!2sua!4v1710447000000!5m2!1sru!2sua"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
          allowFullScreen
          loading="lazy"
          title="Карта"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Image src="/logo.svg" alt="Marker" width={60} height={60} className="drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
}
