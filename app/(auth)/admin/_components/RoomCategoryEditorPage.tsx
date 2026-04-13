'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Image as ImageIcon, Info, Ruler, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

import { RoomImageUploader } from './RoomImageUploader';

type AreaInputMode = 'existing' | 'custom';

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

type RoomCategoryDetails = {
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

type RoomCategoryEditorPageProps = {
  categoryId?: number;
  mode: 'create' | 'edit';
};

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

async function readApiError(response: Response, fallbackMessage: string) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;

  return payload?.error ?? fallbackMessage;
}

export function RoomCategoryEditorPage({ categoryId, mode }: RoomCategoryEditorPageProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [areas, setAreas] = useState<RoomAreaOption[]>([]);
  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [perfectForItems, setPerfectForItems] = useState<PerfectForOption[]>([]);

  const [form, setForm] = useState({
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
    selectedAreaId: '',
    selectedFeatureIds: [] as string[],
    selectedFeatureToAdd: '',
    selectedPerfectForIds: [] as string[],
    selectedPerfectForToAdd: '',
    widthCm: '',
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const requests: Promise<Response>[] = [
          fetch('/api/room-areas', { cache: 'no-store' }),
          fetch('/api/features', { cache: 'no-store' }),
          fetch('/api/perfect-for-items', { cache: 'no-store' }),
        ];

        if (isEdit && categoryId) {
          requests.push(fetch(`/api/admin/room-categories/${categoryId}`, { cache: 'no-store' }));
        }

        const [areasRes, featuresRes, perfectForRes, categoryRes] = await Promise.all(requests);

        if (!areasRes.ok) {
          throw new Error(await readApiError(areasRes, 'Не вдалося завантажити площі.'));
        }

        if (!featuresRes.ok) {
          throw new Error(await readApiError(featuresRes, 'Не вдалося завантажити оснащення.'));
        }

        if (!perfectForRes.ok) {
          throw new Error(await readApiError(perfectForRes, 'Не вдалося завантажити список "ідеально для".'));
        }

        const areasPayload = (await areasRes.json().catch(() => null)) as
          | { roomAreas?: RoomAreaOption[] }
          | RoomAreaOption[]
          | null;
        const featuresPayload = (await featuresRes.json().catch(() => null)) as
          | { features?: FeatureOption[] }
          | FeatureOption[]
          | null;
        const perfectForPayload = (await perfectForRes.json().catch(() => null)) as
          | { perfectForItems?: PerfectForOption[] }
          | PerfectForOption[]
          | null;

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

        if (cancelled) {
          return;
        }

        setAreas(areaItems);
        setFeatures(featureItems);
        setPerfectForItems(perfectForList);

        if (isEdit && categoryRes) {
          if (!categoryRes.ok) {
            throw new Error(await readApiError(categoryRes, 'Не вдалося завантажити категорію.'));
          }

          const categoryPayload = (await categoryRes.json()) as { roomCategory: RoomCategoryDetails };
          const category = categoryPayload.roomCategory;
          const coverImage =
            category.images?.find((image) => {
              return image.isCover;
            })?.url ?? '';
          const imageUrls = (category.images ?? [])
            .filter((image) => {
              return !image.isCover;
            })
            .map((image) => {
              return image.url;
            });

          setForm({
            areaInputMode: 'existing',
            coverImageUrl: coverImage,
            depthCm: String(category.area.depthCm),
            description: category.description ?? '',
            heightCm: String(category.area.heightCm),
            imageUrls,
            name: category.name,
            newFeatureDraft: '',
            newFeatureNames: [],
            newPerfectForDescriptions: [],
            newPerfectForDraft: '',
            price: category.price,
            roomCount: String(category.roomCount),
            selectedAreaId: String(category.areaId),
            selectedFeatureIds: (category.features ?? []).map((item) => {
              return String(item.id);
            }),
            selectedFeatureToAdd: '',
            selectedPerfectForIds: (category.perfectFor ?? []).map((item) => {
              return String(item.id);
            }),
            selectedPerfectForToAdd: '',
            widthCm: String(category.area.widthCm),
          });
        }

        setIsLoading(false);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Помилка завантаження форми.');
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [categoryId, isEdit]);

  const selectedExistingArea = useMemo(() => {
    const id = Number(form.selectedAreaId);

    if (!Number.isInteger(id)) {
      return null;
    }

    return (
      areas.find((area) => {
        return area.id === id;
      }) ?? null
    );
  }, [areas, form.selectedAreaId]);

  const customAreaPreview = useMemo(() => {
    const width = Number(form.widthCm);
    const depth = Number(form.depthCm);

    if (!Number.isFinite(width) || !Number.isFinite(depth) || width <= 0 || depth <= 0) {
      return null;
    }

    return Math.round((width * depth) / 100) / 10000;
  }, [form.depthCm, form.widthCm]);

  const selectedFeatures = useMemo(() => {
    const selectedIds = new Set(form.selectedFeatureIds);

    return features.filter((feature) => {
      return selectedIds.has(String(feature.id));
    });
  }, [features, form.selectedFeatureIds]);

  const availableFeatures = useMemo(() => {
    const selectedIds = new Set(form.selectedFeatureIds);

    return features.filter((feature) => {
      return !selectedIds.has(String(feature.id));
    });
  }, [features, form.selectedFeatureIds]);

  const selectedPerfectFor = useMemo(() => {
    const selectedIds = new Set(form.selectedPerfectForIds);

    return perfectForItems.filter((item) => {
      return selectedIds.has(String(item.id));
    });
  }, [form.selectedPerfectForIds, perfectForItems]);

  const availablePerfectFor = useMemo(() => {
    const selectedIds = new Set(form.selectedPerfectForIds);

    return perfectForItems.filter((item) => {
      return !selectedIds.has(String(item.id));
    });
  }, [form.selectedPerfectForIds, perfectForItems]);

  const handleRemoveSelectedFeature = (id: string) => {
    setForm((prev) => {
      return {
        ...prev,
        selectedFeatureIds: prev.selectedFeatureIds.filter((item) => {
          return item !== id;
        }),
      };
    });
  };

  const handleAddNewFeatureDraft = () => {
    const values = parseCommaSeparated(form.newFeatureDraft);

    if (values.length === 0) {
      return;
    }

    setForm((prev) => {
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
    setForm((prev) => {
      return {
        ...prev,
        newFeatureNames: prev.newFeatureNames.filter((item) => {
          return item !== name;
        }),
      };
    });
  };

  const handleRemoveSelectedPerfectFor = (id: string) => {
    setForm((prev) => {
      return {
        ...prev,
        selectedPerfectForIds: prev.selectedPerfectForIds.filter((item) => {
          return item !== id;
        }),
      };
    });
  };

  const handleAddNewPerfectForDraft = () => {
    const values = parseCommaSeparated(form.newPerfectForDraft);

    if (values.length === 0) {
      return;
    }

    setForm((prev) => {
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
    setForm((prev) => {
      return {
        ...prev,
        newPerfectForDescriptions: prev.newPerfectForDescriptions.filter((item) => {
          return item !== value;
        }),
      };
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    const body: Record<string, number | number[] | string | string[] | null> = {
      coverImageUrl: form.coverImageUrl.trim() || null,
      description: form.description || null,
      featureIds: form.selectedFeatureIds.map((item) => Number(item)).filter(Number.isInteger),
      imageUrls: form.imageUrls,
      name: form.name,
      newFeatureNames: form.newFeatureNames,
      newPerfectForDescriptions: form.newPerfectForDescriptions,
      perfectForIds: form.selectedPerfectForIds.map((item) => Number(item)).filter(Number.isInteger),
      price: form.price,
      roomCount: Number(form.roomCount || '1'),
    };

    if (form.areaInputMode === 'existing') {
      body.areaId = Number(form.selectedAreaId);
    } else {
      body.widthCm = Number(form.widthCm);
      body.depthCm = Number(form.depthCm);
      body.heightCm = Number(form.heightCm);
    }

    const endpoint = isEdit ? `/api/admin/room-categories/${categoryId}` : '/api/admin/room-categories';
    const method = isEdit ? 'PATCH' : 'POST';

    const response = await fetch(endpoint, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      method,
    });

    setIsSaving(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      alert(payload?.error ?? 'Не вдалося зберегти категорію номера.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  if (isLoading) {
    return <p className="text-[16px] text-brand-text-subtle">Завантаження форми...</p>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-white p-6 text-destructive">
        <p>{error}</p>
        <Button className="mt-4" onClick={() => router.refresh()}>
          Спробувати ще раз
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-26 text-gray-800">
      <header className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? `Редагування категорії #${categoryId}` : 'Створення категорії'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? 'Оновіть дані категорії та збережіть зміни.'
                : 'Додайте новий тип номерів для вашого готелю.'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              router.push('/admin');
            }}
          >
            Скасувати
          </Button>
        </div>
      </header>

      <main className="mt-6 space-y-6">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
            <Info className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Загальна інформація</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-12">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Назва категорії</label>
                <Input
                  placeholder="Наприклад: Люкс для сфінксів"
                  value={form.name}
                  onChange={(event) => {
                    setForm((prev) => {
                      return { ...prev, name: event.target.value };
                    });
                  }}
                />
              </div>

              <div className="md:col-span-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Ціна за добу</label>
                <Input
                  placeholder="0.00"
                  type="number"
                  value={form.price}
                  onChange={(event) => {
                    setForm((prev) => {
                      return { ...prev, price: event.target.value };
                    });
                  }}
                />
              </div>

              <div className="md:col-span-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Кількість номерів</label>
                <Input
                  type="number"
                  value={form.roomCount}
                  onChange={(event) => {
                    setForm((prev) => {
                      return { ...prev, roomCount: event.target.value };
                    });
                  }}
                />
              </div>

              <div className="md:col-span-12">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Опис</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => {
                    setForm((prev) => {
                      return { ...prev, description: event.target.value };
                    });
                  }}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Коротко опишіть переваги цього номера..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
            <ImageIcon className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Фото номера</h2>
          </div>

          <div className="p-6">
            <RoomImageUploader
              coverImageUrl={form.coverImageUrl}
              imageUrls={form.imageUrls}
              onChange={(next) => {
                setForm((prev) => {
                  return {
                    ...prev,
                    coverImageUrl: next.coverImageUrl,
                    imageUrls: next.imageUrls,
                  };
                });
              }}
              disabled={isSaving}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
            <Ruler className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Габарити та оснащення</h2>
          </div>

          <div className="space-y-8 p-6">
            <div>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <label className="block text-sm font-medium text-gray-700">Площа номера</label>
                <div className="flex w-fit rounded-lg bg-gray-100/80 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        return { ...prev, areaInputMode: 'existing' };
                      });
                    }}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${form.areaInputMode === 'existing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Вибрати існуючу
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => {
                        return { ...prev, areaInputMode: 'custom' };
                      });
                    }}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${form.areaInputMode === 'custom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Ввести габарити
                  </button>
                </div>
              </div>

              {form.areaInputMode === 'existing' ? (
                <div className="space-y-2">
                  <select
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    value={form.selectedAreaId}
                    onChange={(event) => {
                      setForm((prev) => {
                        return { ...prev, selectedAreaId: event.target.value };
                      });
                    }}
                  >
                    <option value="">Оберіть площу зі списку...</option>
                    {areas.map((area) => {
                      return (
                        <option key={area.id} value={area.id}>
                          {area.value} м² ({area.widthCm}x{area.depthCm}x{area.heightCm} см)
                        </option>
                      );
                    })}
                  </select>
                  {selectedExistingArea && (
                    <p className="text-sm text-gray-500">
                      Габарити: {selectedExistingArea.widthCm}x{selectedExistingArea.depthCm}x{selectedExistingArea.heightCm} см
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    type="number"
                    placeholder="Ширина (см)"
                    value={form.widthCm}
                    onChange={(event) => {
                      setForm((prev) => {
                        return { ...prev, widthCm: event.target.value };
                      });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Глибина (см)"
                    value={form.depthCm}
                    onChange={(event) => {
                      setForm((prev) => {
                        return { ...prev, depthCm: event.target.value };
                      });
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Висота (см)"
                    value={form.heightCm}
                    onChange={(event) => {
                      setForm((prev) => {
                        return { ...prev, heightCm: event.target.value };
                      });
                    }}
                  />
                  <p className="text-sm text-gray-500 md:col-span-3">
                    Розрахована площа: {customAreaPreview ? `${customAreaPreview} м²` : 'вкажіть ширину і глибину'}
                  </p>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Оснащення номера</label>
                <p className="mb-3 text-xs text-gray-500">Що є всередині (полички, іграшки тощо)</p>

                <div className="mb-3 flex min-h-[40px] flex-wrap gap-2">
                  {selectedFeatures.map((feature) => {
                    return (
                      <span
                        key={feature.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm text-orange-700"
                      >
                        {feature.name}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveSelectedFeature(String(feature.id));
                          }}
                          className="rounded-full p-0.5 transition-colors hover:bg-orange-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                  {form.newFeatureNames.map((name) => {
                    return (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm text-yellow-800"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveNewFeature(name);
                          }}
                          className="rounded-full p-0.5 transition-colors hover:bg-yellow-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <select
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    value={form.selectedFeatureToAdd}
                    onChange={(event) => {
                      const value = event.target.value;

                      setForm((prev) => {
                        if (!value) {
                          return { ...prev, selectedFeatureToAdd: '' };
                        }

                        const next = new Set(prev.selectedFeatureIds);
                        next.add(value);

                        return {
                          ...prev,
                          selectedFeatureIds: Array.from(next),
                          selectedFeatureToAdd: '',
                        };
                      });
                    }}
                  >
                    <option value="">Оберіть із шаблонів...</option>
                    {availableFeatures.map((feature) => {
                      return (
                        <option key={feature.id} value={String(feature.id)}>
                          {feature.name}
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Або введіть свій варіант..."
                      value={form.newFeatureDraft}
                      onChange={(event) => {
                        setForm((prev) => {
                          return { ...prev, newFeatureDraft: event.target.value };
                        });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddNewFeatureDraft();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddNewFeatureDraft}>
                      Додати
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Ідеально підходить для</label>
                <p className="mb-3 text-xs text-gray-500">Особливості котиків (вік, характер)</p>

                <div className="mb-3 flex min-h-[40px] flex-wrap gap-2">
                  {selectedPerfectFor.map((item) => {
                    return (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                      >
                        {item.description}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveSelectedPerfectFor(String(item.id));
                          }}
                          className="rounded-full p-0.5 transition-colors hover:bg-indigo-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                  {form.newPerfectForDescriptions.map((item) => {
                    return (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveNewPerfectFor(item);
                          }}
                          className="rounded-full p-0.5 transition-colors hover:bg-slate-300"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <select
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    value={form.selectedPerfectForToAdd}
                    onChange={(event) => {
                      const value = event.target.value;

                      setForm((prev) => {
                        if (!value) {
                          return { ...prev, selectedPerfectForToAdd: '' };
                        }

                        const next = new Set(prev.selectedPerfectForIds);
                        next.add(value);

                        return {
                          ...prev,
                          selectedPerfectForIds: Array.from(next),
                          selectedPerfectForToAdd: '',
                        };
                      });
                    }}
                  >
                    <option value="">Оберіть із шаблонів...</option>
                    {availablePerfectFor.map((item) => {
                      return (
                        <option key={item.id} value={String(item.id)}>
                          {item.description}
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Або введіть свій варіант..."
                      value={form.newPerfectForDraft}
                      onChange={(event) => {
                        setForm((prev) => {
                          return { ...prev, newPerfectForDraft: event.target.value };
                        });
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddNewPerfectForDraft();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddNewPerfectForDraft}>
                      Додати
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex w-full max-w-7xl justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              router.push('/admin');
            }}
          >
            Скасувати
          </Button>
          <Button disabled={isSaving} onClick={() => void handleSubmit()}>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {isSaving ? 'Збереження...' : isEdit ? 'Оновити категорію' : 'Зберегти категорію'}
          </Button>
        </div>
      </div>
    </div>
  );
}
