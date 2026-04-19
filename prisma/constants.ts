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
  { id: 1, value: 0.63, widthCm: 90, depthCm: 70, heightCm: 180 },
  { id: 2, value: 0.9, widthCm: 90, depthCm: 100, heightCm: 180 },
  { id: 3, value: 1.13, widthCm: 100, depthCm: 125, heightCm: 180 },
  { id: 4, value: 1.56, widthCm: 125, depthCm: 125, heightCm: 180 },
  { id: 5, value: 2.56, widthCm: 160, depthCm: 160, heightCm: 180 },
  { id: 6, value: 2.88, widthCm: 180, depthCm: 160, heightCm: 180 },
];

export const Features = [
  { id: 1, name: 'Лежак', price: 0, imageUrl: '/amenities/bed.svg' },
  { id: 2, name: 'Кігтеточка', price: 0, imageUrl: '/amenities/scratcher.svg' },
  { id: 3, name: 'Ігровий комплекс', price: 0, imageUrl: '/amenities/toy.svg' },
  { id: 4, name: 'Будиночок', price: 0, imageUrl: '/amenities/house.svg' },
  { id: 5, name: 'Пустий номер', price: 0, imageUrl: '/amenities/none.svg' },
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
    description: 'Затишний базовий номер для спокійного відпочинку котика.',
    price: 100,
    roomCount: 4,
    areaId: 1,
  },
  {
    id: 2,
    name: 'Економ плюс',
    description: "Більше простору та м'який лежак для комфортного сну.",
    price: 200,
    roomCount: 3,
    areaId: 2,
  },
  {
    id: 3,
    name: 'Комфорт',
    description: 'Оптимальний номер з ігровою зоною для активних хвостиків.',
    price: 250,
    roomCount: 2,
    areaId: 3,
  },
  {
    id: 4,
    name: 'Сьют',
    description: 'Просторий номер з підвищеним комфортом для довгого проживання.',
    price: 350,
    roomCount: 2,
    areaId: 4,
  },
  {
    id: 5,
    name: 'Люкс',
    description: 'Преміальний номер з будиночком та ігровим комплексом.',
    price: 500,
    roomCount: 1,
    areaId: 5,
  },
  {
    id: 6,
    name: 'Супер-Люкс',
    description: 'Максимальний простір та топове оснащення для найвибагливіших гостей.',
    price: 600,
    roomCount: 1,
    areaId: 6,
  },
];

export const RoomCategoryFeatures = [
  { roomCategoryId: 1, featureIds: [5] },
  { roomCategoryId: 2, featureIds: [1, 2] },
  { roomCategoryId: 3, featureIds: [1, 2, 3] },
  { roomCategoryId: 4, featureIds: [1, 2, 3] },
  { roomCategoryId: 5, featureIds: [1, 2, 3, 4] },
  { roomCategoryId: 6, featureIds: [1, 2, 3, 4] },
];

export const RoomCategoryImages = [
  { id: 1, roomCategoryId: 1, sortOrder: 0, isCover: true, url: '/rooms/economy.jpg' },
  { id: 2, roomCategoryId: 1, sortOrder: 1, isCover: false, url: '/amenities/photos/none.jpg' },
  { id: 3, roomCategoryId: 1, sortOrder: 2, isCover: false, url: '/room1.jpg' },
  { id: 4, roomCategoryId: 1, sortOrder: 3, isCover: false, url: '/room2.jpg' },

  { id: 5, roomCategoryId: 2, sortOrder: 0, isCover: true, url: '/rooms/economy-plus.jpg' },
  { id: 6, roomCategoryId: 2, sortOrder: 1, isCover: false, url: '/amenities/photos/bed.jpg' },
  {
    id: 7,
    roomCategoryId: 2,
    sortOrder: 2,
    isCover: false,
    url: '/amenities/photos/scratcher-cat.jpg',
  },
  { id: 8, roomCategoryId: 2, sortOrder: 3, isCover: false, url: '/room3.jpg' },

  { id: 9, roomCategoryId: 3, sortOrder: 0, isCover: true, url: '/rooms/comfort.jpg' },
  { id: 10, roomCategoryId: 3, sortOrder: 1, isCover: false, url: '/amenities/photos/bed.jpg' },
  {
    id: 11,
    roomCategoryId: 3,
    sortOrder: 2,
    isCover: false,
    url: '/amenities/photos/scratcher-cat.jpg',
  },
  { id: 12, roomCategoryId: 3, sortOrder: 3, isCover: false, url: '/amenities/photos/toy-cat.jpg' },

  { id: 13, roomCategoryId: 4, sortOrder: 0, isCover: true, url: '/rooms/suite.jpg' },
  { id: 14, roomCategoryId: 4, sortOrder: 1, isCover: false, url: '/amenities/photos/bed.jpg' },
  {
    id: 15,
    roomCategoryId: 4,
    sortOrder: 2,
    isCover: false,
    url: '/amenities/photos/scratcher-cat.jpg',
  },
  { id: 16, roomCategoryId: 4, sortOrder: 3, isCover: false, url: '/amenities/photos/toy-cat.jpg' },

  { id: 17, roomCategoryId: 5, sortOrder: 0, isCover: true, url: '/rooms/lux.jpg' },
  { id: 18, roomCategoryId: 5, sortOrder: 1, isCover: false, url: '/amenities/photos/house.jpg' },
  { id: 19, roomCategoryId: 5, sortOrder: 2, isCover: false, url: '/amenities/photos/toy-cat.jpg' },
  { id: 20, roomCategoryId: 5, sortOrder: 3, isCover: false, url: '/room1.jpg' },

  { id: 21, roomCategoryId: 6, sortOrder: 0, isCover: true, url: '/rooms/super-lux.jpg' },
  { id: 22, roomCategoryId: 6, sortOrder: 1, isCover: false, url: '/amenities/photos/house.jpg' },
  { id: 23, roomCategoryId: 6, sortOrder: 2, isCover: false, url: '/amenities/photos/toy-cat.jpg' },
  {
    id: 24,
    roomCategoryId: 6,
    sortOrder: 3,
    isCover: false,
    url: '/amenities/photos/scratcher-cat.jpg',
  },
];

export const PerfectForItems = [
  {
    id: 1,
    imageUrl: '/marketing-icons/clock.svg',
    description: 'Короткого перебування (1-3 дні)',
  },
  {
    id: 2,
    imageUrl: '/marketing-icons/heart.svg',
    description: 'Спокійних або літніх котиків',
  },
  {
    id: 3,
    imageUrl: '/marketing-icons/package.svg',
    description: 'Розміщення з власними улюбленими речами',
  },
  {
    id: 4,
    imageUrl: '/marketing-icons/cat.svg',
    description: 'Котиків середнього розміру',
  },
  {
    id: 5,
    imageUrl: '/marketing-icons/bed-double.svg',
    description: "Любителів міцно поспати (м'який лежак включено)",
  },
  {
    id: 6,
    imageUrl: '/marketing-icons/calendar-days.svg',
    description: 'Перебування на вихідні (2-4 дні)',
  },
  {
    id: 7,
    imageUrl: '/marketing-icons/activity.svg',
    description: 'Активних та енергійних улюбленців',
  },
  {
    id: 8,
    imageUrl: '/marketing-icons/gamepad-2.svg',
    description: 'Тиха забава (є ігровий комплекс)',
  },
  {
    id: 9,
    imageUrl: '/marketing-icons/sun-medium.svg',
    description: 'Збалансованого відпочинку до одного тижня',
  },
  {
    id: 10,
    imageUrl: '/marketing-icons/scaling.svg',
    description: 'Великих порід (Мейн-кун, Бенгал)',
  },
  {
    id: 11,
    imageUrl: '/marketing-icons/users.svg',
    description: 'Спільного проживання 2-х котиків з однієї родини',
  },
  {
    id: 12,
    imageUrl: '/marketing-icons/calendar-check.svg',
    description: 'Тривалого перебування (від 7 днів)',
  },
  {
    id: 13,
    imageUrl: '/marketing-icons/home.svg',
    description: 'Цінителів приватності (є особистий будиночок)',
  },
  {
    id: 14,
    imageUrl: '/marketing-icons/shield-check.svg',
    description: 'Тривожних хвостиків, що люблять тишу та затишок',
  },
  {
    id: 15,
    imageUrl: '/marketing-icons/maximize.svg',
    description: 'Великого простору для ігор та відпочинку',
  },
  {
    id: 16,
    imageUrl: '/marketing-icons/crown.svg',
    description: 'VIP-гостей та найвибагливіших пухнастиків',
  },
  {
    id: 17,
    imageUrl: '/marketing-icons/expand.svg',
    description: 'Максимального простору (можна вільно бігати)',
  },
  {
    id: 18,
    imageUrl: '/marketing-icons/users-2.svg',
    description: 'Великих котячих сімей (до 4-х котиків)',
  },
];

export const RoomCategoryPerfectForItems = [
  { roomCategoryId: 1, perfectForIds: [1, 2, 3] },
  { roomCategoryId: 2, perfectForIds: [4, 5, 6] },
  { roomCategoryId: 3, perfectForIds: [7, 8, 9] },
  { roomCategoryId: 4, perfectForIds: [10, 11, 12] },
  { roomCategoryId: 5, perfectForIds: [13, 14, 15] },
  { roomCategoryId: 6, perfectForIds: [16, 17, 18] },
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

export const VerificationCodes = [];
