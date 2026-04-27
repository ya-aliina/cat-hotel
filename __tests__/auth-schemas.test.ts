import { describe, expect, test } from '@jest/globals';

import { loginSchema, registerFormSchema } from '@/lib/auth-schemas';

describe('Валідація авторизації', () => {
  test('Перевірка входу з коректними email і паролем', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'Test123',
    });

    expect(result.success).toBe(true);
  });

  test('Перевірка помилки для некоректного email', () => {
    const result = loginSchema.safeParse({
      email: 'invalidEmail',
      password: 'Test123',
    });

    expect(result.success).toBe(false);
  });

  test('Перевірка помилки, якщо паролі при реєстрації не співпадають', () => {
    const result = registerFormSchema.safeParse({
      name: 'Аліна',
      surname: 'Маковій',
      phone: '+380991112233',
      email: 'alina@example.com',
      password: 'Secret123',
      confirmPassword: 'Secret321',
    });

    expect(result.success).toBe(false);
  });

  test('Перевірка заборони цифр в імені користувача', () => {
    const result = registerFormSchema.safeParse({
      name: 'Alina1',
      surname: 'Makovii',
      phone: '+380991112233',
      email: 'alina@example.com',
      password: 'Secret123',
      confirmPassword: 'Secret123',
    });

    expect(result.success).toBe(false);
  });

  test('Перевірка заборони пароля тільки з цифр', () => {
    const result = registerFormSchema.safeParse({
      name: 'Alina',
      surname: 'Makovii',
      phone: '+380991112233',
      email: 'alina@example.com',
      password: '123456',
      confirmPassword: '123456',
    });

    expect(result.success).toBe(false);
  });
});
