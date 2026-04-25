'use client';

import { type Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';

import { RoomImageUploader } from './RoomImageUploader';

type AdminUser = {
  createdAt: string;
  email: string;
  id: number;
  name: string;
  phone: string | null;
  role: Role;
  surname: string;
  updatedAt: string;
  verified: string | null;
};

type AdminReview = {
  comment: string | null;
  createdAt: string;
  id: number;
  rating: number;
  user: {
    email: string;
    id: number;
    name: string;
    surname: string;
  };
};

type RoomAreaOption = {
  depthCm: number;
  heightCm: number;
  id: number;
  value: number;
  widthCm: number;
};

type FeatureOption = {
  id: number;
  name: string;
};

type PerfectForOption = {
  description: string;
  id: number;
};

type AdminRoomCategory = {
  area: RoomAreaOption;
  areaId: number;
  description: string | null;
  features?: FeatureOption[];
  id: number;
  images?: Array<{
    isCover: boolean;
    sortOrder: number;
    url: string;
  }>;
  name: string;
  perfectFor?: PerfectForOption[];
  price: string;
  roomCount: number;
};

type AreaInputMode = 'existing' | 'custom';

type AdminRoom = {
  category: {
    id: number;
    name: string;
  };
  categoryId: number;
  id: number;
  name: string;
};

type ActiveBooking = {
  bookingItems: Array<{
    cat: {
      id: number;
      name: string;
    };
    room: {
      id: number;
      name: string;
    };
  }>;
  endDate: string;
  id: number;
  startDate: string;
  status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED';
  user: {
    email: string;
    id: number;
    name: string;
    phone: string | null;
    surname: string;
  };
};

type TabKey = 'users' | 'reviews' | 'room-categories' | 'rooms' | 'bookings';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'users', label: 'Ролі користувачів' },
  { key: 'reviews', label: 'Відгуки' },
  { key: 'room-categories', label: 'Категорії номерів' },
  { key: 'rooms', label: 'Номери' },
  { key: 'bookings', label: 'Активні бронювання' },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('uk-UA', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function readApiError(response: Response, fallbackMessage: string) {
  const payload = (await response.json().catch(() => {
    return null;
  })) as { error?: string } | null;

  return payload?.error ?? fallbackMessage;
}

function parseCommaSeparated(value: string) {
  const normalized = value
    .split(',')
    .map((item) => {
      return item.trim();
    })
    .filter(Boolean);

  const uniqueMap = new Map<string, string>();

  for (const item of normalized) {
    const key = item.toLowerCase();

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  }

  return Array.from(uniqueMap.values());
}

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [roomCategories, setRoomCategories] = useState<AdminRoomCategory[]>([]);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [bookings, setBookings] = useState<ActiveBooking[]>([]);
  const [areas, setAreas] = useState<RoomAreaOption[]>([]);
  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [perfectForItems, setPerfectForItems] = useState<PerfectForOption[]>([]);

  const [newCategory, setNewCategory] = useState({
    areaInputMode: 'existing' as AreaInputMode,
    coverImageUrl: '',
    depthCm: '',
    description: '',
    heightCm: '',
    imageUrls: [] as string[],
    name: '',
    newFeatureDraft: '',
    newFeatureNames: [] as string[],
    newPerfectForDescriptions: [] as string[],
    newPerfectForDraft: '',
    price: '',
    roomCount: '1',
    selectedFeatureToAdd: '',
    selectedFeatureIds: [] as string[],
    selectedAreaId: '',
    selectedPerfectForToAdd: '',
    selectedPerfectForIds: [] as string[],
    widthCm: '',
  });
  const [newRoom, setNewRoom] = useState({
    categoryId: '',
    name: '',
  });
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        usersRes,
        reviewsRes,
        categoriesRes,
        roomsRes,
        bookingsRes,
        areasRes,
        featuresRes,
        perfectForRes,
      ] = await Promise.all([
        fetch('/api/admin/users', { cache: 'no-store' }),
        fetch('/api/admin/reviews', { cache: 'no-store' }),
        fetch('/api/admin/room-categories', { cache: 'no-store' }),
        fetch('/api/admin/rooms', { cache: 'no-store' }),
        fetch('/api/admin/bookings/active', { cache: 'no-store' }),
        fetch('/api/room-areas', { cache: 'no-store' }),
        fetch('/api/features', { cache: 'no-store' }),
        fetch('/api/perfect-for-items', { cache: 'no-store' }),
      ]);

      if (!usersRes.ok) {
        throw new Error(await readApiError(usersRes, 'Не вдалося завантажити користувачів.'));
      }

      if (!reviewsRes.ok) {
        throw new Error(await readApiError(reviewsRes, 'Не вдалося завантажити відгуки.'));
      }

      if (!categoriesRes.ok) {
        throw new Error(
          await readApiError(categoriesRes, 'Не вдалося завантажити категорії номерів.'),
        );
      }

      if (!roomsRes.ok) {
        throw new Error(await readApiError(roomsRes, 'Не вдалося завантажити номери.'));
      }

      if (!bookingsRes.ok) {
        throw new Error(
          await readApiError(bookingsRes, 'Не вдалося завантажити активні бронювання.'),
        );
      }

      const usersData = (await usersRes.json()) as { users: AdminUser[] };
      const reviewsData = (await reviewsRes.json()) as { reviews: AdminReview[] };
      const categoriesData = (await categoriesRes.json()) as {
        roomCategories: AdminRoomCategory[];
      };
      const roomsData = (await roomsRes.json()) as { rooms: AdminRoom[] };
      const bookingsData = (await bookingsRes.json()) as { bookings: ActiveBooking[] };
      const areasPayload = (await areasRes.json().catch(() => {
        return null;
      })) as { roomAreas?: RoomAreaOption[] } | RoomAreaOption[] | null;
      const featuresPayload = (await featuresRes.json().catch(() => {
        return null;
      })) as { features?: FeatureOption[] } | FeatureOption[] | null;
      const perfectForPayload = (await perfectForRes.json().catch(() => {
        return null;
      })) as { perfectForItems?: PerfectForOption[] } | PerfectForOption[] | null;

      const areaItems = Array.isArray(areasPayload)
        ? areasPayload
        : Array.isArray(areasPayload?.roomAreas)
          ? areasPayload.roomAreas
          : [];
      const featureItems = Array.isArray(featuresPayload)
        ? featuresPayload
        : Array.isArray(featuresPayload?.features)
          ? featuresPayload.features
          : [];
      const perfectForList = Array.isArray(perfectForPayload)
        ? perfectForPayload
        : Array.isArray(perfectForPayload?.perfectForItems)
          ? perfectForPayload.perfectForItems
          : [];

      setUsers(usersData.users ?? []);
      setReviews(reviewsData.reviews ?? []);
      setRoomCategories(categoriesData.roomCategories ?? []);
      setRooms(roomsData.rooms ?? []);
      setBookings(bookingsData.bookings ?? []);
      setAreas(areaItems);
      setFeatures(featureItems);
      setPerfectForItems(perfectForList);
      setIsLoading(false);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Сталася помилка завантаження.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const categoryOptions = useMemo(() => {
    return roomCategories.map((category) => {
      return {
        id: category.id,
        name: category.name,
      };
    });
  }, [roomCategories]);

  const selectedExistingArea = useMemo(() => {
    const id = Number(newCategory.selectedAreaId);

    if (!Number.isInteger(id)) {
      return null;
    }

    return (
      areas.find((area) => {
        return area.id === id;
      }) ?? null
    );
  }, [areas, newCategory.selectedAreaId]);

  const customAreaPreview = useMemo(() => {
    const width = Number(newCategory.widthCm);
    const depth = Number(newCategory.depthCm);

    if (!Number.isFinite(width) || !Number.isFinite(depth) || width <= 0 || depth <= 0) {
      return null;
    }

    return Math.round((width * depth) / 100) / 10000;
  }, [newCategory.widthCm, newCategory.depthCm]);

  const selectedFeatures = useMemo(() => {
    const selectedIds = new Set(newCategory.selectedFeatureIds);

    return features.filter((feature) => {
      return selectedIds.has(String(feature.id));
    });
  }, [features, newCategory.selectedFeatureIds]);

  const availableFeatures = useMemo(() => {
    const selectedIds = new Set(newCategory.selectedFeatureIds);

    return features.filter((feature) => {
      return !selectedIds.has(String(feature.id));
    });
  }, [features, newCategory.selectedFeatureIds]);

  const selectedPerfectFor = useMemo(() => {
    const selectedIds = new Set(newCategory.selectedPerfectForIds);

    return perfectForItems.filter((item) => {
      return selectedIds.has(String(item.id));
    });
  }, [newCategory.selectedPerfectForIds, perfectForItems]);

  const availablePerfectFor = useMemo(() => {
    const selectedIds = new Set(newCategory.selectedPerfectForIds);

    return perfectForItems.filter((item) => {
      return !selectedIds.has(String(item.id));
    });
  }, [newCategory.selectedPerfectForIds, perfectForItems]);

  const handleRemoveSelectedFeature = (id: string) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        selectedFeatureIds: prev.selectedFeatureIds.filter((item) => {
          return item !== id;
        }),
      };
    });
  };

  const handleAddNewFeatureDraft = () => {
    const values = parseCommaSeparated(newCategory.newFeatureDraft);

    if (values.length === 0) {
      return;
    }

    setNewCategory((prev) => {
      const uniqueMap = new Map<string, string>();

      for (const item of prev.newFeatureNames) {
        uniqueMap.set(item.toLowerCase(), item);
      }

      for (const item of values) {
        uniqueMap.set(item.toLowerCase(), item);
      }

      return {
        ...prev,
        newFeatureDraft: '',
        newFeatureNames: Array.from(uniqueMap.values()),
      };
    });
  };

  const handleRemoveNewFeature = (name: string) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        newFeatureNames: prev.newFeatureNames.filter((item) => {
          return item !== name;
        }),
      };
    });
  };

  const handleRemoveSelectedPerfectFor = (id: string) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        selectedPerfectForIds: prev.selectedPerfectForIds.filter((item) => {
          return item !== id;
        }),
      };
    });
  };

  const handleAddNewPerfectForDraft = () => {
    const values = parseCommaSeparated(newCategory.newPerfectForDraft);

    if (values.length === 0) {
      return;
    }

    setNewCategory((prev) => {
      const uniqueMap = new Map<string, string>();

      for (const item of prev.newPerfectForDescriptions) {
        uniqueMap.set(item.toLowerCase(), item);
      }

      for (const item of values) {
        uniqueMap.set(item.toLowerCase(), item);
      }

      return {
        ...prev,
        newPerfectForDescriptions: Array.from(uniqueMap.values()),
        newPerfectForDraft: '',
      };
    });
  };

  const handleRemoveNewPerfectFor = (value: string) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        newPerfectForDescriptions: prev.newPerfectForDescriptions.filter((item) => {
          return item !== value;
        }),
      };
    });
  };

  const handleRoleChange = async (id: number, role: Role) => {
    const response = await fetch('/api/admin/users', {
      body: JSON.stringify({ id, role }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося змінити роль користувача.');
      return;
    }

    await loadAdminData();
  };

  const handleDeleteReview = async (id: number) => {
    const confirmed = window.confirm('Видалити цей відгук?');

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося видалити відгук.');
      return;
    }

    await loadAdminData();
  };

  const handleCreateCategory = async () => {
    const body: Record<string, number | number[] | string | string[] | null> = {
      coverImageUrl: newCategory.coverImageUrl.trim() || null,
      description: newCategory.description || null,
      featureIds: newCategory.selectedFeatureIds
        .map((item) => {
          return Number(item);
        })
        .filter(Number.isInteger),
      imageUrls: newCategory.imageUrls,
      name: newCategory.name,
      newFeatureNames: newCategory.newFeatureNames,
      newPerfectForDescriptions: newCategory.newPerfectForDescriptions,
      perfectForIds: newCategory.selectedPerfectForIds
        .map((item) => {
          return Number(item);
        })
        .filter(Number.isInteger),
      price: newCategory.price,
      roomCount: Number(newCategory.roomCount || '1'),
    };

    if (newCategory.areaInputMode === 'existing') {
      body.areaId = Number(newCategory.selectedAreaId);
    } else {
      body.widthCm = Number(newCategory.widthCm);
      body.depthCm = Number(newCategory.depthCm);
      body.heightCm = Number(newCategory.heightCm);
    }

    const response = await fetch('/api/admin/room-categories', {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося створити категорію номера.');
      return;
    }

    setNewCategory({
      areaInputMode: 'existing',
      coverImageUrl: '',
      depthCm: '',
      description: '',
      heightCm: '',
      imageUrls: [],
      name: '',
      newFeatureDraft: '',
      newFeatureNames: [],
      newPerfectForDescriptions: [],
      newPerfectForDraft: '',
      price: '',
      roomCount: '1',
      selectedFeatureToAdd: '',
      selectedFeatureIds: [],
      selectedAreaId: '',
      selectedPerfectForToAdd: '',
      selectedPerfectForIds: [],
      widthCm: '',
    });
    setIsCreateCategoryDialogOpen(false);
    await loadAdminData();
  };

  const handleEditCategory = async (category: AdminRoomCategory) => {
    router.push(`/admin/room-categories/${category.id}`);
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = window.confirm('Видалити категорію номера?');

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/room-categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося видалити категорію номера.');
      return;
    }

    await loadAdminData();
  };

  const handleCreateRoom = async () => {
    const response = await fetch('/api/admin/rooms', {
      body: JSON.stringify({
        categoryId: Number(newRoom.categoryId),
        name: newRoom.name,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося створити номер.');
      return;
    }

    setNewRoom({
      categoryId: '',
      name: '',
    });
    await loadAdminData();
  };

  const handleEditRoom = async (room: AdminRoom) => {
    const name = window.prompt('Назва номера', room.name);

    if (!name) {
      return;
    }

    const categoryId = window.prompt('ID категорії', String(room.categoryId));

    if (!categoryId) {
      return;
    }

    const response = await fetch(`/api/admin/rooms/${room.id}`, {
      body: JSON.stringify({
        categoryId: Number(categoryId),
        name,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося оновити номер.');
      return;
    }

    await loadAdminData();
  };

  const handleDeleteRoom = async (id: number) => {
    const confirmed = window.confirm('Видалити номер?');

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/rooms/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => {
        return null;
      })) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося видалити номер.');
      return;
    }

    await loadAdminData();
  };

  if (isLoading) {
    return <p className="text-[16px] text-brand-text-subtle">Завантаження адмін-кабінету...</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-white p-6 text-destructive">
        <p>{error}</p>
        <Button
          className="mt-4"
          onClick={() => {
            return void loadAdminData();
          }}
        >
          Спробувати ще раз
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Button
              key={tab.key}
              variant={isActive ? 'secondary' : 'outline'}
              onClick={() => {
                setActiveTab(tab.key);
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === 'users' && (
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Користувачі та ролі</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-190 text-left text-[14px] text-brand-text">
              <thead>
                <tr className="border-b border-gray-100 text-brand-text-subtle">
                  <th className="pb-3 pr-3">ID</th>
                  <th className="pb-3 pr-3">Користувач</th>
                  <th className="pb-3 pr-3">Email</th>
                  <th className="pb-3 pr-3">Роль</th>
                  <th className="pb-3 pr-3">Дії</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr key={user.id} className="border-b border-gray-50 align-middle">
                      <td className="py-3 pr-3">{user.id}</td>
                      <td className="py-3 pr-3">
                        {user.name} {user.surname}
                      </td>
                      <td className="py-3 pr-3">{user.email}</td>
                      <td className="py-3 pr-3 font-semibold">{user.role}</td>
                      <td className="py-3 pr-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              void handleRoleChange(user.id, 'USER');
                            }}
                          >
                            USER
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              void handleRoleChange(user.id, 'EMPLOYEE');
                            }}
                          >
                            EMPLOYEE
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              void handleRoleChange(user.id, 'ADMIN');
                            }}
                          >
                            ADMIN
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Відгуки</h2>
          <div className="mt-6 space-y-4">
            {reviews.map((review) => {
              return (
                <article key={review.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-text">
                        #{review.id} • {review.user.name} {review.user.surname}
                      </p>
                      <p className="text-[13px] text-brand-text-subtle">{review.user.email}</p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => {
                        void handleDeleteReview(review.id);
                      }}
                    >
                      Видалити
                    </Button>
                  </div>

                  <p className="mt-3 text-[14px] text-brand-text">Оцінка: {review.rating}/5</p>
                  <p className="mt-2 text-[14px] text-brand-text-subtle">
                    {review.comment || 'Коментар відсутній'}
                  </p>
                  <p className="mt-2 text-[12px] text-brand-text-subtle">
                    Створено: {formatDateTime(review.createdAt)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'room-categories' && (
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-brand-text">Категорії номерів</h2>
            <Button
              onClick={() => {
                router.push('/admin/room-categories/new');
              }}
            >
              Нова категорія
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {roomCategories.map((category) => {
              const coverImageUrl =
                category.images?.find((image) => {
                  return image.isCover;
                })?.url ??
                category.images?.[0]?.url ??
                null;

              return (
                <article key={category.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverImageUrl}
                            alt={`Обкладинка категорії ${category.name}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-brand-text-subtle">
                            Нема фото
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">
                          #{category.id} • {category.name}
                        </p>
                        <p className="text-[13px] text-brand-text-subtle">
                          {category.area.widthCm} x {category.area.depthCm} x{' '}
                          {category.area.heightCm} см • {category.area.value} м²
                        </p>
                        <p className="text-[13px] text-brand-text-subtle">
                          Ціна: {category.price} • Кількість: {category.roomCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          void handleEditCategory(category);
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          void handleDeleteCategory(category.id);
                        }}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'rooms' && (
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Номери</h2>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              placeholder="Назва номера"
              value={newRoom.name}
              onChange={(event) => {
                setNewRoom((prev) => {
                  return { ...prev, name: event.target.value };
                });
              }}
            />
            <select
              className="h-11 rounded-xl border border-input px-3"
              value={newRoom.categoryId}
              onChange={(event) => {
                setNewRoom((prev) => {
                  return { ...prev, categoryId: event.target.value };
                });
              }}
            >
              <option value="">Оберіть категорію</option>
              {categoryOptions.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <Button
              onClick={() => {
                return void handleCreateRoom();
              }}
            >
              Створити номер
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {rooms.map((room) => {
              return (
                <article key={room.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-text">
                        #{room.id} • {room.name}
                      </p>
                      <p className="text-[13px] text-brand-text-subtle">
                        Категорія: {room.category?.name ?? 'Невідома'} (ID {room.categoryId})
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          void handleEditRoom(room);
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          void handleDeleteRoom(room.id);
                        }}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'bookings' && (
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Активні бронювання</h2>

          <div className="mt-6 space-y-4">
            {bookings.map((booking) => {
              const roomTitles = Array.from(
                new Set(
                  booking.bookingItems.map((item) => {
                    return item.room.name;
                  }),
                ),
              );
              const petNames = Array.from(
                new Set(
                  booking.bookingItems.map((item) => {
                    return item.cat.name;
                  }),
                ),
              );

              return (
                <article key={booking.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-text">
                        Бронь #{booking.id} • {booking.user.name} {booking.user.surname}
                      </p>
                      <p className="text-[13px] text-brand-text-subtle">{booking.user.email}</p>
                      <p className="mt-1 text-[13px] text-brand-text-subtle">
                        Телефон: {booking.user.phone || 'Не вказано'}
                      </p>
                    </div>

                    <span className="rounded-full bg-brand-yellow/35 px-3 py-1 text-[12px] font-semibold text-brand-text">
                      {booking.status}
                    </span>
                  </div>

                  <p className="mt-3 text-[14px] text-brand-text">
                    Період: {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="mt-2 text-[14px] text-brand-text-subtle">
                    Номери: {roomTitles.join(', ') || 'Не вказано'}
                  </p>
                  <p className="mt-1 text-[14px] text-brand-text-subtle">
                    Котики: {petNames.join(', ') || 'Не вказано'}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
