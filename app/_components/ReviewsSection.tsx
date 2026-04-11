import { getHomePageReviews } from '../_data/reviews';
import { ReviewsCarousel } from './ReviewsCarousel';

export async function ReviewsSection() {
  const reviews = await getHomePageReviews();

  return <ReviewsCarousel reviews={reviews} />;
}
