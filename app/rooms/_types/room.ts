export type RoomFeature = {
  icon?: string;
  id: string;
  label: string;
};

export type RoomMarketingPoint = {
  description: string;
  imageUrl: string;
};

export interface Room {
  area: number;
  availableRooms: number;
  categoryId: number;
  description: string;
  equipment: string[];
  equipmentDetails: RoomFeature[];
  gallery: string[];
  id: string;
  image: string;
  perfectFor: RoomMarketingPoint[];
  price: number;
  size: string;
  slug: string;
  title: string;
}
