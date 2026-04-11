'use client';

export function RoomDetailsSkeleton() {
  return (
    <>
      <section className="bg-brand-surface pb-12 pt-8 md:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-36 rounded bg-gray-200 animate-pulse" />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              <div className="aspect-16/10 w-full rounded-3xl border border-gray-100 bg-gray-200 animate-pulse" />
              <div className="mt-4 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, index) => {
                  return (
                    <div
                      key={index}
                      className="aspect-4/3 rounded-xl border border-gray-100 bg-gray-200 animate-pulse"
                    />
                  );
                })}
              </div>
            </div>

            <article className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="h-10 w-2/3 rounded bg-gray-200 animate-pulse" />
              <div className="mt-3 h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 animate-pulse" />

              <div className="mt-6 space-y-4">
                <div className="h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse" />

                <div className="pt-2">
                  <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, index) => {
                      return (
                        <div key={index} className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 rounded-2xl border border-gray-100 bg-brand-surface p-4 space-y-3">
                  <div className="h-5 w-44 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-gray-50">
                <div className="h-8 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="mt-6 h-12 w-full md:w-48 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-brand-surface pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-44 rounded bg-gray-200 animate-pulse" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                >
                  <div className="aspect-16/10 bg-gray-200 animate-pulse" />
                  <div className="p-5">
                    <div className="h-7 w-2/3 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-2 h-4 w-full rounded bg-gray-200 animate-pulse" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-4 h-6 w-1/3 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
