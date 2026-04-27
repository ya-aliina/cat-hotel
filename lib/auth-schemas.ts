import { z } from 'zod';

const nameFieldSchema = z
  .string()
  .trim()
  .min(2, 'Мінімум 2 символи.')
  .regex(/^[^\d]+$/, 'Не повинно містити цифр.');

const emailFieldSchema = z
  .string()
  .trim()
  .min(1, 'Обовʼязкове поле.')
  .email('Некоректний формат email.');

const passwordFieldSchema = z
  .string()
  .min(6, 'Пароль має містити мінімум 6 символів.')
  .regex(/[A-Za-z]/, 'Пароль має містити хоча б одну літеру.')
  .regex(/[0-9]/, 'Пароль має містити хоча б одну цифру.');

const phoneFieldSchema = z
  .string()
  .trim()
  .refine((value) => !value || value.length >= 10, 'Вкажіть номер телефону.')
  .refine((value) => !value || /^[+()\-\s\d]+$/.test(value), 'Некоректний формат телефону.');

export const loginSchema = z.object({
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export const emailRequestSchema = z.object({
  email: emailFieldSchema,
});

export const registerInputSchema = z.object({
  name: nameFieldSchema,
  surname: nameFieldSchema,
  phone: phoneFieldSchema,
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export const registerFormSchema = registerInputSchema
  .extend({
    confirmPassword: z.string().min(1, 'Обовʼязкове поле.'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Паролі не співпадають.',
      path: ['confirmPassword'],
    },
  );

export const accountProfileInputSchema = z.object({
  email: emailFieldSchema,
  name: nameFieldSchema,
  phone: phoneFieldSchema.nullable().optional(),
  surname: nameFieldSchema,
});

export const accountPasswordInputSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Обовʼязкове поле.'),
    currentPassword: z.string().trim().optional(),
    newPassword: passwordFieldSchema,
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    {
      message: 'Паролі не співпадають.',
      path: ['confirmPassword'],
    },
  );

export const resetPasswordFormSchema = z
  .object({
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, 'Обовʼязкове поле.'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Паролі не співпадають.',
      path: ['confirmPassword'],
    },
  );

export const resetPasswordInputSchema = z.object({
  password: passwordFieldSchema,
  token: z.string().min(1, 'Некоректний токен.'),
});

export type LoginData = z.infer<typeof loginSchema>;
export type EmailRequestData = z.infer<typeof emailRequestSchema>;
export type AccountProfileInputData = z.infer<typeof accountProfileInputSchema>;
export type AccountPasswordInputData = z.infer<typeof accountPasswordInputSchema>;
export type RegisterData = z.infer<typeof registerFormSchema>;
export type RegisterInputData = z.infer<typeof registerInputSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordInputData = z.infer<typeof resetPasswordInputSchema>;
