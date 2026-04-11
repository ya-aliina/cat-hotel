export type DateTimeString = string;
export type DecimalString = string;

export type Role = 'USER' | 'EMPLOYEE' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'SUCCEEDED' | 'CANCELLED';

export interface UserBase {
  createdAt: DateTimeString;
  email: string;
  id: number;
  name: string;
  phone: string;
  provider: string | null;
  providerId: string | null;
  role: Role;
  surname: string;
  updatedAt: DateTimeString;
  verified: DateTimeString;
}

export interface CatBase {
  birthDate: DateTimeString | null;
  breed: string | null;
  createdAt: DateTimeString;
  id: number;
  name: string;
  notes: string | null;
  ownerId: number;
  updatedAt: DateTimeString;
}

export interface CatReportBase {
  catId: number;
  date: DateTimeString;
  employeeId: number;
  id: number;
  notes: string;
}

export interface ReportImageBase {
  id: number;
  reportId: number;
  url: string;
}

export interface RoomAreaBase {
  createdAt: DateTimeString;
  id: number;
  updatedAt: DateTimeString;
  value: number;
}

export interface RoomCategoryBase {
  areaId: number;
  createdAt: DateTimeString;
  depthCm: number;
  description: string | null;
  heightCm: number;
  id: number;
  name: string;
  price: DecimalString;
  updatedAt: DateTimeString;
  widthCm: number;
}

export interface RoomCategoryImageBase {
  createdAt: DateTimeString;
  id: number;
  isCover: boolean;
  roomCategoryId: number;
  sortOrder: number;
  updatedAt: DateTimeString;
  url: string;
}

export interface PerfectForItemBase {
  createdAt: DateTimeString;
  description: string;
  id: number;
  imageUrl: string;
  updatedAt: DateTimeString;
}

export interface RoomBase {
  categoryId: number;
  createdAt: DateTimeString;
  id: number;
  name: string;
  updatedAt: DateTimeString;
}

export interface FeatureBase {
  createdAt: DateTimeString;
  id: number;
  imageUrl: string;
  name: string;
  price: DecimalString;
  updatedAt: DateTimeString;
}

export interface ServiceBase {
  createdAt: DateTimeString;
  description: string | null;
  id: number;
  name: string;
  price: DecimalString;
  updatedAt: DateTimeString;
}

export interface ReviewBase {
  bookingId: number | null;
  comment: string | null;
  createdAt: DateTimeString;
  id: number;
  rating: number;
  updatedAt: DateTimeString;
  userId: number;
}

export interface BookingItemBase {
  bookingId: number;
  catId: number;
  id: number;
  priceAtBooking: DecimalString;
  roomId: number;
}

export interface BookingItemServiceBase {
  bookingItemId: number;
  id: number;
  price: DecimalString;
  quantity: number;
  serviceId: number;
}

export interface BookingBase {
  createdAt: DateTimeString;
  endDate: DateTimeString;
  id: number;
  paymentId: string | null;
  startDate: DateTimeString;
  status: BookingStatus;
  totalPrice: DecimalString;
  updatedAt: DateTimeString;
  userId: number;
}

export interface NewsBase {
  authorId: number;
  content: string;
  createdAt: DateTimeString;
  id: number;
  imageUrl: string | null;
  isPublished: boolean;
  title: string;
  updatedAt: DateTimeString;
}

export interface VerificationCodeBase {
  code: string;
  createdAt: DateTimeString;
  id: number;
  userId: number;
}

export type PublicUser = UserBase;
export type CatSummary = CatBase;

export interface UserDto extends PublicUser {
  bookings: BookingBase[];
  cats: CatSummary[];
  news: NewsBase[];
  reports: CatReportBase[];
  reviews: ReviewBase[];
  verificationCode: VerificationCodeBase | null;
}

export interface OwnerDto extends PublicUser {
  cats: CatSummary[];
}

export interface CatDto extends CatBase {
  bookingItems: BookingItemBase[];
  owner: OwnerDto;
  reports: CatReportBase[];
}

export interface CatReportDto extends CatReportBase {
  cat: CatBase;
  employee: PublicUser;
  images: ReportImageBase[];
}

export interface ReportImageDto extends ReportImageBase {
  report: CatReportBase;
}

export interface RoomCategoryDto extends RoomCategoryBase {
  area: RoomAreaBase;
  features: FeatureBase[];
  images: RoomCategoryImageBase[];
  perfectFor: PerfectForItemBase[];
  rooms: RoomBase[];
}

export interface RoomCategoryImageDto extends RoomCategoryImageBase {
  roomCategory: RoomCategoryBase;
}

export interface PerfectForItemDto extends PerfectForItemBase {
  roomCategories: RoomCategoryBase[];
}

export interface RoomDto extends RoomBase {
  bookingItems: BookingItemBase[];
  category: RoomCategoryBase;
}

export interface RoomAreaDto extends RoomAreaBase {
  categories: RoomCategoryBase[];
}

export interface FeatureDto extends FeatureBase {
  roomCategories: RoomCategoryBase[];
}

export interface ServiceDto extends ServiceBase {
  bookingItemServices: BookingItemServiceBase[];
}

export interface ReviewDto extends ReviewBase {
  booking: BookingBase | null;
  user: PublicUser;
}

export interface BookingItemDto extends BookingItemBase {
  booking: BookingBase;
  cat: CatBase;
  room: RoomBase;
  services: BookingItemServiceBase[];
}

export interface BookingItemServiceDto extends BookingItemServiceBase {
  bookingItem: BookingItemBase;
  service: ServiceBase;
}

export interface BookingDto extends BookingBase {
  bookingItems: BookingItemBase[];
  review: ReviewBase | null;
  user: PublicUser;
}

export interface NewsDto extends NewsBase {
  author: PublicUser;
}

export interface VerificationCodeDto extends VerificationCodeBase {
  user: PublicUser;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  phone: string;
  provider?: string | null;
  providerId?: string | null;
  role?: Role;
  surname: string;
  verified: DateTimeString;
}

export type UserUpdateInput = Partial<UserCreateInput>;

export interface CatCreateInput {
  birthDate?: DateTimeString | null;
  breed?: string | null;
  name: string;
  notes?: string | null;
  ownerId: number;
}

export type CatUpdateInput = Partial<CatCreateInput>;

export interface CatReportCreateInput {
  catId: number;
  date?: DateTimeString;
  employeeId: number;
  notes: string;
}

export type CatReportUpdateInput = Partial<CatReportCreateInput>;

export interface ReportImageCreateInput {
  reportId: number;
  url: string;
}

export type ReportImageUpdateInput = Partial<ReportImageCreateInput>;

export interface RoomCategoryCreateInput {
  areaId: number;
  depthCm: number;
  description?: string | null;
  heightCm: number;
  name: string;
  price: DecimalString;
  widthCm: number;
}

export type RoomCategoryUpdateInput = Partial<RoomCategoryCreateInput>;

export interface RoomCategoryImageCreateInput {
  isCover?: boolean;
  roomCategoryId: number;
  sortOrder?: number;
  url: string;
}

export type RoomCategoryImageUpdateInput = Partial<RoomCategoryImageCreateInput>;

export interface PerfectForItemCreateInput {
  description: string;
  imageUrl: string;
}

export type PerfectForItemUpdateInput = Partial<PerfectForItemCreateInput>;

export interface RoomCreateInput {
  categoryId: number;
  name: string;
}

export type RoomUpdateInput = Partial<RoomCreateInput>;

export interface RoomAreaCreateInput {
  value: number;
}

export type RoomAreaUpdateInput = Partial<RoomAreaCreateInput>;

export interface FeatureCreateInput {
  imageUrl: string;
  name: string;
  price: DecimalString;
}

export type FeatureUpdateInput = Partial<FeatureCreateInput>;

export interface ServiceCreateInput {
  description?: string | null;
  name: string;
  price: DecimalString;
}

export type ServiceUpdateInput = Partial<ServiceCreateInput>;

export interface ReviewCreateInput {
  bookingId?: number | null;
  comment?: string | null;
  rating: number;
  userId: number;
}

export type ReviewUpdateInput = Partial<ReviewCreateInput>;

export interface BookingItemCreateInput {
  bookingId: number;
  catId: number;
  priceAtBooking: DecimalString;
  roomId: number;
}

export type BookingItemUpdateInput = Partial<BookingItemCreateInput>;

export interface BookingItemServiceCreateInput {
  bookingItemId: number;
  price: DecimalString;
  quantity?: number;
  serviceId: number;
}

export type BookingItemServiceUpdateInput = Partial<BookingItemServiceCreateInput>;

export interface BookingCreateInput {
  endDate: DateTimeString;
  paymentId?: string | null;
  startDate: DateTimeString;
  status?: BookingStatus;
  totalPrice: DecimalString;
  userId: number;
}

export type BookingUpdateInput = Partial<BookingCreateInput>;

export interface NewsCreateInput {
  authorId: number;
  content: string;
  imageUrl?: string | null;
  isPublished?: boolean;
  title: string;
}

export type NewsUpdateInput = Partial<NewsCreateInput>;

export interface VerificationCodeCreateInput {
  code: string;
  userId: number;
}

export type VerificationCodeUpdateInput = Partial<VerificationCodeCreateInput>;
