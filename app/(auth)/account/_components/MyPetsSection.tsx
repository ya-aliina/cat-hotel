'use client';

import { CalendarDays, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PawButton } from '@/components/ui/PawButton';

type Pet = {
  birthDate: string | null;
  breed: string | null;
  id: number;
  name: string;
  notes: string | null;
};

type PetDraft = {
  birthDate: string;
  breed: string;
  name: string;
  notes: string;
};

type PetsResponse = {
  error?: string;
  pets?: Array<{
    birthDate: string | null;
    breed: string | null;
    id: number;
    name: string;
    notes: string | null;
  }>;
};

type CreatePetResponse = {
  error?: string;
  pet?: Pet;
};

const MONTH_OPTIONS = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
] as const;

function parseMonthValue(value: string): { month: number; year: number } | null {
  const match = /^([0-9]{4})-([0-9]{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return { month, year };
}

function buildMonthValue(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatMonthValue(value: string) {
  const parsed = parseMonthValue(value);

  if (!parsed) {
    return '';
  }

  return `${MONTH_OPTIONS[parsed.month - 1]} ${parsed.year}`;
}

function MonthPickerField({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (nextValue: string) => void;
  value: string;
}) {
  const nowYear = new Date().getFullYear();
  const parsed = parseMonthValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(parsed?.year ?? nowYear);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPickerYear(parsed?.year ?? nowYear);
  }, [isOpen, nowYear, parsed?.year]);

  return (
    <>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatMonthValue(value)}
          placeholder="Оберіть місяць і рік"
          className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
          disabled={disabled}
        />
        <button
          type="button"
          aria-label="Відкрити пікер дати"
          title="Відкрити пікер дати"
          disabled={disabled}
          onClick={() => {
            setIsOpen(true);
          }}
          className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-brand-text-subtle transition-colors hover:bg-brand-yellow/30 hover:text-brand-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarDays className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-[30px] border border-gray-100 bg-white p-6 shadow-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand-text">Оберіть дату народження</DialogTitle>
            <DialogDescription className="text-brand-text-subtle">
              Вкажіть місяць та рік
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  setPickerYear((prev) => {
                    return prev - 1;
                  });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-text-subtle transition-colors hover:bg-brand-yellow/30 hover:text-brand-text"
                aria-label="Попередній рік"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <p className="text-base font-semibold text-brand-text">{pickerYear}</p>

              <button
                type="button"
                onClick={() => {
                  setPickerYear((prev) => {
                    return prev + 1;
                  });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-text-subtle transition-colors hover:bg-brand-yellow/30 hover:text-brand-text"
                aria-label="Наступний рік"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MONTH_OPTIONS.map((monthLabel, index) => {
                const month = index + 1;
                const monthValue = buildMonthValue(pickerYear, month);
                const isSelected = monthValue === value;

                return (
                  <button
                    key={monthLabel}
                    type="button"
                    onClick={() => {
                      onChange(monthValue);
                      setIsOpen(false);
                    }}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-brand-orange bg-brand-orange text-white'
                        : 'border-gray-200 text-brand-text hover:border-brand-yellow hover:bg-brand-yellow/20'
                    }`}
                  >
                    {monthLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-3 sm:justify-start">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-brand-text-subtle transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              Очистити
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Готово
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function toInputDate(value: string | null) {
  if (!value) {
    return '';
  }

  return value.slice(0, 7);
}

function toDraft(pet: Pet): PetDraft {
  return {
    birthDate: toInputDate(pet.birthDate),
    breed: pet.breed ?? '',
    name: pet.name,
    notes: pet.notes ?? '',
  };
}

function PetCard({
  onDeleted,
  onSaved,
  pet,
}: {
  onDeleted: (petId: number) => void;
  onSaved: (nextPet: Pet) => void;
  pet: Pet;
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [draft, setDraft] = useState<PetDraft>(toDraft(pet));
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(toDraft(pet));
    }
  }, [isEditing, pet]);

  const savePet = async () => {
    setError(null);
    setIsSaving(true);

    const response = await fetch(`/api/account/pets/${pet.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate: draft.birthDate || null,
        breed: draft.breed || null,
        name: draft.name,
        notes: draft.notes || null,
      }),
    });

    const responseData = (await response.json().catch(() => {
      return null;
    })) as {
      error?: string;
      pet?: Pet;
    } | null;

    if (!response.ok || !responseData?.pet) {
      setIsSaving(false);
      setError(responseData?.error ?? 'Не вдалося оновити улюбленця.');
      return;
    }

    onSaved(responseData.pet);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <article className="rounded-2xl border border-gray-100 bg-brand-surface-card p-5 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-brand-text-subtle">Ім'я улюбленця</span>
          <input
            type="text"
            value={draft.name}
            disabled={!isEditing || isSaving}
            onChange={(event) => {
              setDraft((prev) => {
                return { ...prev, name: event.target.value };
              });
            }}
            className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-brand-text-subtle">Порода</span>
          <input
            type="text"
            value={draft.breed}
            disabled={!isEditing || isSaving}
            onChange={(event) => {
              setDraft((prev) => {
                return { ...prev, breed: event.target.value };
              });
            }}
            className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-brand-text-subtle">Дата народження</span>
          <MonthPickerField
            value={draft.birthDate}
            disabled={!isEditing || isSaving}
            onChange={(nextValue) => {
              setDraft((prev) => {
                return { ...prev, birthDate: nextValue };
              });
            }}
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm text-brand-text-subtle">Нотатки</span>
          <textarea
            value={draft.notes}
            disabled={!isEditing || isSaving}
            onChange={(event) => {
              setDraft((prev) => {
                return { ...prev, notes: event.target.value };
              });
            }}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!isEditing ? (
          <>
            <PawButton
              type="button"
              variant="accent"
              className="bg-brand-orange text-white"
              onClick={() => {
                setError(null);
                setIsEditing(true);
              }}
            >
              Редагувати
            </PawButton>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setConfirmDeleteOpen(true);
              }}
              aria-label="Видалити улюбленця"
              title="Видалити улюбленця"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive text-destructive transition-colors hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <PawButton
              type="button"
              variant="accent"
              className="bg-brand-orange text-white"
              onClick={() => {
                void savePet();
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Зберігаємо...' : 'Зберегти'}
            </PawButton>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setError(null);
                setDraft(toDraft(pet));
                setIsEditing(false);
              }}
              className="rounded-full px-4 py-2 text-sm font-medium text-brand-text-subtle transition-colors hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
            >
              Скасувати
            </button>
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent
          className="max-w-md rounded-[30px] border border-gray-100 bg-white p-7 shadow-sm"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand-text">
              Видалити улюбленця?
            </DialogTitle>
            <DialogDescription className="text-brand-text-subtle">
              Дію неможливо скасувати. Дані про улюбленця буде видалено з вашого профілю.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-start">
            <button
              type="button"
              onClick={() => {
                setConfirmDeleteOpen(false);
              }}
              disabled={isDeleting}
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-brand-text-subtle transition-colors hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
            >
              Скасувати
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                setError(null);
                setIsDeleting(true);

                const response = await fetch(`/api/account/pets/${pet.id}`, {
                  method: 'DELETE',
                });

                const responseData = (await response.json().catch(() => {
                  return null;
                })) as {
                  error?: string;
                } | null;

                if (!response.ok) {
                  setIsDeleting(false);
                  setError(responseData?.error ?? 'Не вдалося видалити улюбленця.');
                  return;
                }

                setIsDeleting(false);
                setConfirmDeleteOpen(false);
                onDeleted(pet.id);
                toast.success('Улюбленця видалено');
              }}
              className="rounded-full bg-destructive px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Видаляємо...' : 'Видалити'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}

export function MyPetsSection() {
  const [createDraft, setCreateDraft] = useState<PetDraft>({
    birthDate: '',
    breed: '',
    name: '',
    notes: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);

  const resetCreateForm = () => {
    setCreateDraft({
      birthDate: '',
      breed: '',
      name: '',
      notes: '',
    });
  };

  const createPet = async () => {
    setCreateError(null);
    setIsSavingNew(true);

    const response = await fetch('/api/account/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birthDate: createDraft.birthDate || null,
        breed: createDraft.breed || null,
        name: createDraft.name,
        notes: createDraft.notes || null,
      }),
    });

    const responseData = (await response.json().catch(() => {
      return null;
    })) as CreatePetResponse | null;

    if (!response.ok || !responseData?.pet) {
      setIsSavingNew(false);
      setCreateError(responseData?.error ?? 'Не вдалося додати улюбленця.');
      return;
    }

    setPets((prev) => {
      return [responseData.pet!, ...prev];
    });
    resetCreateForm();
    setIsSavingNew(false);
    setIsCreating(false);
    toast.success('Улюбленця успішно додано');
  };

  useEffect(() => {
    let isMounted = true;

    const loadPets = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/account/pets');
      const responseData = (await response.json().catch(() => {
        return null;
      })) as PetsResponse | null;

      if (!isMounted) {
        return;
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(responseData?.error ?? 'Не вдалося завантажити улюбленців.');
        return;
      }

      setPets(responseData?.pets ?? []);
      setIsLoading(false);
    };

    void loadPets();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="pets"
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-brand-text">Мої улюбленці</h2>

      {isLoading ? (
        <p className="mt-6 text-[16px] text-brand-text-subtle">Завантажуємо ваших котиків...</p>
      ) : error ? (
        <p className="mt-6 text-[16px] text-destructive">{error}</p>
      ) : pets.length === 0 ? (
        <div className="mt-6 space-y-4">
          <p className="text-[16px] text-brand-text-subtle">У вас поки немає улюбленців.</p>
          {!isCreating ? (
            <PawButton
              type="button"
              variant="accent"
              className="bg-brand-orange text-white"
              onClick={() => {
                setCreateError(null);
                setIsCreating(true);
              }}
            >
              Додати улюбленця
            </PawButton>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {pets.map((pet) => {
            return (
              <PetCard
                key={pet.id}
                pet={pet}
                onSaved={(nextPet) => {
                  setPets((prev) => {
                    return prev.map((item) => {
                      return item.id === nextPet.id ? nextPet : item;
                    });
                  });
                  toast.success('Інформацію про улюбленця оновлено');
                }}
                onDeleted={(petId) => {
                  setPets((prev) => {
                    return prev.filter((item) => {
                      return item.id !== petId;
                    });
                  });
                }}
              />
            );
          })}
        </div>
      )}

      {(isCreating || pets.length > 0) && (
        <div className="mt-6 rounded-2xl border border-dashed border-brand-orange/50 bg-brand-surface-card p-5 md:p-6">
          {!isCreating ? (
            <div className="flex flex-wrap items-center gap-3">
              <PawButton
                type="button"
                variant="accent"
                className="bg-brand-orange text-white"
                onClick={() => {
                  setCreateError(null);
                  setIsCreating(true);
                }}
              >
                Додати улюбленця
              </PawButton>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-text">Новий улюбленець</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm text-brand-text-subtle">Ім'я улюбленця</span>
                  <input
                    type="text"
                    value={createDraft.name}
                    disabled={isSavingNew}
                    onChange={(event) => {
                      setCreateError(null);
                      setCreateDraft((prev) => {
                        return { ...prev, name: event.target.value };
                      });
                    }}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm text-brand-text-subtle">Порода</span>
                  <input
                    type="text"
                    value={createDraft.breed}
                    disabled={isSavingNew}
                    onChange={(event) => {
                      setCreateError(null);
                      setCreateDraft((prev) => {
                        return { ...prev, breed: event.target.value };
                      });
                    }}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm text-brand-text-subtle">Дата народження</span>
                  <MonthPickerField
                    value={createDraft.birthDate}
                    disabled={isSavingNew}
                    onChange={(nextValue) => {
                      setCreateError(null);
                      setCreateDraft((prev) => {
                        return { ...prev, birthDate: nextValue };
                      });
                    }}
                  />
                </label>

                <label className="space-y-1 sm:col-span-2">
                  <span className="text-sm text-brand-text-subtle">Нотатки / опис</span>
                  <textarea
                    value={createDraft.notes}
                    disabled={isSavingNew}
                    onChange={(event) => {
                      setCreateError(null);
                      setCreateDraft((prev) => {
                        return { ...prev, notes: event.target.value };
                      });
                    }}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-brand-text outline-none transition-colors focus:border-brand-yellow disabled:bg-gray-100"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <PawButton
                  type="button"
                  variant="accent"
                  className="bg-brand-orange text-white"
                  onClick={() => {
                    void createPet();
                  }}
                  disabled={isSavingNew}
                >
                  {isSavingNew ? 'Зберігаємо...' : 'Зберегти'}
                </PawButton>
                <button
                  type="button"
                  disabled={isSavingNew}
                  onClick={() => {
                    setCreateError(null);
                    resetCreateForm();
                    setIsCreating(false);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium text-brand-text-subtle transition-colors hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>
                {createError && <p className="text-sm text-destructive">{createError}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
