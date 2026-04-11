import type { RoomCategoryDto } from '@/services/types';

import type { Room, RoomFeature } from '../_types/room';

const roomSlugByName: Record<string, string> = {
  Економ: 'economy',
  'Економ плюс': 'economy-plus',
  Комфорт: 'comfort',
  Сьют: 'suite',
  Люкс: 'lux',
  'Супер-Люкс': 'super-lux',
};

const emptyFeature: RoomFeature = {
  id: 'empty-room',
  label: 'Пустий номер',
};

function fallbackSlugify(value: string) {
  const transliterationMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ye',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'yi',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ь: '',
    ю: 'yu',
    я: 'ya',
  };

  return value
    .toLowerCase()
    .split('')
    .map((symbol) => {
      return transliterationMap[symbol] ?? symbol;
    })
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveRoomSlug(name: string) {
  return roomSlugByName[name] ?? fallbackSlugify(name);
}

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
  const dimensions = [category.widthCm, category.depthCm, category.heightCm];

  if (
    dimensions.every((value) => {
      return typeof value === 'number' && Number.isFinite(value);
    })
  ) {
    return `${category.widthCm}x${category.depthCm}x${category.heightCm}`;
  }

  return '';
}

export function mapRoomCategoryToRoom(category: RoomCategoryDto): Room {
  const slug = resolveRoomSlug(category.name);
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
  const equipmentDetails =
    category.features.length > 0
      ? category.features.map((feature) => {
          return {
            id: String(feature.id),
            label: feature.name,
            icon: feature.imageUrl || undefined,
          };
        })
      : [emptyFeature];

  return {
    id: String(category.id),
    categoryId: category.id,
    slug,
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
    availableRooms: category.rooms.length,
  };
}
