import { BookingStatus, Role } from '@prisma/client';
import { hashSync } from 'bcrypt';

const VERIFIED_AT = new Date('2026-04-10T09:00:00.000Z');

export const Users = [
  {
    id: 1,
    name: 'Олександр',
    surname: 'Адміненко',
    email: 'admin@hotel.com',
    phone: '+380501112233',
    password: hashSync('111111', 10),
    role: Role.ADMIN,
    verified: VERIFIED_AT,
  },
  {
    id: 2,
    name: 'Марія',
    surname: 'Коваленко',
    email: 'user@example.com',
    phone: '+380674445566',
    password: hashSync('111112', 10),
    role: Role.USER,
    verified: VERIFIED_AT,
  },
  {
    id: 3,
    name: 'Ірина',
    surname: 'Савчук',
    email: 'employee@hotel.com',
    phone: '+380931234567',
    password: hashSync('111113', 10),
    role: Role.EMPLOYEE,
    verified: VERIFIED_AT,
  },
  {
    id: 4,
    name: 'Дмитро',
    surname: 'Мельник',
    email: 'client2@example.com',
    phone: '+380661234567',
    password: hashSync('111114', 10),
    role: Role.USER,
    verified: VERIFIED_AT,
  },
];

export const RoomAreas = [
  { id: 1, value: 0.63 },
  { id: 2, value: 0.9 },
  { id: 3, value: 1.13 },
  { id: 4, value: 1.56 },
  { id: 5, value: 2.56 },
  { id: 6, value: 2.88 },
];

export const Features = [
  { id: 1, name: 'Лежак', price: 0, imageUrl: '/icons/bed.svg' },
  { id: 2, name: 'Кігтеточка', price: 0, imageUrl: '/icons/scratch.svg' },
  { id: 3, name: 'Ігровий комплекс', price: 0, imageUrl: '/icons/complex.svg' },
  { id: 4, name: 'Будиночок', price: 0, imageUrl: '/icons/house.svg' },
];

export const Services = [
  {
    id: 1,
    name: 'Грумінг',
    price: 300,
    description: 'Дбайливе вичісування та базовий догляд за шерстю.',
  },
  {
    id: 2,
    name: 'Фото-звіт',
    price: 100,
    description: 'Фото та короткий апдейт про настрій котика протягом дня.',
  },
  {
    id: 3,
    name: 'Індивідуальна гра',
    price: 180,
    description: 'Додатковий ігровий час з доглядачем.',
  },
  {
    id: 4,
    name: 'Контроль ліків',
    price: 250,
    description: 'Нагляд за графіком прийому ліків та відмітки в картці.',
  },
];

export const RoomCategories = [
  {
    id: 1,
    name: 'Економ',
    description:
      'Затишний базовий номер для спокійного відпочинку котика. Розміри (ШхГхВ): 90х70х180 см',
    price: 100,
    widthCm: 90,
    depthCm: 70,
    heightCm: 180,
    areaId: 1,
  },
  {
    id: 2,
    name: 'Економ плюс',
    description:
      "Більше простору та м'який лежак для комфортного сну. Розміри (ШхГхВ): 90х100х180 см",
    price: 200,
    widthCm: 90,
    depthCm: 100,
    heightCm: 180,
    areaId: 2,
  },
  {
    id: 3,
    name: 'Комфорт',
    description:
      'Оптимальний номер з ігровою зоною для активних хвостиків. Розміри (ШхГхВ): 100х125х180 см',
    price: 250,
    widthCm: 100,
    depthCm: 125,
    heightCm: 180,
    areaId: 3,
  },
  {
    id: 4,
    name: 'Сьют',
    description:
      'Просторий номер з підвищеним комфортом для довгого проживання. Розміри (ШхГхВ): 125х125х180 см',
    price: 350,
    widthCm: 125,
    depthCm: 125,
    heightCm: 180,
    areaId: 4,
  },
  {
    id: 5,
    name: 'Люкс',
    description:
      'Преміальний номер з будиночком та ігровим комплексом. Розміри (ШхГхВ): 160х160х180 см',
    price: 500,
    widthCm: 160,
    depthCm: 160,
    heightCm: 180,
    areaId: 5,
  },
  {
    id: 6,
    name: 'Супер-Люкс',
    description:
      'Максимальний простір та топове оснащення для найвибагливіших гостей. Розміри (ШхГхВ): 180х160х180 см',
    price: 600,
    widthCm: 180,
    depthCm: 160,
    heightCm: 180,
    areaId: 6,
  },
];

export const RoomCategoryFeatures = [
  { roomCategoryId: 2, featureIds: [1, 2] },
  { roomCategoryId: 3, featureIds: [1, 2, 3] },
  { roomCategoryId: 4, featureIds: [1, 2, 3] },
  { roomCategoryId: 5, featureIds: [1, 2, 3, 4] },
  { roomCategoryId: 6, featureIds: [1, 2, 3, 4] },
];

export const Rooms = [
  { id: 1, name: 'Економ 1', categoryId: 1 },
  { id: 2, name: 'Економ 2', categoryId: 1 },
  { id: 3, name: 'Економ 3', categoryId: 1 },
  { id: 4, name: 'Економ 4', categoryId: 1 },
  { id: 5, name: 'Економ плюс 1', categoryId: 2 },
  { id: 6, name: 'Економ плюс 2', categoryId: 2 },
  { id: 7, name: 'Економ плюс 3', categoryId: 2 },
  { id: 8, name: 'Комфорт 1', categoryId: 3 },
  { id: 9, name: 'Комфорт 2', categoryId: 3 },
  { id: 10, name: 'Сьют 1', categoryId: 4 },
  { id: 11, name: 'Сьют 2', categoryId: 4 },
  { id: 12, name: 'Люкс 1', categoryId: 5 },
  { id: 13, name: 'Супер-Люкс 1', categoryId: 6 },
];

export const Cats = [
  {
    id: 1,
    name: 'Мурчик',
    breed: 'Британська короткошерста',
    birthDate: new Date('2021-06-14T00:00:00.000Z'),
    notes: 'Спокійний, любить лежаки та тишу.',
    ownerId: 2,
  },
  {
    id: 2,
    name: 'Персик',
    breed: 'Мейн-кун',
    birthDate: new Date('2020-03-09T00:00:00.000Z'),
    notes: 'Активний, потребує ігор та додаткової уваги.',
    ownerId: 4,
  },
  {
    id: 3,
    name: 'Луна',
    breed: 'Шотландська висловуха',
    birthDate: new Date('2022-11-21T00:00:00.000Z'),
    notes: 'Полюбляє будиночки та мʼякі пледи.',
    ownerId: 4,
  },
];

export const Bookings = [
  {
    id: 1,
    startDate: new Date('2026-04-01T12:00:00.000Z'),
    endDate: new Date('2026-04-05T12:00:00.000Z'),
    totalPrice: 1300,
    status: BookingStatus.SUCCEEDED,
    userId: 2,
    paymentId: 'pay_demo_0001',
  },
  {
    id: 2,
    startDate: new Date('2026-04-15T12:00:00.000Z'),
    endDate: new Date('2026-04-20T12:00:00.000Z'),
    totalPrice: 2750,
    status: BookingStatus.PENDING,
    userId: 4,
    paymentId: 'pay_demo_0002',
  },
];

export const BookingItems = [
  { id: 1, bookingId: 1, roomId: 5, catId: 1, priceAtBooking: 800 },
  { id: 2, bookingId: 2, roomId: 12, catId: 2, priceAtBooking: 2500 },
];

export const BookingItemServices = [
  { id: 1, bookingItemId: 1, serviceId: 1, quantity: 1, price: 300 },
  { id: 2, bookingItemId: 1, serviceId: 2, quantity: 2, price: 100 },
  { id: 3, bookingItemId: 2, serviceId: 4, quantity: 1, price: 250 },
];

export const Reviews = [
  {
    id: 1,
    rating: 5,
    comment: 'Котик повернувся спокійний і доглянутий, сервіс відмінний.',
    userId: 2,
    bookingId: 1,
  },
];

export const News = [
  {
    id: 1,
    title: 'Весняне оновлення номерів',
    content: 'Додали нові лежаки та ігрові елементи в категоріях Комфорт, Люкс та Супер-Люкс.',
    imageUrl: '/rooms/comfort.jpg',
    isPublished: true,
    authorId: 1,
  },
  {
    id: 2,
    title: 'Запустили щоденні фото-звіти',
    content:
      'Тепер можна замовити окрему послугу з фото-звітом, щоб бачити, як відпочиває ваш котик.',
    imageUrl: '/amenities/photos/toy-cat.jpg',
    isPublished: true,
    authorId: 1,
  },
];

export const CatReports = [
  {
    id: 1,
    date: new Date('2026-04-03T09:30:00.000Z'),
    notes: 'Добрий апетит, активний в першій половині дня, без змін у поведінці.',
    catId: 1,
    employeeId: 3,
  },
];

export const ReportImages = [
  { id: 1, url: '/amenities/photos/bed.jpg', reportId: 1 },
  { id: 2, url: '/amenities/photos/scratcher-cat.jpg', reportId: 1 },
];

export const VerificationCodes = [
  {
    id: 1,
    code: 'CATHOTEL-VERIFY-0004',
    userId: 4,
    createdAt: new Date('2026-04-10T09:15:00.000Z'),
  },
];
