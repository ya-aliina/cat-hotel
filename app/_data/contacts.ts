import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export const contactItems = [
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

export const socialLinks = [
  { id: 'facebook', Icon: Facebook, href: '#' },
  { id: 'instagram', Icon: Instagram, href: '#' },
];
