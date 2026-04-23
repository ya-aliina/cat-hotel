import type { RoomCategoryDto } from '@/services/types';

import type { Room } from '../_types/room';

function sanitizeRoomDescription(description: string | null | undefined) {
  if (!description) {
    return '';
  }

  return description
    .replace(/\s*Розміри\s*\(Ш[хx×]Г[хx×]В\):\s*\d+\s*[xх×]\s*\d+\s*[xх×]\s*\d+\s*см\s*/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function resolveRoomSize(category: RoomCategoryDto) {
  const dimensions = [category.area.widthCm, category.area.depthCm, category.area.heightCm];

  if (
    dimensions.every((value) => {
      return typeof value === 'number' && Number.isFinite(value);
    })
  ) {
    return `${category.area.widthCm}x${category.area.depthCm}x${category.area.heightCm}`;
  }

  return '';
}

export function mapRoomCategoryToRoom(category: RoomCategoryDto): Room {
  const galleryFromDb = category.images
    .slice()
    .sort((left, right) => {
      if (left.isCover !== right.isCover) {
        return left.isCover ? -1 : 1;
      }

      return left.sortOrder - right.sortOrder;
    })
    .map((image) => {
      return image.url;
    });
  const mainImage = galleryFromDb[0] ?? '';
  const equipmentDetails = category.features.map((feature) => {
    return {
      id: String(feature.id),
      label: feature.name,
      icon: feature.imageUrl || undefined,
    };
  });

  return {
    id: String(category.id),
    categoryId: category.id,
    title: category.name,
    description: sanitizeRoomDescription(category.description),
    image: mainImage,
    gallery: galleryFromDb,
    size: resolveRoomSize(category),
    area: category.area.value,
    equipment: category.features.map((feature) => {
      return String(feature.id);
    }),
    equipmentDetails,
    perfectFor: category.perfectFor.map((item) => {
      return {
        imageUrl: item.imageUrl,
        description: item.description,
      };
    }),
    price: Number(category.price),
    availableRooms: category.roomCount || category.rooms.length,
  };
}
