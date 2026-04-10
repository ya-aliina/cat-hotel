import type {
  Booking,
  BookingItem,
  BookingItemService,
  Cat,
  CatReport,
  Feature,
  News,
  Prisma,
  ReportImage,
  Review,
  Room,
  RoomArea,
  RoomCategory,
  Service,
  User,
  VerificationCode,
} from '@prisma/client';

export type PublicUser = Omit<User, 'password'>;

export type CatSummary = Pick<
  Cat,
  'id' | 'name' | 'breed' | 'birthDate' | 'notes' | 'ownerId' | 'createdAt' | 'updatedAt'
>;

export type UserDto = PublicUser & {
  bookings: Booking[];
  cats: CatSummary[];
  news: News[];
  reports: CatReport[];
  reviews: Review[];
  verificationCode: VerificationCode | null;
};

export type OwnerDto = PublicUser & {
  cats: CatSummary[];
};

export type CatDto = Cat & {
  bookingItems: BookingItem[];
  owner: OwnerDto;
  reports: CatReport[];
};

export type CatReportDto = CatReport & {
  cat: Cat;
  employee: PublicUser;
  images: ReportImage[];
};

export type ReportImageDto = ReportImage & {
  report: CatReport;
};

export type RoomCategoryDto = RoomCategory & {
  area: RoomArea;
  features: Feature[];
  rooms: Room[];
};

export type RoomDto = Room & {
  bookingItems: BookingItem[];
  category: RoomCategory;
};

export type RoomAreaDto = RoomArea & {
  categories: RoomCategory[];
};

export type FeatureDto = Feature & {
  roomCategories: RoomCategory[];
};

export type ServiceDto = Service & {
  bookingItemServices: BookingItemService[];
};

export type ReviewDto = Review & {
  booking: Booking | null;
  user: PublicUser;
};

export type BookingItemDto = BookingItem & {
  booking: Booking;
  cat: Cat;
  room: Room;
  services: BookingItemService[];
};

export type BookingItemServiceDto = BookingItemService & {
  bookingItem: BookingItem;
  service: Service;
};

export type BookingDto = Booking & {
  bookingItems: BookingItem[];
  review: Review | null;
  user: PublicUser;
};

export type NewsDto = News & {
  author: PublicUser;
};

export type VerificationCodeDto = VerificationCode & {
  user: PublicUser;
};

export type UserCreateInput = Prisma.UserUncheckedCreateInput;
export type UserUpdateInput = Prisma.UserUncheckedUpdateInput;
export type CatCreateInput = Prisma.CatUncheckedCreateInput;
export type CatUpdateInput = Prisma.CatUncheckedUpdateInput;
export type CatReportCreateInput = Prisma.CatReportUncheckedCreateInput;
export type CatReportUpdateInput = Prisma.CatReportUncheckedUpdateInput;
export type ReportImageCreateInput = Prisma.ReportImageUncheckedCreateInput;
export type ReportImageUpdateInput = Prisma.ReportImageUncheckedUpdateInput;
export type RoomCategoryCreateInput = Prisma.RoomCategoryUncheckedCreateInput;
export type RoomCategoryUpdateInput = Prisma.RoomCategoryUncheckedUpdateInput;
export type RoomCreateInput = Prisma.RoomUncheckedCreateInput;
export type RoomUpdateInput = Prisma.RoomUncheckedUpdateInput;
export type RoomAreaCreateInput = Prisma.RoomAreaUncheckedCreateInput;
export type RoomAreaUpdateInput = Prisma.RoomAreaUncheckedUpdateInput;
export type FeatureCreateInput = Prisma.FeatureUncheckedCreateInput;
export type FeatureUpdateInput = Prisma.FeatureUncheckedUpdateInput;
export type ServiceCreateInput = Prisma.ServiceUncheckedCreateInput;
export type ServiceUpdateInput = Prisma.ServiceUncheckedUpdateInput;
export type ReviewCreateInput = Prisma.ReviewUncheckedCreateInput;
export type ReviewUpdateInput = Prisma.ReviewUncheckedUpdateInput;
export type BookingItemCreateInput = Prisma.BookingItemUncheckedCreateInput;
export type BookingItemUpdateInput = Prisma.BookingItemUncheckedUpdateInput;
export type BookingItemServiceCreateInput = Prisma.BookingItemServiceUncheckedCreateInput;
export type BookingItemServiceUpdateInput = Prisma.BookingItemServiceUncheckedUpdateInput;
export type BookingCreateInput = Prisma.BookingUncheckedCreateInput;
export type BookingUpdateInput = Prisma.BookingUncheckedUpdateInput;
export type NewsCreateInput = Prisma.NewsUncheckedCreateInput;
export type NewsUpdateInput = Prisma.NewsUncheckedUpdateInput;
export type VerificationCodeCreateInput = Prisma.VerificationCodeUncheckedCreateInput;
export type VerificationCodeUpdateInput = Prisma.VerificationCodeUncheckedUpdateInput;
