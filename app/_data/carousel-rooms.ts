export type CarouselRoom = {
  title: string;
  image: string;
  features: string[];
};

export const CAROUSEL_ROOMS: CarouselRoom[] = [
  {
    title: 'Економ плюс',
    image: '/rooms/economy-plus.jpg',
    features: ['Площа: 0,90 м²', 'Розміри (ШхГхВ): 90х100х180 см', 'Ціна за добу: 200₴'],
  },
  {
    title: 'Комфорт',
    image: '/rooms/comfort.jpg',
    features: ['Площа: 1,50 м²', 'Розміри (ШхГхВ): 120x100x180 см', 'Ціна за добу: 500₴'],
  },
  {
    title: 'Люкс',
    image: '/rooms/lux.jpg',
    features: ['Площа: 2,50 м²', 'Розміри (ШхГхВ): 150x120x180 см', 'Ціна за добу: 800₴'],
  },
];
