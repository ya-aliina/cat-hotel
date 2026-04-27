import { mapRoomCategoryToRoom } from '@/app/rooms/_utils/roomCatalog';

describe('Маппінг каталогу номерів', () => {
  const category: any = {
    id: 1,
    name: 'Люкс',
    description: 'Просторий номер. Розміри (ШxГxВ): 100x80x90 см',
    price: '1200',
    roomCount: 3,
    rooms: [],
    area: {
      value: 2.5,
      widthCm: 100,
      depthCm: 80,
      heightCm: 90,
    },
    images: [
      { url: '/second.jpg', isCover: false, sortOrder: 1 },
      { url: '/cover.jpg', isCover: true, sortOrder: 2 },
    ],
    features: [{ id: 10, name: 'Відеоспостереження', imageUrl: '/camera.svg' }],
    perfectFor: [],
  };

  test('Перевірка перетворення категорії номера у формат картки', () => {
    const room = mapRoomCategoryToRoom(category);

    expect(room).toMatchObject({
      id: '1',
      title: 'Люкс',
      price: 1200,
      image: '/cover.jpg',
      size: '100x80x90',
      area: 2.5,
      availableRooms: 3,
    });
  });

  test('Перевірка видалення технічних розмірів з опису номера', () => {
    const room = mapRoomCategoryToRoom(category);

    expect(room.description).toBe('Просторий номер.');
  });
});
