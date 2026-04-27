import { describe, expect, test } from '@jest/globals';

import { bookingSchema } from '@/components/shared/BookingPaymentModal';

describe('Валідація бронювання', () => {
  const validBooking = {
    dateFrom: '2026-05-01',
    dateTo: '2026-05-03',
    items: [
      {
        catId: '1',
        newPetName: '',
        secondCatId: '',
        secondNewPetName: '',
        roomId: '2',
        serviceIds: ['1', '2'],
      },
    ],
  };

  test('Перевірка коректного бронювання', () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  test('Перевірка заборони дати виїзду раніше або в той самий день', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      dateFrom: '2026-05-03',
      dateTo: '2026-05-01',
    });

    expect(result.success).toBe(false);
  });

  test('Перевірка заборони вибору одного улюбленця двічі', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      items: [
        {
          catId: '1',
          newPetName: '',
          secondCatId: '1',
          secondNewPetName: '',
          roomId: '2',
          serviceIds: [],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test('Перевірка додавання нового улюбленця з коректним іменем', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      items: [
        {
          catId: '__new__',
          newPetName: 'Мурчик',
          secondCatId: '',
          secondNewPetName: '',
          roomId: '2',
          serviceIds: [],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  test('Перевірка помилки для імені нового улюбленця з цифрами', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      items: [
        {
          catId: '__new__',
          newPetName: 'Кіт123',
          secondCatId: '',
          secondNewPetName: '',
          roomId: '2',
          serviceIds: [],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
