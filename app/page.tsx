import { RoomsCarousel } from '@/app/_components/RoomsCarousel';

import Features from './_components/Features';
import Hero from './_components/Hero';
import { ReviewsCarousel } from './_components/ReviewsCarousel';

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Features />
      <RoomsCarousel />
      <ReviewsCarousel />
    </div>
  );
}
