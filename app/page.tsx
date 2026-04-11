import { Suspense } from 'react';

import { RoomsCarousel } from '@/app/_components/RoomsCarousel';

import { ContactSection } from './_components/ContactSection';
import Features from './_components/Features';
import Hero from './_components/Hero';
import { ReviewsCarouselSkeleton } from './_components/ReviewsCarouselSkeleton';
import { ReviewsSection } from './_components/ReviewsSection';

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <RoomsCarousel />
      <Suspense fallback={<ReviewsCarouselSkeleton />}>
        <ReviewsSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
