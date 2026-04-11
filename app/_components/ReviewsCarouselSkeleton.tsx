import Image from 'next/image';

export function ReviewsCarouselSkeleton() {
  return (
    <section id="reviews" className="w-full relative overflow-hidden py-16 md:py-24 scroll-mt-24">
      <div className="absolute top-3 -right-10 md:top-3 md:right-0 lg:-right-5 z-0 pointer-events-none rotate-[-15deg]">
        <Image
          src="/paw.svg"
          alt=""
          width={400}
          height={400}
          className="w-91.75 h-auto"
          priority={false}
        />
      </div>

      <div className="max-w-300 mx-auto px-4 relative z-10 mb-12">
        <div className="mx-auto h-10 w-48 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="relative z-10 w-full">
        <div className="-ml-4 pl-4 xl:pl-[calc((100vw-1200px)/2+1rem)]">
          <div className="flex gap-4 overflow-hidden py-4">
            {Array.from({ length: 3 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="basis-[90%] md:basis-117.5 shrink-0 rounded-[8px] border border-gray-100 bg-white p-6 lg:p-7.5 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex gap-4 lg:gap-6">
                    <div className="mt-1 h-6 w-8 rounded bg-gray-200 animate-pulse" />

                    <div className="flex-1">
                      <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                      <div className="mt-3 h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
                      <div className="mt-3 h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
                      <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between pl-12 lg:pl-14">
                    <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-300 mx-auto px-4 mt-8">
          <div className="flex items-center justify-between relative min-h-12">
            <div className="absolute left-1/2 flex -translate-x-1/2 gap-3">
              {Array.from({ length: 3 }).map((_, index) => {
                return (
                  <div key={index} className="h-3 w-3 rounded-full bg-gray-200 animate-pulse" />
                );
              })}
            </div>

            <div className="hidden md:flex gap-4 ml-auto">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
