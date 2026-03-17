import { type Room } from '../_components/RoomCard';

export const ROOMS: Room[] = [
  {
    id: '1',
    title: 'Економ',
    image: '/rooms/economy.jpg',
    size: '90x70x180',
    area: 0.63,
    equipment: ['none'],
    price: 100,
  },
  {
    id: '2',
    title: 'Економ плюс',
    image: '/rooms/economy-plus.jpg',
    size: '90x100x180',
    area: 0.9,
    equipment: ['bed', 'scratcher'],
    price: 200,
  },
  {
    id: '3',
    title: 'Комфорт',
    image: '/rooms/comfort.jpg',
    size: '100x125x180',
    area: 1.13,
    equipment: ['bed', 'scratcher', 'toy'],
    price: 250,
  },
  {
    id: '4',
    title: 'Сьют',
    image: '/rooms/suite.jpg',
    size: '125x125x180',
    area: 1.56,
    equipment: ['bed', 'scratcher', 'toy'],
    price: 350,
  },
  {
    id: '5',
    title: 'Люкс',
    image: '/rooms/lux.jpg',
    size: '160x160x180',
    area: 2.56,
    equipment: ['bed', 'scratcher', 'toy', 'house'],
    price: 500,
  },
  {
    id: '6',
    title: 'Супер-Люкс',
    image: '/rooms/super-lux.jpg',
    size: '180x160x180',
    area: 2.88,
    equipment: ['bed', 'scratcher', 'toy', 'house'],
    price: 600,
  },
];

export const AMENITIES = [
  { label: 'Пустий номер', id: 'none' },
  { label: 'Лежак', id: 'bed' },
  { label: 'Кігтеточка', id: 'scratcher' },
  { label: 'Ігровий комплекс', id: 'toy' },
  { label: 'Будиночок', id: 'house' },
] as const;

export const AREAS = ['0,63 м2', '0,90 м2', '1,13 м2', '1,56 м2', '2,56 м2', '2,88 м2'] as const;
