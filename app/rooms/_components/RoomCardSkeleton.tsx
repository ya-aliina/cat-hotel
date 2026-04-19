'use client';

export function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="h-50 w-full bg-gray-200 animate-pulse" />

      <div className="p-6 flex flex-col grow">
        <div className="h-7 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="mt-3 h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 animate-pulse" />

        <div className="mt-6 space-y-3 grow">
          <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-30 rounded bg-gray-200 animate-pulse" />
            <div className="flex gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => {
                return <div key={index} className="h-5 w-5 rounded bg-gray-200 animate-pulse" />;
              })}
            </div>
          </div>
          <div className="h-6 w-2/5 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="pt-8 flex justify-center">
          <div className="h-12 w-40 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
