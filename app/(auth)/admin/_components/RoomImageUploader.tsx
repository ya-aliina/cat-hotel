'use client';

import { Plus, UploadCloud, X } from 'lucide-react';
import React from 'react';

type RoomImageUploaderProps = {
  coverImageUrl: string;
  disabled?: boolean;
  imageUrls: string[];
  onChange: (next: { coverImageUrl: string; imageUrls: string[] }) => void;
};

const MAX_FILES_PER_BATCH = 10;

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/uploads', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => {
      return null;
    })) as { error?: string } | null;
    throw new Error(payload?.error ?? 'Не вдалося завантажити файл.');
  }

  const payload = (await response.json()) as { url: string };

  return payload.url;
}

async function requestImageCleanup(url: string) {
  await fetch(`/api/admin/uploads?url=${encodeURIComponent(url)}`, {
    method: 'DELETE',
  });
}

export function RoomImageUploader({
  coverImageUrl,
  disabled,
  imageUrls,
  onChange,
}: RoomImageUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const allImages = React.useMemo(() => {
    const merged = [coverImageUrl, ...imageUrls].filter(Boolean);
    const unique = merged.filter((url, index, array) => {
      return url && array.indexOf(url) === index;
    });

    if (!coverImageUrl) {
      return unique;
    }

    return unique.sort((left, right) => {
      if (left === coverImageUrl) {
        return -1;
      }

      if (right === coverImageUrl) {
        return 1;
      }

      return 0;
    });
  }, [coverImageUrl, imageUrls]);

  const applyImages = React.useCallback(
    (newUrls: string[]) => {
      const normalized = newUrls.filter(Boolean);
      const nextCover =
        normalized.find((url) => {
          return url === coverImageUrl;
        }) ??
        normalized[0] ??
        '';

      onChange({
        coverImageUrl: nextCover,
        imageUrls: normalized.filter((url) => {
          return url !== nextCover;
        }),
      });
    },
    [coverImageUrl, onChange],
  );

  const handleFiles = React.useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).slice(0, MAX_FILES_PER_BATCH);

      if (files.length === 0) {
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const uploaded = await Promise.all(
          files.map((file) => {
            return uploadFile(file);
          }),
        );

        applyImages([...allImages, ...uploaded]);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Помилка завантаження.');
      } finally {
        setIsUploading(false);
      }
    },
    [allImages, applyImages],
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) {
      return;
    }

    void handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${isDragging ? 'border-orange-400 bg-orange-50/40' : 'border-gray-300'} ${disabled ? 'opacity-60' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node)) {
            return;
          }

          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <UploadCloud className="h-9 w-9" />
        </div>
        <p className="text-4.5 font-semibold text-gray-900">Завантажте фотографії</p>
        <p className="mx-auto mt-2 max-w-105 text-4 text-gray-500">
          Перетягніть фото сюди або{' '}
          <button
            type="button"
            className="font-semibold text-orange-600"
            onClick={() => {
              inputRef.current?.click();
            }}
            disabled={disabled || isUploading}
          >
            натисніть
          </button>{' '}
          для вибору файлів
        </p>
        <p className="mt-4 text-sm text-gray-400">Підтримка: JPG, PNG, WEBP, AVIF. Максимум 8MB.</p>
        {isUploading && <p className="mt-2 text-sm text-gray-500">Завантаження...</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(event) => {
            if (!event.target.files) {
              return;
            }

            void handleFiles(event.target.files);
            event.currentTarget.value = '';
          }}
          disabled={disabled || isUploading}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {allImages.length > 0 && (
        <div className="space-y-3">
          <p className="text-5 font-semibold text-gray-800">
            Завантажені фотографії ({allImages.length})
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {allImages.map((url, index) => {
              const isCover = url === coverImageUrl;

              return (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Фото номера" className="h-full w-full object-cover" />

                  {index === 0 && isCover && (
                    <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                      ГОЛОВНЕ
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-end justify-center bg-black/35 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    {!isCover && (
                      <button
                        type="button"
                        className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-800"
                        onClick={() => {
                          onChange({
                            coverImageUrl: url,
                            imageUrls: allImages.filter((item) => {
                              return item !== url;
                            }),
                          });
                        }}
                      >
                        Зробити головним
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-black/55 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      const nextImages = allImages.filter((item) => {
                        return item !== url;
                      });

                      applyImages(nextImages);
                      void requestImageCleanup(url);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-400 transition-colors hover:border-orange-400 hover:text-orange-500"
              onClick={() => {
                inputRef.current?.click();
              }}
              disabled={disabled || isUploading}
            >
              <Plus className="h-10 w-10" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
